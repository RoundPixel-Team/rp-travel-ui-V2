
import { airItineraries, searchCriteria } from "../flight-result/interfaces";


/**
 * this model is mappping to the get selected flight response
 */
export interface selectedFlight {
    airItineraryDTO:airItineraries
    status: string
    searchCriteria:searchCriteria
    passportDetailsRequired:boolean
}

/**
 * this model is mappping to flight offline service response
 */
export interface flightOfflineService {
    currency: string,
    servicePrice: number,
    serviceCode: string,
    serviceName: string,
    serviceDescription: string,
    pslacement: string,
    pos:string [],
    offlineServiceImageUrl: string,
    oflineServiceIconUrl: string,
    offlineServiceTerms: string,
    serviceNameAr: string,
    serviceDescriptionAr: string,
    offlineServiceTermsAr: string,
    recommended: boolean,
    perPassenger: boolean,
    added?: boolean;
}


export interface passengerInfoModel  {
    title:string,
    firstName:string,
    lastName:string,
    dateOfBirth:string,
    countryOfResidence:string,
    countryCode:any,
    phoneNumber:any,
    passengerType:string,
    nationality:string,
    PassportNumber:string,
    PassportExpiry:string,
    IssuedCountry:string,
   }
   
   export interface  passengersModel {  
      bookingEmail:string,
      UserCurrency:string,
      DiscountCode: any,
      passengersDetails:passengerInfoModel[]
   }

   export interface BreakDownView{
    ADT:{
      totalFare:[number,string],
      ScFare:[number,string,number]
    },
    CNN:{
      totalFare:[number,string],
      ScFare:[number,string,number]
    },
    INF:{
      totalFare:[number,string],
      ScFare:[number,string,number]
    }
  }


  export interface Cobon {
    promotionDetails: promotionDetails
    status: string
}

export interface promotionDetails {
    promoCode: string,
    discountAmount: number,
    discountCode: any,
    newFare: number
}