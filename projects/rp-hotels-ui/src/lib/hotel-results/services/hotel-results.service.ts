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
  hotelResultsLoader:boolean=false;
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
    hotelPriceMax: new FormControl(),
    hotelPriceMin: new FormControl(),
    hotelLocations: new FormArray([])
  });

  constructor() { 

  }

  ngOnInit(){}

 resetHotelForm(){
  this.filterForm = new FormGroup({
    hotelName: new FormControl(''),
    hotelRates: new FormArray([]),
    hotelPriceMax: new FormControl(),
    hotelPriceMin: new FormControl(),
    hotelLocations: new FormArray([])
  });
 }

 detectDataChanging(){
  this.filteredHotels = [...this.filteredHotels];
 }
  /**
   * this function is responsible to call API to get the Hotel Data
   * you should call it first in the search Results componet
   */
  getHotelDataFromUrl(hotelSearchObj: GetHotelModule, dateFrom:string, dateTo:string){
    this.hotelResultsLoader = true;
    //call het hotel data API
    this.subscription.add(
      this.api.getHotelsRes(hotelSearchObj).subscribe((res:hotelResults)=>{
        if(res && res.HotelResult.length > 0){
          this.hotelLocationsArr = []
          this.locationsArrSelected = []
          this.resetHotelForm();

          this.hotelDataResponse = res;
          this.filteredHotels = res.HotelResult;
          this.hotelLocationsArr= [...res.Locations]
          this.locationsArrSelected= [...res.Locations]
          this.hotelLocationsArr.shift(); //will be removed After editing the backend Data
          this.locationsArrSelected.shift(); //will be removed After editing the backend Data
          //GET START AND END DATE TO CALCULATE ROOM NIGHTS NUMBER 
          let startDate:Date  =new Date(dateFrom.replace(new RegExp('%20','g'),' '));
          let endDate: Date  = new Date(dateTo.replace(new RegExp('%20','g'),' '));

          this.nightsNumber = this.calculateHotelNights(startDate,endDate);

          //initialize hotel locations form array value with true values (selected)
          this.hotelLocationsArr.map(()=>{
            this.addLocations()
          })

          //initialize hotel rate array with rates
          for(let i=0; i<5; i++){
            this.addRating();
            this.ratesArrSelected.push(i+1)
          }
          
          this.sorting(1);

          //set price slider configurations
          this.maxPrice = [...this.filteredHotels][0].costPrice;
          this.maxPriceValueForSlider = [...this.filteredHotels][0].costPrice + 100;
          this.minPrice = [...this.filteredHotels][this.filteredHotels.length -1].costPrice;
          this.minPriceValueForSlider = [...this.filteredHotels][this.filteredHotels.length -1].costPrice;


          
          this.setFormPriceValue(); //set filter form values for price
          this.hotelsFilter();
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
  generateSearchRooms(guestInfo: string) {
    let SearchRooms: guests[] = [];
    let roomsInfo = guestInfo.split("R");

    for (let i = 1; i < roomsInfo.length; i++) { 
        let roomData = roomsInfo[i];
        
        let adult = Number(roomData.slice(2, 3));
        let child = Number(roomData.slice(4, 5));

        let childrenAges: number[] = [];
        if (child > 0) {
            for (let j = 0; j < child; j++) {
                childrenAges.push(Number(roomData.slice(6 + j * 2, 7 + j * 2))); 
            }
        }

        SearchRooms.push({ adult, child:childrenAges});
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
      default:
        {
          this.filteredHotels = this.filteredHotels.sort((low, high) => high.TotalSellPrice - low.TotalSellPrice);
          break;
        } 
    }
    return this.filteredHotels;
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
    return (hotel.hotelName.toLowerCase()).includes((this.filterForm.get('hotelName')?.value).toLowerCase()) && ((hotel.costPrice >= this.filterForm.get('hotelPriceMin')?.value) && (hotel.costPrice <= this.filterForm.get('hotelPriceMax')?.value)) 
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
   * this function is responsible to set max and min Price for initial price Form
   */
  setFormPriceValue(){
    this.filterForm.get('hotelPriceMax')?.setValue(this.maxPriceValueForSlider);
    this.filterForm.get('hotelPriceMin')?.setValue(this.minPriceValueForSlider);
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
      hotelAddres.toLowerCase().includes(item.toLowerCase()) ? addressValuesArr.push(true) : addressValuesArr.push(false)
    })
    return addressValuesArr.includes(true) ? true : false ; //if (addressValuesArr) Array contains one True value then return True else return False 
  }
  /**
   * this function is responsible to destory any opened subscription on this service
   */
  destroyer(){
    this.subscription = new Subscription();
    this.hotelDataResponse = undefined!;
    this.hotelLocationsArr=[];
    this.filteredHotels = [];
    this.locationsArrSelected = [];
    this.ratesArrSelected = [];
    this.hotelResultsLoader=false;
    this.searchID='';
    this.maxPrice=100;
    this.minPrice=0;
    this.nightsNumber=0;
    this.minPriceValueForSlider = 0
    this.maxPriceValueForSlider = 100

    this.resetHotelForm();
  }
}
