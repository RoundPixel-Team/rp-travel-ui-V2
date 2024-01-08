import { Injectable, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { HotelResultsApiService } from './hotel-results-api.service';
import { Router } from '@angular/router';
import { GetHotelModule, hotel, hotelResults } from '../interfaces';
import { guests } from '../../hotel-search/interfaces';
import { FormArray, FormControl, FormGroup } from '@angular/forms';


@Injectable({
  providedIn: 'root'
})
export class HotelResultsService {

  api = inject(HotelResultsApiService)
  router = inject(Router)
  hotelDataResponse?:hotelResults;
  filteredHotels: hotel[] = [];
  locationsArr: Array<string> = [];
  hotelResultsLoader:boolean=true;
  subscription : Subscription = new Subscription()
  filterForm : FormGroup= new FormGroup({
    hotelName: new FormControl(''),
    hotelRates: new FormArray([]),
    hotelPrice: new FormControl(),
    hotelLocation: new FormControl([])
  });

  constructor() { 
    //initialize hotel rate array with rates
    for(let i=0; i<5; i++){
      this.addRating(i+1);
    }
  }

  ngOnInit(){

  }

  /**
   * this function is responsible to call API to get the Hotel Data
   * you should call it first in the search Results componet
   */
  getHotelDataFromUrl(){
    // let hotelUrl = this.router.url.split('/');
    let hotelUrl = ('hotels.hogozati.com/hotelResult/en/KWD/EG/2024B0I4S938H00B30I60S50H60I80/3202/CAIRO,EGYPT/Kuwait/February%2001,%202024/February%2022,%202024/1/R0A2C0').split('/');

    let guestInfo = hotelUrl[12];
    let searchRooms = this.generateSearchRooms(guestInfo); //get child numbers from URL to send an array of thier Ages
    let hotelSearchObj: GetHotelModule = {
      Lang:hotelUrl[2],
      Currency:hotelUrl[3],
      POS:hotelUrl[4],
      sID:hotelUrl[5],
      CityName:hotelUrl[6],
      Nat:hotelUrl[8],
      DateFrom:hotelUrl[9].replace(new RegExp('%20','g'),' '), //replace all %20 to white space
      DateTo:hotelUrl[10].replace(new RegExp('%20','g'),' '),
      Source:'Direct',
      SearchRooms:searchRooms
    }
    //call het hotel data API
    this.subscription.add(
      this.api.getHotelsRes(hotelSearchObj).subscribe((res)=>{
        if(res){
          this.hotelResultsLoader = false;
          this.hotelDataResponse = res;
          this.filteredHotels = res.HotelResult;
          this.locationsArr = res.Locations;
        }
      })
    )
  }
  /**
   * this function is responsible to generate search rooms Array
   * @param guestInfo get this string from URL after splitting it
   */
  generateSearchRooms(guestInfo:string){
    let SearchRooms: guests[] = [];
    let roomsInfo = guestInfo.split("R");
    roomsInfo.splice(0, 1);
    for (let i = 0; i < roomsInfo.length; i++) {
      let chNum: number = 0;
      let age: number[] = [];
      chNum = Number(roomsInfo[i].slice(4, 5));
      if (chNum === 0) {
        age = [];
      }
      else if (chNum === 1) {
        age = [7];
      }
      else if (chNum === 2) {
        age = [7,6];
      }
      SearchRooms[i] = { adultN: Number(roomsInfo[i].slice(2, 3)), childN: age };
    }
    return SearchRooms;
  }
  /**
   * this function is responsible to sort the hotels data based on Price
   * @param sortType = 'high' || 'low' 
   */
  priceSorting(sortType:string){
    switch (sortType) {
      case "Low":
        {
          this.filteredHotels = this.filteredHotels.sort((low, high) => low.TotalSellPrice - high.TotalSellPrice);
          break;
        }

      case "High":
        {
         this.filteredHotels = this.filteredHotels.sort((low, high) => high.TotalSellPrice - low.TotalSellPrice);
          break;
        }
      default:{
        this.filteredHotels = this.filteredHotels.sort((low, high) => high.TotalSellPrice - low.TotalSellPrice);
        break;
      } 
    }
    return this.filteredHotels ;
  }
  /**
   * this function is responsible to sort the hotels data based on Star Rating
   * @param sortType = 'high' || 'low' 
   */
  rateSorting(sortType:string){
    switch (sortType) {
      case "Low":
        {
          this.filteredHotels = this.filteredHotels.sort((low, high) => low.hotelRate - high.hotelRate);
          break;
        }

      case "High":
        {
         this.filteredHotels = this.filteredHotels.sort((low, high) => high.hotelRate - low.hotelRate);
          break;
        }
      default:{
        this.filteredHotels = this.filteredHotels.sort((low, high) => high.hotelRate - low.hotelRate);
        break;
      } 
    }
    return this.filteredHotels ;
  }
  filter(){ 
    // this.filterdhotels = this.hotels.HotelResult.filter(v => this.filterfunc(v));
    let filterr= this.filteredHotels.filter((res)=>{
      this.filterValue(res)
    })
    this.filteredHotels.filter((res)=>{})
    
  }
  formValueChanged(){
    this.filterForm.valueChanges.subscribe((res)=>{
      console.log('Hotel Filter Form Value', res)
    })
  }
  filterValue(value:any){
    // (this.hotelRatesArray.indexOf(value.hotelStars) != -1 || this.starsArray.length == 0)
  }
  addRating(rate:number){
    (<FormArray>this.filterForm.get('hotelRates')).push(
      new FormGroup ({
        rate: new FormControl(true),
      })
    )
  }

  public get hotelRatesArray(): FormArray{
    return this.filterForm.get('hotelRates') as FormArray;
  }

  /**
   * this function is responsible to destory any opened subscription on this service
   */
  destroyer(){
    this.subscription.unsubscribe()
  }
}
