import { Component, OnInit, inject } from '@angular/core';
import { HomePageService } from 'rp-travel-ui';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {

  public homePageService = inject(HomePageService)

  constructor() { }

  ngOnInit(): void {
    this.homePageService.getCurrency('KWD');
    this.homePageService.getAirports('en');
    this.homePageService.getCountries('en');
    this.homePageService.getPointOfSale();
    this.homePageService.getAllOffers('EG');
    this.homePageService.getOfferById(37);
    

  }

}
