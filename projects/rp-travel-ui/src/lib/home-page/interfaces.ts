/**
 * all currency Model according to backend response
 */
export interface currencyModel {
    ID:number,
    Currency_Code:string,
    Currency_Name:string,
    Is_Base_Currency:boolean,
    Image_Url:string,
    rate : number
 }

 /**
 * point Of Sale Model according to backend response
 */
 export interface pointOfSaleModel { 
    ip?:string,
    city?:string,
    region?:string,
    region_code?:string,
    country?:string,
    country_name?:string,
    country_nameAr?:string,
    continent_code?:string,
    airport?:string
    country_capital?:string,
    in_eu?:boolean,
    postal?:any,
    latitude?:number,
    longitude?:number,
    timezone?:string,
    utc_offset?:string,
    country_calling_code?:string,
    currency?:string,
    languages?:string,
    asn?:string,
    org?:string
}
 /**
 * airPorts Model according to backend response
 */
 export interface airPorts {
    airportCode:string,
    airportName:string,
    cityName:string,
    cityCode:string,
    countryCode:string,
    countryName:string,
    regionName:string
}

 /**
 * countries Model according to backend response
 */
export interface countries {
    pseudoCountryCode:string,
    countryName:string,
    regionName:string,
    phoneCode:any
}


/**
 * get all Cities Model according to backend response
 */
export interface hotelCities {
     CityId: number,
     City: string,
     Country: string,
     CityWithCountry: string,
     CountryCode:string
}


/**
 * dynamic top destinations Model according to backend response
 */
export interface topCityFlight {
    id: number,
    distination: string,
    distinationAr:string,
    airportCode: string,
    price: number,
    currencyCode: string,
    tag: string,
    tagAr:string
    flightType: string,
    imageURL: string,
    tripIdeas: boolean
}


/**
 * dynamic trip ideas Model according to backend response
 */
export interface tripIdeas {
    tripIdea:string,
    tribIdeaAr:string,
    trips:topCityFlight[]
}
/**
 * Offers Models according to backend response
 */
export interface OfferDTO {
    agentId: string;
    bookedQuantity:number;
    currency: string;
    endDate: Date;
    imageID:number;
    netProfit:number;
    offerCode: number;
    offerDays: OfferDay[];
    offerDescription: string;
    offerImage: Image;
    offerName: string;
    offerProvider: string;
    offerServices:OfferService[]
    offerStatus: number;
    offerTag:number;   
    paymentMethod: string;
    pos: string;
    salesChannel: string;
    totalSellPrice: number;
    startDate: Date;
    totalCostPrice: number;
    totalQuantity: number;
}

export interface OfferDay {
    DayDescription: string;
    DayDate: Date;
    OfferServices: OfferService[];
}

export interface OfferService {
    serviceType: string;
    serviceDescription: string;
    servicePrice: number;
    includedCities: IncludedCity[];
    serviceImage: Image[];
    airline:Airlines[],
    offlineItinerary: number |string,
    hotelName:string,
    hotelRate:number,
    roomBasis:string,
    nights:number,
    roomType:string,
    hotelAmenties:HotemAmenties[]
}

export interface HotemAmenties {
    amenity : string
}
export interface IncludedCity {
    CityCode: string;
    CityName: string;
    CityType: string;
}

export interface Image {
    imageDescription: string;
    url: string;
    imageID?: number;
    serviceIndex?: number;
    dayIndex?: number
}
export interface OfferUpdate {
    OfferCode: number;
    OfferDTO: OfferDTO;
}

export interface CurrencyModule {
    ID: number,
    Currency_Code: string,
    Currency_Name: string,
    Is_Base_Currency: string,
    Image_Url: string,
    rate: number
}

export interface HotelsCitiesModule {
    CityId: number,
    City: string,
    Country: string,
    CityWithCountry: string,
    CountryCode: string
}

export interface imageObject {
    ImageDescription: string;
    Image: any;
    serviceIndex?: number;
    dayIndex?: number
}
export interface BookedOffersFilterObject {
    OfferBookingNo?: string,
    PhoneNumber: string,
    PhoneCountryCode: string,
    Email: string,
    FullName: string,
    Nationality: string,
    SelectedOfferCode: string,
    BookingDate?: string,
    ProviderID?: string,
    BookedOfferStatus?: string,
    IncludedCities?:Cities[],
    BookingStatusName?:string
}
export interface Cities{
    
          CountryCode: string,
          CityName: string,
          CityType: string
}



export interface Airlines{
    airlineCode:string,
    languageCode:string,
    airlineName:string,
    alternativeBusinessName:string,
    airlineLogo:string,
    passportDetailsRequired:boolean
}
/**
 * Book an offer form model
 */
export interface BookedOffer {
  
    PhoneNumber: string | null,
    PhoneCountryCode: string,
    Email: string,
    FullName: string,
    Nationality: string,
    SelectedOfferCode: number
  }
/**
 * Offline seats interfaces according to backend response
 */
export interface Itinerary {
    airItineraryId?: string
    flightType:string,
    departureAirportCode:string,
    arrivalAirportCode:string,
    airline:string,
    status:boolean | string,
    flightContractId:number | string, 
    onWardFlightsDTO:OnWardFlightsDTO[],
    TotalFlightFare:totalFlightFare,
    ItineraryAvailabilitiesDTO:AddAvailablity,
    ItineraryCalendarDTOs:itineraryCalendarDTO[]
}

export interface OnWardFlightsDTO  {
    elapsedTime:number | string,
    onWardFlightId?: string,
    airItineraryId?: string,
    departureAirportCode: string,
    arrivalAirportCode: string,
    flightSegmentsDTO:FlightSegmentsDTO[]     
}

export interface FlightSegmentsDTO {
    AirlineLogo?:string
    departureDate:	string,
    arrivalDate:	string,
    duration:number | string
    DepartureOffset:number | string,
    ArrivalOffset:number | string,
    IsStopSegment:boolean | string,
    airlineRefrence:string,
    ArrivalTerminal:string,
    DepartureTerminal:string,
    MarketingAirlineCode:string,
    OperatedAirlineCode:string,
    DepartureAirportCode:string,
    ArrivalAirportCode:string,
    EquipmentNumber:any,
    FlightNumber:any,
    ArrivalTime:string,
    DepartureTime:string,
    MealCode:string,
    TransitTime:string,
    seqNum : number | string,
    passengerBaggageInfosDTO:PassengerBaggageInfoDTO[]

}

export interface PassengerBaggageInfoDTO{
    baggageCode?:	string
    passengerType:	string
    airlineCode:	string
    weight:	        number | string
    unit:	        string
    size:	        number | string
    flightSegmentId?:string
}
export interface totalFlightFare {
    currency: string,
    taxeFare: number | string,
    flightFare: number | string,
    totalFare: number | string
  }
  export interface AddAvailablity {

    id?: string,
    numOfAvailSeats: number | string,
    maxUesd: number | string,
    adtPrice: number | string,
    cnnPrice: number | string,
    infPrice: number | string,
    adtPublishPrice: number | string,
    cnnPublishPrice: number | string,
    infPublishPrice: number | string,
    adtPromoPrice: number | string,
    cnnPromoPrice: number | string,
    infPromoPrice: number | string,
    adtTaxes: number | string,
    cnnTaxes: number | string,
    infTaxes: number | string,
    pnr: string,
    status: boolean | string,
    cabinClass: string,
    currency: string ,
    isRefundable: boolean | string,
    availableType: string,
    airItineraryId?: string,
    availableFrom: string,
    availableTo: string
  
}
export interface itineraryCalendarDTO {
    id?: string,
    numOfAvailSeats: number | string,
    numUsed: number | string,
    maxUesd: number | string,
    date: string,
    departureAirportCode: string,
    arrivalAirportCode: string,
    pos: string,
    airline: string,
    cabineClass: string,
    status: boolean | string,
    flightType: string,
    airItineraryId?: string
}