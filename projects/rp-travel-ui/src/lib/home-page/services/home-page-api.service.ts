import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, mergeMap, retry, take } from 'rxjs';
import { BookedOffer, Itinerary, MostSearchedFlightsResponse, OfferDTO, airPorts, countries, currencyModel, pointOfSaleModel } from '../interfaces';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
    return this.http.get<airPorts[]>(API).pipe(retry(3),take(1),catchError(err=>{console.error(err);throw err}))
  }


  /**
   * 
   * @param baseCurrency 
   * @returns all currency with their changing rate depends on the base currency
   */
  currencyApi(baseCurrency:string) : Observable<currencyModel[]>{
    let API:string = `${this.env.admin}/api/CurrencyApi?currency=${baseCurrency}`;
    return this.http.get<currencyModel[]>(API).pipe(retry(3),take(1),catchError(err=>{console.error(err);throw err}))
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
       return  this.http.get<pointOfSaleModel>(
          `https://ipapi.co/${result.ip}/json/`
        )
      }
        
      ),
      catchError(err=>{console.error(err);throw err})
    );
  }


  /**
   * 
   * @param lang 
   * @returns take language and return contries and countries codes
   */
  getCountries(lang: string) {
    let api = `${this.env.backOffice}/api/GetAllCountriesByLangName?LangCode=${lang}`;
    return this.http.get<countries[]>(api).pipe( retry(2),take(1),catchError(err=>{console.error(err);throw err})
    );
  }
/**
 * 
 * @param pos 
 * @returns All offers of type OfferDTO[] depending on the current point of sale
 */
GetAllOffers(pos: string):Observable<{offers:OfferDTO[]}> {
  let API = `${this.env.offers.getAllActive}${pos}`;
  return this.http.get<{offers:OfferDTO[]}>(API).pipe(
   take(1),retry(3), catchError(err => { console.error(err, "ERROR IN GETTING ALL OFFERS"); throw err })
  )
}
   /**
 * 
 * @param id 
 * @returns a specific offer of type OfferDTO[] depending on the given ID
 */
  getOfferBYId(id: number | string):Observable<OfferDTO> {
    let API = `${this.env.offers.getByID}${id}`;
    return this.http.get<OfferDTO>(API).pipe(
      retry(3), take(1), map(
        (res: any) => { return res }
      ), catchError(err => { console.error(err, "ERROR IN GETTING OFFER BY ID"); throw err })
    )
  }
  /**
   * 
   * @param Source 
   * @param LanguageCode 
   * @param body 
   * @param searchID 
   * @returns It takes source, language and searchID parameters and post the body 
   * of the request as the booked offer model(body:BookedOffer)
   */
  BookOffers(Source: string, LanguageCode:string,body:BookedOffer,searchID:string ) {

    let API = `${this.env.offers.BookOffer}`;
    const httpOptions = {
      headers: new HttpHeaders({
 
        'Source': Source,'LanguageCode':LanguageCode,'searchID':searchID
      })
    };
    let Body ={
      BookedOffer:body
    }
    return this.http.post(API, Body,httpOptions).pipe(
      take(1),
      map(
        (result:any) => result
      )
    )
  
  }
     /**
 * @param id
 * @returns itinerary depending on the given ID if the service type is offline.
 */
     retriveItinerary(id:number |string ) {
      let API: string = `${this.env.offlineSeats}${this.env.offers.RetriveItineraryDetails}?ItineraryId=${id}`;
      return this.http.get<Itinerary>(API).pipe(retry(3), take(1), catchError(err => { console.error(err); throw err }));
    }

  getAboutUs(){
    let API:string = `${this.env.staticPages}/api/Pages/GetPageBySlug?slug=about-us`;
    return this.http.get(API).pipe(retry(3),take(1),catchError(err=>{console.error(err);throw err}))
  }

  getContact(){
    let API:string = `${this.env.staticPages}/api/Pages/GetPageBySlug?slug=contact`;
    return this.http.get(API).pipe(retry(3),take(1),catchError(err=>{console.error(err);throw err}))
  }

  getPrivacyPolicy(){
    let API:string = `${this.env.staticPages}/api/Pages/GetPageBySlug?slug=privacy-policy`;
    return this.http.get(API).pipe(retry(3),take(1),catchError(err=>{console.error(err);throw err}))
  }

  getTerms(){
    let API:string = `${this.env.staticPages}/api/Pages/GetPageBySlug?slug=terms`;
    return this.http.get(API).pipe(retry(3),take(1),catchError(err=>{console.error(err);throw err}))
  }

  getMostSearchedFlights() {
    let API: string = `${this.env.searchflow}/api/GetCheapestFlights?resCount=5`;
    return this.http
      .get<MostSearchedFlightsResponse[]>(
        'https://flightsearch.bookingwep.com/api/GetCheapestFlights?resCount=5',
      )
      .pipe(
        retry(3),
        take(1),
        catchError((err) => {
          console.error(err);
          throw err;
        }),
      )
  }

}
