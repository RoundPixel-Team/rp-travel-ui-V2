import { IAirItinerary } from "../flight-result/interfaces";

export interface confirmationModel {
    fareAmount: number;
    additionalServicesAmount: number;
    additionalServicesCurrency: string;
    hgNumber: string;
    pnr: string;
    bookingEmail: string;
    status: string;
    issueTicketStatus: boolean;
    userSelectInsurance: boolean;
    promoCode: string;
    promoDiscount: number;
    languageCode: string;
    userCurrencyCode: string;
    schedualChanges: boolean;
    selectedInsurance: any;
    additionalServices: (any)[] ;
    airItineraries: IAirItinerary[] ;
    passengersDetails: (PassengersDetailsEntity)[] ;
    paymentTrackID?:string
    paymentMethod?:string
    paymentRef?:string
  }

  export interface PassengersDetailsEntity {
    title: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    countryOfResidence: string;
    nationality: string;
    issuedCountry: string;
    countryCode: string;
    phoneNumber: string;
    passportNumber: string;
    passportExpiry: string;
    passengerType: string;
    ticketNumber: any;
  }
  