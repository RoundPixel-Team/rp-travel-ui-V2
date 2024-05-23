import { Injectable, inject } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { Subscription} from 'rxjs';
import { FareRules, FlightSearchResult, SearchFlightModule, airItineraries, filterFlightInterface, flight, flightResultFilter } from '../interfaces';
import { ActivatedRoute, Router } from '@angular/router';
import { FlightResultApiService } from './flight-result-api.service';
import { customAirlineFilter } from '../interfaces'
import { FlightSearchService } from '../../flight-search/services/flight-search.service';

@Injectable({
  providedIn: 'root'
})
export class FlightResultService {

  api = inject(FlightResultApiService)
  flightSearch = inject(FlightSearchService)
  router = inject(Router)
  route = inject(ActivatedRoute)
  filter?: flightResultFilter;
  searchID : string = ''
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
/**fare rules loading state */
fareLoading: boolean = true;
  ResultFound: boolean = false

  //Price Filter Values
  priceMinValue:number=0;
  priceMaxValue:number=100;
  minPriceValueForSlider:number = 0;
  maxPriceValueForSlider:number = 100;

  FilterChanges$: Subscription = new Subscription();

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
  departingMin: number = 0;
  departingMax: number = 7000;
  minDepartingValueForSlider:number = 0;
  maxDepartingValueForSlider:number = 7000;

  arrivingMin: number = 0;
  arrivingMax: number = 7000
  minArrivingValueForSlider:number = 0;
  maxArrivingValueForSlider:number = 7000;


  durationMin: number = 0;
  durationMax: number = 7000;
  minDurationValueForSlider:number = 0;
  maxDurationValueForSlider:number = 7000;

/**Property for fare Rules */
  fareRules!: FareRules[];
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

    minpriceSlider: new FormControl(0),
    maxpriceSlider: new FormControl(0),

    mindurationSlider: new FormControl(0),
    maxdurationSlider: new FormControl(0),
    mindepartingSlider: new FormControl(0),
    maxdepartingSlider: new FormControl(0),
    minarrivingSlider: new FormControl(0),
    maxarrivingSlider: new FormControl(0),

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

  formINIT:boolean =false;

  subscription: Subscription = new Subscription()

  moreT: boolean[] = [];
  /**
*  array return data type airItineraries[] after organize
* 
*/
  orgnizedResponce: airItineraries[][] = [];

 
  /**
   * lowest fares for sorting containers
   */
  cheapestFlight!:airItineraries;
  shortestFlight!:airItineraries;
  bestExperienceFlight!:airItineraries;
  cheapeastLowestFare:number = 0
  shortestLowestFare:number = 0
  bestExperienceLowestFare:number = 0


  /**Custom airlines filter */
  customFilteredAirline : customAirlineFilter[] = [];
  chosenCustomFilteredAirline : string[] = [];
  customFilteredAirlineSlice:customAirlineFilter[] = [];
  customFilteredAirlineStart : number = 0;
  customFilteredAirlineEnd : number = 4;

  customFilteredAirlineSliceMobile:customAirlineFilter[] = [];
  customFilteredAirlineStartMobile : number = 0;
  customFilteredAirlineEndMobile : number = 2;
  constructor() { }



  /**
 * get all data from the router to call api to get flightResultData
 * from Api  searchFlight
 **/
  getDataFromUrl(lang: string, currency: string, pointOfReservation: string, flightType: string, flightsInfo: string, serachId: string, passengers: string, Cclass: string, showDirect: boolean,endCustomAirlineFilter:number,endCustomAirlineFilterMobile:number) {
    this.loading = true
    this.orgnizedResponce = []
    this.FilterData = []
    this.response = undefined
    this.customFilteredAirlineEnd = endCustomAirlineFilter
    this.customFilteredAirlineEndMobile = endCustomAirlineFilterMobile
    this.searchID = serachId
    console.log("Flight TYPE BEFORE CONDITION",this.flightSearch.searchFlight.get("flightType")?.value )
    if (this.flightSearch.searchFlight.get("flightType")?.value == 'RoundTrip') {
      this.roundT = true;
    }
    else{
      this.roundT = false;
    }
    let searchApi: SearchFlightModule = new SearchFlightModule(lang, currency, pointOfReservation, flightType, flightsInfo, passengers, Cclass, serachId, showDirect, 'all');
    if (SearchFlightModule) {
      let myapi = searchApi;

      this.subscription.add(this.api.searchFlight(myapi).subscribe(
        (result) => {
          this.formINIT =false;
          if (result.status == 'Valid') {
            this.loading = false;
            this.ResultFound = true;
            this.response = result;
            
            this.minAnMax(this.response.airItineraries); //get Min And Max price
            this.findDepartingnMinMax(this.response.airItineraries); //get Min And Max Depart Date
            this.findArrivingMinMax(this.response.airItineraries); //get Min And Max Arrival Date
            this.findDurationMinMax(this.response.airItineraries); //get Min And Max Duration Stops

            this.airlinesA =[];
            this.airLR=[];
            this.filterAirlines()
            this.FilterData =  this.addExperiance(result.airItineraries); //add new optional value to airItineraries object
            this.orgnizedResponce = this.orgnize(this.FilterData);
            this.fetchLowestFaresForSorting(this.orgnizedResponce)
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
              minpriceSlider: new FormControl(0),
              maxpriceSlider: new FormControl(0),
              mindurationSlider: new FormControl(0),
              maxdurationSlider: new FormControl(7000),
              mindepartingSlider: new FormControl(0),
              maxdepartingSlider: new FormControl(20000),
              minarrivingSlider: new FormControl(0),
              maxarrivingSlider: new FormControl(20000),
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
            console.log("Filter Form ", this.filterForm.value);
            debugger;
            this.filterForm.get("mindepartingSlider")?.setValue( this.minDepartingValueForSlider);
            this.filterForm.get("maxdepartingSlider")?.setValue( this.maxDepartingValueForSlider);

            this.filterForm.get("mindurationSlider")?.setValue(this.minDurationValueForSlider);
            this.filterForm.get("maxdurationSlider")?.setValue(this.maxDurationValueForSlider);

            this.filterForm.get("minarrivingSlider")?.setValue(this.minArrivingValueForSlider);
            this.filterForm.get("maxarrivingSlider")?.setValue(this.maxArrivingValueForSlider);
            
            this.filterForm.get('minpriceSlider')?.setValue(this.minPriceValueForSlider);
            this.filterForm.get('maxpriceSlider')?.setValue(this.maxPriceValueForSlider);
            this.filterForm.updateValueAndValidity();  

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
            this.filterForm.updateValueAndValidity();
            console.log("filter Formmmm", this.filterForm.value);
            debugger;
            this.formINIT = true;
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
        if (this.formINIT) {
          let filter: flightResultFilter = new flightResultFilter(
            this.filterForm.get("sameAirline")?.value!,
            this.filterForm.get("minpriceSlider")?.value!,
            this.filterForm?.get("maxpriceSlider")?.value!,
            this.filterForm.get("mindurationSlider")?.value!,
            this.filterForm.get("maxdurationSlider")?.value!,
            this.filterForm.get("mindepartingSlider")?.value!,
            this.filterForm.get("maxdepartingSlider")?.value!,
            this.filterForm.get("minarrivingSlider")?.value!,
            this.filterForm.get("maxarrivingSlider")?.value!,
            this.filterForm.get("returnSlider")?.value![0],
            this.filterForm.get("returnSlider")?.value![1],
            this.stopsvalues(),
            [this.filterForm.get('experience')?.get('overNight')?.value!],
            [this.filterForm.get('flexibleTickets')?.get('refund')?.value!, this.filterForm.get('flexibleTickets')?.get('nonRefund')?.value!],

            this.filteringbyairline(this.filterForm.get('airline')?.get('airlines')?.value!),
            this.filteringbyBookingSites(this.filterForm.get('bookingSite')?.get('bookingSites')?.value!)

          );

          console.log("same airline", this.filterForm.get("sameAirline")?.value!)
          console.log("airline", this.filterForm.get('airline')?.get('airlines')?.value)
        
          this.oneForAll(filter, this.FilterData, this.roundT);
        }
        else {
        }
      })
    );
  }

 
  oneForAll(filter: filterFlightInterface, fligtsArray: airItineraries[], round: boolean) {
    console.log("this.roundT",this.roundT)
    console.log("filter",filter)

    this.orgnizedResponce = this.orgnize(fligtsArray.filter(v =>
      this.filterFlighWithPrice(v) &&
      this.filterFlighWithDepartionTime(v) &&
      this.filterFlighWithArrivalTime(v) &&
      this.filterFlighWithDuration(v) &&
      this.FlexTicketcheck(v, filter) &&
      this.filterFlightWithNumberofStopsFunction(v, filter) &&
      this.filterWithExperience(v, filter) &&
      this.filterFlighWithReturnTime(v, filter, this.roundT) &&
      this.completeTripOnSameAirline(v, filter) &&
      this.filterFlightWithAirlineFunction(v, filter,this.roundT)
    ))

  }

  /**
   * grouping data return two array array airItineraries and array have same price
   **/

  orgnize(array: airItineraries[]) {
    let out :airItineraries[][]=[];
    let remain:airItineraries[] =array;
    let i = 0;
    while (remain.length >0 || !remain) {
      if (i>50){
        break
      }else{
        out.push(remain.filter((v,i,a)=>v.allJourney.flights[0].flightDTO[0].flightAirline.airlineCode ===a[0].allJourney.flights[0].flightDTO[0].flightAirline.airlineCode && v.itinTotalFare.amount === a[0].itinTotalFare.amount));
        remain = remain.filter((v,i,a)=>v.allJourney.flights[0].flightDTO[0].flightAirline.airlineCode !=a[0].allJourney.flights[0].flightDTO[0].flightAirline.airlineCode || v.itinTotalFare.amount != a[0].itinTotalFare.amount);
      }
      i = i +1
    }
    
   return out.sort((a,b)=>{return a[0].itinTotalFare.amount - b[0].itinTotalFare.amount})
  
  
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
      if (type == 1) {
        this.orgnizedResponce = 
          [...this.orgnizedResponce].sort((a, b) => { return a[0].itinTotalFare.amount - b[0].itinTotalFare.amount })
        
      }
      if (type == 2) {
        this.orgnizedResponce = [...this.orgnizedResponce].sort((a, b) => { return a[0].totalDuration - b[0].totalDuration })
      }
      if (type == 3) {
        this.orgnizedResponce = [...this.orgnizedResponce].sort((a, b) => { return <any>new Date(a[0].deptDate) - <any>new Date(b[0].deptDate) })
      }
      if (type == 4) {
        this.orgnizedResponce = [...this.orgnizedResponce].sort((a, b) => { return <any>new Date(b[0].deptDate) - <any>new Date(a[0].deptDate) })
      }
      if (type == 5) {
        this.orgnizedResponce = [...this.orgnizedResponce].sort((a, b) => { return <any>new Date(a[0].allJourney.flights[1].flightDTO[0].departureDate) - <any>new Date(b[0].allJourney.flights[1].flightDTO[0].departureDate) })
      }

      if (type == 6) {
        this.orgnizedResponce = [...this.orgnizedResponce].sort((a, b) => { return <any>new Date(b[0].allJourney.flights[1].flightDTO[0].departureDate) - <any>new Date(a[0].allJourney.flights[1].flightDTO[0].departureDate) })
      }

      if (type == 7) {
        this.orgnizedResponce = [...this.orgnizedResponce].sort((a, b) => { return a[0].experiance - b[0].experiance })
      }


    }
  }

  /**
   * get the lowest fares for all sorting criterias
   * @param data (all the itineraries)
   */
  fetchLowestFaresForSorting(data:airItineraries[][]){
    this.cheapestFlight=[...data].sort((a, b) => { return a[0].itinTotalFare.amount - b[0].itinTotalFare.amount })[0][0]
    this.cheapeastLowestFare = [...data].sort((a, b) => { return a[0].itinTotalFare.amount - b[0].itinTotalFare.amount })[0][0].itinTotalFare.amount
    this.bestExperienceLowestFare = [...data].sort((a, b) => { return a[0].experiance - b[0].experiance })[0][0].itinTotalFare.amount
    this.bestExperienceFlight=[...data].sort((a, b) => { return a[0].experiance - b[0].experiance })[0][0]
    this.shortestLowestFare = [...data].sort((a, b) => { return a[0].totalDuration - b[0].totalDuration })[0][0].itinTotalFare.amount
    this.shortestFlight= [...data].sort((a, b) => { return a[0].totalDuration - b[0].totalDuration })[0][0]
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

    let minValue : number = sortedRes[0].itinTotalFare.amount;
    let maxValue : number = sortedRes[sortedRes.length - 1].itinTotalFare.amount;

    this.priceMinValue = minValue;
    this.priceMaxValue = Math.round(maxValue + 10);
    this.minPriceValueForSlider = minValue
    this.maxPriceValueForSlider = maxValue
  }

  /**
    * Find Min And Max Values and  Filter Values airItineraries[]  Of Flight Duration  And Update Filtiration Slider
    **/
  findDurationMinMax(array: any[]) {
    let sorted = [...array].sort((a, b) => b.totalDuration - a.totalDuration);
    let min = sorted[sorted.length - 1]['totalDuration'];
    let max = sorted[0]['totalDuration'];
    this.durationMax = max + 100;
    this.durationMin = min;
    this.minDurationValueForSlider = min;
    this.maxDurationValueForSlider = max +100;
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

    this.departingMin = min;
    this.departingMax = max;
    this.minDepartingValueForSlider = min;
    this.maxDepartingValueForSlider = max;

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

    this.minArrivingValueForSlider = min;
    this.maxArrivingValueForSlider = max;

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
 *  filter by price value
 **/
  filterFlighWithPrice(flight: airItineraries): boolean {
    return flight.itinTotalFare.amount >= this.filterForm.get('minpriceSlider')?.value! && flight.itinTotalFare.amount < this.filterForm.get('maxpriceSlider')?.value!;
  }
  /**
*  filter by DepartingTime
**/
  filterFlighWithDepartionTime(flight: airItineraries): boolean {
    return this.convertToMin(flight.allJourney.flights[0].flightDTO[0].departureDate) >= this.filterForm.get('mindepartingSlider')?.value! && this.convertToMin(flight.allJourney.flights[0].flightDTO[0].departureDate) <= this.filterForm.get('maxdepartingSlider')?.value!;

  }
  /**
*  filter by ArrivalTime
**/
  filterFlighWithArrivalTime(flight: airItineraries): boolean {
    return this.convertToMin(flight.allJourney.flights[0].flightDTO[flight.allJourney.flights[0].flightDTO.length - 1].arrivalDate) >= this.filterForm.get('minarrivingSlider')?.value! && this.convertToMin(flight.allJourney.flights[0].flightDTO[flight.allJourney.flights[0].flightDTO.length - 1].arrivalDate) <= this.filterForm.get('maxarrivingSlider')?.value!;

  }
  /**
 *  filter by Duration flight
 **/
  filterFlighWithDuration(flight: airItineraries): boolean {
    return flight.totalDuration >= this.filterForm.get('mindurationSlider')?.value! && flight.totalDuration < this.filterForm.get('maxdurationSlider')?.value!;
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

    return out
  }
  /**
*  filter by stops value
**/
  filterFlightWithNumberofStopsFunction(flight: airItineraries, filter: filterFlightInterface): boolean {
    let stopFlage: boolean = true;
    if(filter.stops![0] == 0 && filter.stops![1] == 1 && filter.stops![2] == 2 && filter.stops![3] == 3 && filter.stops![4] == 4){
      stopFlage = true
    }
    else if (filter?.stops![0] == 0 && filter.stops?.length! == 1) {
      for (var i = 0; i < flight.allJourney.flights.length; i++) {
        if (flight.allJourney.flights[i].stopsNum != 0) {
          stopFlage = false
        }
      }
    }

    else if (filter.stops![0] == 0 && filter.stops![1] == 1) {
      for (var i = 0; i < flight.allJourney.flights.length; i++) {
        if (flight.allJourney.flights[i].stopsNum > 1) {
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

    else if (filter.stops![0] == 1 && filter.stops?.length == 1) {
      for (var i = 0; i < flight.allJourney.flights.length; i++) {
        if (flight.allJourney.flights[i].stopsNum != 1) {
          stopFlage = false
        }
      }
    }

    else if(filter.stops![0] == 1 && filter.stops![1] == 2){
      for (var i = 0; i < flight.allJourney.flights.length; i++) {
        if (flight.allJourney.flights[i].stopsNum < 2 && flight.allJourney.flights[i].stopsNum != 1) {
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
    console.log("airL", airL);
    debugger;
    if (airL.length == 0) {
      let out = airL;
      this.airLR = out
      console.log("airlR", this.airLR);
      
      return out
    }
    else {
      return airL;
    }
  }
  filterFlightWithAirlineFunction(flight: airItineraries, filter: filterFlightInterface,roundT:boolean): boolean {
    if(roundT){
      return filter.airlines!.indexOf(flight.allJourney.flights[0]['flightAirline']['airlineName']) != -1 || filter.airlines!.indexOf(flight.allJourney.flights[1]['flightAirline']['airlineName']) != -1  || filter.airlines?.length == 0
    }else{
      console.log("******", filter.airlines!.indexOf(flight.allJourney.flights[0]['flightAirline']['airlineName']) != -1 || filter.airlines?.length == 0);
      
      return filter.airlines!.indexOf(flight.allJourney.flights[0]['flightAirline']['airlineName']) != -1 || filter.airlines?.length == 0
    }
    
  }

  /**
 *  filter by ReturnTime
 **/

  filterFlighWithReturnTime(flight: airItineraries, filter: filterFlightInterface, roundT: boolean): boolean {
    roundT = this.roundT
    if(roundT){
      return this.convertToMin(flight.allJourney.flights[1].flightDTO[0].departureDate) >= filter.returnMin! && this.convertToMin(flight.allJourney.flights[1].flightDTO[0].departureDate) < filter.returnMax!;
    }else{
      return true
    }
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
   * after finding the min and max values for all filtiration critirias .. update the sliders with these ,,
   * minimum and maximum values
   */


updateCurrencyCode(code: string){
  this.code = code;
}
  DayOrNight(h:number,m:number):string{
    let hourOfday = h > 24?h%24:h;
   return hourOfday+(m/100) > 12?'PM':"AM"
  }
  hoursFormater(h:number):string{
    let hourOfday = h > 24?h%24:h;
    let fHourOfday  = hourOfday >12? hourOfday -12 : hourOfday;
  
    return fHourOfday >= 10 ?fHourOfday.toString():`0${fHourOfday}`;
  }
  mFormater(m:number):string{
  return m >=10?m.toString():`0${m}`;
  }


  /**
   **Sort according to the lowest fare (amount) and then create airlines array
   **according to the sorting to use them in filtiration
   **/
   filterAirlines() {
    this.customFilteredAirline = [];
    this.customFilteredAirlineSlice = [];
    this.customFilteredAirlineSliceMobile = [];
    if (!this.response) {
      return;
    }
    let sorted = this.response.airItineraries.slice().sort((a, b) => {
      return a.itinTotalFare.amount - b.itinTotalFare.amount;
    });
    for (var i = 0; i < this.response.airlines.length; i++) {
      let airlineNow = this.response.airlines[i];
      let index = sorted.findIndex(
        (air) =>
          air.allJourney.flights[0].flightAirline.airlineName == airlineNow
      );
      if (index != -1) {
        var maxStops = sorted[index].allJourney.flights.slice().sort((a, b) => {
          return b.stopsNum - a.stopsNum;
        });
        this.customFilteredAirline.push({
          logo: sorted[index].allJourney.flights[0].flightAirline.airlineLogo,
          stops: maxStops[0].stopsNum,
          price: sorted[index].itinTotalFare.amount,
          currency: sorted[index].itinTotalFare.currencyCode,
          name: sorted[index].allJourney.flights[0].flightAirline.airlineName,
          selected:false
        });
      }
    }
    // this.code = sorted[0].itinTotalFare.currencyCode
    this.customFilteredAirlineSlice = this.customFilteredAirline.slice(this.customFilteredAirlineStart,this.customFilteredAirlineEnd)
    this.customFilteredAirlineSliceMobile = this.customFilteredAirline.slice(this.customFilteredAirlineStartMobile,this.customFilteredAirlineEndMobile)

  }


  /**
   * navigate next on custom filter airline data
   * @returns 
   */
  nextcustomFilteredAirline(){
    if(this.customFilteredAirlineEnd == this.customFilteredAirline.length){
      return
    }
    else{
      this.customFilteredAirlineStart +=1;
      this.customFilteredAirlineEnd +=1;
      this.customFilteredAirlineSlice = this.customFilteredAirline.slice(this.customFilteredAirlineStart,this.customFilteredAirlineEnd)
    }
    
  }

  /**
   * navigate previous on custom filter airline data
   * @returns 
   */
  prevcustomFilteredAirline(){
    if(this.customFilteredAirlineStart == 0){
      return
    }
    else{
      this.customFilteredAirlineStart -=1;
      this.customFilteredAirlineEnd -=1;
      this.customFilteredAirlineSlice = this.customFilteredAirline.slice(this.customFilteredAirlineStart,this.customFilteredAirlineEnd)
    }
  }

  /**
   * navigate next on custom mobile filter airline data
   * @returns 
   */
  nextcustomFilteredAirlineMobile(){
    if(this.customFilteredAirlineEndMobile == this.customFilteredAirline.length){
      return
    }
    else{
      this.customFilteredAirlineStartMobile +=1;
      this.customFilteredAirlineEndMobile +=1;
      this.customFilteredAirlineSliceMobile = this.customFilteredAirline.slice(this.customFilteredAirlineStartMobile,this.customFilteredAirlineEndMobile)
    }
    
  }

  /**
   * navigate previous on custom mobile filter airline data
   * @returns 
   */
  prevcustomFilteredAirlineMobile(){
    if(this.customFilteredAirlineStartMobile == 0){
      return
    }
    else{
      this.customFilteredAirlineStartMobile -=1;
      this.customFilteredAirlineEndMobile -=1;
      this.customFilteredAirlineSliceMobile = this.customFilteredAirline.slice(this.customFilteredAirlineStartMobile,this.customFilteredAirlineEndMobile)
    }
  }

  /**
   * Choose From The Sorted Lowest Fare Airline To Filter With And Change The Form
   **/
  chooseCustomFilterAirline(val: customAirlineFilter, index: number) {
    var indexForForm = this.customFilteredAirline.findIndex(
      a=> a.name == val.name
    );
    var airlineIndex = this.chosenCustomFilteredAirline.findIndex(
      (name: string) => name == val.name
    );
    if (airlineIndex == -1) {
      (this.filterForm.get("airline")!.get("airlines") as FormArray)
        .at(indexForForm)
        .setValue(true);
        this.chosenCustomFilteredAirline.push(val.name)
    } else {
      (this.filterForm.get("airline")!.get("airlines") as FormArray)
        .at(indexForForm)
        .setValue(false);
        this.chosenCustomFilteredAirline.splice(airlineIndex,1)
    }
  }


  /**
   * Check If The Airline Is Selected Or Not
   **/
  checkCustomFilterAirline(airlineName: string) {
    var airlineIndex = this.chosenCustomFilteredAirline.findIndex(
      (name: string) => name == airlineName
    );
    if (airlineIndex == -1) {

      return false;
    } else {
      return true;
    }
  }

  /** A method to get the fare rules data */
  showFareRules(searchId:string,squencNumber: number, pKey: string) {

    this.fareLoading=true;
    this.api.fareRules(searchId, squencNumber, pKey).subscribe(
      (result) => {
        this.fareLoading=false;
        this.fareRules = result.fares;
      }

    );
  }
  /**
   * calculate value to overnight
   * @param airItineraries 
   * @returns 
   */
  calcOverNight (airItinerarie:airItineraries):number{
    let arrivalDate:Date = new Date(airItinerarie.arrivalDate);
    let departualDate:Date = new Date(airItinerarie.deptDate);
    return arrivalDate.getDay() === departualDate.getDay()?0:arrivalDate.getHours()
  }

  /**
   * evaluate flight experiance based on total stop time ,price ,over night 
   * as the value increase the over all experiance decrease
   * @param airItineraries
   * @returns 
   */
  calcExperiance(flightObj:airItineraries) :number {
  return flightObj.itinTotalFare.amount + this.addStopTime(flightObj.allJourney.flights) + this.calcOverNight(flightObj);  //Flight Price + Flight Total Stops + Flight over night number
  }
  /**
  * 
  */
  addExperiance(airItinerariesArr:airItineraries[]){
    let finalArr =  airItinerariesArr.map(
      (v)=>{
         let flightObj:airItineraries = {
             ...v,
             stopsTime:this.addStopTime(v.allJourney.flights),
             overNight:this.calcOverNight(v),
             experiance:this.calcExperiance(v),
         }
          return flightObj
      }
  )
   return finalArr

  }
  /**
   * calculate the total stop time in hours
   * @param flights 
   * @returns 
   */
  addStopTime (flights:flight[]) :number{
    let TtransitTime :number = 0
    flights.forEach(flight => {
      let transitTime = flight.flightDTO.map(f=>f.transitTime.split(':').map(t=>parseInt(t))).reduce((ac,v)=>{
            return [ac[0]+v[0],ac[1]+v[1],ac[2]+v[2]]}).reduce((ac,v,I)=>{
            return ac + Math.floor(v/60**I)
        })
        TtransitTime += transitTime
    });
    return TtransitTime;
  }

  /**
   * this function is responsible to destory any opened subscription on this service
   */
  destroyer() {
    // this.subscription.unsubscribe()
    this.response =undefined
    this.FilterData = []
    this.normalError = ''
    this.FlightType = 'RoundTrip'
    this.normalErrorStatus = false
    this.loading = true
    this.roundT = false;
    this.airLR = []

    this.ResultFound = false
    this.priceMinValue = 0;
    this.priceMaxValue = 5000;
    this.FilterChanges$ = new Subscription();

    this.rate = 1;
    this.code = "KWD"
    this.airlinesA = [];
    this.airlinesForm = [];
    this.bookingSites = ['KhaleejGate', 'other'];
    this.bookingSitesForm = []
    this.departingMin = 0;
    this.departingMax = 7000

    this.arrivingMin = 0;
    this.arrivingMax = 7000


    this.durationMin = 0;
    this.durationMax = 7000;

    this.filterForm = new FormGroup({
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

      minpriceSlider: new FormControl(0),
      maxpriceSlider: new FormControl(0),

      mindurationSlider: new FormControl(0),
      maxdurationSlider: new FormControl(0),
      mindepartingSlider: new FormControl(0),
      maxdepartingSlider: new FormControl(0),
      minarrivingSlider: new FormControl(0),
      maxarrivingSlider: new FormControl(0),

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

    this.formINIT =false;
    this.subscription = new Subscription()

    this.moreT = [];
    this.orgnizedResponce = [];
    this.cheapeastLowestFare = 0
    this.shortestLowestFare = 0
    this.bestExperienceLowestFare = 0


    /**Custom airlines filter */
    this.customFilteredAirline = [];
    this.chosenCustomFilteredAirline  = [];
    this.customFilteredAirlineSlice = [];
    this.customFilteredAirlineStart  = 0;
    this.customFilteredAirlineEnd = 5;

    this.customFilteredAirlineSliceMobile = [];
    this.customFilteredAirlineStartMobile = 0;
    this.customFilteredAirlineEndMobile  = 2;
  }
}
