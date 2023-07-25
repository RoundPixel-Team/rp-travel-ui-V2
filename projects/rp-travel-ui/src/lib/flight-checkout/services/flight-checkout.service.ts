import { Injectable, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { FlightCheckoutApiService } from './flight-checkout-api.service';
import { selectedFlight } from '../interfaces';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FlightCheckoutService {
  api = inject(FlightCheckoutApiService)
  subscription : Subscription = new Subscription()


  /**
   * here is the loaded selected data 
   */
  selectedFlight : selectedFlight | undefined = undefined

  /**
   * loading state ..
   */
  loader : boolean = false

  /**
   * this is the main form for the checkout which contains all users array forms
   */
  usersForm = new FormGroup({
    users : new FormArray([])
  });

  /**
   * this is a getter to return the users array forms (users) from the main form (usersForm)
   */
  public get usersArray() : FormArray {
    return this.usersForm.get("users")as FormArray
  }

  /**
   * this is a getter to return the users array forms (users) from the main form (usersForm)
   */
  usersArrayFunc() : FormArray {
    return this.usersForm.get("users")as FormArray
  }

  constructor() { }



  /**
   * 
   * @param searchId 
   * @param sequenceNum 
   * @param providerKey 
   * this is for fetching the selected flight data and update selected flight state (selectedFlight:selectedFlight)
   * also update loader state
   */
  getSelectedFlightData(searchId:string,sequenceNum:number,providerKey:number){
    this.loader = true
    this.subscription.add(
      this.api.getSelectedFlight(searchId,sequenceNum,providerKey).subscribe((res:selectedFlight)=>{
        if(res){
          // updating the selected flight state
          this.selectedFlight = res
      
          // initilize users forms
          this.buildUsersForm(
            res.searchCriteria.adultNum,
            res.searchCriteria.childNum,
            res.searchCriteria.infantNum,
            res.passportDetailsRequired)

          // updating the loading state
          this.loader = false
        }
      },(err:any)=>{
        console.log('get selected flight error ->',err)
        this.loader = false
      })
    )
  }


  buildUsersForm(adults:number,childs:number,infants:number,passportFlag:boolean){
    // build form when passports details are required
    if(passportFlag){

      // build adults forms WITH paspport details
      for(var i = 0 ; i<adults ; i++){
        this.usersArray.push(
          new FormGroup({
            title: new FormControl("", [Validators.required]),
            firstName: new FormControl("", [
              Validators.required,
              Validators.pattern("^[a-zA-Z]+"),
              Validators.minLength(3),
            ]),
            middleName: new FormControl("", [
              Validators.pattern("^[a-zA-Z]+"),
              Validators.minLength(3),
            ]),
            lastName: new FormControl("", [
              Validators.required,
              Validators.pattern("^[a-zA-Z]+"),
              Validators.minLength(3),
            ]),
            email: new FormControl("", [
              Validators.required,
              Validators.email,
              Validators.minLength(9),
            ]),
            phonenum: new FormControl("", [
              Validators.required,
              Validators.maxLength(5),
            ]),
            national: new FormControl("", [
              Validators.required,
              Validators.minLength(3),
            ]),
            dateOfBirth: new FormControl("", [Validators.required]),
            type: new FormControl("ADT"),
            countryofresident: new FormControl("", [Validators.required]),
            passportnumber: new FormControl("", [Validators.required]),
            expdate: new FormControl("", [Validators.required]),
            issuedcountry: new FormControl("", [Validators.required]),
            position: new FormControl(this.usersArray.length + 1)
          })
        )
      }

      // build childs forms WITH paspport details
      for(var i = 0 ; i<childs ; i++){
          this.usersArray.push(
            new FormGroup({
              title: new FormControl("", [Validators.required]),
              firstName: new FormControl("", [
                Validators.required,
                Validators.pattern("^[a-zA-Z -']+"),
                Validators.minLength(3),
              ]),
              middleName: new FormControl("", [
                Validators.pattern("^[a-zA-Z]+"),
                Validators.minLength(3),
              ]),
              lastName: new FormControl("", [
                Validators.required,
                Validators.pattern("^[a-zA-Z -']+"),
                Validators.minLength(3),
              ]),
              passportnum: new FormControl("", [Validators.max(16)]),
              dateOfBirth: new FormControl("", [Validators.required]),
              national: new FormControl("", [Validators.required]),
              type: new FormControl("CNN"),
              phonenum: new FormControl(""),
              countryofresident: new FormControl("", [Validators.required]),
              passportnumber: new FormControl("", [Validators.required]),
              expdate: new FormControl("", [Validators.required]),
              issuedcountry: new FormControl("", [Validators.required]),
              position: new FormControl(this.usersArray.length)
            })
          )
      }

      // build infants forms WITH paspport details
      for(var i = 0 ; i<infants ; i++){
        this.usersArray.push(
          new FormGroup({
            title: new FormControl("", [Validators.required]),
            firstName: new FormControl("", [
              Validators.required,
              Validators.pattern("^[a-zA-Z -']+"),
              Validators.minLength(3),
            ]),
            middleName: new FormControl("", [
              // Validators.required,
              Validators.pattern("^[a-zA-Z]+"),
              Validators.minLength(3),
            ]),
            lastName: new FormControl("", [
              Validators.required,
              Validators.pattern("^[a-zA-Z -']+"),
              Validators.minLength(3),              
            ]),
            passportnum: new FormControl("", [Validators.maxLength(12)]),
            dateOfBirth: new FormControl("", [Validators.required]),
            national: new FormControl("", [Validators.required]),
            type: new FormControl("INF"),
            phonenum: new FormControl(""),
            countryofresident: new FormControl("", [Validators.required]),
            passportnumber: new FormControl("", [Validators.required]),
            expdate: new FormControl("", [Validators.required]),
            issuedcountry: new FormControl("", [Validators.required]),
            position: new FormControl(this.usersArray.length)
          })
        )
      }
    }

    // build form when passports details are NOT required
    else{
      // build adults forms WITHOUT paspport details
      for(var i = 0 ; i<adults ; i++){
        this.usersArray.push(
          new FormGroup({
            title: new FormControl("", [Validators.required]),
            firstName: new FormControl("", [
              Validators.required,
              Validators.pattern("^[a-zA-Z]+"),
              Validators.minLength(3),
            ]),
            middleName: new FormControl("", [
              Validators.pattern("^[a-zA-Z]+"),
              Validators.minLength(3),
            ]),
            lastName: new FormControl("", [
              Validators.required,
              Validators.pattern("^[a-zA-Z]+"),
              Validators.minLength(3),
            ]),
            email: new FormControl("", [
              Validators.required,
              Validators.email,
              Validators.minLength(9),
            ]),
            phonenum: new FormControl("", [
              Validators.required,
              Validators.maxLength(5),
            ]),
            national: new FormControl("", [
              Validators.required,
              Validators.minLength(3),
            ]),
            dateOfBirth: new FormControl("", [Validators.required]),
            type: new FormControl("ADT"),
            countryofresident: new FormControl("", [Validators.required]),
            passportnumber: new FormControl(""),
            expdate: new FormControl(""),
            issuedcountry: new FormControl(""),
            position: new FormControl(this.usersArray.length + 1)
          })
        )
      }

      // build childs forms WITHOUT paspport details
      for(var i = 0 ; i<childs ; i++){
        this.usersArray.push(
          new FormGroup({
            title: new FormControl("", [Validators.required]),
            firstName: new FormControl("", [
              Validators.required,
              Validators.pattern("^[a-zA-Z -']+"),
              Validators.minLength(3),
            ]),
            middleName: new FormControl("", [
              Validators.pattern("^[a-zA-Z]+"),
              Validators.minLength(3),
            ]),
            lastName: new FormControl("", [
              Validators.required,
              Validators.pattern("^[a-zA-Z -']+"),
              Validators.minLength(3),
            ]),
            passportnum: new FormControl("", [Validators.max(16)]),
            dateOfBirth: new FormControl("", [Validators.required]),
            national: new FormControl("", [Validators.required]),
            type: new FormControl("CNN"),
            phonenum: new FormControl(""),
            countryofresident: new FormControl(""),
            passportnumber: new FormControl(""),
            expdate: new FormControl(""),
            issuedcountry: new FormControl(""),
            position: new FormControl(this.usersArray.length)
          })
        )
    }

    // build infants forms WITHOUT paspport details
    for(var i = 0 ; i<infants ; i++){
      this.usersArray.push(
        new FormGroup({
          title: new FormControl("", [Validators.required]),
          firstName: new FormControl("", [
            Validators.required,
            Validators.pattern("^[a-zA-Z -']+"),
            Validators.minLength(3),
          ]),
          middleName: new FormControl("", [
            // Validators.required,
            Validators.pattern("^[a-zA-Z]+"),
            Validators.minLength(3),
          ]),
          lastName: new FormControl("", [
            Validators.required,
            Validators.pattern("^[a-zA-Z -']+"),
            Validators.minLength(3),              
          ]),
          passportnum: new FormControl("", [Validators.maxLength(12)]),
          dateOfBirth: new FormControl("", [Validators.required]),
          national: new FormControl("", [Validators.required]),
          type: new FormControl("INF"),
          phonenum: new FormControl(""),
          countryofresident: new FormControl(""),
          passportnumber: new FormControl(""),
          expdate: new FormControl(""),
          issuedcountry: new FormControl(""),
          position: new FormControl(this.usersArray.length)
        })
      )
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
