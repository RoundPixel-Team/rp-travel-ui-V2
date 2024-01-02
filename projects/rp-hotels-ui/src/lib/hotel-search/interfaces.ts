import { hotelCities } from "../home-page/interfaces"

export interface hotelSearchForm{
    location: hotelCities
    nation: string,
    checkIn: string,
    checkOut: string,
    roomN: number,
    guestInfo: guests[]
}

export interface guests{
    adultN: number,
    childN: number,
    childGroup: any[]
}


export interface errorAlert{
    errorEN : string
    errorAR : string
}