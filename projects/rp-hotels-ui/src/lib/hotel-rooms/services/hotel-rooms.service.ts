import { Injectable, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { HotelRoomsApiService } from './hotel-rooms-api.service';

@Injectable({
  providedIn: 'root'
})
export class HotelRoomsService {

  api = inject(HotelRoomsApiService)

  subscription : Subscription = new Subscription()

  constructor() { }


  /**
   * this function is responsible to destory any opened subscription on this service
   */
  destroyer(){
    this.subscription.unsubscribe()
  }
}
