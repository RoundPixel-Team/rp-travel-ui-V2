export interface hotelResults{
    CheckIn: string
    CheckOut: string
    HotelResult: hotel[]
    Locations: string[]
    ResultException: {Code:string,ExceptionMessage:string}
    Status: number
}

export interface hotel{
    hotelCode: string
    hotelName: string
    hotelRate:number
    providerID: string
    providerHotelCode: string
    providerHotelID: string
    hotelThumb: string
    hotelDescription: string
    shortcutHotelDescription:string
    MarkupId: number
    DiscountId:number
    MarkupValue: number
    DiscountValue: number
    hotelImages: string []
    LatLong: string
    Location: string
    hotelStars: number
    costCurrency:string
    costPrice: number
    TotalSellPrice: number
    sellCurrency: string
    Lat:string
    Lng: string
    City: string
    Country: string
    ZipCode: string
    Address: string
    CityTaxValue: 0
    CityTaxCurrency: string
    Amenities: amenties[]
}

export interface amenties{
    Amenity:string
    status:string
    HotelCode:string
}


export interface hotelsFilterForm{
    hotelName: string
    mapOn: boolean,
    rate: hotelRateFilter
    price: number[]
    neighbor: string[]
}

export interface hotelRateFilter{
    1:boolean
    2:boolean
    3:boolean
    4:boolean
    5:boolean
}
