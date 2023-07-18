import { Injectable } from '@angular/core';
import { enviromentModel } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class EnvironmentService {

    offlineSeats ='http://178.63.214.219:7025'
    searchflow =  'https://flightsearch.rhlaty.com'
    BookingFlow = 'https://flightflow.rhlaty.com'
    FareRules =   'https://flightprov.rhlaty.com'
    asm =         'https://backofficeapi.rhlaty.com'
    Apihotels =   'https://hotels.rhlatycom'
    hotelprepay = 'https://prepayapi.rhlaty.com'
    users =       'https://usersapi.rhlaty.com'
    admin =       'https://adminapi.rhlaty.com/'
    getDPayment = 'https://adminapi.rhlaty.com/'
    bookHotels =  'https://hotels.rhlaty.com'
    hotelPrepay = 'https://prepayapi.rhlaty.com'
    backOffice =  'https://backofficeapi.rhlaty.com'
    FlightTop =   'https://flightsearch.rhlaty.com'
    offers= {
      getAll:     'http://41.215.243.36:7893/api/GetAllOffersAPI?POS=',
      getByID:    'http://41.215.243.36:7893/api/GetOfferByIdAPI?OfferId=',
      BookOffer:  'http://41.215.243.36:7895/api/BookOffer',
      RetriveItineraryDetails:'/api/Admin/RetriveItineraryDetails'
    }

  constructor() { }

  /**
   * 
   * @param env [all environment endpoints]
   * configure the environment at your application startup
   * follow the interface named "enviromentModel" to provide all the system endpoints needed
   */
  envConfiguration(env:enviromentModel){
    this.Apihotels = env.Apihotels
    this.BookingFlow = env.BookingFlow
    this.FareRules = env.FareRules
    this.FlightTop = env.FlightTop
    this.admin = env.admin
    this.asm = env.asm
    this.backOffice = env.backOffice
    this.bookHotels = env.bookHotels
    this.getDPayment = env.getDPayment
    this.hotelPrepay = env.hotelPrepay
    this.hotelprepay = env.hotelprepay
    this.offers.BookOffer = env.offers.BookOffer
    this.offers.RetriveItineraryDetails = env.offers.RetriveItineraryDetails
    this.offers.getAll = env.offers.getAll
    this.offers.getByID = env.offers.getByID
    this.offlineSeats = env.offlineSeats
    this.searchflow = env.searchflow
    this.users = env.users
  }
}
