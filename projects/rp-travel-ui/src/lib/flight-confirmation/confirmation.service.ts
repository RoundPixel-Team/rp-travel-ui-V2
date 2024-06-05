import { Injectable, inject } from '@angular/core';
import { ConfirmationApiService } from './confirmation-api.service';
import { FlightSearchResult } from '../flight-result/interfaces';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { confirmationModel } from './interfaces';

@Injectable({
  providedIn: 'root'
})
export class ConfirmationService {

  api = inject(ConfirmationApiService)

  loading : boolean = false
  confirmationData! : confirmationModel 
  wgoDeebUrl! : SafeUrl;
  error:any

  constructor(private sanitizer: DomSanitizer) { }

  /**
   * fetching confirmation data
   * update state of [confirmationData:FlightSearchResult] in case of success response
   * update loading state
   * @param searchId 
   * @param hgNum 
   * @param tok 
   */
  getConfirmationDate(searchId:string,hgNum:string,tok:string){
    this.loading = true
    this.error = undefined
    this.api.getConfirmation(hgNum,searchId,tok).subscribe((res)=>{
      if(res){
        this.confirmationData = res
        this.formatWegoClicktUrl()
        this.loading = false
      }
    },(err)=>{
      this.error = err
      this.loading = false
    })
  }



  /**
   * 
   * @returns formatt wgo deeb url
   */
  formatWegoClicktUrl(){
    let comm_currency_code ='USD';
    let bv_currency_code ='KWD';
    let transaction_id = this.confirmationData.pnr;
    let total_booking_value = this.confirmationData.fareAmount;
    let commission =total_booking_value *.02;
    let status ='confirmed';
    if(localStorage.getItem('click_id')){
      var url = `https://srv.wego.com/analytics/v2/conversions?conversion_id=c-wego-travasky.com&click_id=${localStorage.getItem('click_id')}&comm_currency_code=${comm_currency_code}&bv_currency_code=${bv_currency_code}&transaction_id=${transaction_id}&commission=${commission}&total_booking_value=${total_booking_value}&status=${status}`;
    }
    else {
      console.log("CLICK ID NOT FOUND");
      var url = `https://srv.wego.com/analytics/v2/conversions?conversion_id=c-wego-travasky.com&click_id=${'no_click_id'}&comm_currency_code=${comm_currency_code}&bv_currency_code=${bv_currency_code}&transaction_id=${transaction_id}&commission=${commission}&total_booking_value=${total_booking_value}&status=${status}`;
    }
    
    this.wgoDeebUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }


}
