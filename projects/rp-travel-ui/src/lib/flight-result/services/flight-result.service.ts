import { Injectable, inject } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { Subscription, retry, take } from 'rxjs';
import { FlightSearchResult, SearchFlightModule, airItineraries, filterFlightInterface, flight, flightResultFilter } from '../interfaces';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FlightResultApiService } from './flight-result-api.service';
import { searchFlightModel } from '../../flight-search/interfaces';
// import { Options } from '@angular-slider/ngx-slider';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class FlightResultService {

  api = inject(FlightResultApiService)
  router = inject(Router)
  route = inject(ActivatedRoute)
  filter?: flightResultFilter;
  /**
 * response Data from Api  b type FlightSearchResult
 */
  response?: FlightSearchResult
  /**
   * response airItineraries Data from Api  b type airItineraries
   */
  FilterData: airItineraries[] = []
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
  loading: boolean = true
  roundT: boolean = false;
  airLR: any = []

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
  /**
 *  optins init and return data as string 
 * 
 */
  // options: Options = {
  //   floor: 0,
  //   ceil: 5000,
  //   translate: (value: number): string => {
  //     return Math.round(value).toString();
  //   },
  // };
  /**
 * inital rate currecy code kwd
 * 
 */
  rate: number = 1;
  code: string = "KWD"
  /**
 *  array of  type string return feh kol airline back from airItineraries
 * 
 */
  airlinesA: string[] = [];
  airlinesForm: any = [];
  bookingSites: string[] = ['KhaleejGate', 'other'];
  /**
 *  array of  type boolean
 * 
 */
  bookingSitesForm: boolean[] = []
  /**
 *  inital slider for filter return feh date min and max 
 * 
 */
  // departingMin: number = 0;
  // departingMax: number = 7000
  // optionsdeparting: Options = this.options;

  // arrivingMin: number = 0;
  // arrivingMax: number = 7000
  // optionsArriving: Options = this.options;
  // minValue: number = 0
  // maxValue: number = 5000

  // durationMin: number = 0;
  // durationMax: number = 7000;
  // optionsDurathion: Options = this.options

  /**
  *  inital from filter
  * 
  */
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

  moreT: boolean[] = [];
  /**
*  array return data type airItineraries[] after organize
* 
*/
  orgnizedResponce: airItineraries[] = [];
  constructor() { }



  /**
 * get all data from the router to call api to get flightResultData
 * from Api  searchFlight
 **/
  getDataFromUrl(lang: string, currency: string, pointOfReservation: string, flightType: string, flightsInfo: string, serachId: string, passengers: string, Cclass: string, showDirect: boolean) {
    console.log("show url in services", lang, currency, pointOfReservation, flightType, flightsInfo, serachId, passengers, Cclass, showDirect)
    this.FlightType = flightType;
    if (this.FlightType == 'RoundTrip') {
      this.roundT = true
    }
    let searchApi: SearchFlightModule = new SearchFlightModule(lang, currency, pointOfReservation, flightType, flightsInfo, passengers, Cclass, serachId, showDirect, 'all');
    if (SearchFlightModule) {
      let myapi = searchApi;

      this.subscription.add(this.api.searchFlight(myapi).subscribe(
        (result) => {
          if (result.status == 'Valid') {
            this.loading = false;
            this.ResultFound = true;
            this.response = result;
            this.FilterData = result.airItineraries;
            this.orgnizedResponce = this.orgnize(this.FilterData);

            this.FilterChanges$.unsubscribe();
            this.filterForm = new FormGroup({
              airline: new FormGroup({
                airlines: new FormArray([])
              }),

              bookingSite: new FormGroup({
                bookingSites: new FormArray([])
              }),

              stopsForm: new FormGroup({
                noStops: new FormControl(false),
                oneStop: new FormControl(false),
                twoAndm: new FormControl(false)
              }),
              sameAirline: new FormControl(false),
              priceSlider: new FormControl([0, 0]),
              durationSlider: new FormControl([0, 7000]),
              dpartingSlider: new FormControl([0, 20000]),
              arrivingSlider: new FormControl([0, 20000]),
              returnSlider: new FormControl([0, 7000]),

              experience: new FormGroup({
                overNight: new FormControl(false),
                longStops: new FormControl(false)
              }),

              flexibleTickets: new FormGroup({
                refund: new FormControl(false),
                nonRefund: new FormControl(false)
              })
            });

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
            this.updateFilter()










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
 * update filter input
 * 
 **/
  updateFilter() {
    this.subscription.add(
      this.filterForm.valueChanges.subscribe((val) => {

        if (this.filterForm.touched) {
          // console.log("")

          let filter: flightResultFilter = new flightResultFilter(
            this.filterForm.get("sameAirline")?.value!,
            this.filterForm.get("priceSlider")?.value![0],
            this.filterForm?.get("priceSlider")?.value![1],
            this.filterForm.get("durationSlider")?.value![0],
            this.filterForm.get("durationSlider")?.value![1],
            this.filterForm.get("dpartingSlider")?.value![0],
            this.filterForm.get("dpartingSlider")?.value![1],
            this.filterForm.get("arrivingSlider")?.value![0],
            this.filterForm.get("arrivingSlider")?.value![1],
            this.filterForm.get("returnSlider")?.value![0],
            this.filterForm.get("returnSlider")?.value![1],
            this.stopsvalues(),
            [this.filterForm.get('experience')?.get('overNight')?.value!],
            [this.filterForm.get('flexibleTickets')?.get('refund')?.value!, this.filterForm.get('flexibleTickets')?.get('nonRefund')?.value!],

            this.filteringbyairline(this.filterForm.get('airline')?.get('airlines')?.value!),


            this.filteringbyBookingSites(this.filterForm.get('bookingSite')?.get('bookingSites')?.value!)


          );



          this.oneForAll(filter, this.FilterData, this.roundT);

        }
        else {
          console.log("FILTER CHANGED", val)
        }
      })
    );
  }

  // filter func


  // new filteration method
  oneForAll(filter: filterFlightInterface, fligtsArray: airItineraries[], round: boolean) {

    this.orgnizedResponce = this.orgnize(fligtsArray.filter(v =>

      this.filterFlighWithPrice(v, filter) &&
      this.filterFlighWithDepartionTime(v, filter) &&
      this.filterFlighWithArrivalTime(v, filter) &&
      this.FlexTicketcheck(v, filter) &&
      this.filterFlightWithNumberofStopsFunction(v, filter) &&
      this.filterFlighWithDuration(v, filter) &&
      this.filterWithExperience(v, filter) &&
      this.filterFlighWithReturnTime(v, filter, this.roundT) &&
      this.completeTripOnSameAirline(v, filter) &&
      this.filterFlightWithAirlineFunction(v, filter)


    ))
    console.log('should be filterd', this.orgnizedResponce);

  }

  /**
   * grouping data return two array array airItineraries and array have same price
   **/

  orgnize(array: any[]) {

    let ar = array
    let out: any[] = []
    ar.forEach(element => {

      // check Nostop in each flight
      // this.checkStops(element);
      let price: number = Math.round(element.itinTotalFare.amount);
      let airLine: string = element.allJourney.flights[0]['flightAirline']['airlineCode'];
      // console.log(airLine);
      let lairLine: string = airLine

      let item = [];
      if (out.length == 0) {
        item.push(element);
        out.push(item);
      }
      else {
        let found: boolean = false;
        let i = 0
        while (i < out.length || i > 60) {
          let elmentO = out[i];
          let first = elmentO[0];
          let price2: number = Math.round(first.itinTotalFare.amount);
          let lairLine2: string = first.allJourney.flights[0]['flightAirline']['airlineCode'];
          if (lairLine === lairLine2 && price === price2) {
            elmentO.push(element);
            found = true;
            break
          }
          else {
            i = i + 1
          }
        }
        if (!found) {
          item.push(element);
          out.push(item);
        }
      }

    });
    return out
  }
  /**
   * create an array with the same length of the output
   **/
  valuesoftrueM(array: airItineraries[]) {
    let out: any[] = [];
    let arryalengty = array.length;
    for (let index = 0; index < arryalengty; index++) {
      let truth: boolean = true;
      out.push(truth);

    }
    return this.moreT = out;
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
        this.FilterData = this.orgnize(
          [...this.response.airItineraries].sort((a, b) => { return a.itinTotalFare.amount - b.itinTotalFare.amount })
        )
      }
      if (type == 2) {
        this.FilterData = this.orgnize([...this.response.airItineraries].sort((a, b) => { return a.totalDuration - b.totalDuration }))
      }
      if (type == 3) {
        this.FilterData = this.orgnize([...this.response.airItineraries].sort((a, b) => { return <any>new Date(a.deptDate) - <any>new Date(b.deptDate) }))
      }
      if (type == 4) {
        this.FilterData = this.orgnize([...this.response.airItineraries].sort((a, b) => { return <any>new Date(b.deptDate) - <any>new Date(a.deptDate) }))
      }
      if (type == 5) {
        this.FilterData = this.orgnize([...this.response.airItineraries].sort((a, b) => { return <any>new Date(a.allJourney.flights[1].flightDTO[0].departureDate) - <any>new Date(b.allJourney.flights[1].flightDTO[0].departureDate) }))
      }

      if (type == 6) {
        this.FilterData = this.orgnize([...this.response.airItineraries].sort((a, b) => { return <any>new Date(b.allJourney.flights[1].flightDTO[0].departureDate) - <any>new Date(a.allJourney.flights[1].flightDTO[0].departureDate) }))
      }

      if (type == 7) {
        this.FilterData = this.orgnize([...this.response.airItineraries].sort((a, b) => { return a.experiance - b.experiance }))
      }


    }
  }



  /**
   * get min , max value slider from back data 
   **/


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

    // this.options = {
    //   floor: minValue,
    //   ceil: Math.round(maxValue1 + 10),
    //   translate: (value: number): string => {
    //     return Math.round(value).toString();
    //   },
    // };
    // console.log("MinAndMax", minValue, this.maxValue);
    // this.priceMinValue = minValue;
    // this.priceMaxValue = Math.round(maxValue1 + 10);
    // this.maxValue = Math.round(maxValue1 + 10);
    return [minValue]
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
    // this.durationMax = max + 100;
    // this.durationMin = min;
    // this.optionsDurathion = {
    //   floor: min,
    //   ceil: max + 100,
    //   noSwitching: true,
    //   translate: (value: number): string => {
    //     let h = value / 60 | 0;
    //     let m = value % 60 | 0;
    //     return h + "h" + ":" + m + "m";
    //   }
    // }
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

    // this.departingMin = min;
    // this.departingMax = max;
    // this.optionsdeparting = {
    //   floor: min,
    //   ceil: max,
    //   noSwitching: false,
    //   translate: (value: number): string => {
    //     let h = value / 60 | 0;
    //     let m = value % 60 | 0;
    //     return h + "h" + ":" + m + "m";
    //     // return this.datePipe.transform(value * 1000, 'HH:mm a')
    //   }
    // };
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

    console.log("Arrival", max, min);

    // this.arrivingMin = min;
    // this.arrivingMax = max;
    // this.optionsArriving = {
    //   floor: min,
    //   ceil: max,
    //   noSwitching: true,
    //   translate: (value: number): string => {
    //     let h = value / 60 | 0;
    //     let m = value % 60 | 0;
    //     return h + "h" + ":" + m + "m";
    //   }
    // };
    return [min, max];
  }



  /**
   * Functions filter to filter data 
   **/

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
 *  filter by price value
 **/
  filterFlighWithPrice(flight: airItineraries, filter: filterFlightInterface): boolean {
    return flight.itinTotalFare.amount >= filter.priceMin! && flight.itinTotalFare.amount < filter.priceMax!;
  }
  /**
*  filter by DepartingTime
**/
  filterFlighWithDepartionTime(flight: airItineraries, filter: filterFlightInterface): boolean {
    return this.convertToMin(flight.allJourney.flights[0].flightDTO[0].departureDate) >= filter.depatingMin! && this.convertToMin(flight.allJourney.flights[0].flightDTO[0].departureDate) <= filter.departingMax!;

  }
  /**
*  filter by ArrivalTime
**/
  filterFlighWithArrivalTime(flight: airItineraries, filter: filterFlightInterface): boolean {
    return this.convertToMin(flight.allJourney.flights[0].flightDTO[0].arrivalDate) >= filter.arrivingMin! && this.convertToMin(flight.allJourney.flights[0].flightDTO[0].arrivalDate) <= filter.arrivingMax!;

  }
  /**
 *  filter by Duration flight
 **/
  filterFlighWithDuration(flight: airItineraries, filter: filterFlightInterface): boolean {
    return flight.totalDuration >= filter.durationMin! && flight.totalDuration < filter.durationMax!;
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
  /**
*  filter by stops value
**/
  filterFlightWithNumberofStopsFunction(flight: airItineraries, filter: filterFlightInterface): boolean {
    let stopFlage: boolean = true;
    // if(filter.stops[0] == 0 && filter.stops[1] == 1 && filter.stops[2] == 2 && filter.stops[3] == 3 && filter.stops[4] == 4){
    //   stopFlage = true
    // }
    if (filter?.stops![0] == 0 && filter.stops?.length! == 1) {
      for (var i = 0; i < flight.allJourney.flights.length; i++) {
        if (flight.allJourney.flights[i].stopsNum != 0) {
          stopFlage = false
        }
      }
    }

    else if (filter.stops![0] == 0 && filter.stops![1] == 1) {
      for (var i = 0; i < flight.allJourney.flights.length; i++) {
        if (flight.allJourney.flights[i].stopsNum > 1) {
          console.log("this itineraray stop show", flight)
          stopFlage = false
        }
      }
    }

    else if (filter.stops![0] == 0 && filter.stops![1] == 2) {
      for (var i = 0; i < flight.allJourney.flights.length; i++) {
        if (flight.allJourney.flights[i].stopsNum == 1) {
          stopFlage = false
        }
      }
    }

    else if (filter.stops![0] == 1) {
      for (var i = 0; i < flight.allJourney.flights.length; i++) {
        if (flight.allJourney.flights[i].stopsNum != 1) {
          stopFlage = false
        }
      }
    }

    else if (filter.stops![0] == 2) {
      for (var i = 0; i < flight.allJourney.flights.length; i++) {
        if (flight.allJourney.flights[i].stopsNum < 2) {
          stopFlage = false
        }
      }
    }

    else {
      stopFlage = true
    }


    return stopFlage
  }

  /**
  *  filter by airline
  **/



  filteringbyairline(val: any[]) {
    let airL: any[] = [];
    for (let index = 0; index < val.length; index++) {
      const element = val[index];
      if (element) {
        airL.push(this.airlinesA[index]);
      }

    };
    if (airL.length == 0) {
      let out = airL;
      this.airLR = out
      return out
    }
    else {
      return airL;
    }
  }
  filterFlightWithAirlineFunction(flight: airItineraries, filter: filterFlightInterface): boolean {
    return filter.airlines!.indexOf(flight.allJourney.flights[0]['flightAirline']['airlineName']) !== -1 || filter.airlines?.length == 0
  }

  /**
 *  filter by ReturnTime
 **/

  filterFlighWithReturnTime(flight: airItineraries, filter: filterFlightInterface, roundT: boolean): boolean {
    roundT = this.roundT
    return this.convertToMin(flight.allJourney.flights[1].flightDTO[0].departureDate) >= filter.returnMin! && this.convertToMin(flight.allJourney.flights[1].flightDTO[0].departureDate) < filter.returnMax!;

  }

  /**
 *  filter by booking sites
 **/


  filteringbyBookingSites(val: string[]) {
    let selectedSites: any[] = [];
    for (let index = 0; index < val.length; index++) {
      const element = val[index];
      if (element) {
        selectedSites.push(this.bookingSites[index]);
      }

    };
    if (selectedSites.length == 0) {
      let out = selectedSites;
      return out
    }
    else {
      return selectedSites;
    }
  }

  /**
  * check value stop 
  **/
  stopscheck(stops: number[], flight: flight[]) {
    let status: Boolean = true;
    let t1 = performance.now();
    flight.forEach(element => {
      if (stops.indexOf(element.stopsNum) == -1) {
        status = false;
      }

    });
    return status
  }
  /**
  * check FlextTicket 
  **/
  FlexTicketcheck(flight: airItineraries, filter: filterFlightInterface): boolean {
    if (filter.flexibleTicket![0] && !filter.flexibleTicket![1]) {
      if (flight.isRefundable) {
        return true
      }
      else {
        return false
      }
    }

    else if (!filter.flexibleTicket![0] && filter.flexibleTicket![1]) {
      if (flight.isRefundable) {
        return false
      }
      else {
        return true
      }
    }

    else if (!filter.flexibleTicket![0] && !filter.flexibleTicket![1]) {
      return true
    }

    else if (filter.flexibleTicket![0] && filter.flexibleTicket![1]) {
      return true
    } else {
      return false
    }
  }
  /**
  * filter data based on  experience value 
  **/
  filterWithExperience(flight: airItineraries, filter: filterFlightInterface): boolean {
    if (filter.experience![0] && !filter.experience![1]) {
      if (flight.overNight == 0) {
        return true
      }
      else { return false }
    }

    else if (filter.experience![1] && !filter.experience![0]) {
      if (flight?.stopsTime! < 4) {
        return true
      }
      else { return false }
    }

    else if (filter.experience![1] && filter.experience![0]) {
      if (flight.overNight == 0 && flight.stopsTime! < 4) {
        return true
      }
      else { return false }
    }

    else if (!filter.experience![1] && !filter.experience![0]) {
      return true
    }
    else {
      return false
    }
  }
  /**
  * filter data based on  SameAirline  
  **/
  completeTripOnSameAirline(flight: airItineraries, filter: filterFlightInterface): boolean {
    if (!filter.sameAirline) {
      return true
    }
    else {
      let airlineChange = true
      let firstAirline = flight.allJourney.flights[0].flightDTO[0].flightAirline.airlineName

      let flightAirlines: string[][]
      flightAirlines = flight.allJourney.flights.map(v => {
        return v.flightDTO.map(f => {
          return f.flightAirline.airlineName
        })
      })

      for (var i = 0; i < flightAirlines.length; i++) {
        for (var j = 0; j < flightAirlines[i].length; j++) {
          if (flightAirlines[i][j] != firstAirline) {
            airlineChange = false;
          }
        }
      }
      return airlineChange;
    }
  }





  /**
   * this function is responsible to destory any opened subscription on this service
   */
  destroyer() {
    this.subscription.unsubscribe()
  }
}
