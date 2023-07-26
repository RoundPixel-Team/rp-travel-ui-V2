import { Injectable, inject } from '@angular/core';
import { HomePageApiService } from './home-page-api.service';
import { airPorts, countries, currencyModel, pointOfSaleModel } from '../interfaces';
import { Subscription } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class HomePageService {

  api = inject(HomePageApiService)
  subscription : Subscription = new Subscription()

  /**
   * here is all available currencies
   */
  allCurrency : currencyModel[] = []
  /**
   * here is all available airports
   */
  allAirports :airPorts[]=[]
   /**
   * here is all available airports
   */
   allCountries :countries[]=[]
  /**
   * here is all available point of sales
   */
  pointOfSale!:pointOfSaleModel
  /**
   * loading state ..
   */
  loader : boolean = false
  response:string = ''
  constructor() { }


/**
 * 
 * @param baseCurrency 
 * this is for fetching all currencies and update my all currencies state (allCurrency:currencyModel[])
 * also updates loader state (loader:boolean)
 */
  getCurrency(baseCurrency:string){
    this.loader = true
    this.subscription.add(
      this.api.currencyApi(baseCurrency).subscribe((res:currencyModel[])=>{
        if(res){
          this.allCurrency = res
          this.loader = false
        }
      },(err:any)=>{
        console.log('get all currency error ->',err)
        this.loader = false
      })
    )
  }

  /**
 * 
 * @param currentLang 
 * this is for fetching all airports (allAirports: airPorts[]) based on current language
 * also updates loader state (loader:boolean)
 */
  getAirports(currentLang:string){
    this.loader = true
    this.subscription.add(
      this.api.UtilityAirports(currentLang).subscribe((res:airPorts[])=>{
        if(res){
          this.allAirports = res
          this.loader = false
        }
      },(err:any)=>{
        console.log('get all airports error ->',err)
        this.loader = false
      })
    )
  }
  getCountries(currentLang:string){
    this.loader = true
    this.subscription.add(
      this.api.getCountries(currentLang).subscribe((res:countries[])=>{
        if(res){
          this.allCountries = res
          this.loader = false
        }
      },(err:any)=>{
        console.log('get all countires error ->',err)
        this.loader = false
      })
    )
  }

getPointOfSale(){
  this.loader = true
  this.subscription.add(
      this.api.pointOfSale().subscribe((res)=>{
        if(res){
                  this.pointOfSale = res
                  this.loader = false
                }
      },(err:any)=>{
        console.log('get all pointofsales error ->',err)
        this.loader = false
      })
  )
}
  /**
   * this function is responsible to destory any opened subscription on this service
   */
  destroyer(){
    this.subscription.unsubscribe()
  }
}
