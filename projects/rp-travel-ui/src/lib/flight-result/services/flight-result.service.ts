import { Injectable } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { FlightSearchResult } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class FlightResultService {
  response?: FlightSearchResult;
  filterForm   = new FormGroup({
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
  subscription : Subscription = new Subscription()

  constructor() { }
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
convertToMin(time:string) :number {
  let date = time;
    let T = date.indexOf('T');
    let h = date.slice(T+1);
    let hr = +h.slice(0,2) *60 ;
    let m = +h.slice(3,5);
    let tm = hr+m;
    return tm
} 


minAnMax() {
  debugger;
  let len: number = 20;
  let minValue =this.response?.airItineraries[0]['itinTotalFare']['amount']-1
  this.response.airItineraries[0]['itinTotalFare']['amount'] - 1;
  len = this.response?.airItineraries.length;
  len = len - 1;

  let maxValue1 = this.response.airItineraries[len]['itinTotalFare']['amount'] + 1;
  let maxValue = Math.max(...this.response?.airItineraries.map(o => o['itinTotalFare']['amount']), 0);
 
  return [0,maxValue+100];
}

//  remove airlines arr
removeArrayControllers() {
  if(((<FormArray>this.filterForm.get('airline')?.get("airlines")).length)){
   while (((<FormArray>this.filterForm.get('airline')?.get("airlines"))).length >= 1) {
     // (<FormArray>this.airlineForm.get("airline").get('airlines')).removeAt(0);
     (<FormArray>this.filterForm.get('airline')?.get("airlines")).removeAt(0);
   }
  }

}

  /**
   * this function is responsible to destory any opened subscription on this service
   */
  destroyer(){
    this.subscription.unsubscribe()
  }
}
