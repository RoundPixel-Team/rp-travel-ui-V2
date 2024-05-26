import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { EnvironmentService } from '../../shared/services/environment.service';
import { Cobon, flightOfflineService, passengersModel, selectedFlight } from '../interfaces';
import { catchError, mergeMap, retry, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FlightCheckoutApiService {

  public http = inject(HttpClient)
  public env = inject(EnvironmentService)

  constructor() { }

  /**
   * 
   * @param searchid 
   * @param sequenceNum 
   * @param providerKey 
   * @returns all information about the selected flight according to its searchId , sequence number and provider key
   */
  getSelectedFlight(searchid: string,sequenceNum: number,providerKey: number,pcc:string) {
    let api = `${this.env.searchflow}/api/GetSelectedFlight?searchid=${searchid}&SequenceNum=${sequenceNum}&PKey=${providerKey}&sCode=${pcc}`;
    return this.http.get<selectedFlight>(api).pipe(retry(3),take(1),catchError(err=>{throw err}));
  }


  /**
   * 
   * @param SID 
   * @param POS 
   * @returns a list of offline services provided for a flight reservation using the search ID and the POS
   */
  offlineServices(SID: string,POS:string) {
    let api = `${this.env.BookingFlow}/api/GetOfflineServices?SID=${SID}&POS=${POS}`;
    return this.http.get<flightOfflineService[]>(api).pipe(retry(2),take(1),catchError(err=>{console.log(err);throw err}));
  }


  /**
   * 
   * @param promo 
   * @param Sid 
   * @param sequenceNum 
   * @param pkey 
   * @returns disscount amount if the copoun code is active and valid
   */
  activateCobon(promo: string, Sid: string, sequenceNum: any, pkey: string,pcc:string) {
    //check the validity of cobon and return
    let api = `${this.env.BookingFlow}/api/GetPromotionDetails?PromoCode=${promo}&SearchId=${Sid}&SeqNum=${sequenceNum}&PKey=${pkey}&sCode=${pcc}`;
    return this.http.get<Cobon>(api).pipe(take(1));
  }


  /**
   * 
   * @param searchid 
   * @param sequenceNum 
   * @param body 
   * @param pkey 
   * @param lang 
   * @param selectedServices 
   * @returns this function is resposible to call the save booking then checking flight validations and them generate your payment link
   */
  saveBooking(searchid: string, sequenceNum: number, body: passengersModel, pkey: string, lang:string,selectedServices:string[],ip:string,ipLocation:string,pcc:string) {
    let api = `${this.env.BookingFlow}/api/SaveBooking?SearchId=${searchid}&SeqNum=${sequenceNum}&PKey=${pkey}&sCode=${pcc}`;
    return this.http.post<any>(api, body).pipe(take(1),retry(1),
      mergeMap(
        (result) => { 
          let api = `${this.env.BookingFlow}/api/CheckFlightValidation?HGNum=${result.hgNumber}&Language=${lang}&SearchId=${searchid}&SeqNum=${sequenceNum}&PKey=${pkey}`;
          return this.http.get<any>(api).pipe(retry(1),take(1),
          mergeMap(()=>{
            let apis = `${this.env.BookingFlow}/api/GetPaymentView?IP=${ip}&IPLoc=${ipLocation}&HG=${result.hgNumber}&SId=${searchid}&NotifyToken=`;
            let bodys = {
              UserSeletedInsurance: { ProductId: "" },
              UserSeletedServices: { SeletedServicesCodes: selectedServices },
            };
            return this.http.post<any>(apis, bodys).pipe(take(1),retry(1))
          }),catchError(err=>{console.log(err);throw err}));
         }
      ),catchError(err=>{console.log(err);throw err})
    )
  }
}
