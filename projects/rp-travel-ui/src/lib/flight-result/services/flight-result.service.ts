import { Injectable, inject } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { Subscription, take } from 'rxjs';
import { FlightSearchResult, SearchFlightModule, airItineraries } from '../interfaces';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FlightResultApiService } from './flight-result-api.service';
import { searchFlightModel } from '../../flight-search/interfaces';

@Injectable({
  providedIn: 'root'
})
export class FlightResultService {
  api = inject(FlightResultApiService)
  response?: FlightSearchResult
  FilterData?:airItineraries[]
  normalError: string = ''
  normalErrorStatus: boolean = false
  loading: boolean = false
  ResultFound: boolean = false
  router = inject(Router)
  route = inject(ActivatedRoute)
  filterForm = new FormGroup({
    airline: new FormGroup({
      airlines: new FormArray([]),
    }),
    stopsForm: new FormGroup({
      noStops: new FormControl(false),
      oneStop: new FormControl(false),
      twoAndm: new FormControl(false),
    }),
    priceSlider: new FormControl([0, 0]),
    durationSlider: new FormControl([0, 0]),
    dpartingSlider: new FormControl([0, 0]),
    returnSlider: new FormControl([30, 7000]),
  });
  subscription: Subscription = new Subscription()

  constructor() { }



  /**
 * get all data from the router to call api to get flightResultData
 * from Api  searchFlight
 **/
  getDataFromUrl(lang:string,currency:string,pointOfReservation:string,flightType:string,flightsInfo:string,serachId:string,passengers:string,Cclass:string, showDirect:boolean) {
    console.log("show url in services", lang,currency,pointOfReservation,flightType,flightsInfo,serachId,passengers,Cclass, showDirect)

        
        let searchApi: SearchFlightModule = new SearchFlightModule(lang, currency, pointOfReservation, flightType, flightsInfo, passengers, Cclass, serachId, showDirect, 'all');
        if (SearchFlightModule) {
          let myapi = searchApi;
          console.log("myapi" ,myapi)

          this.subscription.add(this.api.searchFlight(myapi).subscribe(
            (result) => {
              if (result.status == 'Valid') {
                this.loading = false;
                this.ResultFound = true;
                this.response = result;
                // console.log("result" ,  this.response ,result)
                this.FilterData= result.airItineraries;




              } else {
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
if(this.response != undefined)
{    console.log(type);
    if (type == 1) {
      this.FilterData= [...this.response.airItineraries].sort((a, b) => { return a.itinTotalFare.amount - b.itinTotalFare.amount })
      // console.log("sortData" ,this.FilterData)

    }
    if (type == 2) {
      this.FilterData= [...this.response.airItineraries].sort((a, b) => { return a.totalDuration - b.totalDuration })
    }
    if (type == 3) {
      this.FilterData= [...this.response.airItineraries].sort((a, b) => { return <any>new Date(a.deptDate) - <any>new Date(b.deptDate) })
    }
    if (type == 4) {
      this.FilterData= [...this.response.airItineraries].sort((a, b) => { return <any>new Date(b.deptDate) - <any>new Date(a.deptDate) })
    }
    if (type == 5) {
      this.FilterData= [...this.response.airItineraries].sort((a, b) => { return <any>new Date(a.allJourney.flights[1].flightDTO[0].departureDate) - <any>new Date(b.allJourney.flights[1].flightDTO[0].departureDate) })
    }

    if (type == 6) {
      this.FilterData= [...this.response.airItineraries].sort((a, b) => { return <any>new Date(b.allJourney.flights[1].flightDTO[0].departureDate) - <any>new Date(a.allJourney.flights[1].flightDTO[0].departureDate) })
    }

    if (type == 7) {
      this.FilterData= [...this.response.airItineraries].sort((a, b) => { return a.experiance - b.experiance })
    }
    // return [...this.response.airItineraries]
  
  
  }
  }


  
  /**
   * Find Min And Max Values Of Flight Duration  And Update Filtiration Slider
   **/
  findDurationMinMax(array: any[]) {
    let min = array[0].totalDuration;
    let max = array[0].totalDuration;
    array.forEach((element) => {
      if (element.totalDuration < min) {
        min = element.totalDuration;
      }
      if (element.totalDuration > max) {
        max = element.totalDuration;
      }
    });

    return [min, max + 100];
  }

  /**
   *  Find Min And Max Values Of Flight Departing Dates  And Update Filtiration Slider
   **/
  findDepartingnMinMax(array: any[]) {
    let min = this.convertToMin(array[0].deptDate);
    let max = this.convertToMin(array[0].deptDate);
    array.forEach((element) => {
      let t = this.convertToMin(element.deptDate);
      if (t < min) {
        min = t;
      }
      if (t > max) {
        max = t;
      }
    });



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
   * this function is responsible to destory any opened subscription on this service
   */
  destroyer() {
    this.subscription.unsubscribe()
  }
}
