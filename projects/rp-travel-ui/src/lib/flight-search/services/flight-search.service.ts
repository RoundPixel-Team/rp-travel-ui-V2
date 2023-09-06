import { Inject, Injectable, inject } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import {
  searchBoxFlights,
  searchBoxModel,
  searchBoxPassengers,
  searchFlightModel,
} from '../interfaces';
import { AlertMsgModel } from '../../shared/interfaces';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class FlightSearchService {
  subscription: Subscription = new Subscription();

  //#region Variablses
  searchFlight: FormGroup = new FormGroup({});
  localForm?: searchBoxModel | undefined; //used to get previous searchbox data from local storage
  flightType?: string; //used to save value of flight type from paramter of initSearchForm function
  passengers?: searchBoxPassengers;
  lastFlight?: searchBoxFlights;
  resultLink?: searchFlightModel;
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
  retDateAlert: AlertMsgModel = {
    arMsg: '',
    enMsg: '',
  };
  //#endregion

  constructor(private datePipe: DatePipe) {}
  /**
   * this function is responsible to fill the searchbox form from local storage if it has a previous data
   */
  initSearchForm(form:searchBoxModel) {
    if (form) {
      this.flightType = form.flightType;
      //get the flight type based
      if (this.flightType == 'OneWay' || this.flightType == 'oneway' || this.flightType == 'oneWay') {
        this.oneWayData(form);
      }
       else if (
        this.flightType == 'RoundTrip' ||
        this.flightType == 'roundTrip' ||
        this.flightType == 'roundtrip'
      ) {
        this.roundTripData(form);
      }
      else if(this.flightType == 'MultiCity' ||
      this.flightType == 'multiCity' ||
      this.flightType == 'multicity') {
        this.multiData(form);
      }
    }
    //no values on local storage 
    else {
      this.searchFlight = new FormGroup({
        flightType: new FormControl('RoundTrip', [Validators.required]),
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
            infant: new FormControl(0, [
              Validators.required,
              Validators.max(4),
              Validators.min(0),
            ]),
          },
          []
        ),
        class: new FormControl('Economy', [Validators.required]),
      });
      //Intialize Empty Flight
      (<FormArray>this.searchFlight.get('Flights')).push(
        new FormGroup({
          departing: new FormControl('', [
            Validators.required,
          ]),
          landing: new FormControl('', [
            Validators.required,
          ]),
          departingD: new FormControl('', [
            Validators.required,
          ]),
        })
      );
    }
  }
  /**
   * this function is responsible to fill the oneway searchbox data from data storage
   */
  oneWayData(localForm: searchBoxModel) {
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
          infant: new FormControl(localForm['passengers']['infant'], [
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
          infant: new FormControl(localForm['passengers']['infant'], [
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
    //change between depart and land cities and pushing it to flights array
    (<FormArray>this.searchFlight.get('Flights')).push(
      new FormGroup({
        departing: new FormControl(localForm.Flights[0].landing, [
          Validators.required,
        ]),
        landing: new FormControl(localForm.Flights[0].departing, [
          Validators.required,
        ]),
        departingD: new FormControl(localForm.returnDate,[
          Validators.required,
        ]),
      })
    );
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
          infant: new FormControl(localForm['passengers']['infant'], [
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
   * this function is responsible to update the flight Type
   * @param flightType (oneWay or roundTrip or multiCity)
   */
  changeFlightType(flightType: string) {
    this.searchFlight.controls['flightType'].setValue(flightType);
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
    if (len >= 4) {
      this.flightAlert.enMsg = "Maximum Flights Shouldn't be more than 4";
      this.flightAlert.arMsg = 'يجب ألا يزيد الحد الأقصى لعدد الرحلات عن 4';
      return this.flightAlert;
    } else {
      if (len > 1) {
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
      return this.flightAlert;
    }
  }
  /**
   * this function is responsible to remove flight from multi city
   * @return object of string error message (removeFlightAlert)
   */
  removeFlight() {
    let len = this.flightsArray.length;
    if (len > 1) {
      (<FormArray>this.searchFlight.get('Flights')).removeAt(len-1);
      return this.removeFlightAlert;
    } else {
      this.removeFlightAlert.enMsg = "You Don't have any flights to remove";
      this.removeFlightAlert.arMsg = 'ليس لديك أي رحلات لإزالتها';
      return this.removeFlightAlert;
    }
  }
  /**
   * this function is responsible to get Total Number of passengers
   * @return object of string error message (passengerAlert)
   * if message is empty then the validation is true
   */
  getTotalPassengers(adult: number, child: number, infant: number) {
    return adult + child + infant;
  }
  /**
   * this function is responsible to change Value Of Adult passenger
   * @return object of string error message (passengerAlert)
   */
  changeAdultPassenger(num: number) {
    this.passengerAlert.arMsg = '';
    this.passengerAlert.enMsg = '';
    //get total number of passenger with new selected adult value
    let Total = this.getTotalPassengers(
      num,
      this.searchFlight?.get('passengers.child')?.value,
      this.searchFlight?.get('passengers.infant')?.value
    );
    if (num <= 9 && num != 0 && Total <= 9) {
      this.searchFlight?.get('passengers.adults')?.setValue(num);
      this.passengerAlert.arMsg = '';
      this.passengerAlert.enMsg = '';
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
   * if message is empty then the validation is true
   */
  changeChildPassenger(num: number) {
    this.passengerAlert.arMsg = '';
      this.passengerAlert.enMsg = '';
    //get total number of passenger with new selected child value
    let Total = this.getTotalPassengers(
      this.searchFlight?.get('passengers.adults')?.value,
      num,
      this.searchFlight?.get('passengers.infant')?.value
    );
    if (num <= 9 && Total <= 9) {
      this.searchFlight?.get('passengers.child')?.setValue(num);
      this.passengerAlert.arMsg = '';
      this.passengerAlert.enMsg = '';
      return this.passengerAlert;
    } else {
      this.passengerAlert.enMsg = 'maximum number Of passenger Should Be 9';
      this.passengerAlert.arMsg = 'يجب أن يكون الحد الأقصى لعدد الركاب 9';
      return this.passengerAlert;
    }
  }
  /**
   * this function is responsible to change Value Of infant passenger
   * @return object of string error message (passengerAlert)
   * if message is empty then the validation is true
   */
  changeinfantPassenger(num: number) {
    this.passengerAlert.arMsg = '';
      this.passengerAlert.enMsg = '';
    let adultVal = this.searchFlight?.get('passengers.adults')?.value;
    //get total number of passenger with new selected infant value
    let Total = this.getTotalPassengers(
      adultVal,
      this.searchFlight?.get('passengers.child')?.value,
      num
    );
    if (num <= adultVal && Total <= 9) {
      this.searchFlight?.get('passengers.child')?.setValue(num);
      this.passengerAlert.arMsg = '';
      this.passengerAlert.enMsg = '';
      return this.passengerAlert;
    } else {
      this.passengerAlert.enMsg =
        'infants number should be equal or less than Adults number and maximum number Of passenger Should Be 9';
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
   * this function is responsible to exchange between destinations
   * @params item which i want to exchange (from Type searchBoxFlights)
   */
  switchDestination(item : any) {
    let destination1 = item.get("landing")?.value;
    let destination2 = item.get("departing")?.value;
    item.get("departing")?.setValue(destination1);
    item.get("landing")?.setValue(destination2);
    item.updateValueAndValidity();
  }
  /**
   * this function is responsible to return current Date
   */
  todayDate() {
    let date = new Date();
    return date.toISOString().split('T')[0];
  }
  /**
   * this function is responsible to set the value of depart Date after validate it
   * @params depart date should be format as 2023-08-01
   * @params flightIndex number for
   * @retuen object with empty message if validation is true or object with error messages
   */
  setDepDate(depDate: string, flightIndex: number) {
    let date = new Date(depDate).toISOString().split('T')[0]; //making date as 2023-08-01 format to check the condition
    this.dateAlert.enMsg = '';
    this.dateAlert.arMsg = '';
    //check if date is previous than today or not
    if (date < this.todayDate()) {
      (<FormArray>this.searchFlight?.get('Flights'))
        .at(flightIndex)
        .get('departingD')
        ?.setValue(this.todayDate());
      this.dateAlert.enMsg = "You Shouldn't select a Previous Date";
      this.dateAlert.arMsg = 'لا يجب عليك تحديد تاريخ سابق';
    } else {
      //check if the return date equal to depart (when the user enters the return date first)
      if (this.searchFlight.controls['returnDate'].value == date) {
        this.dateAlert.enMsg =
          'This Date Is Similar to Return date, You Should Select Another one';
        this.dateAlert.arMsg =
          'هذا التاريخ مشابه لتاريخ العودة ، يجب عليك تحديد تاريخ آخر';
        (<FormArray>this.searchFlight?.get('Flights'))
          .at(flightIndex)
          .get('departingD')
          ?.setValue(this.todayDate());
      } else {
        (<FormArray>this.searchFlight?.get('Flights'))
          .at(flightIndex)
          .get('departingD')
          ?.setValue(depDate);
      }
    }
    return this.dateAlert;
  }
  /**
   * this function is responsible to set the value of Return Date after validate it
   * @params Return date should be format as 2023-08-01
   * @retuen object with empty message if validation is true or object with error messages
   */
  setRetDate(retDate: string) {
    this.retDateAlert.enMsg = '';
    this.retDateAlert.arMsg = '';
    if (retDate) {
      let date = new Date(retDate).toISOString().split('T')[0]; //making date as 2023-08-01 format to check the condition
      let depDate = (<FormArray>this.searchFlight?.get('Flights'))
        .at(0)
        ?.get('departingD')?.value;
      //check if date is previous than today
      if (date <= this.todayDate()) {
        this.retDateAlert.enMsg = 'You Should select a date after this day';
        this.retDateAlert.arMsg = 'يجب عليك تحديد تاريخ بعد هذا اليوم';
      }
      //check of date is is previous than depart date
      else if (date < depDate) {
        this.retDateAlert.enMsg =
          'You Should Select a date After your Depart Date';
        this.retDateAlert.arMsg =
          'يجب عليك تحديد تاريخ بعد تاريخ المغادرة الخاص بك';
      }
      //if all validation is true then go to else condition
      else {
        this.searchFlight.controls['returnDate'].setValue(date);
      }
    } else {
      this.retDateAlert.enMsg = 'You Should Select a return Date';
      this.retDateAlert.arMsg = 'يجب عليك تحديد تاريخ العودة';
    }
    return this.retDateAlert;
    
  }
  /**
   * this function is responsible to set the second flight of flights array if the flight type is roundtrip
   */
  setRetFlight() {
    if(this.flightsArray.length == 1)
    (<FormArray>this.searchFlight.get('Flights')).push(
      new FormGroup({
        departing: new FormControl(this.flightsArray.at(0).get('landing')?.value, [
          Validators.required,
        ]),
        landing: new FormControl(this.flightsArray.at(0).get('departing')?.value, [
          Validators.required,
        ]),
        departingD: new FormControl(this.searchFlight.get('returnDate')?.value),
      })
    );
  }
  /**
   * this function is responsible to generate Search Id
   */
  id() {
    let date = new Date();
    let myId =
      date.getFullYear() +
      'B' +
      date.getUTCMonth() +
      'I' +
      date.getUTCDay() +
      'S' +
      date.getMilliseconds() +
      'H' +
      Math.floor(Math.random() * (9 - 0 + 1)) +
      0 +
      'B' +
      Math.floor(Math.random() * (9 - 0 + 1)) +
      0 +
      'I' +
      Math.floor(Math.random() * (9 - 0 + 1)) +
      0 +
      'S' +
      Math.floor(Math.random() * (9 - 0 + 1)) +
      0 +
      'H' +
      Math.floor(Math.random() * (9 - 0 + 1)) +
      0 +
      'I' +
      Math.floor(Math.random() * (9 - 0 + 1)) +
      0;
    return myId;
  }
  /**
   * this function is responsible to split the airport code from Depart Or Land input
   * @params spiltIndex with index hav the airport code (0 or 1)
   * @params splitPattern pattern used to split the airport string and get separate code alone
   * @params airport whicj selected from depart or land airports Input
   * @retuen airport code
   */
  getAirportCode(spiltIndex: number, splitPattern: string, airport: string) {
    let airportCode = airport.split(splitPattern)[spiltIndex];
    return airportCode;
  }
  /**
   * match Flights form array values with FlightInfoModule
   */
  getFlightInfo(spiltIndex: number, splitPattern: string) {
    let flightout: searchBoxFlights[] = [];
    //if flight type is round trip return array of two flights with depart city, land city and depart date
    if (this.searchFlight.get('flightType')?.value == 'RoundTrip') {
      const roundElement1 = (<FormArray>this.searchFlight.get('Flights'))
        .controls[0]; //first flight of RoundTrip
      var depart = this.getAirportCode(
        spiltIndex,
        splitPattern,
        roundElement1.value['departing']
      );
      var landing = this.getAirportCode(
        spiltIndex,
        splitPattern,
        roundElement1.value['landing']
      );
      let depFlight: searchBoxFlights = {
        departing: depart,
        landing: landing,
        departingD: this.datePipe.transform(
          roundElement1.value['departingD'],
          'MMMM dd, y'
        ),
      };
      flightout.push(depFlight);

      //switch depart and land airport codes for the second flight and push it on flightout array
      let landFlight: searchBoxFlights = {
        departing: landing,
        landing: depart,
        departingD: this.datePipe.transform(
          this.searchFlight.controls['returnDate'].value,
          'MMMM dd, y'
        ),
      };
      flightout.push(landFlight);
      return flightout;
    }
    //if flight type is oneWay Or Multi then loop on flights array length and push all the flights into flightout
    for (
      let index = 0;
      index < (<FormArray>this.searchFlight.get('Flights')).length;
      index++
    ) {
      const element = (<FormArray>this.searchFlight.get('Flights')).controls[
        index
      ];
      let flight: searchBoxFlights = {
        departing: this.getAirportCode(
          spiltIndex,
          splitPattern,
          element.value['departing']
        ),
        landing: this.getAirportCode(
          spiltIndex,
          splitPattern,
          element.value['landing']
        ),
        departingD: this.datePipe.transform(
          element.value['departingD'],
          'MMMM dd, y'
        ),
      };
      flightout.push(flight);
    }
    return flightout;
  }
  /**
   * this function is responsible to return string of flights in KWI-CAI-March%2015%202019_ format
   */
  flightInfoFormatter(array: searchBoxFlights[]) {
    let FlightsInfoArray: string = '';
    for (let element of array) {
      let fligt: string =
        element.departing +
        '-' +
        element.landing +
        '-' +
        element.departingD +
        '_';
      FlightsInfoArray = FlightsInfoArray + fligt;
    }
    return FlightsInfoArray.slice(0, -1);
  }
  /**
   * this function is responsible to convert array of passanger type number to A-1-C-0-I-0
   * @params passenger object with total numbers of adults,child and infants
   * @example 'en/KWD/EG/RoundTrip/KWI-CAI-August%2019,%202023_CAI-KWI-August%2031,%202023/2023B7I0S617H00B50I90S10H20I30/A-1-C-0-I-0/Economy/false'
   */
  passengerFormatter(passengerObj: searchBoxPassengers) {
    let passengersString: string;
    passengersString =
      'A-' +
      passengerObj.adults +
      '-C-' +
      passengerObj.child +
      '-I-' +
      passengerObj.infant;
    return passengersString;
  }
  /**
   * this function is responsible to return link to use it to navigate to search results with all data of search box
   */
  getSearchresultLink(
    lang: string,
    currency: string,
    pointOfSale: string,
    spiltIndex: number,
    splitPattern: string
  ) {
    let flightList = this.getFlightInfo(spiltIndex, splitPattern);
    let searchApi: searchFlightModel = {
      lan: lang,
      currency: currency,
      pointOfReservation: pointOfSale,
      flightType: this.searchFlight.get('flightType')?.value,
      flightsInfo: this.flightInfoFormatter(flightList),
      passengers: this.passengerFormatter(
        this.searchFlight.get('passengers')?.value
      ),
      Cclass: this.searchFlight.get('class')?.value,
      serachId: this.id(),
      showDirect: this.searchFlight.get('Direct')?.value,
      preferredAirLine: 'all',
    };
    this.resultLink = searchApi;
    return `${searchApi.lan}/${searchApi.currency}/${searchApi.pointOfReservation}/${searchApi.flightType}/${searchApi.flightsInfo}/${searchApi.serachId}/${searchApi.passengers}/${searchApi.Cclass}/${searchApi.showDirect}`;
  }
  onSubmit(lang: string,currency: string,pointOfSale: string,spiltIndex: number,splitPattern: string) {
    if (!this.searchFlight.value) {
      this.searchFlight.markAllAsTouched(); //used this function to make a red border around invalid inputs
      return '';
    } else {
      //call all functions validation for all passengers type and flight dates
      let adult = this.changeAdultPassenger(this.searchFlight?.get('passengers.adult')?.value);
      let child = this.changeChildPassenger(this.searchFlight?.get('passengers.child')?.value);
      let infant = this.changeinfantPassenger( this.searchFlight?.get('passengers.infant')?.value);
      var retDate: AlertMsgModel = { arMsg: '', enMsg: '' };
      let depDate = this.setDepDate((<FormArray>this.searchFlight?.get('Flights')).at(0)?.get('departingD')?.value,0);

      if(this.searchFlight.controls['flightType']?.value == 'roundtrip' || this.searchFlight.controls['flightType']?.value == 'RoundTrip' || this.searchFlight.controls['flightType']?.value == 'roundTrip') {
        //set return date value
        retDate = this.setRetDate(this.searchFlight.controls['returnDate'].value);
        //change between depart and land cities and pushing it to flights array
        this.setRetFlight();
      }
      else if(this.searchFlight.controls['flightType']?.value == 'oneway' || this.searchFlight.controls['flightType']?.value == 'OneWay' || this.searchFlight.controls['flightType']?.value == 'oneWay'){
        if(this.flightsArray.length>1){
          this.removeFlight();
        }
      }

      //If All Validations and conditions are true then save the form at local storage and go to search Results
      if (!adult.enMsg &&!child.enMsg &&!infant.enMsg &&!depDate.enMsg && !retDate?.enMsg) {
        return this.getSearchresultLink(lang,currency,pointOfSale,spiltIndex,splitPattern);
      } else {
        return { adult, child, infant, retDate, depDate };
      }
      
    }
  }

  /**
   * this function is responsible to destory any opened subscription on this service
   */
  destroyer() {
    this.subscription.unsubscribe();
  }
}
