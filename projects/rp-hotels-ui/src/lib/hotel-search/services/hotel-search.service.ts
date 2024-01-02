import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HotelSearchService {

  subscription : Subscription = new Subscription()

  constructor() { }


  /**
   * this function is responsible to destory any opened subscription on this service
   */
  destroyer(){
    this.subscription.unsubscribe()
  }
}
