import { Injectable, inject } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { FlightCheckoutApiService } from './flight-checkout-api.service';
import { BreakDownView, Cobon, flightOfflineService, passengersModel, selectedFlight } from '../interfaces';
import { FormArray, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { passengerFareBreakDownDTOs,fare } from '../../flight-result/interfaces';
import { HomePageService } from '../../home-page/services/home-page.service';

type fareCalc = (fare:fare[])=>number;
type calcEqfare =(flightFaresDTO: passengerFareBreakDownDTOs[],type:string,farecalc:fareCalc)=>number;


@Injectable({
  providedIn: 'root'
})
export class FlightCheckoutService {
  api = inject(FlightCheckoutApiService)
  home = inject(HomePageService)
  subscription : Subscription = new Subscription()
  serviceFees: number= 0;

  yesOrNoVaild:boolean = false;
  packageVaild:boolean = false ;
  addbuttonVaild:boolean = false ;
  
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
   * here is all loaded offline services orgnized and grouped by type 
   */
  organizedOfllineServices : flightOfflineService[] = []

  /**
   * here is the recommened service which is added to the cost/ticket by default
   */
  recommendedOfflineService! : flightOfflineService | undefined
/**
 * type of booking in checkout
 */
bookingType:string='standard'
  /**
   * here is the price with the recommened offline service added
   */
  priceWithRecommenedService: number = 0;


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
   * this is containing the error while applying copoun code
   */
  copounCodeError : string = ''


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


  paymentLink = new Subject();
  paymentLinkFailure = new Subject();

  /**
   * variable to hold the value of the selected flight language
   */
  selectedFlightLang = new Subject();

  /**
   * variable to hold the value of the offline services response
   */
  offlineServicesResponse = new Subject<flightOfflineService[]>();

  /**errors varriables */
  selectedFlightError : boolean = false

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
  getSelectedFlightData(searchId:string,sequenceNum:number,providerKey:number,userCombinedNames:boolean){
    this.loader = true
    this.subscription.add(
      this.api.getSelectedFlight(searchId,sequenceNum,providerKey).subscribe((res:selectedFlight)=>{
        if(res){
          // updating the selected flight state
          this.selectedFlight = res
          // updating the loading state
          this.loader = false
          if(res.status == 'Valid'){
            this.priceWithRecommenedService += res.airItineraryDTO.itinTotalFare.amount
            
            // initilize users forms
            this.buildUsersForm(
              res.searchCriteria.adultNum,
              res.searchCriteria.childNum,
              res.searchCriteria.infantNum,
              res.passportDetailsRequired,
              userCombinedNames)


              this.fetchLastPassengerData()

              // assign values to fare breakup and fare disscount
              this.calculateFareBreakupDisscount()
              this.calculatePassengersFareBreakupValue()
              
              this.selectedFlightLang.next(res.searchCriteria.language)
          }
          
          else{
            this.selectedFlightError = true
            console.log("now error happens")
          }

        }
      },(err:any)=>{
        console.log('get selected flight error ->',err)
        this.loader = false
        this.selectedFlightError = true
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
  getAllOfflineServices(searchId:string,pos:string,multiTypes:boolean){
    this.offlineServicesLoader = true
    this.subscription.add(
      this.api.offlineServices(searchId,pos).subscribe((res)=>{
        this.allOfflineServices = [...res.map((s)=>{
        this.offlineServicesResponse.next(res)
          if(s.recommended){
            this.recommendedOfflineService = s
            this.priceWithRecommenedService += this.recommendedOfflineService.servicePrice
            this.selectedOfflineServices.push(this.recommendedOfflineService.serviceCode)
            return {...s,added:true,interaction:true}
          }
          else{
            return {...s,added:false,interaction:false}
          }
          
        })]
        if(multiTypes){
          this.organizedOfllineServices = this.organizeOfflineServices(this.allOfflineServices)
        }
        this.offlineServicesLoader = false
      },(err)=>{
        console.log('get selected flight offline services error ->',err)
        this.offlineServicesLoader = false
      })
    )
  }

  /**
   * 
   * @param data [all offline services data]
   * @returns offline services organized and grouped with the new logic
   */
  organizeOfflineServices(data:flightOfflineService[]):flightOfflineService[]{
    let packageServices:flightOfflineService[] = data.filter((s)=>{return s.serviceType == 'package'})
    for(var i = 0 ; i<packageServices.length ; i++){
      let packageSubServices = packageServices.filter((s)=>{return s.parentService == packageServices[i].parentService && s.serviceCode != packageServices[i].serviceCode})
        packageServices[i].subServices = packageSubServices
    }

    let allPackageServiceParents:string [] = []
    if(packageServices.length>0){
      for(var i = 0 ; i<packageServices.length; i++){
        allPackageServiceParents.push(packageServices[i].parentService || '')
      }
    }
    allPackageServiceParents = [...new Set([...allPackageServiceParents])]
    
    if(allPackageServiceParents.length > 0){
      for(var i =0;i<allPackageServiceParents.length; i++){
        let firstParentMatch : flightOfflineService = packageServices.filter((s)=>{return s.parentService == allPackageServiceParents[i]})[0]
        packageServices = [...packageServices.filter((s)=>{return s.parentService != allPackageServiceParents[i]})]
        packageServices = [...packageServices,firstParentMatch]
      }
    }

    return [...data.filter((s)=>{return s.serviceType != 'package'})].concat(packageServices)
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
  buildUsersForm(adults:number,childs:number,infants:number,passportFlag:boolean,userCombinedNames:boolean){
    // build form when passports details are required
    if(passportFlag){

      // build adults forms WITH paspport details
      for(var i = 0 ; i<adults ; i++){
        if(i==0){
          this.usersArray.push(
            new FormGroup({
              title: new FormControl("", [Validators.required]),
              firstName: new FormControl("", [
                Validators.required,
                Validators.pattern(userCombinedNames?"[a-zA-Z ]*":"^[a-zA-Z]+"),
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
              phoneNumber: new FormControl("", [
                Validators.required,
                Validators.maxLength(16),
              ]),
              countryCode: new FormControl(""),
              nationality: new FormControl("", [
                Validators.required
              ]),
              dateOfBirth: new FormControl("", [Validators.required]),
              PassengerType: new FormControl("ADT"),
              countryOfResidence: new FormControl("", [Validators.required]),
              PassportNumber: new FormControl("", [Validators.required]),
              PassportExpiry: new FormControl("", [Validators.required]),
              IssuedCountry: new FormControl("", [Validators.required]),
              position: new FormControl(this.usersArray.length + 1)
            })
          )
        }
        else{
          this.usersArray.push(
            new FormGroup({
              title: new FormControl("", [Validators.required]),
              firstName: new FormControl("", [
                Validators.required,
                Validators.pattern(userCombinedNames?"[a-zA-Z ]*":"^[a-zA-Z]+"),
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
                Validators.email,
                Validators.minLength(9),
              ]),
              phoneNumber: new FormControl("", [
                Validators.maxLength(16),
              ]),
              countryCode: new FormControl(""),
              nationality: new FormControl("", [
                Validators.required
              ]),
              dateOfBirth: new FormControl("", [Validators.required]),
              PassengerType: new FormControl("ADT"),
              countryOfResidence: new FormControl("", [Validators.required]),
              PassportNumber: new FormControl("", [Validators.required]),
              PassportExpiry: new FormControl("", [Validators.required]),
              IssuedCountry: new FormControl("", [Validators.required]),
              position: new FormControl(this.usersArray.length + 1)
            })
          )
        }
        
      }

      // build childs forms WITH paspport details
      for(var i = 0 ; i<childs ; i++){
          this.usersArray.push(
            new FormGroup({
              title: new FormControl("", [Validators.required]),
              firstName: new FormControl("", [
                Validators.required,
                Validators.pattern(userCombinedNames?"[a-zA-Z ]*":"^[a-zA-Z]+"),
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
              nationality: new FormControl("", [Validators.required]),
              PassengerType: new FormControl("CNN"),
              phoneNumber: new FormControl(""),
              countryCode: new FormControl(""),
              countryOfResidence: new FormControl("", [Validators.required]),
              PassportNumber: new FormControl("", [Validators.required]),
              PassportExpiry: new FormControl("", [Validators.required]),
              IssuedCountry: new FormControl("", [Validators.required]),
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
              Validators.pattern(userCombinedNames?"[a-zA-Z ]*":"^[a-zA-Z]+"),
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
            nationality: new FormControl("", [Validators.required]),
            PassengerType: new FormControl("INF"),
            phoneNumber: new FormControl(""),
            countryCode: new FormControl(""),
            countryOfResidence: new FormControl("", [Validators.required]),
            PassportNumber: new FormControl("", [Validators.required]),
            PassportExpiry: new FormControl("", [Validators.required]),
            IssuedCountry: new FormControl("", [Validators.required]),
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
              Validators.pattern(userCombinedNames?"[a-zA-Z ]*":"^[a-zA-Z]+"),
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
            phoneNumber: new FormControl("", [
              Validators.required,
              Validators.maxLength(5),
            ]),
            countryCode: new FormControl(""),
            nationality: new FormControl("", [
              Validators.required
            ]),
            dateOfBirth: new FormControl("", [Validators.required]),
            PassengerType: new FormControl("ADT"),
            countryOfResidence: new FormControl("", [Validators.required]),
            PassportNumber: new FormControl(""),
            PassportExpiry: new FormControl(""),
            IssuedCountry: new FormControl(""),
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
              Validators.pattern(userCombinedNames?"[a-zA-Z ]*":"^[a-zA-Z]+"),
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
            nationality: new FormControl("", [Validators.required]),
            PassengerType: new FormControl("CNN"),
            phoneNumber: new FormControl(""),
            countryCode: new FormControl(""),
            countryOfResidence: new FormControl(""),
            PassportNumber: new FormControl(""),
            PassportExpiry: new FormControl(""),
            IssuedCountry: new FormControl(""),
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
            Validators.pattern(userCombinedNames?"[a-zA-Z ]*":"^[a-zA-Z]+"),
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
          nationality: new FormControl("", [Validators.required]),
          PassengerType: new FormControl("INF"),
          phoneNumber: new FormControl(""),
          countryCode: new FormControl(""),
          countryOfResidence: new FormControl(""),
          PassportNumber: new FormControl(""),
          PassportExpiry: new FormControl(""),
          IssuedCountry: new FormControl(""),
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
    let serviceIndex = this.allOfflineServices.findIndex((s)=>{return s.serviceCode == service.serviceCode})
    this.selectedOfflineServices.push(service.serviceCode)
    if(this.selectedFlight != undefined){
      this.selectedFlight.airItineraryDTO.itinTotalFare.amount += service.servicePrice
      this.priceWithRecommenedService += service.servicePrice
      this.serviceFees += service.servicePrice;    
         //appear validation message based on boolean value
         switch(service.serviceType) {
          case 'addbutton':  
            this.addbuttonVaild = true;
            break;
      
          case 'yes/no':
            this.yesOrNoVaild = true;
            break;
          case 'package':
            this.packageVaild = true;
            break;
        }
    }
    this.allOfflineServices[serviceIndex].added = true
    this.allOfflineServices[serviceIndex].interaction = true
  }

  /**
   * 
   * @param service 
   * this is to remove an already selected offline service with the selected flight
   * also removing offline service from the whole price
   */
  removeOfflineService(service : flightOfflineService){
    let serviceIndex = this.allOfflineServices.findIndex((s)=>{return s.serviceCode == service.serviceCode})
    this.selectedOfflineServices = this.selectedOfflineServices.filter((s)=>{return s != service.serviceCode})
    if(this.selectedFlight != undefined){ 
      //if interacted before 
          if(this.serviceFees == 0){
            this.serviceFees = 0;
          }
          else{
            this.serviceFees -= service.servicePrice;
            this.priceWithRecommenedService -= service.servicePrice;
            this.selectedFlight.airItineraryDTO.itinTotalFare.amount -= service.servicePrice
      }
         //appear validation message based on boolean value
         switch(service.serviceType) {
          case 'addbutton':  
            this.addbuttonVaild = true;
            break;
      
          case 'yes/no':
            this.yesOrNoVaild = true;
            break;
          case 'package':
            this.packageVaild = true;
            break;
        }
    }
    this.allOfflineServices[serviceIndex].added = false
    this.allOfflineServices[serviceIndex].interaction = true
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
        this.copounCodeError = err
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


  /**
   * 
   * @returns error type either main form error (email & phone number) or passenger error (error happens while entering passengers data)
   * IT RETURNS (Valid) in the type of string this means that every thing is OK and ready to payment
   */
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



  /**
   * 
   * @param currentCurrency 
   * here is the save booking function which returning the payment link if all params is good
   * it updates the behaviour subject (paymentLink) with the link
   * it also updates the behaviour subject (paymentLinkFailure) with the error
   */
  saveBooking(currentCurrency:string,type:string){
    this.loader = true
    this.subscription.add(
      this.api.saveBooking(
      this.selectedFlight?.searchCriteria.searchId!,
      this.selectedFlight?.airItineraryDTO.sequenceNum!,
      this.generateSaveBookingBodyParam(currentCurrency),
      this.selectedFlight?.airItineraryDTO.pKey!.toString()!,
      this.selectedFlight?.searchCriteria.language!,
      type=='premium'?this.selectedOfflineServices:this.selectedOfflineServices.filter((s)=>{return s != this.recommendedOfflineService?.serviceCode}),
      this.home.pointOfSale.ip || "00.00.000.000",
      this.home.pointOfSale.country || 'kw'
      )

    .subscribe((res)=>{
      this.paymentLink.next(res)
      this.loader = false;
    },(err)=>{
      console.log("SAVE BOOKING ERROR", err)
      this.paymentLinkFailure.next(err)
      this.loader = false
      this.selectedFlightError = true
    }))
    
  }


  /**
   * 
   * @param currentCurrency 
   * @returns the passenger details (body param) needed by backend to make the save booking action
   */
  generateSaveBookingBodyParam(currentCurrency:string):passengersModel{
    for(var i = 0 ; i < this.usersArray.length; i++){
      if(this.usersArray.at(i).get('title')!.value == 'Male'){
        this.usersArray.at(i).get('title')!.setValue('Mr')
      }
      else if(this.usersArray.at(i).get('title')!.value == 'Female'){
        this.usersArray.at(i).get('title')!.setValue('Ms')
      }
      if(this.usersArray.at(i).get('phoneNumber')?.value != ''){
        this.usersArray.at(i).get('countryCode')?.setValue((<string>this.usersArray.at(i).get('phoneNumber')?.value.dialCode).replace("+",''))
        this.usersArray.at(i).get('phoneNumber')?.setValue(this.usersArray.at(i).get('phoneNumber')?.value.number)
      }

      
      this.usersArray.at(i).get('countryOfResidence')?.setValue(this.home.allCountries
        .filter(c=>{return c.countryName == this.usersArray.at(i).get('countryOfResidence')?.value})[0].pseudoCountryCode)
        this.usersArray.at(i).get('IssuedCountry')?.setValue(this.usersArray.at(i).get('countryOfResidence')?.value)
        this.usersArray.at(i).get('nationality')?.setValue(this.usersArray.at(i).get('countryOfResidence')?.value)
    }
    let object : passengersModel = {
      bookingEmail:this.usersArray.at(0).get('email')?.value,
      DiscountCode:this.copounCodeDetails?.promotionDetails.discountCode || '',
      passengersDetails:this.usersArray.value,
      UserCurrency:currentCurrency
    }
    return object
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
     if(equivfare != undefined && totalFare != undefined && totalTax != undefined){
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


  updatePackageServiceInteractionValidation(val:boolean){
    this.packageVaild = val
  }

  updateYesOrNoServiceInteractionValidation(val:boolean){
    this.yesOrNoVaild = val
  }

  /**
   * this function is responsible to destory any opened subscription on this service
   */
  destroyer(){
    // this.subscription.unsubscribe()
    this.selectedFlight  = undefined
    this.allOfflineServices  = []
    this.selectedOfflineServices  = []
    this.recommendedOfflineService = undefined
    this.priceWithRecommenedService = 0;
    this.offlineServicesLoader = false
    this.loader  = false
    this.copounCodeLoader  = false
    this.copounCodeDetails = undefined
    this.copounCodeError  = ''
    this.usersForm = new FormGroup({
      users : new FormArray([])
    });
    this.fareDisscount = [0,'',''];
    this.fareBreackup = undefined
    this.paymentLink = new Subject();
    this.paymentLinkFailure = new Subject();
    this.selectedFlightLang = new Subject();
    this.offlineServicesResponse = new Subject();
    this.selectedFlightError = false

    this.yesOrNoVaild = false;
    this.packageVaild = false ;
    this.addbuttonVaild = false ;
    this.serviceFees = 0;
    this.organizedOfllineServices = []
  }
}
