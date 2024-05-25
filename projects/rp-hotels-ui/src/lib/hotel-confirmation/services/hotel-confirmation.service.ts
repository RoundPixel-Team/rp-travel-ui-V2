import { Injectable, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { hotelBookingModel } from '../interfces';
import { HotelConfirmationApiService } from './hotel-confirmation-api.service';

@Injectable({
  providedIn: 'root'
})
export class HotelConfirmationService {

  api = inject(HotelConfirmationApiService)
  subscription : Subscription = new Subscription()
  loading : boolean = false
  confirmationData! :hotelBookingModel  
  error:any
  constructor() { }

/**
   * fetching confirmation data
   * update state of [confirmationData:FlightSearchResult] in case of success response
   * update loading state
   * @param searchId 
   * @param hgNum 
   */
getConfirmationData(searchId:string,hgNum:string){
  this.loading = true
  this.error = undefined
  this.api.getHotelsConfirmation(hgNum,searchId).subscribe((res)=>{
    if(res){
      this.confirmationData = res
      this.loading = false
    }
  },(err)=>{
    this.error = err
    this.loading = false
  })
}

  /**
   * this function is responsible to destory any opened subscription on this service
   */
  destroyer(){
    this.subscription.unsubscribe()
  }
}
