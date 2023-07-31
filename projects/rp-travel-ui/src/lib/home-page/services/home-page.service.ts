import { Injectable, inject } from '@angular/core';
import { HomePageApiService } from './home-page-api.service';
import { BookedOffer, Image, Itinerary, OfferDTO,airPorts, countries, currencyModel, pointOfSaleModel } from '../interfaces';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';


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
/**
 * getting selected offer ID from params
 */
  id= this.route.snapshot.paramMap.get("id");
  /**
   * Getting selected offer data
   */
  singleOffer!: OfferDTO;

  /**number of nights properties */
  numberOfNights!: number;
  /**
   * getting offline itinerary
   */
  offlineItinerary!:Itinerary;
  /**
   * getting offer images
   */
  offerImages: string[] =[];
/**
 * Book offer request header parameters
 */
  source!: string;
  langCode!: string | null;
  searchId!: string;
/**store form value to api */
  submittedForm!:BookedOffer
/**
 * Creating booking an offer form
 */
  offerCheckOutForm = new FormGroup({
    FullName: new FormControl("", [
      Validators.required,

      Validators.minLength(3),
    ]),

    Email: new FormControl("", [
      Validators.required,
      Validators.email,
      Validators.minLength(9),
    ]),

    PhoneNumber: new FormControl("", [
      Validators.required,
      Validators.maxLength(5),
    ]),

    Nationality: new FormControl("", [
      Validators.required,
      Validators.minLength(2),
    ]),
  });
  PhoneNumber: any;
  phonecountrycode!: string;
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
                  
 * this is for fetching and updating Point of Sale (pointOfSale:pointOfSaleModel) 
 *and also updates loader state
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
    this.api.GetAllOffers(pos).subscribe((res)=>{
      if(res){
       
        this.allOffers=res.offers;
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
 * @returns this is for fetching  and updating single offer (offerById:OfferDTO) depending on given id
 * and also updates the loader state.
 */
getOfferById(id:number | string){
  this.loader= true;
  this.subscription.add(
    this.api.getOfferBYId(id).subscribe((res)=>{
      console.log('get ID',id);
      if (res){
        this.singleOffer=res;
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
 * 
 * @param id 
 * @returns this function is responsible for mapping & extracting the offer service properties.
 *  Also,it's responsible for retrieving the offline itinerary from the api in case of offline seats
 *  depending on the offer code.
 */
extractOfferData(id:number | string){
  this.subscription.add(this.api.getOfferBYId(id).subscribe(res=>{
    if (res){
        this.singleOffer=res
        this.offerImages =res.offerImage? [res.offerImage.url] : []
        this.singleOffer.offerServices.map(offerService=>{
          let startDate=new Date(res.startDate);
          let endDate=new Date(res.endDate);
          let differenceInTime=startDate.getTime()-endDate.getTime();
          this.numberOfNights=differenceInTime / (1000 * 3600 * 24);
          if(offerService.serviceType=='1'){            
              this.api.retriveItinerary(offerService.offlineItinerary).subscribe((res:Itinerary) =>{
                if(res){
                  this.offlineItinerary=res;
                }
              })

            

            
          }
        })
    }
  }))
}
/**
 * 
 * @returns submit offer booking form logic
 */
formSubmit(){
this.source='web';
this.id=this.route.snapshot.paramMap.get("id");
 if (localStorage.getItem('lang')==null){
  this.langCode='en'
}else{
  this.langCode=localStorage.getItem('lang');
}
if(this.offerCheckOutForm.valid){
let Body: BookedOffer = {
  Email: this.offerCheckOutForm.value["Email"]!,
  FullName: this.offerCheckOutForm.value["FullName"]!,
  Nationality: this.offerCheckOutForm.value["Nationality"]!,
  PhoneNumber: this.offerCheckOutForm.value["PhoneNumber"]!,
  PhoneCountryCode: this.phonecountrycode,
  SelectedOfferCode:Number(this.id) ,
};
this.api.BookOffers(this.source,this.langCode!,Body,this.id!).subscribe((res:BookedOffer)=>{
  if (res){
    this.submittedForm=res;
  }
})
}else{
  return;
}

}
  /**
   * this function is responsible to destory any opened subscription on this service
   */
  destroyer(){
    this.subscription.unsubscribe()
  }
}
