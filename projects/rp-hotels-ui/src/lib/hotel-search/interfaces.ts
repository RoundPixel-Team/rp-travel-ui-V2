import { hotelCities } from "../home-page/interfaces"

export interface hotelSearchForm {
    location: hotelCities
    nation: string,
    checkIn: string,
    checkOut: string,
    roomN: number,
    guestInfo: guests[]
}
export interface CountriescodeModule {

    pseudoCountryCode: string,
    countryName: string,
    regionName: string,
    phoneCode: any
}
export interface SearchHoteltModule { 
    
    lan:string,
    Currency:string,
    POS:string,
    serachId:any,
    CityName:string,
    citywithcountry:string,
    nation:string,
    checkIn:string |null,
    checkOut:string | null,
    roomN:string,
    guestInfo:any,

 }
export interface guests {
    adultN: number,
    childN: number,
    childGroup: any[]
}


export interface errorAlert {
    errorEN: string
    errorAR: string
}
/**
 * used to save error messages with two language (arabic, english)
 */
export interface AlertMsgModel{
    arMsg:string | null | undefined
    enMsg:string | null | undefined
  }