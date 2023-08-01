import { Inject, Injectable, inject } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import {
  searchBoxFlights,
  searchBoxModel,
  searchBoxPassengers,
} from '../interfaces';
import { FlightSearchApiService } from './flight-search-api.service';
import { AlertMsgModel } from '../../shared/interfaces';

@Injectable({
  providedIn: 'root',
})
export class FlightSearchService {
  subscription: Subscription = new Subscription();
  api = inject(FlightSearchApiService);

  //#region Variablses
  searchFlight: FormGroup = new FormGroup({});
  localForm?: searchBoxModel | undefined; //used to get previous searchbox data from local storage
  flightType?: string;
  passengers?: searchBoxPassengers;
  searchForm?: searchBoxModel;
  lastFlight?: searchBoxFlights;
  passengerAlert: AlertMsgModel = {
    arMsg: '',
    enMsg: '',
  };
  flightAlert: AlertMsgModel = {
    arMsg: '',
    enMsg: '',
  };
  removeFlightAlert: AlertMsgModel = {
    arMsg: '',
    enMsg: '',
  };
  dateAlert: AlertMsgModel = {
    arMsg: '',
    enMsg: '',
  };
  //#endregion

  constructor() {}
  /**
   * this function is responsible to fill the searchbox form from local storage if it has a previous data
   */
  initSearchForm() {
    this.localForm = JSON.parse(localStorage.getItem('form') as string);
    this.flightType = this.localForm?.flightType;
    console.log('FLIGHT TYPE', this.flightType);
    if (localStorage.getItem('form')) {
      //get the flight type based
      if (this.flightType == 'OneWay' || this.flightType == 'oneway') {
        this.oneWayData(this.localForm);
      } else if (
        this.flightType == 'RoundTrip' ||
        this.flightType == 'roundTrip'
      ) {
        this.roundTripData(this.localForm);
      } else {
        this.multiData(this.localForm);
      }
    } else {
      this.searchFlight = new FormGroup({
        flightType: new FormControl('', [Validators.required]),
        Direct: new FormControl(false, [Validators.required]),
        Flights: new FormArray([], [Validators.required]),
        returnDate: new FormControl(''),
        passengers: new FormGroup(
          {
            adults: new FormControl(1, [
              Validators.required,
              Validators.min(1),
            ]),
            child: new FormControl(0, [Validators.required, Validators.min(0)]),
            infent: new FormControl(0, [
              Validators.required,
              Validators.max(4),
              Validators.min(0),
            ]),
          },
          []
        ),
        class: new FormControl('Economy', [Validators.required]),
      });
      //initialize Flights form array
      // (<FormArray>this.searchFlight.get('Flights')).push(
      //   new FormGroup({
      //     departing: new FormControl('Cairo', [Validators.required]),
      //     landing: new FormControl('Kuwait', [Validators.required]),
      //     departingD: new FormControl('30-9-2025', [Validators.required]),
      //   })
      // );
    }
  }

  /**
   * this function is responsible to fill the oneway searchbox data from data storage
   */
  oneWayData(localForm: any) {
    //fill the form with data from local storage
    this.searchFlight = new FormGroup({
      flightType: new FormControl(localForm['flightType'], [
        Validators.required,
      ]),
      Direct: new FormControl(localForm['Direct'], [Validators.required]),
      Flights: new FormArray([], [Validators.required]),
      returnDate: new FormControl(''),
      passengers: new FormGroup(
        {
          adults: new FormControl(localForm['passengers']['adults'], [
            Validators.required,
            Validators.min(1),
          ]),
          child: new FormControl(localForm['passengers']['child'], [
            Validators.required,
            Validators.min(0),
          ]),
          infent: new FormControl(localForm['passengers']['infent'], [
            Validators.required,
            Validators.min(0),
          ]),
        },
        []
      ),
      class: new FormControl(localForm['class'], [Validators.required]),
    });
    //push the first Flight to the flights form array
    (<FormArray>this.searchFlight.get('Flights')).push(
      new FormGroup({
        departing: new FormControl(localForm.Flights[0].departing, [
          Validators.required,
        ]),
        landing: new FormControl(localForm.Flights[0].landing, [
          Validators.required,
        ]),
        departingD: new FormControl(localForm.Flights[0].departingD, [
          Validators.required,
        ]),
      })
    );
    console.log('ONE WAY FORM', this.searchFlight?.value);
  }
  /**
   * this function is responsible to fill the roundTrip searchbox data from data storage
   */
  roundTripData(localForm: any) {
    //fill the form with data from local storage
    this.searchFlight = new FormGroup({
      flightType: new FormControl(localForm['flightType'], [
        Validators.required,
      ]),
      Direct: new FormControl(localForm['Direct'], [Validators.required]),
      Flights: new FormArray([], [Validators.required]),
      returnDate: new FormControl(localForm['returnDate'], [
        Validators.required,
      ]),
      passengers: new FormGroup(
        {
          adults: new FormControl(localForm['passengers']['adults'], [
            Validators.required,
            Validators.min(1),
          ]),
          child: new FormControl(localForm['passengers']['child'], [
            Validators.required,
            Validators.min(0),
          ]),
          infent: new FormControl(localForm['passengers']['infent'], [
            Validators.required,
            Validators.min(0),
          ]),
        },
        []
      ),
      class: new FormControl(localForm['class'], [Validators.required]),
    });
    //push the first Flight to the flights form array
    (<FormArray>this.searchFlight.get('Flights')).push(
      new FormGroup({
        departing: new FormControl(localForm.Flights[0].departing, [
          Validators.required,
        ]),
        landing: new FormControl(localForm.Flights[0].landing, [
          Validators.required,
        ]),
        departingD: new FormControl(localForm.Flights[0].departingD, [
          Validators.required,
        ]),
      })
    );
    console.log('ROUND TRIP FORM', this.searchFlight?.value);
  }
  /**
   * this function is responsible to fill the Multi City searchbox data from data storage
   */
  multiData(localForm: any) {
    this.searchFlight = new FormGroup({
      flightType: new FormControl(localForm['flightType'], [
        Validators.required,
      ]),
      Direct: new FormControl(localForm['Direct'], [Validators.required]),
      Flights: new FormArray([], [Validators.required]),
      returnDate: new FormControl(''),
      passengers: new FormGroup(
        {
          adults: new FormControl(localForm['passengers']['adults'], [
            Validators.required,
            Validators.min(1),
          ]),
          child: new FormControl(localForm['passengers']['child'], [
            Validators.required,
            Validators.min(0),
          ]),
          infent: new FormControl(localForm['passengers']['infent'], [
            Validators.required,
            Validators.min(0),
          ]),
        },
        []
      ),
      class: new FormControl(localForm['class'], [Validators.required]),
    });
    //push all my flights to flights form array
    for (let i = 0; i < localForm.Flights?.length; i++) {
      (<FormArray>this.searchFlight.get('Flights')).push(
        new FormGroup({
          departing: new FormControl(localForm.Flights[i].departing, [
            Validators.required,
          ]),
          landing: new FormControl(localForm.Flights[i].landing, [
            Validators.required,
          ]),
          departingD: new FormControl(localForm.Flights[i].departingD, [
            Validators.required,
          ]),
        })
      );
    }
  }
  /**
   * this function is responsible to get flights form array
   */
  public get flightsArray(): FormArray {
    return this.searchFlight?.get('Flights') as FormArray;
  }
  /**
   * this function is responsible to add flight at multi city
   * @return object of string error message (flightAlert)
   */
  addFlight() {
    let len = this.flightsArray.length;
    if (len > 4) {
      this.flightAlert.enMsg = "Maximum Flights Shouldn't be more than 4";
      this.flightAlert.arMsg = 'يجب ألا يزيد الحد الأقصى لعدد الرحلات عن 4';
      return this.flightAlert;
    } else {
      if (len > 0) {
        this.lastFlight = (<FormArray>this.searchFlight.get('Flights')).value[
          len - 1
        ]['landing'];
      }
      (<FormArray>this.searchFlight.get('Flights')).push(
        new FormGroup({
          departing: new FormControl(this.lastFlight, [Validators.required]),
          landing: new FormControl('', [Validators.required]),
          departingD: new FormControl('', [Validators.required]),
        })
      );
      console.log('FORMMMM', this.flightsArray.value);
      return this.flightAlert;
    }
  }
  /**
   * this function is responsible to remove flight from multi city
   * @return object of string error message (removeFlightAlert)
   */
  removeFlight(flightIndex: number) {
    let len = this.flightsArray.length;
    if (len > 0) {
      (<FormArray>this.searchFlight.get('Flights')).removeAt(flightIndex);
      return this.removeFlightAlert;
    } else {
      this.removeFlightAlert.enMsg = "You Don't have any flights to remove";
      this.removeFlightAlert.arMsg = 'ليس لديك أي رحلات لإزالتها';
      return this.removeFlightAlert;
    }
  }

  /**
   * this function is responsible to check maximum number of passenger
   */
  // maxValueReached(passengerForm: FormGroup): boolean  {
  //   if ( passengerForm.controls['adults'].value + passengerForm.controls['child'].value + passengerForm.controls['infent'].value > 9)
  //   {
  //     return  true ;
  //   }
  //   return  false ;
  // }

  /**
   * this function is responsible to get Total Number of passengers
   */
  getTotalPassengers(adult: number, child: number, infent: number) {
    return adult + child + infent;
  }

  /**
   * this function is responsible to change Value Of Adult passenger
   * @return object of string error message (passengerAlert)
   */
  changeAdultPassenger(num: number) {
    //get total number of passenger with new selected adult value
    let Total = this.getTotalPassengers(
      num,
      this.searchFlight?.get('passengers.child')?.value,
      this.searchFlight?.get('passengers.infent')?.value
    );
    if (num <= 9 && num != 0 && Total <= 9) {
      this.searchFlight?.get('passengers.adults')?.setValue(num);
      this.passengerAlert.arMsg = ' ';
      this.passengerAlert.enMsg = ' ';
      return this.passengerAlert;
    } else {
      this.passengerAlert.enMsg =
        'You Should Have at least 1 Adult Passenger and maximum number Of passenger Is 9';
      this.passengerAlert.arMsg =
        'يجب أن يكون لديك راكب بالغ واحد على الأقل وأن لا يزيد عدد الركاب عن 9';
      return this.passengerAlert;
    }
  }
  /**
   * this function is responsible to change Value Of child passenger
   * @return object of string error message (passengerAlert)
   */
  changeChildPassenger(num: number) {
    //get total number of passenger with new selected child value
    let Total = this.getTotalPassengers(
      this.searchFlight?.get('passengers.adults')?.value,
      num,
      this.searchFlight?.get('passengers.infent')?.value
    );
    if (num <= 9 && Total <= 9) {
      this.searchFlight?.get('passengers.child')?.setValue(num);
      this.passengerAlert.arMsg = ' ';
      this.passengerAlert.enMsg = ' ';
      return this.passengerAlert;
    } else {
      this.passengerAlert.enMsg = 'maximum number Of passenger Should Be 9';
      this.passengerAlert.arMsg = 'يجب أن يكون الحد الأقصى لعدد الركاب 9';
      return this.passengerAlert;
    }
  }
  /**
   * this function is responsible to change Value Of infent passenger
   * @return object of string error message (passengerAlert)
   */
  changeInfentPassenger(num: number) {
    let adultVal = this.searchFlight?.get('passengers.adults')?.value;
    //get total number of passenger with new selected infent value
    let Total = this.getTotalPassengers(
      adultVal,
      this.searchFlight?.get('passengers.child')?.value,
      num
    );
    if (num <= adultVal && Total <= 9) {
      this.searchFlight?.get('passengers.child')?.setValue(num);
      this.passengerAlert.arMsg = ' ';
      this.passengerAlert.enMsg = ' ';
      return this.passengerAlert;
    } else {
      this.passengerAlert.enMsg =
        'Infents number should be equal or less than Adults number and maximum number Of passenger Should Be 9';
      this.passengerAlert.arMsg =
        'يجب أن يكون عدد الأطفال الرضع مساوياً أو أقل من عدد البالغين والحد الأقصى لعدد الركاب يجب أن يكون 9';
      return this.passengerAlert;
    }
  }
  /**
   * this function is responsible to change Value Of Class Type
   * @params class value selected from list view
   */
  setClassValue(classVal: string) {
    this.searchFlight.controls['class'].setValue(classVal);
  }

  /**
   * this function is responsible to return current Date
   */
  todayDate() {
    let date = new Date();
    return date.toISOString().split("T")[0];
  }

  /**
   * this function is responsible to set the value of depart city after validate it
   * @params depart date should be format as 2023-08-01
   * @params flightIndex number for 
   */
  setDepCity(depDate: any, flightIndex:number){
    let date = new Date(depDate).toISOString().split("T")[0] //making date as 2023-08-01 format to check the condition
    if(date < this.todayDate()){
      (<FormArray>this.searchFlight?.get('Flights')).at(flightIndex).get("departingD")?.setValue(this.todayDate())
        this.dateAlert.enMsg ="You Shouldn't select a Previous Date";
        this.dateAlert.arMsg ='لا يجب عليك تحديد تاريخ سابق';
      return this.dateAlert;
    }
    else{
      (<FormArray>this.searchFlight?.get('Flights')).at(flightIndex).get("departingD")?.setValue(depDate)
      return this.dateAlert;
    }
  }

  onSubmit() {
    localStorage.setItem('form', JSON.stringify(this.searchFlight.value));
  }

  /**
   * this function is responsible to destory any opened subscription on this service
   */
  destroyer() {
    this.subscription.unsubscribe();
  }
}
