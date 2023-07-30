import { Inject, Injectable, inject } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { searchBoxModel } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class FlightSearchService {
  subscription: Subscription = new Subscription();

  //#region Variablses
  searchFlight: FormGroup = new FormGroup({
    flightType: new FormControl('', [Validators.required]),
    Direct: new FormControl(false, [Validators.required]),
    Flights: new FormArray([], [Validators.required]),
    returnDate: new FormControl(''),
    passengers: new FormGroup(
      {
        adults: new FormControl(1, [Validators.required, Validators.min(1)]),
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
  localForm?: searchBoxModel | undefined; //used to get previous searchbox data from local storage
  flightType?: string;
  searchForm?: searchBoxModel;
  //#endregion

  constructor() {}
  /**
   * this function is responsible to fill the searchbox form from local storage if it has a previous data
   */

  initSearchForm() {
    this.localForm = JSON.parse(localStorage.getItem('form') as string);
    this.flightType = this.localForm?.flightType;
    if (localStorage.getItem('form')) {
      //get the flight type based
      if (this.flightType == 'OneWay' || 'oneway') {
        this.oneWayData(this.localForm);
      } else if (this.flightType == 'RoundTrip' || 'roundTrip') {
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
      (<FormArray>this.searchFlight.get('Flights')).push(
        new FormGroup({
          departing: new FormControl('', [Validators.required]),
          landing: new FormControl('', [Validators.required]),
          departingD: new FormControl('', [Validators.required]),
        })
      );
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
          adults: new FormControl(localForm['passengers']['adult'], [
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
          adults: new FormControl(localForm['passengers']['adult'], [
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
  }
  /**
   * this function is responsible to fill the Multi City searchbox data from data storage
   */
  multiData(localForm: any) {
    console.log('MULTI TRIP DATA');
    this.searchFlight = new FormGroup({
      flightType: new FormControl(localForm['flightType'], [
        Validators.required,
      ]),
      Direct: new FormControl(localForm['Direct'], [Validators.required]),
      Flights: new FormArray([], [Validators.required]),
      returnDate: new FormControl(''),
      passengers: new FormGroup(
        {
          adults: new FormControl(localForm['passengers']['adult'], [
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
