export interface enviromentModel{
    offlineSeats : string
    searchflow   : string
    BookingFlow  : string
    FareRules    : string
    asm          : string
    Apihotels    : string
    prepay  : string
    users        : string
    admin        : string
    getDPayment  : string
    bookHotels   : string
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