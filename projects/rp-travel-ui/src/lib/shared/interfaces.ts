export interface enviromentModel{
    offlineSeats : string
    searchflow   : string
    BookingFlow  : string
    FareRules    : string
    asm          : string
    Apihotels    : string
    hotelprepay  : string
    users        : string
    admin        : string
    getDPayment  : string
    bookHotels   : string
    hotelPrepay  : string
    backOffice   : string
    FlightTop    : string
    offers:{
      getAll     : string,
      getByID    : string,
      BookOffer  : string,
      RetriveItineraryDetails : string
    }
}
/**
 * used to save error messages with two language (arabic, english)
 */
export interface AlertMsgModel{
  arMsg:string | null | undefined
  enMsg:string | null | undefined
}