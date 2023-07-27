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
 * dynamic top destinations Mdel according to backend response
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
    OfferCode: number;
    OfferName: string;
    OfferDescription: string;
    OfferTag:number;    
    pos: string;
    totalSellPrice: number;
    startDate: Date;
    endDate: Date;
    offerImage: Image;
    currency: string;
    offerDays: OfferDay[];
    netProfit: number;
    totalCostPrice: number;
    totalQuantity: number;
    offerProvider: string;
    AgentId: string;
    paymentMethod: string;
    salesChannel: string;
    offerStatus: number;
    offerServices:OfferService[]
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
    offlineItinerary: number,
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
    OfferBookingNo: string,
    PhoneNumber: string,
    PhoneCountryCode: string,
    Email: string,
    FullName: string,
    Nationality: string,
    SelectedOfferCode: string,
    BookingDate: string,
    ProviderID: string,
    BookedOfferStatus: string,
    IncludedCities:Cities[],
    BookingStatusName:string
}
export interface Cities{
    
          CountryCode: string,
          CityName: string,
          CityType: string
}
export interface BookedOffersFilterfilterObj {
    BookedOfferStatus: string,
    email: string,
    Nationality: string
}


export interface Airlines{
    airlineCode:string,
    languageCode:string,
    airlineName:string,
    alternativeBusinessName:string,
    airlineLogo:string,
    passportDetailsRequired:boolean
}
