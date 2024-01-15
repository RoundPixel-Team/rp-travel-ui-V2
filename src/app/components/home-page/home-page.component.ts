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
    
    this.hotelRoom.getRooms('2024B0I2S304H90B60I10S50H00I20','1083','7');
    this.hotelRoom.getCancelPolicy('2024B0I2S304H90B60I10S50H00I20','1083','1','e860de88-95e2-469d-b3de-6a35e8db6feb','7')
  }


}
