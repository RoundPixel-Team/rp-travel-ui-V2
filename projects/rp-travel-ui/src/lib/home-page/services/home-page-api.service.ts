import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, mergeMap, retry, take } from 'rxjs';
import { OfferDTO, airPorts, countries, currencyModel, pointOfSaleModel } from '../interfaces';
import { HttpClient } from '@angular/common/http';
import { EnvironmentService } from '../../shared/services/environment.service';

@Injectable({
  providedIn: 'root'
})
export class HomePageApiService {

  public http = inject(HttpClient)
  public env = inject(EnvironmentService)


  constructor() { }

 /**
   * 
   * @param lang 
   * @returns all airports depends on the current languague
   */
  UtilityAirports(lang:string) : Observable<airPorts[]>{
    let API:string = `${this.env.backOffice}/api/GetSearchFlowMapping?LangCode=${lang}`;
    return this.http.get<airPorts[]>(API).pipe(retry(3),take(1),catchError(err=>{console.log(err);throw err}))
  }


  /**
   * 
   * @param baseCurrency 
   * @returns all currency with their changing rate depends on the base currency
   */
  currencyApi(baseCurrency:string) : Observable<currencyModel[]>{
    let API:string = `${this.env.admin}/api/CurrencyApi?currency=${baseCurrency}`;
    return this.http.get<currencyModel[]>(API).pipe(retry(3),take(1),catchError(err=>{console.log(err);throw err}))
  }
  

  /**
   * 
   * @returns current point of sale by fetching current ip then get this ip location/(POS)
   */
  pointOfSale(): Observable<pointOfSaleModel> {
    let api = "https://api.ipify.org/?format=json";
    return this.http.get<any>(api).pipe(
      retry(2),
      take(1),
      mergeMap((result) =>{
        console.log("show me first response",result)
       return  this.http.get<pointOfSaleModel>(
          `https://ipapi.co/${result.ip}/json/`
        )
      }
        
      ),
      catchError(err=>{console.log(err);throw err})
    );
  }


  /**
   * 
   * @param lang 
   * @returns take language and return contries and countries codes
   */
  getCountries(lang: string) {
    let api = `${this.env.backOffice}/api/GetAllCountriesByLangName?LangCode=${lang}`;
    return this.http.get<countries[]>(api).pipe( retry(2),take(1),catchError(err=>{console.log(err);throw err})
    );
  }
/**
 * 
 * @param pos 
 * @returns All offers depending on the current point of sale
 */
  AllOffers(pos: string):Observable<OfferDTO[]> {
    let API = `${this.env.offers.getAll}${pos}`;
    return this.http.get<OfferDTO[]>(API).pipe(
     take(1),retry(3), catchError(err => { console.log(err, "ERROR IN GETTING ALL OFFERS"); throw err })
    )
  }
   /**
 * 
 * @param id 
 * @returns offer depending on the current ID
 */
  OfferBYId(id: number | string):Observable<OfferDTO> {
    let API = `${this.env.offers.getByID}${id}`;
    return this.http.get<OfferDTO>(API).pipe(
      retry(3), take(1), map(
        (res: any) => { return res }
      ), catchError(err => { console.log(err, "ERROR IN GETTING OFFER BY ID"); throw err })
    )
  }
}
