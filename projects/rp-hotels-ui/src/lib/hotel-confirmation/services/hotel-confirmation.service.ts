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
   hotelBookingModel:hotelBookingModel={
    status:"string",
    bookingNum: "string",
    ProviderConfirmation:"Confirmed",
    mail: "string",
    pdf: "any",
    hotel: {
        hotelCode: "string",
        hotelName: "string",
        hotelThumb: "string",
        Location: "string",
        hotelStars: 6,
        TotalSellPrice: 4,
        sellCurrency: "string",
        City: "string",
        Country: "string",
        Paxes: 8,
        Rooms: 6,
        CheckIn:String(new Date()),
        CheckOut: String(new Date())
    },
    travellers:[{
        Title: "string",
        FirstName: "string",
        LastName: "string"
   }] ,
    rooms: [{
        RoomCode: "string",
        Paxs: 5,
        Adult: 5,
        Child: 5,
        RoomType:"string",
        RoomMeal:"string",
        IsRefundable: true,
        Image: "string"
    }]

}
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
