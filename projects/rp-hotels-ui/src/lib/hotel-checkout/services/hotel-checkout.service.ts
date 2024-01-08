import { Injectable, inject } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { HotelCheckoutApiService } from './hotel-checkout-api.service';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { hotelRoomsResponse, room } from '../../hotel-rooms/interfaces';
import { hotelSaveBooking, selectedPackageAvailibilty } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class HotelCheckoutService {
  route = inject(ActivatedRoute)
  api = inject(HotelCheckoutApiService)
  HotelForm!: FormGroup;
  subscription: Subscription = new Subscription()
  HotelResult: room[] = [];
  SearchId: string = ''
  HotelCode: string = ''
  ProviderId: string = ''
  PackageKey: string = ''
  roomLength: number = 0;
  totalSellPrice: number = 0
  totalCostPrice: number = 0
  Currency: string = 'KWD'
  ip: string = '00.00.00.00';
  iplocation: string = 'Egypt';
  lang: string = 'En'
  terms!: selectedPackageAvailibilty;
  firstAdultFound: boolean = false;
  paymentLink = new Subject();
  paymentLinkFailure = new Subject();
  loader: boolean = false;
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
  loadDataCard() {
    this.subscription.add(
      this.api.GetHotelRooms(this.ProviderId, this.SearchId, this.HotelCode).subscribe((res) => {
        if (res == undefined) {
          return
        }
        else {
          let HotelPackage = res.Packages
          this.HotelResult = HotelPackage.filter(v => v.PackageKey === this.route.snapshot.paramMap.get('package'))[0].Rooms
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
