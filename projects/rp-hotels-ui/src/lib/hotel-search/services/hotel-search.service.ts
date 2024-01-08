import { Injectable, inject } from '@angular/core';
import { Subscription, skip, take } from 'rxjs';
import { EnvironmentService } from '../../shared/services/environment.service';
import { HttpClient } from '@angular/common/http';

import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { HotelsCitiesModule } from 'rp-travel-ui';
import { CountriescodeModule, HomePageApiService, SearchHoteltModule } from 'projects/rp-hotels-ui/src/public-api';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class HotelSearchService {
  public http = inject(HttpClient)
  public env = inject(EnvironmentService)
  public HomePageService = inject(HomePageApiService)
  allGuest: number = 0;
  roomN: number = 1;
  today!: Date;
  formday!: Date;
  citiesNames: string[] = [];
  subscription: Subscription = new Subscription()
  /**
     * 
     * inital form Search Hotel
     * 
     */
  HotelSearchFormGroup: FormGroup = new FormGroup({
    location: new FormControl("", [Validators.required, Validators.minLength(3), this.citynotfound.bind(this)]),
    nation: new FormControl(""),
    checkIn: new FormControl(this.formday, Validators.required),
    checkOut: new FormControl(this.today, Validators.required),
    roomN: new FormControl(1, [Validators.required, Validators.min(1)]),
    guestInfo: new FormArray([], [Validators.required, this.maxValueReached.bind(this)]),

  });

  constructor(private datePipe: DatePipe, private router: Router,) {

  }
  /**
     * 
     *geter value control location 
     * 
     */
  public get citySearchKey(): FormControl {
    return this.HotelSearchFormGroup?.get('location') as FormControl
  }
  /**
     * 
     *geter value control guestInfo 
     * 
     */
  public get GuestData(): FormArray {
    return this.HotelSearchFormGroup.get('guestInfo') as FormArray;
  }
  /**
      * 
      *inital HotelSearchFormGroup Form  
      * 
      */
  initSearchForm(form: any) {
    if (form) {
      this.HotelSearchFormGroup = new FormGroup({
        location: new FormControl("", [Validators.required, Validators.minLength(3), this.citynotfound.bind(this)]),
        nation: new FormControl(""),
        checkIn: new FormControl(this.formday, Validators.required),
        checkOut: new FormControl(this.today, Validators.required),
        roomN: new FormControl(1, [Validators.required, Validators.min(1)]),
        guestInfo: new FormArray([], [Validators.required, this.maxValueReached.bind(this)]),

      });
    }
    (<FormArray>this.HotelSearchFormGroup.get("guestInfo")).push(
      new FormGroup({
        adultN: new FormControl(2, [Validators.required, Validators.min(1), Validators.max(5)]),
        childN: new FormControl(0, [Validators.required, Validators.max(2)]),
        childGroup: new FormArray([])

      }));

    this.subscription.add(this.HotelSearchFormGroup.get("roomN")?.valueChanges.subscribe(
      (val) => {

        if (val != null) {
          this.roomN = val;

          console.log(val);

        }
        else {

          this.roomN = 1;
          console.log("else ", val)
        }


      }));

    this.subscription.add(this.HotelSearchFormGroup.get("checkIn")?.valueChanges.subscribe(
      (val) => {

      }
    ));

  }
  /**
     * 
     *get Cities based Key (country code ) 
     * 
     */
  getCities() {
    this.subscription.add(
      this.citySearchKey.valueChanges.pipe(skip(2)).subscribe(
        (v: string) => {
          if (v.length === 3) {
            this.HomePageService.getHotelsCities(v)
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
  *select City from Cities set value in control Location
  * 
  */
  citynotfound(input: FormControl): { [c: string]: boolean } {
    if (input.value['City']) {
      let city: string = input.value['City'].toLowerCase();
      if (this.citiesNames.indexOf(city) === -1) {
        return { 'notValidcity': true };
      }

    }
    else {
      if (this.citiesNames.indexOf((<string>input.value).toLowerCase()) === -1) {
        return { 'notValidcity': true };
      }
    }
    return { '': false }
  }

  /**
  * 
  * add Roome to Room Array
  * 
  */
  addRome() {
    let num = this.HotelSearchFormGroup.get('roomN')?.value;
    this.HotelSearchFormGroup.get('roomN')?.setValue(num + 1);
    this.HotelSearchFormGroup.get('roomN')?.updateValueAndValidity();
    (<FormArray>this.HotelSearchFormGroup.get("guestInfo")).push(
      new FormGroup({
        adultN: new FormControl(1, [Validators.required, Validators.min(1), Validators.max(5)]),
        childN: new FormControl(0, [Validators.required, Validators.max(2)]),
        childGroup: new FormArray([])

      }));
    (<FormArray>this.HotelSearchFormGroup.get("guestInfo")).updateValueAndValidity();
    this.roomN = this.roomN + 1;

  }
  /**
     * 
     * Remove Roome from Room Array
     * 
     */
  removeRome() {
    let num = this.HotelSearchFormGroup.get('roomN')?.value;
    this.HotelSearchFormGroup.get('roomN')?.setValue(num - 1);
    this.HotelSearchFormGroup.get('roomN')?.updateValueAndValidity();
    (<FormArray>this.HotelSearchFormGroup.get("guestInfo")).removeAt(num - 1);
    this.roomN = this.roomN - 1;

  }

  /**
       * 
       * validation on guest Number con't be more than  9
       * 
       */

  maxValueReached(search: FormArray): { [b: string]: boolean } {
    let adults = 0;
    let childs = 0;
    console.log("searchguest", search)
    for (let i = 0; i < search.length; i++) {
      adults += Number((<FormArray>this.HotelSearchFormGroup.get("guestInfo")).controls[i].get('adultN')?.value)
      childs += Number((<FormArray>this.HotelSearchFormGroup.get("guestInfo")).controls[i].get('childN')?.value)
    }
    this.allGuest = adults + childs;
    if (adults + childs > 9) {
      return { 'maxReched': true };
    }
    return { '': true };
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

  extractcites(hotelcities: HotelsCitiesModule[]) {

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
  getSearchresultLink(lang: string, currency: string, pointOfSale: string) {
    let location: HotelsCitiesModule = this.HotelSearchFormGroup.get("location")?.value;
    let locationId: string = location.City;
    let citywithcountry = location.CityWithCountry;
    let nation = this.HotelSearchFormGroup.get("nation")?.value;
    let checkIn = this.datePipe.transform(this.HotelSearchFormGroup.get("checkIn")?.value, 'MMMM dd, y');
    let checkOut = this.datePipe.transform(this.HotelSearchFormGroup.get("checkOut")?.value, 'MMMM dd, y');
    let roomNumber = this.HotelSearchFormGroup.get("roomN")?.value;
    let guestInfo = this.HotelSearchFormGroup.get("guestInfo")?.value;
    let stringGuest = this.formatGuestInfo(guestInfo);
    let searchApi: SearchHoteltModule = {
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
    let searchId = searchApi.serachId;
    this.router.navigate(['/hotelResult', lang, currency, pointOfSale, searchId, locationId, citywithcountry, nation, checkIn, checkOut, roomNumber, stringGuest]);

  }
  onSubmit(lang: string, currency: string, pointOfSale: string) {
    if (this.HotelSearchFormGroup.valid) {

      this.getSearchresultLink(lang, currency, pointOfSale)


    }
  }

  /**
   * this function is responsible to destory any opened subscription on this service
   */
  destroyer() {
    this.subscription.unsubscribe()
  }
}
