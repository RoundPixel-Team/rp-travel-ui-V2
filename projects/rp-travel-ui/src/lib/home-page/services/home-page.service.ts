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
   * Here's the value of selected currency
   */
selectedCurrency : currencyModel = {
  Currency_Code: "KWD",
  Currency_Name: "Kuwait Dinar" ,
  ID: 2027,
  Image_Url: "https://images.khaleejgate.com/Content/Currencies/KWD.JPG",
  Is_Base_Currency: true,
  rate: 1
};
  /**
   * here is all available airports
   */
  allAirports :airPorts[]=[]
   /**
   * here is all available countries
   */
   allCountries :countries[]=[]
/**
 * here is all available offers
 */
   allOffers:OfferDTO[]=[]
  /**
   * here is all available point of sale
   */
  pointOfSale!:pointOfSaleModel
  /**
   * loading state ..
   */
  loader : boolean = false

  /**
   * Getting selected offer data
   */
  selectedOffer!: OfferDTO;

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

/**book offer API request value*/
  submittedForm!:BookedOffer
/**
 * Creating booking offer form
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
   * set the default selected currency model according to point of sale
   * @param currencyModel
   */
  setSelectedCurrency(currency:currencyModel){
    this.selectedCurrency = currency
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
        this.selectedOffer=res;
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
  
    this.offerImages =this.selectedOffer.offerImage? [this.selectedOffer.offerImage.url] : []
    let startDate=new Date(this.selectedOffer.startDate);
    let endDate=new Date(this.selectedOffer.endDate);
    let differenceInTime=startDate.getTime()-endDate.getTime();
    this.numberOfNights=differenceInTime / (1000 * 3600 * 24);
    this.selectedOffer.offerServices.map(offerService=>{
      if(offerService.serviceType=='1'){            
          this.subscription.add(this.api.retriveItinerary(offerService.offlineItinerary).subscribe((res:Itinerary) =>{
            if(res){
              this.offlineItinerary=res;
            }
          },(err:any)=>{
            console.log('offline itinerary err==>',err);
            })

        

        
    )}
    })
    
 
}
/**
 * 
 * @param source 
 * @param langCode 
 * @param phonecountrycode 
 * @returns it send the request of book offer form with the http headers which are the passed
 *  parameters and with the body of the request in type of (BookedOffer)
 */
bookOffer(source:string,langCode:string,phonecountrycode:string){
let offerId=this.route.snapshot.paramMap.get("id");
if(this.offerCheckOutForm.valid){
let Body: BookedOffer = {
  Email: this.offerCheckOutForm.value["Email"]!,
  FullName: this.offerCheckOutForm.value["FullName"]!,
  Nationality: this.offerCheckOutForm.value["Nationality"]!,
  PhoneNumber: this.offerCheckOutForm.value["PhoneNumber"]!,
  PhoneCountryCode: phonecountrycode,
  SelectedOfferCode:Number(offerId),
};
this.subscription.add(
  this.api.BookOffers(source,langCode!,Body,offerId!).subscribe((res:BookedOffer)=>{
    if (res){
      this.submittedForm=res;
    }
  },(err:any)=>{
    console.log('Book offer err==>',err);
    })
)

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
