import { Injectable, inject } from '@angular/core';
import { Subscription, catchError } from 'rxjs';
import { HotelResultsApiService } from './hotel-results-api.service';
import { GetHotelModule, hotel, hotelResults } from '../interfaces';
import { guests } from '../../hotel-search/interfaces';
import { FormArray, FormControl, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class HotelResultsService {

  api = inject(HotelResultsApiService)

  hotelDataResponse?:hotelResults;
  hotelLocationsArr:Array<string>=[];
  filteredHotels: hotel[] = [];
  locationsArrSelected: Array<string> = [];
  ratesArrSelected: Array<number> = [];
  hotelResultsLoader:boolean=true;
  searchID:string='';
  maxPrice:number=100;
  minPrice:number=0;
  minPriceValueForSlider:number = 0
  maxPriceValueForSlider:number = 100
  nightsNumber:any=0;
  subscription : Subscription = new Subscription()
  filterForm : FormGroup= new FormGroup({
    hotelName: new FormControl(''),
    hotelRates: new FormArray([]),
    hotelPrice: new FormControl(),
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
  getHotelDataFromUrl(hotelSearchObj: GetHotelModule, dateFrom:string, dateTo:string){
    //call het hotel data API
    this.subscription.add(
      this.api.getHotelsRes(hotelSearchObj).subscribe((res:hotelResults)=>{
        if(res){
          this.hotelDataResponse = res;
          this.filteredHotels = res.HotelResult;
          this.hotelLocationsArr= [...res.Locations]
          this.locationsArrSelected= [...res.Locations]
          //GET START AND END DATE TO CALCULATE ROOM NIGHTS NUMBER 
          let startDate:Date  =new Date(dateFrom.replace(new RegExp('%20','g'),' '));
          let endDate: Date  = new Date(dateTo.replace(new RegExp('%20','g'),' '));

          this.nightsNumber = this.calculateHotelNights(startDate,endDate);

          //initialize hotel locations form array value with true values (selected)
          res?.Locations.map(()=>{
            this.addLocations()
          })
          this.hotelsFilter();
          this.sorting(1);

          //set price slider configurations
          this.maxPrice = this.filteredHotels[0].costPrice;
          this.minPrice = this.filteredHotels[this.filteredHotels.length -1].costPrice;
          this.minPriceValueForSlider = this.filteredHotels[this.filteredHotels.length -1].costPrice;
          this.maxPriceValueForSlider = this.filteredHotels[0].costPrice;

          this.hotelResultsLoader = false;
        }
      },err=>{
        console.log("result response error",err)
        this.hotelResultsLoader = false
      })
      )
  }
  /**
   * this function is responsible to calculate Nights Number from Dates 
   * @param startDate get value from URL
   * @param endDate get value from URL
   * @returns Nights Number
   */
  calculateHotelNights(startDate:Date,endDate:Date){
    return Math.floor((Date.UTC(endDate.getFullYear(), endDate.getMonth(), endDate.getDate()) - Date.UTC(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()) ) /(1000 * 60 * 60 * 24));
}
  /**
   * this function is responsible to generate search rooms Array
   * @param guestInfo get this string from URL after splitting it
   */
  generateSearchRooms(guestInfo:string){
    let SearchRooms: guests[] = [];
    let roomsInfo = guestInfo.split("R"); //array of rooms data R1A1C0
    roomsInfo.splice(0, 1);
    //loop on rooms Info to get numbers of children and fill array of ages based on child number to send ages to backend
    for (let i = 0; i < roomsInfo.length; i++) {
      let childNum: number = 0;
      let age: number[] = [];
      childNum = Number(roomsInfo[i].slice(4, 5)); 
      if (childNum === 0) { //If child Number 0 then send empty array
        age = [];
      }
      else if (childNum === 1) { //If Child Nuber 1 then send age is 7 
        age = [7];
      }
      else if (childNum === 2) { //If Child Nuber 1 then send ages are 7 and 6 
        age = [7,6];
      }
      SearchRooms[i] = { adult: Number(roomsInfo[i].slice(2, 3)), child: age };
    }
    return SearchRooms;
  }
  /**
   * this function is responsible to sort the hotels data based on Price and Star Rating
   * @param sortIndex based on index of looping on Sort Boxes
   * 0 ==> sort from lowest Price To Highest
   * 1 ==> sort from Highest Price To lowest
   * 2 ==> sort from lowest Star Rate To Highest
   * 3 ==> sort from Highest Star Rate To lowest
   */
  sorting(sortIndex:number){
    switch (sortIndex) {
      case 0:
        {
          this.filteredHotels = this.filteredHotels.sort((low, high) => low.TotalSellPrice - high.TotalSellPrice);
          break;
        }

      case 1:
        {
         this.filteredHotels = this.filteredHotels.sort((low, high) => high.TotalSellPrice - low.TotalSellPrice);
          break;
        }
        case 2:
          {
            this.filteredHotels = this.filteredHotels.sort((low, high) => low.hotelStars - high.hotelStars);
            break;
          }
  
        case 3:
          {
           this.filteredHotels = this.filteredHotels.sort((low, high) => high.hotelStars - low.hotelStars);
            break;
          }
      default:{
        this.filteredHotels = this.filteredHotels.sort((low, high) => high.TotalSellPrice - low.TotalSellPrice);
        break;
      } 
    }
    return this.filteredHotels ;
  }
  hotelsFilter(){ 
    this.subscription.add(
      this.filterForm.valueChanges.subscribe((res)=>{
        if(this.hotelDataResponse?.HotelResult){
          this.filteredHotels = this.hotelDataResponse?.HotelResult.filter(hotel => this.filterHotelData(hotel))
        }
      })
    )
  }
  /**
   * filter Hotel Object based on Hotel Name, Hotel Star rate, Hotel Price and hotel Locations 
   * @param hotel 
   * @returns 
   */
  filterHotelData(hotel:hotel){
    let hotelPrice = this.filterForm.get('hotelPrice')?.value;
    return (hotel.hotelName.toLowerCase()).includes((this.filterForm.get('hotelName')?.value).toLowerCase()) && (hotel.costPrice >= hotelPrice && hotel.costPrice <= this.maxPrice) 
           && this.filterLocations(hotel.Address) && this.ratesArrSelected.includes( hotel.hotelStars) 
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
    if(this.hotelLocationsArray.at(index)?.get('location')?.value == false){
      this.locationsArrSelected.push(value);
    }
    else{
      let locationIndex= this.locationsArrSelected.indexOf(value)
      this.locationsArrSelected.splice(locationIndex,1);
    }
  }
  public get hotelRatesArray(): FormArray{
    return this.filterForm.get('hotelRates') as FormArray;
  }
  public get hotelLocationsArray(): FormArray{
    return this.filterForm.get('hotelLocations') as FormArray;
  }
  /**
   * this function is responsible to change max and min Price
   */
  changePriceValue(value:number, type:string){
    switch (type) {
      case 'max':
          this.maxPrice = value;
        break;
      case 'min':
        this.minPrice = value;
      break;
    }
  }
  /**
   *  filter locations based on selected location items 
   * @param hotelAddres  hotel addres Name from current object
   * @returns 
   */

  filterLocations(hotelAddres:string):boolean{
    let addressValuesArr: Array<Boolean>= [];

    //loop on Selected locations Array to check if selected is a sub string from Hotel Address
    this.locationsArrSelected.map((item)=>{
      hotelAddres.toLowerCase().includes(item.toLowerCase()) && (item == ' ' || item == null)  ? addressValuesArr.push(true) : addressValuesArr.push(false)
    })
    return addressValuesArr.includes(true) ? true : false ; //if (addressValuesArr) Array contains one True value then return True else return False 
  }
  /**
   * this function is responsible to destory any opened subscription on this service
   */
  destroyer(){
    // this.subscription.unsubscribe();
    this.subscription = new Subscription();
    this.hotelDataResponse = undefined!;
    this.hotelLocationsArr=[];
    this.filteredHotels = [];
    this.locationsArrSelected = [];
    this.ratesArrSelected = [];
    this.hotelResultsLoader=true;
    this.searchID='';
    this.maxPrice=100;
    this.minPrice=0;
    this.nightsNumber=0;
    this.filterForm = new FormGroup({
    hotelName: new FormControl(''),
    hotelRates: new FormArray([]),
    hotelPrice: new FormControl(),
    hotelLocations: new FormArray([])
  });
  }
}
