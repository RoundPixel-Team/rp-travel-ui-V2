import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { EnvironmentService, HomePageService } from 'rp-travel-ui';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  
  title = 'rp-travel-ui-V2';
  public environment = inject(EnvironmentService)
  private router = inject(Router)

  /**
   * while app initilization
   */
  constructor() {
    let envObject  = {
      offlineSeats:  '',
      searchflow:    'https://flightsearch.khaleejgate.com',
      BookingFlow:   'https://flightflow.khaleejgate.com',
      FareRules:     'https://flightprov.khaleejgate.com',
      asm:           'https://backofficeapi.khaleejgate.com',
      Apihotels:     "https://hotels.khaleejgatecom",
      hotelprepay:   'https://prepayapi.khaleejgate.com',
      users:         'https://usersapi.khaleejgate.com',
      admin:         'https://adminapi.khaleejgate.com/',
      getDPayment:   'https://adminapi.khaleejgate.com/',
      bookHotels:    "https://hotels.khaleejgate.com",
      hotelPrepay:   'https://prepayapi.khaleejgate.com',
      backOffice:    'https://backofficeapi.khaleejgate.com',
      FlightTop:     'https://flightsearch.khaleejgate.com',
      offers: {
        RetriveItineraryDetails:'',
        getAll:    'http://41.215.243.36:7893/api/GetAllOffersAPI?POS=',
        getByID:   'http://41.215.243.36:7893/api/GetOfferByIdAPI?OfferId=',
        BookOffer: "http://41.215.243.36:7895/api/BookOffer",
      } 
  }

  // configure my endpoints on the application startup (app initilization)
  this.environment.envConfiguration(envObject);
  console.log('search flow end point -->',this.environment.searchflow);
}
  ngOnInit(): void {
  }  

  goToCheckout(){
    this.router.navigate(
      ['/checkout'], 
      { queryParams: {'sid': '2023B7I2S247H70B10I90S10H90I30', 'sequenceNum': 7, 'providerKey': 52 } })
  }
  goToFlightResult(){
    // this._router.navigate(['SecondComponent', {p1: this.property1, p2: property2 }]);

    this.router.navigate(
      ['/flightResult/en/KWD/KW/RoundTrip/CAI-DXB-October%2005,%202023_DXB-CAI-October%2020,%202023/2023B6I4S732H10B00I80S30H80I00/A-1-C-0-I-0/Economy/false'],
      

     )
  }
  goToSearchbox(){
    this.router.navigate(['/searchbox']);
  }
  }


