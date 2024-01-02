import { Injectable, inject } from '@angular/core';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HotelConfirmationService {

  api = inject(HotelConfirmationService)
  subscription : Subscription = new Subscription()

  constructor() { }


  /**
   * this function is responsible to destory any opened subscription on this service
   */
  destroyer(){
    this.subscription.unsubscribe()
  }
}
