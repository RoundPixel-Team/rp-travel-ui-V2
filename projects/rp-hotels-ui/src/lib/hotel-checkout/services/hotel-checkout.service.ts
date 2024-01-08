import { Injectable, inject } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { HotelCheckoutApiService } from './hotel-checkout-api.service';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { hotelRoomsResponse, room } from '../../hotel-rooms/interfaces';

@Injectable({
  providedIn: 'root'
})
export class HotelCheckoutService {
  route = inject(ActivatedRoute)
  api = inject(HotelCheckoutApiService)
  checkoutForm!: FormGroup;
  subscription: Subscription = new Subscription()
  HotelResult!: room[];
  SearchId: string = ''
  HotelCode: string = ''
  ProviderId: string = ''
  PackageKey: string = ''
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
    this.PackageKey=this.route.snapshot.params['package']

  }
     /**
       * 
       *inital form check out & set searchId, HotelId, ProviderId in control 
       * 
       */
  initalCkeckoutForm() {
    this.checkoutForm = new FormGroup({
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
  }
  public get Travellers(): FormArray {
    return this.checkoutForm.get("Travellers") as FormArray
  }
  /**
       * 
       *load Data Hotel Selected
       * 
       */
  loadDataCard() {
    this.subscription.add(
    this.api.GetHotelRooms(this.ProviderId, this.SearchId, this.HotelCode).subscribe((res) => {
      if(res == undefined){
        return
      }
      else{
        let HotelPackage=res.Packages
        this.HotelResult = HotelPackage.filter(v=>v.PackageKey === this.route.snapshot.paramMap.get('package'))[0].Rooms

      }
      
    }))
  }
  /**
   * this function is responsible to destory any opened subscription on this service
   */
  destroyer() {
    this.subscription.unsubscribe()
  }
}
