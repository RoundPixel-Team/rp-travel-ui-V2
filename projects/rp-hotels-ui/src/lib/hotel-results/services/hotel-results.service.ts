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
  locationsArrSelected: Array<string> = [];
  ratesArrSelected: Array<number> = [];
  hotelResultsLoader:boolean=true;
  maxPrice:number= 100000;
  subscription : Subscription = new Subscription()
  filterForm : FormGroup= new FormGroup({
    hotelName: new FormControl('Grand City Hotel'),
    hotelRates: new FormArray([]),
    hotelPrice: new FormControl(93.4707),
    hotelLocations: new FormArray([])
  });

  constructor() { 
    //initialize hotel rate array with rates
    for(let i=0; i<5; i++){
      this.addRating();
      this.ratesArrSelected.push(i+1)
    }
  }

  ngOnInit(){}

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
          this.locationsArrSelected= res.Locations
          //initialize hotel locations form array value with true values (selected)
          res?.Locations.map(()=>{
            this.addLocations()
          })
          this.hotelsFilter();
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
  hotelsFilter(){ 
    this.filterForm.valueChanges.subscribe((res)=>{
      if(this.hotelDataResponse?.HotelResult){
        this.filteredHotels = this.hotelDataResponse?.HotelResult.filter(hotel => this.filterHotelData(hotel))
      }
      console.log("UPDATED DATA", this.filteredHotels)
    })
  }
  /**
   * filter Hotel Object based on Hotel Name, Hotel Star rate, Hotel Price and hotel Locations 
   * @param hotel 
   * @returns 
   */
  filterHotelData(hotel:hotel){
    let hotelPrice = this.filterForm.get('hotelPrice')?.value;
    return hotel.hotelName.toLowerCase().indexOf((<string>this.filterForm.get('hotelName')?.value).toLowerCase()) != -1 && (hotel.costPrice >= hotelPrice && hotel.costPrice <= this.maxPrice) 
           && this.locationsArrSelected.includes(hotel.City) && this.ratesArrSelected.includes( hotel.hotelStars) 
  }
    /**
   * call it on the hotel rate filter input to fill the hotel Rates Array (selected Values)
   * */
  selectHotelRates(index:number){
    // Toggle checked
    if(!this.hotelRatesArray.at(index)?.get('rate')?.value){
      this.ratesArrSelected.push(index+1);
    }
    else{
      let rateIndex= this.ratesArrSelected.indexOf(index+1)
      this.ratesArrSelected.splice(rateIndex,1);
    }
  }
  /**
   * initialize hotel rates form array with true value to make it selected
   */
  addRating(){
    (<FormArray>this.filterForm.get('hotelRates')).push(
      new FormGroup ({
        rate: new FormControl(true),
      })
    )
  }
  /**
   * initialize hotel Locations form array with true value to make it selected
   */
  addLocations(){
    (<FormArray>this.filterForm.get('hotelLocations')).push(
      new FormGroup ({
        location: new FormControl(true),
      })
    )
  }
  /**
   * call it on the locations filter input to fill the Locations Array (selected Values)
   * @param index  index of the current selected or deselected location
   * @param value  current selected or deselected location
   */
  selectLocations(index:number, value:string){
    if(this.hotelLocationsArray.at(index)?.get('location')?.value){
      this.locationsArrSelected.push(value);
    }
    else{
      let index= this.locationsArrSelected.indexOf(value)
      this.locationsArrSelected.splice(index,1);
    }
    console.log("selected locations", this.locationsArrSelected)
  }
  public get hotelRatesArray(): FormArray{
    return this.filterForm.get('hotelRates') as FormArray;
  }
  public get hotelLocationsArray(): FormArray{
    return this.filterForm.get('hotelLocations') as FormArray;
  }
  /**
   * this function is responsible to destory any opened subscription on this service
   */
  destroyer(){
    this.subscription.unsubscribe()
  }
}
