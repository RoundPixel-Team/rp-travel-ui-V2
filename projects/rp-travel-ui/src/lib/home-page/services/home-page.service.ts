import { Injectable, inject } from '@angular/core';
import { HomePageApiService } from './home-page-api.service';
import { OfferDTO,airPorts, countries, currencyModel, pointOfSaleModel } from '../interfaces';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class HomePageService {

  api = inject(HomePageApiService)
  route=inject(ActivatedRoute)
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
 * here is all available offers
 */
   allOffers:OfferDTO[]=[]
  /**
   * here is all available point of sales
   */
  pointOfSale!:pointOfSaleModel
  /**
   * loading state ..
   */
  loader : boolean = false

  id= this.route.snapshot.paramMap.get("id");
  offerById!: OfferDTO;
;
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
   /**
 * 
 * @param currentLang 
 * this is for fetching all countries (allCountries :countries[]) based on current language
 * also updates loader state (loader:boolean)
 */
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
/**
 * this is for fetching and updating Point of Sale and also updates loader state
 */
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
 * 
 * @param pos 
 * this is for fetching all offers (allOffers :OfferDTO[]) based on current POS
 * also updates loader state (loader:boolean)
 */
getAllOffers(pos:string){
  this.loader = true
  this.subscription.add(
    this.api.AllOffers(pos).subscribe((res:OfferDTO[])=>{
      if(res){
       
        this.allOffers=res;
        this.loader = false;
        console.log(res,'show offers');
       
      }
    },(err:any)=>{
      console.log('get all offers error ->',err)
      this.loader = false
    })
  )
}
/**
 * 
 * @param id 
 * @returns single offer depending on given id
 */
getOfferById(id:number | string){
  this.loader= true;
  this.subscription.add(
    this.api.OfferBYId(id).subscribe((res)=>{
      console.log('get ID',id);
      if (res){
        this.offerById=res;
        this.loader= false;
        console.log("Offer",res);
      }
        
      },(err:any)=>{
        console.log('get offer by ID err==>',err);
        this.loader= false;
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
