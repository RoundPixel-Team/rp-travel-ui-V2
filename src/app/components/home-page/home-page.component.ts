import { Component, OnInit, inject } from '@angular/core';
import { HotelRoomsService } from 'projects/rp-hotels-ui/src/lib/hotel-rooms/services/hotel-rooms.service';
import { HomePageService } from 'rp-travel-ui';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {

  public homePageService = inject(HomePageService)
  public hotelRoom = inject(HotelRoomsService)

  constructor() { }

  ngOnInit(): void {
    this.homePageService.getCurrency('KWD');
    this.homePageService.getAirports('en');
    this.homePageService.getCountries('en');
    this.homePageService.getPointOfSale();
    this.homePageService.getAllOffers('KW');
    this.homePageService.getOfferById(72);
    
    this.hotelRoom.getRooms('2024B0I1S614H20B00I30S50H10I10','1000','7');
  }


}
