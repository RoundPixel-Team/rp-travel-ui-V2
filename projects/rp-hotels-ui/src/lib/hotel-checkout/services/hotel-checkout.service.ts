import { Injectable, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { HotelCheckoutApiService } from './hotel-checkout-api.service';

@Injectable({
  providedIn: 'root'
})
export class HotelCheckoutService {

  api = inject(HotelCheckoutApiService)

  subscription : Subscription = new Subscription()

  constructor() { }


  /**
   * this function is responsible to destory any opened subscription on this service
   */
  destroyer(){
    this.subscription.unsubscribe()
  }
}
