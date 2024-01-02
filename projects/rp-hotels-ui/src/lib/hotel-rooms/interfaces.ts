import { amenties } from "../hotel-results/interfaces";

export interface hotelRoomsResponse{
    hotelCode: string;
    hotelName: string;
    hotelRate: number;
    providerID: string;
    providerHotelCode?: any;
    providerHotelID: string;
    hotelThumb?: any;
    hotelDescription: string;
    shortcutHotelDescription: string;
    MarkupId: number;
    DiscountId: number;
    MarkupValue: number;
    DiscountValue: number;
    hotelImages: string[];
    LatLong?: any;
    Location: string;
    hotelStars: number;
    costCurrency?: any;
    costPrice: number;
    TotalSellPrice: number;
    sellCurrency?: string;
    Lat: string;
    Lng: string;
    City: string;
    Country: string;
    ZipCode?: any;
    Address: string;
    CityTaxValue: number;
    CityTaxCurrency?: string;
    Amenities: amenties[];
    Packages: packages[];
    CheckAvailabilityAfterSaveBooing:string
    CheckAvailabilityBeforeSaveBooing: string
}

export interface packages{
    PackageKey:string
    Rooms: room[];
    TotalSellPrice:string
}

export interface room{
    RoomIndex: number;
    RoomCode: string;
    RoomReference: string;
    Paxs: number;
    Adult: number;
    Child: number;
    RoomType: string;
    RoomMeal: string;
    RatePerNight: number;
    CostPrice: number;
    TotalSellPrice: number;
    MarkupId: number;
    DiscountId: number;
    MarkupValue: number;
    DiscountValue: number;
    IsRefundable: boolean;
    Images: string[];
    cancellationRules: any[];
    PackageNO:number;
    Amenities:amenties[] | any
    ChargeType:any
    Curency:string
    HotelNorms:any
    Inclusion:any
    SpecialPromo:string []
    Supplements:any[]
}


export interface roomsFilter{
    roomType:string
    roomMeal:string
}

export interface roomCancelPolicy{
    FromDate: string,
    ToDate: string,
    Price: number,
    CanellationRuleText: string,
    Curency: string,
    ChargeType: any
}