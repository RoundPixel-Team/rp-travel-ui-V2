import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { EnvironmentService } from '../../shared/services/environment.service';
import { BookingRequest, Cobon, flightOfflineService, passengersModel, paymentCharges, paymentGateways, selectedFlight,mergedGates, paymnetdata } from '../interfaces';
import { catchError, map, mergeMap, retry, take } from 'rxjs';
import { airItineraries } from '../../flight-result/interfaces';

@Injectable({
  providedIn: 'root'
})
export class FlightCheckoutApiService {

  public http = inject(HttpClient)
  public env = inject(EnvironmentService)


paymentGates:paymentGateways[]=[
  {
    PaymentMethod:'fss',
    cardImg:'../../../assets/cards/visamaster.png',
    GatewayType:'FSSCard'
  },
  {
    PaymentMethod:'fss',
    cardImg:'../../../assets/cards/checkout_masterdebit.png',
    GatewayType:'FSSMasterDebit'
  },
  {
    PaymentMethod:'fss',
    cardImg:'../../../assets/cards/checkout_mastercredit.png',
    GatewayType:'FSSMasterCredit'
  },
  {
    PaymentMethod:'fss',
    cardImg:'../../../assets/cards/checkout_visadebit.png',
    GatewayType:'FSSVisaDebit'
  },
  {
    PaymentMethod:'fss',
    cardImg:'../../../assets/cards/checkout_visacredit.png',
    GatewayType:'FSSVisaCredit'
  },
  {
    PaymentMethod:'HostedKnet',
    cardImg:'../../../assets/cards/KNETL.svg',
    GatewayType:'HostedKnet'
  },
  {
    PaymentMethod:'knet',
    cardImg:'../../../assets/cards/KNETL.svg',
    GatewayType:'Knet'
  },
  {
    PaymentMethod:'mada',
    cardImg:'../../../assets/cards/mada.png',
    GatewayType:'Mada'
  },
  {
    PaymentMethod:'cards',
    cardImg:'../../../assets/cards/checkout_masterdebit.png',
    GatewayType:'TapMasterDebit'
  },
  {
    PaymentMethod:'cards',
    cardImg:'../../../assets/cards/checkout_mastercredit.png',
    GatewayType:'TapMasterCredit'
  },
  {
    PaymentMethod:'cards',
    cardImg:'../../../assets/cards/checkout_visadebit.png',
    GatewayType:'TapVisaDebit'
  },
  {
    PaymentMethod:'cards',
    cardImg:'../../../assets/cards/checkout_visacredit.png',
    GatewayType:'TapVisaCredit'
  },
  {
    PaymentMethod:'PnetCC',
    cardImg:'../../../assets/cards/visamaster.png',
    GatewayType:'PnetCard'
  },
  {
    PaymentMethod:'PnetCC',
    cardImg:'../../../assets/cards/checkout_masterdebit.png',
    GatewayType:'PnetMasterDebit'
  },
  {
    PaymentMethod:'PnetCC',
    cardImg:'../../../assets/cards/checkout_mastercredit.png',
    GatewayType:'PnetMasterCredit'
  },
  {
    PaymentMethod:'PnetCC',
    cardImg:'../../../assets/cards/checkout_visadebit.png',
    GatewayType:'PnetVisaDebit'
  },
  {
    PaymentMethod:'PnetCC',
    cardImg:'../../../assets/cards/checkout_visacredit.png',
    GatewayType:'PnetVisaCredit'
  },
  {
    PaymentMethod:'pnetKnet',
    cardImg:'../../../assets/cards/KNETL.svg',
    GatewayType:'PnetKnet'
  },
  {
    PaymentMethod:'myfatoorahcc',
    cardImg:'../../../assets/cards/visamaster.png',
    GatewayType:'MyFatoorahCard'
  },
  {
    PaymentMethod:'myfatoorahcc',
    cardImg:'../../../assets/cards/checkout_masterdebit.png',
    GatewayType:'MyFatoorahMasterDebit'
  },
  {
    PaymentMethod:'myfatoorahcc',
    cardImg:'../../../assets/cards/checkout_mastercredit.png',
    GatewayType:'MyFatoorahMasterCredit'
  },
  {
    PaymentMethod:'myfatoorahcc',
    cardImg:'../../../assets/cards/checkout_visadebit.png',
    GatewayType:'MyFatoorahVisaDebit'
  },
  {
    PaymentMethod:'myfatoorahcc',
    cardImg:'../../../assets/cards/checkout_visacredit.png',
    GatewayType:'MyFatoorahVisaCredit'
  },
  {
    PaymentMethod:'MyFatoorahKnet',
    cardImg:'../../../assets/cards/KNETL.svg',
    GatewayType:'MyFatoorahKnet'
  },
  {
    PaymentMethod:'dafa3nycc',
    cardImg:'../../../assets/cards/visamaster.png',
    GatewayType:'Dafa3nyCC'
  },
  {
    PaymentMethod:'dafa3nycc',
    cardImg:'../../../assets/cards/checkout_masterdebit.png',
    GatewayType:'dafa3nymasterdebit'
  },
  {
    PaymentMethod:'dafa3nycc',
    cardImg:'../../../assets/cards/checkout_mastercredit.png',
    GatewayType:'dafa3nymastercredit'
  },
  {
    PaymentMethod:'dafa3nycc',
    cardImg:'../../../assets/cards/checkout_visadebit.png',
    GatewayType:'dafa3nyvisadebit'
  },
  {
    PaymentMethod:'dafa3nycc',
    cardImg:'../../../assets/cards/checkout_visacredit.png',
    GatewayType:'dafa3nyvisaCredit'
  },

]
  isPnet:boolean = false;



  constructor() { }

  /**
   * 
   * @param searchid 
   * @param sequenceNum 
   * @param providerKey 
   * @returns all information about the selected flight according to its searchId , sequence number and provider key
   */
  getSelectedFlight(searchid: string,sequenceNum: number,providerKey: number,pcc:string,device:string,os:string,browser:string,skyscannerRedirectId?:string) {
    let api = `${this.env.searchflow}/api/GetSelectedFlight?searchid=${searchid}&SequenceNum=${sequenceNum}&PKey=${providerKey}&sCode=${pcc}&device=${device}&os=${os}&browser=${browser}`;
      if (skyscannerRedirectId) {
    api += `&skyscannerRedirectId=${encodeURIComponent(skyscannerRedirectId)}`;
  }
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
  saveBooking(searchid: string, sequenceNum: number, body: passengersModel, pkey: string, lang:string,selectedServices:string[],ip:string,ipLocation:string,pcc:string,device:string,os:string,browser:string) {
    let api = `${this.env.BookingFlow}/api/SaveBooking?SearchId=${searchid}&SeqNum=${sequenceNum}&PKey=${pkey}&sCode=${pcc}&device=${device}&os=${os}&browser=${browser}`;
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
  bookItinerary(body: BookingRequest,device:string,os:string,browser:string) {
    let api = `${this.env.BookingFlow}/api/BookItinerary?device=${device}&os=${os}&browser=${browser}`;
    return this.http.post<any>(api, body).pipe(
      take(1),
      retry(1),
      catchError((err) => {
        console.error(err);
        throw err;
      })
    );
  }
   mergePayment(charges:paymentCharges[],gates:paymentGateways[]):mergedGates[]{
  let mergedGates: mergedGates[]=[];
  if (!Array.isArray(charges) || !Array.isArray(gates)) {
    console.warn('Invalid charges or gates input');

    return [];
  }
  charges.forEach(
      (charge)=>{
        let gate = gates.filter((val)=> val?.GatewayType?.trim().toLowerCase() ===  charge?.paymentMethod?.trim().toLowerCase())[0]
       
        let merge:mergedGates ={
    
          cardImg:gate?.cardImg,
          GatewayType:charge?.paymentMethod,
          Currency:charge?.currency,
          Amount:charge?.amount,
          PaymentMethod:gate?.PaymentMethod
        }
        mergedGates.push(merge)
      }
    )
    return mergedGates
 }
  addPaymentGateways(userCurrency:string,paymentLoction:string,body:airItineraries){
  let api = `${this.env.BookingFlow}/api/checkoutApplyPaymentGateway?UserCurrency=${userCurrency}&PaymentLocation=${paymentLoction}`;
  return this.http.post<any>(api, body).pipe(
    
    retry(3),
    map(val=>{return this.mergePayment(val,this.paymentGates)}),
    catchError((err) => {
      console.error(err);
      throw err;
    }),
    take(1)
  );
 }
  startPaymentProcess(hg: string, SID: string, tok: string, paymnntMethod: string, GatewayCharges: string, GatewayType: string, src: string = 'mop', payToken: string = '') {
    let api = `${this.env.prepay}/api/startpaymentProcess?HG=${hg}&payToken=${payToken}&SId=${SID}&Tok=${tok}&paymentMethod=${paymnntMethod}&GatewayCharges=${GatewayCharges}&GatewayType=${GatewayType}`;
    let body = { HG: hg, Tok: tok, SId: SID, payToken: tok, paymentMethod: paymnntMethod, GatewayCharges: GatewayCharges, GatewayType: GatewayType }
    if (src === 'mop' || src === '' || !src) {
       if(paymnntMethod ==='pnetKnet' || paymnntMethod ==='PnetCC'){
         this.isPnet = true;
       }
      return this.http.get<paymnetdata>(api).pipe(retry(3), take(1),
        map((va) => {
          if (!va || va.Status != 0) {
            throw  'somthisng wrong with output';
          } else {
            return va.paymentResult.RedirectUrl
          }
        }), catchError(err => {throw err}))
    } else {
      if(paymnntMethod ==='pnetKnet' || paymnntMethod ==='PnetCC'){
        this.isPnet = true;
      }
      return this.http.post<paymnetdata>(this.env.prepay + '/api/startpaymentProcess', body).pipe(retry(3), take(1),
      map((va) => {
        if (!va || va.Status != 0) {
          throw 'somthisng wrong with output';
        } else {
          return va.paymentResult.RedirectUrl
        }
      }), catchError(err => {throw err}))
    }


  }
}
