import { Injectable, inject } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { HotelCheckoutApiService } from './hotel-checkout-api.service';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { hotelRoomsResponse, packages, room } from '../../hotel-rooms/interfaces';
import { Cobon, hotelSaveBooking, selectedPackageAvailibilty } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class HotelCheckoutService {
  route = inject(ActivatedRoute)
  api = inject(HotelCheckoutApiService)
  HotelForm!: FormGroup;
  subscription: Subscription = new Subscription()
  HotelResult: room[] = [];
  RequiredHotel!: hotelRoomsResponse;
  SearchId: string = ''
  HotelCode: string = ''
  ProviderId: string = ''
  PackageKey: string = ''
  roomLength: number = 0;
  totalSellPrice: number = 0
  totalCostPrice: number = 0
  copounCodeLoader:boolean=false;
  copounCodeDetails!: Cobon;
  copounCodeError:string=''
  Currency: string = 'KWD'
  ip: string = '00.00.00.00';
  iplocation: string = 'Egypt';
  lang: string = 'En'
  terms!: selectedPackageAvailibilty;
  firstAdultFound: boolean = false;
  paymentLink = new Subject();
  paymentLinkFailure = new Subject();
  loader: boolean = false;
  HotelPackage:packages[]=[]
  constructor() { }
  /**
   * 
   *get data from Route 
   * 
   */
  getDataFromUrl() {
    this.SearchId = this.route.snapshot.params['sId']
    this.HotelCode = this.route.snapshot.params['hotelId']
    this.ProviderId = this.route.snapshot.params['pId']
    this.PackageKey = this.route.snapshot.params['package']

  }
  /**
    * 
    *inital form check out & set searchId, HotelId, ProviderId in control 
    * 
    */
  initalCkeckoutForm() {
    this.HotelForm = new FormGroup({
      sid: new FormControl(this.SearchId),
      cityName: new FormControl(Validators.required),
      hotelID: new FormControl(this.HotelCode),
      providerHotelID: new FormControl(Validators.required),
      pid: new FormControl(this.ProviderId),
      roomQty: new FormControl(Validators.required),
      paxQty: new FormControl(0),
      src: new FormControl('Direct'),
      mail: new FormControl('', [Validators.required, Validators.email, Validators.minLength(9)]),
      currency: new FormControl(''),
      sellPrice: new FormControl(0),
      totalCost: new FormControl(0),
      Travellers: new FormArray([])
    })
    this.firstAdultFound = false;

  }
  public get Travellers(): FormArray {
    return this.HotelForm.get("Travellers") as FormArray
  }
  /**
       * 
       *load Data Hotel Selected
       * 
       */
  loadDataCard(providerId:string, searchId:string, HotelCode:string, packageKey:string) {
    this.subscription.add(
      this.api.GetHotelRooms(providerId,searchId,HotelCode).subscribe((res) => {
        if (res == undefined) {
          return
        }
        else {
          this.RequiredHotel = res
          let HotelPackage = res.Packages
          this.HotelResult = HotelPackage.filter(v => v.PackageKey === packageKey)[0].Rooms
          this.roomLength = this.HotelResult.length;

        }

      }))
  }
  /**
      * 
      *Form Data Rooms based on Number Room
      * 
      */
  FormRooms() {
    for (var i = 0; i < this.roomLength; i++) {
      debugger
      if (this.HotelResult[i].Adult != 0 && !this.firstAdultFound) {
        this.firstAdultFound = true;
        (<FormArray>this.HotelForm.get('Travellers')).push(new FormGroup({
          "salutation": new FormControl('', [Validators.required]),
          "firstName": new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z \-\']+'), Validators.minLength(3)]),
          "lastName": new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z \-\']+'), Validators.minLength(3)]),
          "phonenum": new FormControl("", [Validators.required, Validators.maxLength(12)]),
          "roomNo": new FormControl(Number(this.HotelResult[i].RoomCode)),
          "paxType": new FormControl('adt'),
          "Main": new FormControl(true),
          "dateOfBirth": new FormControl(''),
          "travellerId": new FormControl(i + 1),
          "phone": new FormControl(''),
          "phoneCode": new FormControl(''),
          "roomRef": new FormControl(''),

        }));

      }

      else if (this.HotelResult[i].Adult != 0 && this.firstAdultFound) {
        (<FormArray>this.HotelForm.get('Travellers')).push(new FormGroup({
          "salutation": new FormControl('', [Validators.required]),
          "firstName": new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z \-\']+'), Validators.minLength(3)]),
          "lastName": new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z \-\']+'), Validators.minLength(3)]),
          "phonenum": new FormControl(""),
          "roomNo": new FormControl(Number(this.HotelResult[i].RoomCode)),
          "paxType": new FormControl('adt'),
          "Main": new FormControl(false),
          "dateOfBirth": new FormControl(''),
          "travellerId": new FormControl(i + 1),
          "phone": new FormControl(''),
          "phoneCode": new FormControl(''),
          "roomRef": new FormControl(''),
        }));

      }
    }
  }

 /**
   * 
   * @param copounCode 
   * @param searchId 
   * @param packageKey 
   * @param providerId
   * check if the entered copoun code is valid and apply the disscount amount on the hotel Room price
   * it updates the state of [copounCodeLoader : boolean]
   * it also updates the state of [copounCodeDetails:Copon]
   */

 applyCopounCode(copounCode:string,searchId:string,packageKey:any,providerId:string){
  
  this.subscription.add(
    this.api.activateCobon(copounCode,searchId,packageKey,providerId).subscribe((res)=>{
      if(res){
        // apply disscount on the selected hotel price amount
        if(this.HotelResult){
          this.copounCodeDetails = res
          this.HotelResult[0].TotalSellPrice -= res.promotionDetails.discountAmount
        }
        this.copounCodeLoader = false
      }
    },(err)=>{
      console.log("apply copoun code ERROR",err)
      this.copounCodeError = err
      this.copounCodeLoader = false
    })
  )
}


  /**
  * prepare the whole object to send to API 
  * make the default values
  * handle the missing values which is founded in the first adult form only
  * adding the totalSellPrice & the TotalCostPrice
  */
  prepareData(r: hotelRoomsResponse) {

    {
      this.HotelForm.get('providerHotelID')?.setValue(r.providerHotelID)
      this.HotelForm.get('roomQty')?.setValue(this.HotelResult.length)


      for (var i = 0; i < r.Packages[0].Rooms.length; i++) {
        this.totalSellPrice += this.HotelResult[i].TotalSellPrice
        this.totalCostPrice += this.HotelResult[i].CostPrice ? this.HotelResult[i].CostPrice : 0
      }

      this.HotelForm.get('sellPrice')?.setValue(parseFloat((Math.round(this.totalSellPrice * 100) / 100).toFixed(2)));
      this.HotelForm.get('totalCost')?.setValue(this.totalCostPrice);
      this.HotelForm.get('currency')?.setValue(this.Currency);
      let phoneNumberObject: any = { ...(<FormArray>this.HotelForm.get('Travellers')).at(0).get('phonenum')?.value };
      // debugger
      let phone: string = phoneNumberObject.number;
      let dialCode: string = phoneNumberObject.dialCode;
      for (var i = 0; i < (<FormArray>this.HotelForm.get('Travellers')).length; i++) {

        (<FormArray>this.HotelForm.get('Travellers')).at(i).get('phone')
          ?.setValue(phone);
        (<FormArray>this.HotelForm.get('Travellers')).at(i).get('phoneCode')
          ?.setValue(dialCode);
        (<FormArray>this.HotelForm.get('Travellers')).at(i).get('roomRef')?.setValue(this.route.snapshot.paramMap.get('package'));
        (<FormArray>this.HotelForm.get('Travellers')).at(i).get('roomNo')?.setValue(this.HotelResult[i].RoomIndex);
        if (i > 0) {
          (<FormArray>this.HotelForm.get('Travellers')).at(i).get('dateOfBirth')
            ?.setValue((<FormArray>this.HotelForm.get('Travellers')).at(0).get('dateOfBirth')?.value);
          (<FormArray>this.HotelForm.get('Travellers')).at(i).get('phonenum')
            ?.setValue(phone);
        }


      }


    }
  }

  /**
   * 
   * 
   * here is OnSubmit function which returning the payment link if all params is good
   */
  onSubmit() {
    if (this.HotelForm.valid) {
      let bookObject: hotelSaveBooking = { ...this.HotelForm.value }
      this.subscription.add(
        this.api.saveBooking(bookObject, this.SearchId, this.ip, this.iplocation, this.lang).subscribe
          ((res) => {
            this.paymentLink.next(res)
            this.loader = false;
          }, (err) => {
            console.log("SAVE BOOKING ERROR", err)
            this.paymentLinkFailure.next(err)
            this.loader = false
          })
      )



    }
  }
  /**
     * 
     *Load Avalibilty for select Hotel 
     * 
     */
  getHotelAvalibility() {
    this.subscription.add(
      this.api.hotelCheckAvailability(this.SearchId, this.HotelCode, this.PackageKey, this.ProviderId).subscribe((v) => {
        this.terms = v
      }))
  }
  /**
   * this function is responsible to destory any opened subscription on this service
   */
  destroyer() {
    this.subscription.unsubscribe()
  }
}
