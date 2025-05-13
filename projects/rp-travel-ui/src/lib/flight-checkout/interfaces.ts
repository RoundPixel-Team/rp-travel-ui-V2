
import { airItineraries, searchCriteria } from "../flight-result/interfaces";
import { FORM_ERROR_MESSAGES } from "./constants/error-messages";


/**
 * this model is mappping to the get selected flight response
 */
export interface selectedFlight {
    airItineraryDTO:airItineraries
    status: string
    errorMessage:string
    searchCriteria:searchCriteria
    passportDetailsRequired:boolean
    pcc:string
}

/**
 * this model is mappping to flight offline service response
 */
export interface flightOfflineService {
    currency: string,
    servicePrice: number,
    serviceCode: string,
    serviceName: string,
    pslacement?: string,
    pos:string [],
    offlineServiceImageUrl: string,
    oflineServiceIconUrl: string,
    offlineServiceTerms: string,
    serviceNameAr: string,
    offlineServiceTermsAr: string,
    recommended: boolean,
    perPassenger: boolean,
    added?: boolean;

    serviceDescription: string,
    serviceDescriptionAr: string,
    serviceType?:string // e.g. package / yes/no / contactDetails / normal
    parentService? : string // if type == package
    parentServiceAr? : string 
    acceptText?:string // if type == yes/no
    acceptTextAr?:string 
    declineText?:string // if type == yes/no
    declineTextAR?:string 

    subServices?:flightOfflineService[]
    interaction?:boolean
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

   export interface PassengerDetails {
    title: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    countryCode: string;
    nationality: string;
    dateOfBirth: string;
    PassengerType: string; // e.g., ADT for Adult, CHD for Child, etc.
    countryOfResidence: string;
    PassportNumber: string;
    PassportExpiry: string;
    IssuedCountry: string;
    position: number; // Position of the passenger in the list
  }
  
  export interface CheckOutDetails {
    bookingEmail: string;
    DiscountCode?: string;
    passengersDetails: PassengerDetails[];
    UserCurrency: string;
  }
  
  export interface UserSelectedInsurance {
    ProductId?: string; // ID of the selected insurance product, if any
  }
  
  export interface UserSelectedServices {
    SeletedServicesCodes: string[]; // Codes of selected services, if any
  }
  
  export interface OfflineServices {
    UserSeletedInsurance: UserSelectedInsurance;
    UserSeletedServices: UserSelectedServices;
  }
  
  export interface BookingRequest {
    checkOutDetails: CheckOutDetails;
    offlineServices: OfflineServices;
    searchId: string;
    sequenceNumber: number;
    providerKey: string;
    pcc: string; // Point of sale code
    token: string; // Authentication token if required
    ip: string; // IP address of the user
    pos: string; // Point of sale location
    notifyToken?: string; // Notification token if applicable
    language: string; // Language of the request (e.g., EN, AR)
    brandId: string; // Brand Id
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
export interface paymentGateways {
  PaymentMethod:string,
  cardImg:string,
  GatewayType:string
}
export interface paymentCharges {
  amount: number,
    currency: string,
    paymentMethod: string
}
export interface mergedGates{
  Amount: number,
  Currency: string,
  PaymentMethod: string,
  cardImg:string,
  GatewayType:string
}
export type userControllersKeys = keyof typeof FORM_ERROR_MESSAGES;