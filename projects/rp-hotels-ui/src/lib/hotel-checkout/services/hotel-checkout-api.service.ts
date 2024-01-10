import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { EnvironmentService } from '../../shared/services/environment.service';
import { hotelRoomsResponse } from '../../hotel-rooms/interfaces';
import { catchError, mergeMap, retry, take } from 'rxjs';
import { Cobon, hotelSaveBooking, selectedPackageAvailibilty } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class HotelCheckoutApiService {

  public http = inject(HttpClient)
  public env = inject(EnvironmentService)
   
 /**
   * 
   * @param Pid 
   * @param sid 
   * @param hotelID 
   * @returns this function return Hotel Selected
   */
  GetHotelRooms(Pid: string, sid: string, hotelID: string) {
    // RETURN hOTELS ROOM
    let apiHotel = `${this.env.Apihotels}/`
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
 /**
   * 
   * @param searchId 
   * @param hotelCode 
   * @param packageKey 
   * @param providerId 
   * @returns this function return room availability and cancel policy
   */
 
  hotelCheckAvailability(searchId: string, hotelCode: string, packageKey: string, providerId: string) {
    let APi = `${this.env.Apihotels}/api/CheckPackageAvailability?searchId=${searchId}&hotelCode=${hotelCode}&packageKey=${packageKey}&providerId=${providerId}`;
    return this.http.get<selectedPackageAvailibilty>(APi);
  }

  /**
   * 
   * @param promo 
   * @param Sid 
   * @param packageKey 
   * @param providerId 
   * @returns disscount amount if the copoun code is active and valid
   */
  activateCobon(promo: string, Sid: string, packageKey: any, providerId: string) {
    //check the validity of cobon and return
    let api = `${this.env.Apihotels}/api/GetPromotionDetails?PromoCode=${promo}&SearchId=${Sid}&Packey=${packageKey}&PKey=${providerId}  `;
    return this.http.get<Cobon>(api).pipe(take(1));
  }

 /**
   * 
   * @param sid 
   * @param ip 
   * @param iplocation 
   * @param lang 
   * @param data 
   * @returns this function is resposible to call the save booking then call paymentView  to return  payment link
   */


  saveBooking(data: hotelSaveBooking,sid:string,ip:string,iplocation:string,lang:string) {
    let api = `${this.env.Apihotels}/`;
    return this.http.post<any>(api, data).pipe(take(1),retry(1),
      mergeMap(
        (result) => { 
          let api = `${this.env.Apihotels}/api/PaymentView?bookingnum=${result.HGNu}&sid=${sid}&ip=${ip}&Pos=${iplocation}&lang=${lang}&NotificationTok=""`;
          return this.http.get<any>(api).pipe(retry(1),take(1),
          )
         }
      ),catchError(err=>{console.log(err);throw err})
    )
  }
  constructor() { }
}
