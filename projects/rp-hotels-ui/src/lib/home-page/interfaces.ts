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