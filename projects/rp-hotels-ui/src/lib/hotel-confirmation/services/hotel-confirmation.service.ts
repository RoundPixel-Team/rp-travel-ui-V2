import { Injectable, inject } from '@angular/core';
import { catchError, of, Subscription, switchMap, tap } from 'rxjs';
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
  error = false;
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
    
  getConfirmationData(url: string, searchId: string, hgNum: string, token: string) {
    this.loading = true;

    this.api.getHotelsPaymentResult(url).pipe(
      switchMap(res => {
        if (res.Status !== 0) {
          throw new Error('Payment result failed');
        }

        return this.api.HotelsPostProcessing(hgNum, searchId, token, res.paymentResult.PostPayment);
      }),
      switchMap(res => {
        if (res.Status !== 0) {
          throw new Error('Post-processing failed');
        }

        return this.api.getHotelsConfirmation(hgNum, searchId);
      }),
      tap(res => {
        if (res.status !== 'NotConfirmed') {
          this.confirmationData = res;
        } else {
          throw new Error('Confirmation failed');
        }
      }),
      catchError(err => {
        this.error = true;
        return of(null); // emit null so the chain completes
      }),
      tap(() => this.loading = false) // always stop loading at the end
    ).subscribe();
  }

// getConfirmationData(searchId:string,hgNum:string){
//   this.loading = true
//   this.error = undefined
//   this.api.getHotelsConfirmation(hgNum,searchId).subscribe((res)=>{
//     if(res){
//       this.confirmationData = res
//       this.loading = false
//     }
//   },(err)=>{
//     this.error = err
//     this.loading = false
//   })
// }

  /**
   * this function is responsible to destory any opened subscription on this service
   */
  destroyer(){
    this.subscription.unsubscribe()
  }
}
