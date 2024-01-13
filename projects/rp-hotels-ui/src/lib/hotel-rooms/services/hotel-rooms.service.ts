import { Injectable, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { HotelRoomsApiService } from './hotel-rooms-api.service';
import { hotelRoomsResponse, roomCancelPolicy } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class HotelRoomsService {
roomsLoader:boolean = false;
cancelLoader:boolean = false;
roomsData:hotelRoomsResponse=undefined!;
cancelPolicy!:roomCancelPolicy[];
groupedRooms!:{};
  api = inject(HotelRoomsApiService)

  subscription : Subscription = new Subscription()

  constructor() { }
/**
 * @param sid 
 * @param hotelid  
 * @param pid 
 * this method is responsible for fetching the rooms data in a specified hotel (the selected hotel) and it takes the following parameters : search Id, Hotel Id and provider id
 * */
getRooms(sid: string,hotelid:string,Pid: string){
  this.roomsLoader=true;
  this.subscription.add(
    this.api.getHotelsRoomsApi(sid,hotelid,Pid).subscribe((data) =>{
      if(data){
        this.roomsLoader=false;
      this.roomsData=data;
      console.log(this.roomsData,'test Data');
       this.groupedRooms = this.groupRooms(this.roomsData);
      console.log(this.groupedRooms,'test grouping');
      }
      
    },(err:any)=>{
      console.log('get hotel rooms error ->',err)
      this.roomsLoader = false
    })
  )

}
/**
 * 
 * @param Roomsdata 
 * @returns this method is responsible for grouping the rooms based on thier type and it returns an array of the grouped rooms
 */
groupRooms(Roomsdata:hotelRoomsResponse){
  const allRooms=Roomsdata.Packages.flatMap(pkg=>pkg.Rooms);
   this.groupedRooms = allRooms.reduce((acc:any, room) => {
    const roomType = room.RoomType;
    if (!acc[roomType]) {
      acc[roomType] = [];
    }
    acc[roomType].push(room);
    return acc;
  }, {});

  return this.groupedRooms;
}

/**
 * 
 * @param sid 
 * @param hotelcode 
 * @param roomindex 
 * @param packageKey 
 * @param PId 
 * this method is responsible for fetching the cancelation policy data in each room
 */
 getCancelPolicy(sid: string, hotelcode: any, roomindex: any,packageKey:string, PId: any){
  this.cancelLoader = true;

  this.subscription.add(
    this.api.GetRoomCancelPolicy(sid, hotelcode, roomindex,packageKey, PId).subscribe((data)=>{
      if(data){
        this.cancelPolicy=data;
        this.cancelLoader = false;

        console.log(this.cancelPolicy,'test cancel policy');

      }
    },(err:any)=>{
        console.log('get cancel policy error ->',err)
        this.cancelLoader = false
      }
      
    )
  )

}

  /**
   * this function is responsible to destory any opened subscription on this service
   */
  destroyer(){
    this.subscription.unsubscribe()
  }
}
