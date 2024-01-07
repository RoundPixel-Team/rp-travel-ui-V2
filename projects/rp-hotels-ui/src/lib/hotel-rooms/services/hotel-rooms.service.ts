import { Injectable, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { HotelRoomsApiService } from './hotel-rooms-api.service';
import { hotelRoomsResponse, roomCancelPolicy } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class HotelRoomsService {
roomsLoader:boolean = false;
roomsData!:hotelRoomsResponse[];
cancelPolicy!:roomCancelPolicy[];
  api = inject(HotelRoomsApiService)

  subscription : Subscription = new Subscription()

  constructor() { }
getRooms(sid: string,hotelid:string,Pid: string){
  this.roomsLoader=true;
  this.api.getHotelsRoomsApi(sid,hotelid,Pid).subscribe((data) =>{
    this.roomsLoader=false;
    // this.roomsData=data;
  }
  
    )
}
getCancelPolicy(sid: string, hotelcode: any, roomindex: any,packageKey:string, PId: any){
this.api.GetRoomCancelPolicy(sid, hotelcode, roomindex,packageKey, PId).subscribe((data)=>{
  this.cancelPolicy=data;
});
}
  /**
   * this function is responsible to destory any opened subscription on this service
   */
  destroyer(){
    this.subscription.unsubscribe()
  }
}
