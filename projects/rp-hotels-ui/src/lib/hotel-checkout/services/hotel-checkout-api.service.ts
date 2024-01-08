import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { EnvironmentService } from '../../shared/services/environment.service';
import { hotelRoomsResponse } from '../../hotel-rooms/interfaces';
import { take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HotelCheckoutApiService {

  public http = inject(HttpClient)
  public env = inject(EnvironmentService)
  GetHotelRooms(Pid:string, sid:string, hotelID:string) {
    // RETURN hOTELS ROOM
    let apiHotel = `${this.env.Apihotels}/`; // salama1472019446 /37094/4
    console.log(apiHotel, "myapi");
    return this.http
      .get<hotelRoomsResponse>( 
        apiHotel +
          "api/GetPackages?sid=" +
          sid +
          "&hotel=" +
          hotelID +
          "&Pid=" +
          Pid
      )
      .pipe(take(1));
  }
  constructor() { }
}
