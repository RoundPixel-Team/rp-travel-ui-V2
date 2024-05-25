import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { EnvironmentService } from '../../shared/services/environment.service';
import { take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HotelConfirmationApiService {

  public http = inject(HttpClient)
  public env = inject(EnvironmentService)

  constructor() { }
  /**
   * 
   * @param url 
   * @returns  the payment result status 
   */
  getHotelsPaymentResult(url: string) {
    // get the payment result status for hotels
    let api = `${this.env.prepay}api/paymentresult?${url}`;
    return this.http.get<any>(api).pipe(take(1));
  }
  /**
   *@param HGNu
   @param searchid
   * @param tok 
   * @param url 
   * @returns status after successful payment
   */
  HotelsPostProcessing(HGNu: string, searchid: string, tok: string, url: string) {
    //  get satus after succesful payment
    let api = `${this.env.Apihotels}/Api/ConfirmHotelStatus?sid=${searchid}&bookingNum=${HGNu}&tok=${tok}`;
    console.log(api);
    return this.http.get<any>(api).pipe(take(1));
  }
   /**
   * 
   * @param HGNu 
   * @param searchid 
   * @returns flight confirmation details after payment has been finshed
   */
  getHotelsConfirmation(HGNu: string, searchid: string) {
    // get return conformtion from the clint
    let api = `${this.env.Apihotels}/Api/Confirmation?sid=${searchid}&bookingNum=${HGNu}`;
    return this.http.get<any>(api).pipe(take(3));
  }
}
