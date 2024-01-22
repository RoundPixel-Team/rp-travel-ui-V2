import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { EnvironmentService } from '../../shared/services/environment.service';
import { hotelRoomsResponse } from '../interfaces';
import { Observable, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HotelRoomsApiService {

  public http = inject(HttpClient)
  public env = inject(EnvironmentService)

  constructor() { }
  /**
   * @param sid
   * @param hotelid
   * @param Pid
   * @returns A method to retrieve the hotel rooms response from the server and it takes the search ID, Hotel ID and the Provider ID as parameters.
   */
  
  getHotelsRoomsApi(sid: string,hotelid:string,Pid: string):Observable<hotelRoomsResponse>{
    let url =  this.env.Apihotels + "/api/GetPackages?sid=" +sid +"&hotel=" +hotelid +"&Pid=" + Pid
    return this.http.get<hotelRoomsResponse>(url).pipe(take(1));
  }
  /**
   * 
   * @param sid 
   * @param hotelcode 
   * @param roomindex 
   * @param packageKey 
   * @param PId 
   * @returns A method to retrieve the Cancel policy response for each room from the server and it takes the search ID, hotel ID, room index, pacakge key and the Provider ID as parameters.
   */
  GetRoomCancelPolicy(sid: string, hotelcode: any, roomindex: any,packageKey:string, PId: any) {
    let url = `${this.env.Apihotels}/api/getcancelpolicy?sid=${sid}&hotelcode=${hotelcode}&roomindex=${roomindex}&packageKey=${packageKey}&PId=${PId}`;
    return this.http.get<any[]>(url).pipe(take(2));
  }
}
