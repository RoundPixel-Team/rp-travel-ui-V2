import { Injectable } from '@angular/core';
import { enviromentModel } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class EnvironmentService {

  constructor() { }

  
  offlineSeats=   'http://178.63.214.221:7026' //ticket boarding ofline seats
    searchflow =  'https://flightsearch.rhlaty.com'
    BookingFlow = 'https://flightflow.rhlaty.com'
    FareRules =   'https://flightprov.rhlaty.com'
    asm =         'https://backofficeapi.rhlaty.com'
    Apihotels =   'https://hotelsapi.ticketboarding.com'
    users =       'https://usersapi.rhlaty.com'
    admin =       'https://adminapi.rhlaty.com/'
    getDPayment = 'https://adminapi.rhlaty.com/'
    bookHotels =  'https://hotels.rhlaty.com'
    prepay =      'https://prepayapi.rhlaty.com'
    backOffice =  'https://backofficeapi.rhlaty.com'
    FlightTop =   'https://flightsearch.rhlaty.com'
   
    offers= {
      //Ticket boarding offers endpoints
      getAll: 'http://178.63.214.221:7893/api/GetAllOffersAPI?POS=',
      getAllActive: 'https://flightsearch.ticketboarding.com/api/GetOffers?POS=',
      getByID: 'https://flightsearch.ticketboarding.com/api/SelectOffer?OfferId=',
      BookOffer: "https://flightflow.ticketboarding.com/api/BookOffer",
      RetriveItineraryDetails:'/api/Admin/RetriveItineraryDetails'
    }


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
    this.prepay = env.prepay
    this.offers.BookOffer = env.offers.BookOffer
    this.offers.RetriveItineraryDetails = env.offers.RetriveItineraryDetails
    this.offers.getAll = env.offers.getAll
    this.offers.getByID = env.offers.getByID
    this.offlineSeats = env.offlineSeats
    this.searchflow = env.searchflow
    this.users = env.users
  }
}
