import { Injectable, inject } from '@angular/core';
import { HomePageApiService } from './home-page-api.service';
import { currencyModel } from '../interfaces';
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
   * loading state ..
   */
  loader : boolean = false

  constructor() { }


/**
 * 
 * @param baseCurrency 
 * this is for fetching all currencies and update my all currencies state (allCurrency:currencyModel[])
 * also updates loader statee (loader:boolean)
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
   * this function is responsible to destory any opened subscription on this service
   */
  destroyer(){
    this.subscription.unsubscribe()
  }
}
