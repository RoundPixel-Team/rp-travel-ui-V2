import { Injectable, inject } from '@angular/core';
import { Subscription, skip, take } from 'rxjs';
import { EnvironmentService } from '../../shared/services/environment.service';
import { HttpClient } from '@angular/common/http';

import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

import { CountriescodeModule, HomePageApiService, SearchHoteltModule, hotelSearchForm } from 'projects/rp-hotels-ui/src/public-api';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { AlertMsgModels } from '../interfaces';
import { hotelCities } from 'dist/rp-hotels-ui/lib/home-page/interfaces';

@Injectable({
  providedIn: 'root'
})
export class HotelSearchService {
  public http = inject(HttpClient)
  public env = inject(EnvironmentService)
  public HomePageService = inject(HomePageApiService)
  searchApi: SearchHoteltModule | undefined
  allGuest: number = 0;
  roomNumber: number = 1;
  adultNum: number = 1
  childNum: number = 0
  today!: Date;
  formday!: Date;
  stringGuest:string=''
  citiesNames: string[] = [];
  selectAllcities: any
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
    checkIn: new FormControl(this.formday, Validators.required),
    checkOut: new FormControl(this.today, Validators.required),
    roomN: new FormControl(1, [Validators.required, Validators.min(1)]),

    guestInfo: new FormArray([],[Validators.required]),
  });

  constructor(private router: Router ) {

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
   *inital HotelSearchForm Form  
   * 
   */
  initSearchForm(form: hotelSearchForm) {
    // set data in storage in form
    if (form) {
      this.SetDataFromStorage(form)
    }
    // if no value in storage
    else {
      this.HotelSearchForm = new FormGroup({
        location: new FormControl("", [Validators.required, Validators.minLength(3)]),
        nation: new FormControl(""),
        checkIn: new FormControl(this.formday, Validators.required),
        checkOut: new FormControl(this.today, Validators.required),
        roomN: new FormControl(1, [Validators.required, Validators.min(1)]),
        guestInfo: new FormArray([],  [Validators.required]),

      });

      (<FormArray>this.HotelSearchForm.get("guestInfo")).push(
        new FormGroup({
          adultN: new FormControl(2, [Validators.required, Validators.min(1), Validators.max(5)]),
          childN: new FormControl(0, [Validators.required, Validators.max(2)]),
          childGroup: new FormArray([])

        }));
    }
   
    
  }
  /**
  * 
  * this function set data from starge in form 
  * 
  */
  SetDataFromStorage(FormStorage: hotelSearchForm) {
    this.HotelSearchForm = new FormGroup({
      location: new FormControl(FormStorage['location'], [Validators.required, Validators.minLength(3)]),
      nation: new FormControl(FormStorage['nation']),
      checkIn: new FormControl(FormStorage['checkIn'], Validators.required),
      checkOut: new FormControl(FormStorage['checkOut'], Validators.required),
      roomN: new FormControl(FormStorage['roomN'], [Validators.required, Validators.min(1)]),
      guestInfo: new FormArray([],  [Validators.required]),

    });

    (<FormArray>this.HotelSearchForm.get("guestInfo")).push(
      new FormGroup({
        adultN: new FormControl(2, [Validators.required, Validators.min(1), Validators.max(5)]),
        childN: new FormControl(0, [Validators.required, Validators.max(2)]),
        childGroup: new FormArray([])

      }));
  }
  /**
   * 
   *get Cities based Key (country code ) 
   * 
   */
  getCitiesById() {
    this.subscription.add(
      this.citySearchKey.valueChanges.pipe(skip(2)).subscribe(
        (v: string) => {
          if (v.length === 3) {
            this.selectAllcities = this.HomePageService.getHotelsCities(v)
          }
        }
      )
    )
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
  * 
  * add Roome to Room Array
  * 
  */
  addRoom() {
   
    let numRoom = this.HotelSearchForm.get('roomN')?.value;
    if (numRoom > 5) {
      this.RoomMessageError.enMsg = "Maximun Rooms Shouldn't be more than 5"
      this.RoomMessageError.arMsg = "لا يجب حجز اكثر من 5 غرف"
    }
    else {
      this.HotelSearchForm.get('roomN')?.setValue(numRoom + 1);
      this.HotelSearchForm.get('roomN')?.updateValueAndValidity();
      (<FormArray>this.HotelSearchForm.get("guestInfo")).push(
        new FormGroup({
          adultN: new FormControl(1, [Validators.required, Validators.min(1), Validators.max(5)]),
          childN: new FormControl(0, [Validators.required, Validators.max(2)]),
          childGroup: new FormArray([])

        }));
      (<FormArray>this.HotelSearchForm.get("guestInfo")).updateValueAndValidity();
      this.roomNumber = this.roomNumber + 1;
    }

  }

  /**
     * 
     * Remove Roome from Room Array
     * 
     */
  removeRoom() {
    let numRoom = this.HotelSearchForm.get('roomN')?.value;
    if (numRoom > 1) {
      this.HotelSearchForm.get('roomN')?.setValue(numRoom - 1);
      this.HotelSearchForm.get('roomN')?.updateValueAndValidity();
      (<FormArray>this.HotelSearchForm.get("guestInfo")).removeAt(numRoom - 1);
      this.roomNumber = this.roomNumber - 1;
    }

  }
  /**
   * 
   * validation on guest Number con't be more than  9
   * 
   */

  guestNumberValidation(search: FormArray) {
    // let numberGuest = this.adultNum + this.childNum

    let adults = 0;
    let childs = 0;
    for (let i = 0; i < search.length; i++) {
      adults +=Number(this.GuestData.controls[i].get('adultN')?.value)
      childs +=Number(this.GuestData.controls[i].get('childN')?.value)
 
    }
    this.allGuest = adults + childs;
    if (adults + childs > 9) {
      this.guestMessageError.enMsg = "Maximun Number guest Shouldn't be more than 9"
      this.guestMessageError.arMsg = "لا يجب يزيد عدد الحجزين عن 9 افراد"
    }
  }
  /**
      * 
      * validation on checkIn & checkout Date
      * 
      */
  ValidationDate() {
    this.subscription.add(
      this.HotelSearchForm.get('checkOut')?.valueChanges.subscribe(
        (val) => {
          if (val < this.HotelSearchForm.get('checkIn')?.value) {
            this.DateMessageError.enMsg = "Please Enter checkoutDate after CheckInDate"
            this.DateMessageError.arMsg = "يجب ان يكون وقت الوصول اكبر من وقت الذهاب"
          }
        }

      ))
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
  formatGuestInfo(guestInfo: FormArray) {
    let guesttxt = '';

    for (let i = 0; i < guestInfo.length; i++) {
      guesttxt += "R" + i + "A" + guestInfo.at(i).get('adultN') + "C" + guestInfo.at(i).get('childN')
      let guestValue = guestInfo.at(i).get('childGroup')?.value
      for (let j = 0; j < guestValue.length; j++) {

        guesttxt += "G" + 7;

      }
    }
    return guesttxt;
  }
  /**
   * this function is responsible to return link to use it to navigate to search results with all data of search box
   */

  onSubmit(lang: string, currency: string, pointOfSale: string) {
    if(this.HotelSearchForm.get("nation")?.value === ''){
      this.HotelSearchForm.get("nation")?.setValue('Kuwait')
    }
    if (this.HotelSearchForm.valid) {

      let location: hotelCities = this.HotelSearchForm.get("location")?.value;
      let locationId: string = location.City;
      let citywithcountry = location.CityWithCountry;
      let nation = this.HotelSearchForm.get("nation")?.value;
      let checkIn = this.HotelSearchForm.get("checkIn")?.value;
      let checkOut = this.HotelSearchForm.get("checkOut")?.value;
      let roomNumber = this.HotelSearchForm.get("roomN")?.value;
      let guestInfo = this.HotelSearchForm.get("guestInfo")?.value;
      this.stringGuest = this.formatGuestInfo(guestInfo);
      this.searchApi= {
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
  }
}
