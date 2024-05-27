import { roomCancelPolicy } from "../hotel-rooms/interfaces";

 export interface selectedPackageAvailibilty{
    Status: string,
    TermsAndConditions: string,
    CancellationInfo: string,
    CancellationPolicies: roomCancelPolicy[],
    BookingBeforePrice: number,
    BookingAfterPrice: number,
    Difference: number,
    Currency: string
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
 export interface hotelSaveBooking{
    sid     :        string
    cityName:        number
    hotelID :        string
    providerHotelID: string
    pid:             string
    roomQty:         number
    paxQty:          number
    src:             string
    mail:            string
    currency:        string
    sellPrice:       number
    totalCost:       number
    Travellers:      roomGuestForm[]
 }


 export interface roomGuestForm{
    salutation:  string
    firstName:   string
    lastName:    string
    phonenum:    string
    roomNo:      string
    paxType:     string
    Main:        boolean
    dateOfBirth: string
    travellerId: number
    phone:       string
    phoneCode:   string
    roomRef:     string
 }
 