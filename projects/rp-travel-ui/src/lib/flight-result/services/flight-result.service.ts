import { Injectable, inject } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { Subscription, take } from 'rxjs';
import { FlightSearchResult, SearchFlightModule, airItineraries } from '../interfaces';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FlightResultApiService } from './flight-result-api.service';
import { searchFlightModel } from '../../flight-search/interfaces';
import { Options } from '@angular-slider/ngx-slider';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class FlightResultService {
  
  api = inject(FlightResultApiService)
    /**
   * response Data from Api  b type FlightSearchResult
   */
  response?: FlightSearchResult
  /**
   * response airItineraries Data from Api  b type airItineraries
   */
  FilterData?: airItineraries[]
/**
   * load error message when no data back from api
   */
  normalError: string = ''

  /**
   * flight Type 
   */
  FlightType: string = 'RoundTrip'
  normalErrorStatus: boolean = false
   /**
   * loading state ..
   */
  loading: boolean = false

  
  ResultFound: boolean = false
   /**
   *  Min value price 
   * 
   */
  priceMinValue: number = 0;
   /**
   *  Max value price 
   * 
   */
  priceMaxValue: number = 5000;
  FilterChanges$: Subscription = new Subscription();
  options?: Options;
  rate: number = 1;
  code: string = "KWD"
  airlinesA: string[] = [];
  airlinesForm: any = [];
  bookingSites: string[] = ['KhaleejGate', 'other'];
  bookingSitesForm: boolean[] = []
  departingMin: number = 0;
  departingMax: number = 7000
  optionsdeparting?: Options;

  arrivingMin: number = 0;
  arrivingMax: number = 7000
  optionsArriving?: Options;
  minValue: number = 0
  maxValue: number = 5000

  durationMin: number = 0;
  durationMax: number = 7000;
  optionsDurathion?: Options;
  router = inject(Router)
  route = inject(ActivatedRoute)
  filterForm = new FormGroup({
    airline: new FormGroup({
      airlines: new FormArray([]),
    }),
    bookingSite: new FormGroup({
      bookingSites: new FormArray([])
    }),

    stopsForm: new FormGroup({
      noStops: new FormControl(false),
      oneStop: new FormControl(false),
      twoAndm: new FormControl(false),
    }),
    sameAirline: new FormControl(false),

    priceSlider: new FormControl([0, 0]),
    durationSlider: new FormControl([0, 0]),
    dpartingSlider: new FormControl([0, 0]),
    arrivingSlider: new FormControl([0, 0]),

    returnSlider: new FormControl([30, 7000]),
    experience: new FormGroup({
      overNight: new FormControl(false),
      longStops: new FormControl(false)
    }),

    flexibleTickets: new FormGroup({
      refund: new FormControl(false),
      nonRefund: new FormControl(false)
    })
  });
  subscription: Subscription = new Subscription()
  // datePipe =inject(DatePipe)

  constructor() { }



  /**
 * get all data from the router to call api to get flightResultData
 * from Api  searchFlight
 **/
  getDataFromUrl(lang: string, currency: string, pointOfReservation: string, flightType: string, flightsInfo: string, serachId: string, passengers: string, Cclass: string, showDirect: boolean) {
    console.log("show url in services", lang, currency, pointOfReservation, flightType, flightsInfo, serachId, passengers, Cclass, showDirect)
    this.FlightType = flightType;

    let searchApi: SearchFlightModule = new SearchFlightModule(lang, currency, pointOfReservation, flightType, flightsInfo, passengers, Cclass, serachId, showDirect, 'all');
    if (SearchFlightModule) {
      let myapi = searchApi;
      console.log("myapi", myapi)

      this.subscription.add(this.api.searchFlight(myapi).subscribe(
        (result) => {
          if (result.status == 'Valid') {
            this.loading = false;
            this.ResultFound = true;
            this.response = result;
            // console.log("result" ,  this.response ,result)
            this.FilterData = result.airItineraries;
            this.FilterChanges$.unsubscribe();
          

            this.findDepartingnMinMax(this.response.airItineraries);
            this.filterForm.get("durationSlider")?.setValue(this.findDurationMinMax(this.response.airItineraries));
            this.filterForm.get("durationSlider")?.updateValueAndValidity();
         
            this.findDepartingnMinMax(this.response.airItineraries)
            this.findArrivingMinMax(this.response.airItineraries)
            this.minAnMax(this.response.airItineraries);
            this.filterForm.get('priceSlider')?.setValue(this.minAnMax(this.response.airItineraries));
            this.stopsvalues(),
              this.airlinesA = this.response.airlines;
            this.airlinesForm = []
            this.airlinesA.forEach(element => {
              (<FormArray>this.filterForm.get('airline')?.get('airlines')).push(new FormControl(false));
            });

            this.bookingSitesForm = []
            this.bookingSites.forEach(element => {
              (<FormArray>this.filterForm.get('bookingSite')?.get('bookingSites')).push(new FormControl(false));
            })








           


          }




          else {
            this.normalError = "No result found. <br> please search again"
            this.normalErrorStatus = true;
            this.loading = false;
            this.ResultFound = false;
          }


        }
      ));
    }

  }

  /**
    * 
    * @param type 
    
    * sort result base on type:number return data: airItineraries[] sorting by condition or type  
    * 
    */

  sortMyResult(type: number) {
    if (this.response != undefined) {
      console.log(type);
      if (type == 1) {
        this.FilterData = [...this.response.airItineraries].sort((a, b) => { return a.itinTotalFare.amount - b.itinTotalFare.amount })
        // console.log("sortData" ,this.FilterData)

      }
      if (type == 2) {
        this.FilterData = [...this.response.airItineraries].sort((a, b) => { return a.totalDuration - b.totalDuration })
      }
      if (type == 3) {
        this.FilterData = [...this.response.airItineraries].sort((a, b) => { return <any>new Date(a.deptDate) - <any>new Date(b.deptDate) })
      }
      if (type == 4) {
        this.FilterData = [...this.response.airItineraries].sort((a, b) => { return <any>new Date(b.deptDate) - <any>new Date(a.deptDate) })
      }
      if (type == 5) {
        this.FilterData = [...this.response.airItineraries].sort((a, b) => { return <any>new Date(a.allJourney.flights[1].flightDTO[0].departureDate) - <any>new Date(b.allJourney.flights[1].flightDTO[0].departureDate) })
      }

      if (type == 6) {
        this.FilterData = [...this.response.airItineraries].sort((a, b) => { return <any>new Date(b.allJourney.flights[1].flightDTO[0].departureDate) - <any>new Date(a.allJourney.flights[1].flightDTO[0].departureDate) })
      }

      if (type == 7) {
        this.FilterData = [...this.response.airItineraries].sort((a, b) => { return a.experiance - b.experiance })
      }
      // return [...this.response.airItineraries]


    }
  }

  /**
  * Filter Values airItineraries[] by Price And Update Filtiration Slider
  **/
  minAnMax(data: airItineraries[]) {

    let arr: airItineraries[] = [...data];
    let sortedRes = [
      ...arr.sort((a, b) => {
        return a.itinTotalFare.amount - b.itinTotalFare.amount;
      }),
    ];

    let minValue = sortedRes[0].itinTotalFare.amount;
    let maxValue1 = sortedRes[sortedRes.length - 1].itinTotalFare.amount;

    this.options = {
      floor: minValue,
      ceil: Math.round(maxValue1 + 10),
      translate: (value: number): string => {
        return Math.round(value).toString();
      },
    };
    console.log("MinAndMax", minValue, this.maxValue);
    this.priceMinValue = minValue;
    this.priceMaxValue = Math.round(maxValue1 + 10);
    this.maxValue = Math.round(maxValue1 + 10);
    return [minValue, this.maxValue]
  }

  /**
    * Find Min And Max Values and  Filter Values airItineraries[]  Of Flight Duration  And Update Filtiration Slider
    **/
  findDurationMinMax(array: any[]) {
    let sorted = [...array].sort((a, b) => b.totalDuration - a.totalDuration);
    // console.log(sorted);
    let min = sorted[sorted.length - 1]['totalDuration'];
    let max = sorted[0]['totalDuration'];
    console.log("Duration", max, min);
    this.durationMax = max + 100;
    this.durationMin = min;
    this.optionsDurathion = {
      floor: min,
      ceil: max + 100,
      noSwitching: true,
      translate: (value: number): string => {
        let h = value / 60 | 0;
        let m = value % 60 | 0;
        return h + "h" + ":" + m + "m";
      }
    }
    return [min, max + 100];
  }
  /**
   *  Find Min And Max Values Of Flight Departing Dates  And Update Filtiration Slider
   **/
  findDepartingnMinMax(array: airItineraries[]) {
    let min = this.convertToMin(array[0].allJourney.flights[0].flightDTO[0].departureDate);
    let max = this.convertToMin(array[0].allJourney.flights[0].flightDTO[0].departureDate);
    array.forEach(element => {
      let t = this.convertToMin(element.allJourney.flights[0].flightDTO[0].departureDate)
      if (t < min) {
        min = t;
      }
      if (t > max) {
        max = t;
      }
    });
    console.log("Depart", max, min);

    this.departingMin = min;
    this.departingMax = max;
    this.optionsdeparting = {
      floor: min,
      ceil: max,
      noSwitching: false,
      translate: (value: number): string => {
        let h = value / 60 | 0;
        let m = value % 60 | 0;
        return h + "h" + ":" + m + "m";
        // return this.datePipe.transform(value * 1000, 'HH:mm a')
      }
    };
    return [min, max];
  }

  /**
*  Find Min And Max Values Of Flight arriving Dates  And Update Filtiration Slider
**/

  findArrivingMinMax(array: airItineraries[]) {
    let min = this.convertToMin(array[0].allJourney.flights[0].flightDTO[array[0].allJourney.flights[0].flightDTO.length - 1].arrivalDate);
    let max = this.convertToMin(array[0].allJourney.flights[0].flightDTO[array[0].allJourney.flights[0].flightDTO.length - 1].arrivalDate);
    array.forEach(element => {
      let t = this.convertToMin(element.allJourney.flights[0].flightDTO[element.allJourney.flights[0].flightDTO.length - 1].arrivalDate)
      if (t < min) {
        min = t;
      }
      if (t > max) {
        max = t;
      }
    });


    this.arrivingMin = min;
    this.arrivingMax = max;
    this.optionsArriving = {
      floor: min,
      ceil: max,
      noSwitching: true,
      translate: (value: number): string => {
        let h = value / 60 | 0;
        let m = value % 60 | 0;
        return h + "h" + ":" + m + "m";
      }
    };
    return [min, max];
  }

  /**
 *  take date string return number
 **/
  convertToMin(time: string): number {
    let date = time;
    let T = date.indexOf('T');
    let h = date.slice(T + 1);
    let hr = +h.slice(0, 2) * 60;
    let m = +h.slice(3, 5);
    let tm = hr + m;
    return tm
  }

  /**
*  filter by stops value
**/

  stopsvalues() {
    let out: number[] = [];
    if (this.filterForm.get('stopsForm')?.get('noStops')?.value) {
      out.push(0)
    }
    if (this.filterForm.get('stopsForm')?.get('oneStop')?.value) {
      out.push(1)
    }
    if (this.filterForm.get('stopsForm')?.get('twoAndm')?.value) {
      out.push(2);
      out.push(3);
      out.push(4);
    }

    if (!this.filterForm.get('stopsForm')?.get('noStops')?.value && !this.filterForm.get('stopsForm')?.get('oneStop')?.value && !this.filterForm.get('stopsForm')?.get('twoAndm')?.value) {
      out = [0, 1, 2, 3, 4];
    }
    console.log("stopsvalues", out, this.filterForm.get('stopsForm')?.get('noStops')?.value)

    return out
  }

  //filter by airline
  filteringbyairline(val:any[]){
    let airL:any[]=[];
      for (let index = 0; index < val.length; index++) {
        const element = val[index];
        if(element){
          airL.push(this.airlinesA[index]);
        }
        
      };
      if(airL.length == 0){
      let out = airL;
      return  out
      }
      else{
         return airL;
      }
  }
 //filter by booking sites
  filteringbyBookingSites(val:any[]){
    let selectedSites:any[]=[];
      for (let index = 0; index < val.length; index++) {
        const element = val[index];
        if(element){
          selectedSites.push(this.bookingSites[index]);
        }
        
      };
      if(selectedSites.length == 0){
      let out = selectedSites;
      return  out
      }
      else{
         return selectedSites;
      }
  }
  
  /**
   * this function is responsible to destory any opened subscription on this service
   */
  destroyer() {
    this.subscription.unsubscribe()
  }
}
