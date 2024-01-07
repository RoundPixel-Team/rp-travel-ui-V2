import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { EnvironmentService } from '../../shared/services/environment.service';
import { hotelRoomsResponse } from '../interfaces';
import { take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HotelRoomsApiService {

  public http = inject(HttpClient)
  public env = inject(EnvironmentService)

  constructor() { }
  
  getHotelsRoomsApi(sid: string,hotelid:string,Pid: string){
    let url =  this.env.Apihotels + "api/GetPackages?sid=" +sid +"&hotel=" +hotelid +"&Pid=" + Pid
    return this.http.get<hotelRoomsResponse>(url).pipe(take(1));
  }
  GetRoomCancelPolicy(sid: string, hotelcode: any, roomindex: any,packageKey:string, PId: any) {
    let url = `${this.env.Apihotels}/api/getcancelpolicy?sid=${sid}&hotelcode=${hotelcode}&roomindex=${roomindex}&packageKey=${packageKey}&PId=${PId}`;
    return this.http.get<any[]>(url).pipe(take(2));
  }
}
