import { Injectable, inject } from '@angular/core';
import { Subscription, skip, take } from 'rxjs';
import { EnvironmentService } from '../../shared/services/environment.service';
import { HttpClient } from '@angular/common/http';

import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

import { CountriescodeModule, SearchHoteltModule, guests, hotelSearchForm, roomChildAge } from '../interfaces';
import { Router } from '@angular/router';
import { AlertMsgModels } from '../interfaces';
import { hotelCities, } from '../../home-page/interfaces'
import { HomePageApiService } from '../../home-page/services/home-page-api.service';

@Injectable({
  providedIn: 'root'
})
export class HotelSearchService {
  public http = inject(HttpClient)
  public env = inject(EnvironmentService)
  public HomePageService = inject(HomePageApiService)
  searchApi: SearchHoteltModule | undefined
  allGuest: number = 2;
  roomNumber: number = 1;
  adultNum: number = 1
  childNum: number = 0
  fromDate: Date=new Date();
  toDate: Date= new Date(); 
  
  stringGuest: string = ''
  citiesNames: string[] = [];
  valuesBeforeA: string[] = [];
  valuesBeforeRAndAfterC: string[] = [];
  roomChildAgeArray:roomChildAge[]=[];

  LocalStorage!: hotelSearchForm;
  DateMessageError: AlertMsgModels = {
    arMsg: '',
    enMsg: '',
  };
  RoomMessageError: AlertMsgModels = {
    arMsg: '',
    enMsg: '',
  };
  guestMessageError: AlertMsgModels = {
    arMsg: '',
    enMsg: '',
  };

  subscription: Subscription = new Subscription()
  /**
     * 
     * inital form Search Hotel
     * 
     */
  HotelSearchForm: FormGroup = new FormGroup({
    location: new FormControl("", [Validators.required, Validators.minLength(3)]),
    nation: new FormControl(""),
    checkIn: new FormControl(this.fromDate, Validators.required),
    checkOut: new FormControl(this.toDate, Validators.required),
    roomN: new FormControl(1, [Validators.required, Validators.min(1)]),
    guestInfo: new FormArray([]),
  });

  constructor(private router: Router) {

  }
  /**
   * 
   *geter value control location 
   * 
   */
  public get citySearchKey(): FormControl {
    return this.HotelSearchForm?.get('location') as FormControl
  }
  /**
   * 
   *geter value control guestInfo 
   * 
   */
  public get GuestData(): FormArray {
    return this.HotelSearchForm.get('guestInfo') as FormArray;
  }
  /**
   * 
   *govert String guest num get from url 
   * 
   */
  convertguestString(guest: string) {
    const parts: string[] = guest.split('A');
    // Split the string at each 'R'
    const partsBeforeR: string[] = guest.split('R');
    for (let i = 1; i < parts.length; i++) {
      const valueBeforeA: string = parts[i - 1].split('C')[0];
      this.valuesBeforeA.push(valueBeforeA);
    }
    for (let i = 0; i < partsBeforeR.length - 1; i++) {
      // Split the part at each 'C'
      const partsAfterC: string[] = partsBeforeR[i + 1].split('C');

      // Get the value after 'C' and push it to the array
      this.valuesBeforeRAndAfterC.push(partsAfterC[1]);
    }
  }
   /**
   * 
   *get Data Fron route to set value in from as inital value
   * 
   */
  getDataFromUrl(Location: hotelCities, checkIn: Date, checkOut: Date, roomN: number | string, guestInfo:guests[]) {
    let form: any = {
      location: Location,
      nation: "Kuwait",
      checkIn: checkIn,
      checkOut: checkOut,
      roomN: roomN,
      guestInfo: guestInfo
    }
    this.SetDataFromStorage(form)

  }
  /**
   * 
   *inital HotelSearchForm Form  
   * 
   */
  initSearchForm(form: hotelSearchForm) {
    // set data in storage in for
    if (form) {
      this.SetDataFromStorage(form)
    }
    // if no value in storage
    else {
      this.allGuest=2
      this.roomNumber=1
      this.HotelSearchForm = new FormGroup({
        location: new FormControl("", [Validators.required, Validators.minLength(3)]),
        nation: new FormControl(""),
        checkIn: new FormControl(this.fromDate, Validators.required),
        checkOut: new FormControl(this.toDate, Validators.required),
        roomN: new FormControl(1, [Validators.required, Validators.min(1)]),
        guestInfo: new FormArray([]),
      });

      (<FormArray>this.HotelSearchForm.get("guestInfo")).push(
        new FormGroup({
          adult: new FormControl(2, [Validators.required, Validators.min(1), Validators.max(5)]),
          child: new FormControl(0, [Validators.required, Validators.max(2)]),
          childGroup:new FormControl([])
        }));
        this.addChildAge(0);
    }
    this.guestNumberValidation()
    
    this.subscription.add(this.HotelSearchForm.get("roomN")?.valueChanges.subscribe(
      (val) => {
        if (val != null) {
          this.roomNumber = val;
        }
        else {
          this.roomNumber = 1;
        }
      }));

  }
  /**
  * 
  * this function set data from starge in form 
  * 
  */
  SetDataFromStorage(FormStorage: hotelSearchForm) {
    this.HotelSearchForm = new FormGroup({
      location: new FormControl(FormStorage.location, [Validators.required, Validators.minLength(3)]),
      nation: new FormControl(FormStorage.nation),
      checkIn: new FormControl(FormStorage.checkIn, Validators.required),
      checkOut: new FormControl(FormStorage.checkOut, Validators.required),
      roomN: new FormControl(FormStorage.roomN, [Validators.required, Validators.min(1)]),
      guestInfo: new FormArray([]),
    });

    
    console.log("FormStorage.guestInfo", FormStorage.guestInfo)
    for(let i=0; i< FormStorage.guestInfo.length; i++){
      (<FormArray>this.HotelSearchForm.get("guestInfo")).push(
        new FormGroup({
          adult: new FormControl(FormStorage.guestInfo[i].adult, [Validators.required, Validators.min(1), Validators.max(5)]),
          child: new FormControl(FormStorage.guestInfo[i].child.length, [Validators.required, Validators.max(2)]),
          childGroup: new FormControl([])
        }));
        let childAgeArray:number[]=[]
        for(let J=0;J< Number(FormStorage.guestInfo[i].child.length);J++){
          childAgeArray.push(Number(FormStorage.guestInfo[i].child[J]));
        }

        this.roomChildAgeArray.push({
          roomNo:i,
          childs:childAgeArray
        });
        (<FormArray>this.HotelSearchForm.get("guestInfo")).at(i).get('childGroup')?.setValue(this.roomChildAgeArray[this.roomChildAgeArray.length-1].childs)
      }

  }
  addChildAge(roomNo:number){
    this.roomChildAgeArray.push({
      roomNo: roomNo,
      childs:[]
    })
  }
  removeChildAge(roomNo:number){
    this.roomChildAgeArray=[...this.roomChildAgeArray.filter(child => {return child.roomNo!==roomNo})]
  }

  /**
  * 
  *get Nationality based on lang 
  * 
  */
  getNationality(lang: string) {
    this.subscription.add(
      this.HomePageService.getCountries(lang).subscribe((nati) => {
        this.extractNationality(nati)
      })
    )
  }
  /**
   * 
   *extract nationality based on country 
   * 
   */

  extractNationality(countries: CountriescodeModule[]) {
    if (countries) {
      return countries.map(v => v.countryName.toLowerCase())
    }
    return

  }
/**
 * this function is responsible to reset all Rooms & Guests Number
 */
  clearAllRooms(){
   this.initSearchForm(undefined!)
  
  }

  /**
  * 
  * add Roome to Room Array
  * 
  */
  addRoom() {
    let numRoom = this.HotelSearchForm.get('roomN')?.value;

    if(numRoom > 5) {
      this.RoomMessageError.enMsg = "Maximun Rooms Shouldn't be more than 5"
      this.RoomMessageError.arMsg = "لا يجب حجز اكثر من 5 غرف"
    }
    else {
      this.HotelSearchForm.get('roomN')?.setValue(Number(numRoom)+1);
      this.HotelSearchForm.get('roomN')?.updateValueAndValidity();
      (<FormArray>this.HotelSearchForm.get("guestInfo")).push(
        new FormGroup({
          adult: new FormControl(1, [Validators.required, Validators.min(1), Validators.max(5)]),
          child: new FormControl(0, [Validators.required, Validators.max(2)]),
          childGroup:new FormControl([])
        }));
      (<FormArray>this.HotelSearchForm.get("guestInfo")).updateValueAndValidity();

      this.guestNumberValidation();
      this.addChildAge(Number(numRoom));
    }
  }

  /**
     * 
     * Remove Roome from Room Array
     * 
     */
  removeRoom() {
    let numRoom = this.HotelSearchForm.get("roomN")?.value;
    if (numRoom > 1) {
      this.HotelSearchForm.get('roomN')?.setValue(Number(numRoom)-1);
      this.HotelSearchForm.get('roomN')?.updateValueAndValidity();
      (<FormArray>this.HotelSearchForm.get("guestInfo")).removeAt(Number(numRoom)-1);
      this.guestNumberValidation();
      this.removeChildAge(Number(numRoom));
    }

  }
  /**
   * 
   * validation on guest Number con't be more than  9
   * 
   */
  guestNumberValidation() {
    let search = this.HotelSearchForm.get("guestInfo")?.value
    let adults = 0;
    let childs = 0;
    for (let i = 0; i < search.length; i++) {
      adults += Number(this.GuestData.at(i).get('adult')?.value)
      childs += Number(this.GuestData.at(i).get('child')?.value)
    }
    this.allGuest = adults + childs;

    if (adults + childs > 9) {
      this.guestMessageError.enMsg = "Maximun Number guest Shouldn't be more than 9"
      this.guestMessageError.arMsg = "لا يجب أن يزيد عدد الحاجزين عن 9 افراد"
    }
    return this.allGuest
  }


  /**
  * 
  * validation on checkIn & checkout Date
  * 
  */
  ValidationDate() {
    this.subscription.add(
      this.HotelSearchForm.get('checkIn')?.valueChanges.subscribe(
        (val) => {
          if (val > this.HotelSearchForm.get('checkOut')?.value) {
            this.DateMessageError.enMsg = "Checkout Date Should be After CheckIn Date"
            this.DateMessageError.arMsg = "وقت الوصول يجب أن يكون بعد وقت الذهاب" 
          }
        }
        
      ))
    return this.DateMessageError;
  }
  /**
     * 
     * search id value 
     * 
     */
  id() {
    let date = new Date();
    let myId = date.getFullYear() + 'B' + date.getUTCMonth() + 'I' + date.getUTCDay() + 'S' + date.getMilliseconds() + 'H' + Math.floor(Math.random() * (9 - 0 + 1)) + 0 + 'B' + Math.floor(Math.random() * (9 - 0 + 1)) + 0 + 'I'
      + Math.floor(Math.random() * (9 - 0 + 1)) + 0
      + 'S' + Math.floor(Math.random() * (9 - 0 + 1)) + 0 + 'H' + Math.floor(Math.random() * (9 - 0 + 1)) + 0 + 'I' + Math.floor(Math.random() * (9 - 0 + 1)) + 0;
    return myId;
  }

  /**
   * 
   * push cities Data To citiesNames to show data   
   * 
   */

  extractcites(hotelcities: hotelCities[]) {
    hotelcities.forEach((city) => {
      let cityt = city.City.toLowerCase();
      this.citiesNames.push(cityt);
    });
  }
  /**
  * 
  * format guestInfo To used in Routing 
  * 
  */
  formatGuestInfo(guestInfo: any) {
    this.GuestData.setValue(guestInfo)
    let guesttxt = '';

    for (let i = 0; i < guestInfo.length; i++) {
      guesttxt += "R" + i + "A" + guestInfo[i]['adult'] + "C" + guestInfo[i]['child']
      for (let j = 0; j < guestInfo[i]["childGroup"].length; j++) {
        guesttxt += "G" + guestInfo[i].childGroup[j];
      }
    }
    return guesttxt;
  }
 
  /**
   * this function is responsible to return link to use it to navigate to search results with all data of search box
   */

  onSubmit(lang: string, currency: string, pointOfSale: string) {
    if (this.HotelSearchForm.get("nation")?.value === '') {
      this.HotelSearchForm.get("nation")?.setValue('Kuwait')
    }
    if (this.HotelSearchForm.valid) {
      console.log('on submit form', this.HotelSearchForm.value)
      let location: hotelCities = this.HotelSearchForm.get("location")?.value;
      let locationId: string = location.CityId;
      let citywithcountry = location.CityWithCountry;
      let nation = this.HotelSearchForm.get("nation")?.value;
      let checkIn = this.HotelSearchForm.get("checkIn")?.value;
      let checkOut = this.HotelSearchForm.get("checkOut")?.value;
      let roomNumber = this.HotelSearchForm.get("roomN")?.value;
      let guestInfo = this.GuestData.value;
      this.stringGuest = this.formatGuestInfo(guestInfo);
      this.searchApi = {
        lan: lang,
        Currency: currency,
        POS: pointOfSale,
        serachId: this.id(),
        citywithcountry: citywithcountry,
        nation: nation,
        checkIn: checkIn,
        checkOut: checkOut,
        roomN: roomNumber,
        guestInfo: guestInfo,
        CityName: locationId
      }

    }
  }

  /**
   * this function is responsible to destory any opened subscription on this service
   */
  destroyer() {
    this.subscription.unsubscribe()
    this.DateMessageError.enMsg = '';
    this.DateMessageError.arMsg = '';
  }
}
