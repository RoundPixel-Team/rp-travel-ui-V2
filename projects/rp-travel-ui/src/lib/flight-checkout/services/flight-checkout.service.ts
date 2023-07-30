import { Injectable, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { FlightCheckoutApiService } from './flight-checkout-api.service';
import { BreakDownView, Cobon, flightOfflineService, selectedFlight } from '../interfaces';
import { FormArray, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { passengerFareBreakDownDTOs,fare } from '../../flight-result/interfaces';

type fareCalc = (fare:fare[])=>number;
type calcEqfare =(flightFaresDTO: passengerFareBreakDownDTOs[],type:string,farecalc:fareCalc)=>number;

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
   * here is all the loaded offline services
   */
  allOfflineServices : flightOfflineService[] = []
  
  /**
   * here is the chosen/selected offline service 
   */
  selectedOfflineServices : string[] = []


  /**
   * offline services loading state ..
   */
  offlineServicesLoader : boolean = false


  /**
   * loading state ..
   */
  loader : boolean = false


  /**
   * applying copoun code loading state ..
   */
  copounCodeLoader : boolean = false

  /**
   * this contains all the applied copon code details
   */
  copounCodeDetails : Cobon | undefined


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
   * passengers fare disscount varriables
   */
  fareDisscount : [number,string,string] = [0,'',''];

  /**
   * passengers fare breakup values
   */
  fareBreackup : BreakDownView | undefined


  

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
            this.fetchLastPassengerData()

            // assign values to fare breakup and fare disscount
            this.calculateFareBreakupDisscount()
            this.calculatePassengersFareBreakupValue()

          // updating the loading state
          this.loader = false
        }
      },(err:any)=>{
        console.log('get selected flight error ->',err)
        this.loader = false
      })
    )
  }

  /**
   * 
   * @param searchId 
   * @param pos 
   * this is for fetching the flight offline services data and update offline service state (offlineServices:flightOfflineServices[])
   * also update offlineServicesLoader state
   */
  getAllOfflineServices(searchId:string,pos:string){
    this.offlineServicesLoader = true
    this.subscription.add(
      this.api.offlineServices(searchId,pos).subscribe((res)=>{
        this.allOfflineServices = res
        this.offlineServicesLoader = false
      },(err)=>{
        console.log('get selected flight offline services error ->',err)
        this.offlineServicesLoader = false
      })
    )
  }


  /**
   * 
   * @param adults 
   * @param childs 
   * @param infants 
   * @param passportFlag
   * this function is responsible for creating/building the checkout forms for each passenger according to number
   * of adults and childs and infants and updates the state of the form [usersForm]
   * it also build these forms depending on the paspport flag either required or not
   * if is been called automatically once the selected flight state is containg data 
   */
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
   * 
   * @param service 
   * this for adding a new offline service with the selected flight
   * also adding offline service cost to the whole price
   */
  addOfflineService(service : flightOfflineService){
    this.selectedOfflineServices.push(service.serviceCode)
    if(this.selectedFlight != undefined){
      this.selectedFlight.airItineraryDTO.itinTotalFare.amount += service.servicePrice
    }
  }

  /**
   * 
   * @param service 
   * this is to remove an already selected offline service with the selected flight
   * also removing offline service from the whole price
   */
  removeOfflineService(service : flightOfflineService){
    this.selectedOfflineServices = this.selectedOfflineServices.filter((s)=>{return s != service.serviceCode})
    if(this.selectedFlight != undefined){
      this.selectedFlight.airItineraryDTO.itinTotalFare.amount -= service.servicePrice
    }
  }


  /**
   * 
   * @param copounCode 
   * @param searchId 
   * @param sequenceNum 
   * @param providerKey
   * check if the entered copoun code is valid and apply the disscount amount on the flight price
   * it updates the state of [copounCodeLoader : boolean]
   * it also updates the state of [copounCodeDetails:Copon]
   */
  applyCopounCode(copounCode:string,searchId:string,sequenceNum:number,providerKey:string){
    this.copounCodeLoader = true
    this.subscription.add(
      this.api.activateCobon(copounCode,searchId,sequenceNum,providerKey).subscribe((res)=>{
        if(res){
          // apply disscount on the selected flight price amount
          if(this.selectedFlight){
            this.copounCodeDetails = res
            this.selectedFlight.airItineraryDTO.itinTotalFare.amount -= res.promotionDetails.discountAmount
          }
          this.copounCodeLoader = false
        }
      },(err)=>{
        console.log("apply copoun code ERROR",err)
        this.copounCodeLoader = false
      })
    )
  }


  /**
   * this is responsible for assigning last passengers form value before last payment
   * it depends on local storage key called (lastPassengers) which contains data for array of passengers
   */
  fetchLastPassengerData(){
     if(localStorage.getItem('lastPassengers')){
      this.usersArray.setValue(JSON.parse(localStorage.getItem('lastPassengers')!))
     }
  }


  validatePassengersForm():string{
    let error : string = ''
    for(var i = 0 ; i < this.usersArray.length ; i++){
      if(i == 0 && this.usersArray.at(i).get('email')?.errors != null){
        error = 'mainFormError'
        return 'mainFormError'
      }
      else if(this.usersArray.at(i).invalid){
        error = 'passengersForm'
        return 'passengersForm'
      }
      else {
        error = 'Valid'
        return 'Valid'
      }
    }

    return error
  }

  saveBooking(){
    console.log("show me my form",this.validatePassengersForm())
    
  }


  //-----------------------> Starting Building Fare breakup Functionalities

  /**
   * this function is responsiple for getting disscount from passengers fare breakup
   * it also updates the disscount state fareDisscount : [number,string,string]
   */
  calculateFareBreakupDisscount(){
    if(this.selectedFlight?.airItineraryDTO.passengerFareBreakDownDTOs){
      this.fareDisscount = this.returnPassTotalFarDifferance(
        this.selectedFlight.airItineraryDTO.passengerFareBreakDownDTOs,
        this.selectedFlight.airItineraryDTO.itinTotalFare.amount,
        this.selectedFlight.airItineraryDTO.itinTotalFare.totalTaxes,
        this.selectedFlight.airItineraryDTO.itinTotalFare.currencyCode,
        this.calcEqfare,this.returnCorrectFare
        );
    }
  }



  /**
   * 
   * @param flightFaresDTO 
   * @param totalAmount 
   * @param totalTax 
   * @param curruncy 
   * @param calcEqfare 
   * @param fareCalc 
   * @returns value of discount or service fees
   */
  returnPassTotalFarDifferance(flightFaresDTO: passengerFareBreakDownDTOs[], totalAmount: number,totalTax:number,curruncy:string,calcEqfare:calcEqfare,fareCalc:fareCalc): [number, string, string] {
    let AdtFares = calcEqfare(flightFaresDTO,'ADT',fareCalc);
    let childFare = calcEqfare(flightFaresDTO,'CNN',fareCalc);
    let infentFare = calcEqfare(flightFaresDTO,'INF',fareCalc);
    let TotalFare = AdtFares + childFare + infentFare + totalTax;
    let fareDiff = totalAmount - TotalFare;
     if (fareDiff > 0) {
       return [Math.round(fareDiff), 'Service Fees',curruncy]
     } else if (fareDiff < 0) {
       return [Math.round(-1 * fareDiff), 'Discount',curruncy]
     } else {
       return [0 , '','KWD'];
     }
 
   }


   /**
   * 
   * @param flightFaresDTO 
   * @param type 
   * @param farecalc 
   * @returns numer of passenger * fare of passenger
   */
   calcEqfare(flightFaresDTO: passengerFareBreakDownDTOs[],type:string,farecalc:fareCalc):number{
    let fare = farecalc(flightFaresDTO.filter((v)=>v.passengerType === type)[0]?.flightFaresDTOs);
    let quntity = flightFaresDTO.find((v)=>v.passengerType === type)?.passengerQuantity;
    return  fare && quntity ? fare * quntity : 0;
   }

   /**
   * 
   * @param fare 
   * @returns validate equivelent fare
   */

   returnCorrectFare(fare:fare[]):number{
    if(fare){
     let equivfare = fare.find(v=>v.fareType.toLowerCase() === 'equivfare')?.fareAmount;
     let totalFare = fare.find(v=>v.fareType.toLowerCase() === 'totalfare')?.fareAmount;
     let totalTax  = fare.find(v=>v.fareType.toLowerCase() === 'totaltax')?.fareAmount;
     if(equivfare && totalFare && totalTax){
      return equivfare > 0 ? equivfare : totalFare - totalTax;
     }
     else{
      return 0
     }
     
    } else{
      return 0
    }
    
  }

  /**
   * 
   */
  calculatePassengersFareBreakupValue(){
      let AdtFares  = this.selectedFlight?.airItineraryDTO.passengerFareBreakDownDTOs?.find(v=>v.passengerType ==='ADT');
      let ChildFare = this.selectedFlight?.airItineraryDTO.passengerFareBreakDownDTOs?.find(v=>v.passengerType ==='CNN');
      let infFare   = this.selectedFlight?.airItineraryDTO.passengerFareBreakDownDTOs?.find(v=>v.passengerType ==='INF');
      this.fareBreackup = {
        ADT:{
          totalFare:AdtFares?this.returnPassTotalFar(AdtFares.flightFaresDTOs,AdtFares.passengerQuantity,this.returnCorrectFare):[NaN,'KWD'],
          ScFare:AdtFares?this.returnPassFareScatterd(AdtFares.flightFaresDTOs,AdtFares.passengerQuantity,this.returnCorrectFare):[NaN,'KWD',NaN]
        },
        CNN:{
          totalFare:ChildFare?this.returnPassTotalFar(ChildFare.flightFaresDTOs,ChildFare.passengerQuantity,this.returnCorrectFare):[NaN,'KWD'],
          ScFare:ChildFare?this.returnPassFareScatterd(ChildFare.flightFaresDTOs,ChildFare.passengerQuantity,this.returnCorrectFare):[NaN,'KWD',NaN]
        },
        INF:{
          totalFare:infFare?this.returnPassTotalFar(infFare.flightFaresDTOs,infFare.passengerQuantity,this.returnCorrectFare):[NaN,'KWD'],
          ScFare:infFare?this.returnPassFareScatterd(infFare.flightFaresDTOs,infFare.passengerQuantity,this.returnCorrectFare):[NaN,'KWD',NaN]
        }
      }
    
  }

  /**
   * 
   * @param flightFaresDTO 
   * @param passNumber 
   * @returns [total value ,curruncy code]
   */
  returnPassTotalFar(flightFaresDTO:fare[],passNumber:number,calcfare:fareCalc):[number,string]{
    let Total:fare = flightFaresDTO.filter(v=>v.fareType.toLowerCase() === 'equivfare')[0];
    return Total?[calcfare(flightFaresDTO)*passNumber,Total.currencyCode] :[NaN,'KWD'];
  }

  /**
   * 
   * @param flightFaresDTO 
   * @param passNumber 
   * @returns [total value per passenger ,curruncy code , number of passenger]
   */
  returnPassFareScatterd(flightFaresDTO:fare[],passNumber:number,calcfare:fareCalc):[number,string,number]{
    let Total:fare = flightFaresDTO.filter(v=>v.fareType.toLowerCase() === 'equivfare')[0];
    return Total?[calcfare(flightFaresDTO),Total.currencyCode,passNumber] :[NaN,'KWD',NaN];
  }

  //-----------------------> End of Building Fare breakup Functionalities


  /**
   * this function is responsible to destory any opened subscription on this service
   */
  destroyer(){
    this.subscription.unsubscribe()
  }
}
