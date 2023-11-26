import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { EnvironmentService } from '../shared/services/environment.service';
import { catchError, map, retry, take } from 'rxjs';
import { FlightSearchResult } from '../flight-result/interfaces';
import { confirmationModel } from './interfaces';

@Injectable({
  providedIn: 'root'
})
export class ConfirmationApiService {

  public http = inject(HttpClient)
  public env = inject(EnvironmentService)

  constructor() { }
  /**
   * 
   * @param url 
   * @returns  the payment result status 
   */
  getPaymentResult(url: string) {
    let api = `${this.env.prepay}/api/paymentresult?${url}`;
    return this.http.get<any>(api).pipe(
      take(1),
      map(
        (result) => { return result; }
      )
    )
  }
  /**
   * 
   * @param HGNu 
   * @param searchid 
   * @param tok 
   * @param url 
   * @returns status after successful payment
   */
  PostProcessing(HGNum: string, searchid: string, tok: string, url: string) {
   
    let api = `${url}&tok=${tok}`;
    
    return this.http.get<any>(api).pipe(
      take(1),
      map((result) => {
        return result;
      })
    );
  }

  /**
   * 
   * @param HGNu 
   * @param searchid 
   * @param tok 
   * @returns flight confirmation details after payment has been finshed
   */
  getConfirmation(HGNu: string, searchid: string,tok?:string) {
    let api = `${this.env.BookingFlow}/api/BookingConfirmation?HG=${HGNu}&SId=${searchid}&tok=${tok}`;
    return this.http.get<confirmationModel>(api).pipe(
      retry(3),
      take(1),
      map((result) => {
        return result;
      }),catchError((err:any)=>{console.log("CONFIRMATION ERROR",err);throw err})
    );
  }
}
