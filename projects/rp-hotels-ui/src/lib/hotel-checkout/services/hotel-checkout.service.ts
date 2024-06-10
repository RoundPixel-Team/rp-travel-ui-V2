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
  city: string = '';
  HotelForm: FormGroup = new FormGroup({
    sid: new FormControl(''),
    cityName: new FormControl('', Validators.required),
    hotelID: new FormControl(''),
    providerHotelID: new FormControl(Validators.required),
    pid: new FormControl(''),
    roomQty: new FormControl(Validators.required),
    paxQty: new FormControl(0),
    src: new FormControl('Direct'),
    mail: new FormControl('', [Validators.required, Validators.email, Validators.minLength(9),Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$"),]),
    currency: new FormControl(''),
    sellPrice: new FormControl(0),
    totalCost: new FormControl(0),
    Travellers: new FormArray([])
  })
  subscription: Subscription = new Subscription()
  HotelResult: room[] = [];
  RequiredHotel!: hotelRoomsResponse;
  searchId: string = ''
  hotelCode: string = ''
  providerId: string = ''
  packageKey: string = ''
  roomLength: number = 1;
  totalSellPrice: number = 0
  totalCostPrice: number = 0
  copounCodeLoader: boolean = false;
  copounCodeDetails!: Cobon;

  copounCodeError: string = ''
  Currency: string = 'KWD'
  ip: string = '00.00.00.00';
  iplocation: string = 'Egypt';
  lang: string = 'En'
  terms!: selectedPackageAvailibilty;
  firstAdultFound: boolean = false;
  paymentLink = new Subject();
  paymentLinkFailure = new Subject();
  loader: boolean = false;
  TotalPrice: number = 0
  HotelPackage: packages[] = []
  constructor() { }

  /**
    * 
    *inital form check out & set searchId, HotelId, ProviderId in control 
    * 
    */
  initalCkeckoutForm(cityId:number) {
    this.HotelForm = new FormGroup({
      sid: new FormControl(this.searchId),
      cityName: new FormControl(Number(cityId), Validators.required),
      hotelID: new FormControl(this.hotelCode),
      providerHotelID: new FormControl(Validators.required),
      pid: new FormControl(this.providerId),
      roomQty: new FormControl(Validators.required),
      paxQty: new FormControl(0),
      src: new FormControl('Direct'),
      mail: new FormControl('', [Validators.required, Validators.email, Validators.minLength(9),Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$"),]),
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
  loadDataCard(providerId: string, searchId: string, HotelCode: string, packageKey: string) {
    this.loader = true
    this.subscription.add(
      this.api.GetHotelRooms(providerId, searchId, HotelCode).subscribe((res) => {
        if (res == undefined) {
          this.paymentLinkFailure.next(res);
          this.loader=false;
          return
        }
        else {
          if (res) {
            this.loader = false
            this.RequiredHotel = res
            let HotelPackage = res.Packages
            this.HotelResult = HotelPackage.filter(v => v.PackageKey === packageKey)[0].Rooms
            this.roomLength = this.HotelResult.length;
            this.FormRooms()
            this.CalculateTotalPrice();
          }

        }

      },((err)=>{
        this.paymentLinkFailure.next(err);
        this.loader=false;
      })))
  }
  /**
      * 
      *Form Data Rooms based on Number Room
      * 
      */
  FormRooms() {
    for (var i = 0; i < this.roomLength; i++) {

      if (this.HotelResult[0].Adult != 0 && !this.firstAdultFound) {
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

      else if (this.HotelResult[0].Adult != 0 && this.firstAdultFound) {
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
      *Calculate TotalPrice For ALL Rooms
      * 
      */
  CalculateTotalPrice() {
    let total = 0;
    for (let data of this.HotelResult) {
      total += data.TotalSellPrice;
      this.TotalPrice = total

    }
    return total;

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

  applyCopounCode(copounCode: string, searchId: string, packageKey: any, providerId: string) {

    this.subscription.add(
      this.api.activateCobon(copounCode, searchId, packageKey, providerId).subscribe((res) => {
        if (res) {
          // apply disscount on the selected hotel price amount
          if (this.HotelResult) {
            this.copounCodeDetails = res
            this.HotelResult[0].TotalSellPrice -= res.promotionDetails.discountAmount
          }
          this.copounCodeLoader = false
        }
      }, (err) => {

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
      if (sessionStorage.getItem('hotelform')) {
        let searchForm: any = sessionStorage.getItem('hotelform');
        let obj = JSON.parse(searchForm)
        this.city = obj.CityId;

        if (this.city) {

          this.HotelForm.get('cityName')?.setValue(this.city);
        }
      }
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

      let phone: string = phoneNumberObject.number;
      let dialCode: string = phoneNumberObject.dialCode;
   
      for (var i = 0; i < (<FormArray>this.HotelForm.get('Travellers')).length; i++) {
        (<FormArray>this.HotelForm.get('Travellers')).at(i).get('dateOfBirth')
        ?.setValue('2012-01-12T22:00:00.000Z');
        (<FormArray>this.HotelForm.get('Travellers')).at(i).get('phone')
          ?.setValue(phone);
        (<FormArray>this.HotelForm.get('Travellers')).at(i).get('phoneCode')
          ?.setValue(dialCode);
        (<FormArray>this.HotelForm.get('Travellers')).at(i).get('roomRef')?.setValue(this.packageKey);
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
      this.loader = true
      let bookObject: hotelSaveBooking = { ...this.HotelForm.value }
      this.subscription.add(
        this.api.saveBooking(bookObject, this.searchId, this.ip, this.iplocation, this.lang).subscribe
          ((res) => {
            this.paymentLink.next(res)
            this.loader = false;
          }, (err) => {
            this.paymentLinkFailure.next(err)
            this.loader = false
          })
      )
    }else{
      console.log("hotel form failure",this.HotelForm);
    }
  }
  /**
     * 
     *Load Avalibilty for select Hotel 
     * 
     */
  getHotelAvalibility() {
    this.subscription.add(
      this.api.hotelCheckAvailability(this.searchId, this.hotelCode, this.packageKey, this.providerId).subscribe((v) => {
        this.terms = v
      }))
  }
  /**
   * this function is responsible to destory any opened subscription on this service
   */
  destroyer() {
    this.subscription.unsubscribe();
    this.HotelForm = new FormGroup({});
    this.HotelResult = [];
    this.HotelPackage = [];
    this.searchId = '';
    this.hotelCode = '';
    this.providerId = '';
    this.packageKey = '';

  }
}
