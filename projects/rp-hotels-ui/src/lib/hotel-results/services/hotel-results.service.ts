import { Injectable, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { HotelResultsApiService } from './hotel-results-api.service';

@Injectable({
  providedIn: 'root'
})
export class HotelResultsService {

  api = inject(HotelResultsApiService)

  subscription : Subscription = new Subscription()

  constructor() { }


  /**
   * this function is responsible to destory any opened subscription on this service
   */
  destroyer(){
    this.subscription.unsubscribe()
  }
}
