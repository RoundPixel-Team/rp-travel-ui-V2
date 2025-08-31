import { Injectable, inject } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { FlightCheckoutApiService } from './flight-checkout-api.service';
import {
  BookingRequest,
  BreakDownView,
  CheckOutDetails,
  Cobon,
  flightOfflineService,
  mergedGates,
  OfflineServices,
  passengersModel,
  selectedFlight,
  userControllersKeys,
} from '../interfaces';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import {
  IFlightFareDTO,
  IPassengerFareBreakDownDTO,
} from '../../flight-result/interfaces';
import { HomePageService } from '../../home-page/services/home-page.service';
import { EMAIL_VALIDATION } from '../../user-managment/constants/validation';
import { DatePipe } from '@angular/common';
import { FORM_ERROR_MESSAGES } from '../constants/error-messages';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';

type fareCalc = (fare: IFlightFareDTO[]) => number;
type calcEqfare = (
  flightFaresDTO: IPassengerFareBreakDownDTO[],
  type: string,
  farecalc: fareCalc
) => number;

@Injectable({
  providedIn: 'root',
})
export class FlightCheckoutService {
  api = inject(FlightCheckoutApiService);
  home = inject(HomePageService);
  router = inject(Router);
  subscription: Subscription = new Subscription();
  serviceFees: number = 0;

  yesOrNoVaild: boolean = false;
  packageVaild: boolean = false;
  addbuttonVaild: boolean = false;
  isPnet: boolean = false;
  HG: string = '';
  HGtoken: string = '';
  notify = new Subject<number>();
  redirect: SafeHtml = '';

  datePipe = inject(DatePipe);

  /**
   * here is the loaded selected data
   */
  selectedFlight: selectedFlight | undefined = undefined;

  /**
   * here is all the loaded offline services
   */
  allOfflineServices: flightOfflineService[] = [];

  /**
   * here is the chosen/selected offline service
   */
  selectedOfflineServices: string[] = [];

  /**
   * here is all loaded offline services orgnized and grouped by type
   */
  organizedOfllineServices: flightOfflineService[] = [];

  /**
   * here is the recommened service which is added to the cost/ticket by default
   */
  recommendedOfflineService!: flightOfflineService | undefined;
  /**
   * type of booking in checkout
   */
  bookingType: string = 'standard';
  /**
   * here is the price with the recommened offline service added
   */
  priceWithRecommenedService: number = 0;

  /**
   * offline services loading state ..
   */
  offlineServicesLoader: boolean = false;

  /**
   * loading state ..
   */
  loader: boolean = false;
  saveBookingLoadeer = false;

  /**
   * applying copoun code loading state ..
   */
  copounCodeLoader: boolean = false;


  /**
   * applying error payment flag
   */
  paymentError:boolean = false;

  /**
   * this contains all the applied copon code details
   */
  copounCodeDetails: Cobon | undefined;

  /**
   * this is containing the error while applying copoun code
   */
  copounCodeError: string = '';

  /**
   * indicating which pcc provided the selected itinerary
   */
  pcc: string = '';

  /**
   * this is the main form for the checkout which contains all users array forms
   */
  usersForm = new FormGroup({
    users: new FormArray([]),
  });

  /**
   * this is a getter to return the users array forms (users) from the main form (usersForm)
   */
  public get usersArray(): FormArray {
    return this.usersForm.get('users') as FormArray;
  }

  /**
   * passengers fare disscount varriables
   */
  fareDisscount: [number, string, string] = [0, '', ''];

  /**
   * passengers fare breakup values
   */
  fareBreackup: BreakDownView | undefined;

  paymentLink = new Subject<string>();
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
  selectedFlightError: boolean = false;

  /**
   * this is a getter to return the users array forms (users) from the main form (usersForm)
   */
  usersArrayFunc(): FormArray {
    return this.usersForm.get('users') as FormArray;
  }

  constructor(public sanitizer: DomSanitizer
) {}

  /**
   *
   * @param searchId
   * @param sequenceNum
   * @param providerKey
   * this is for fetching the selected flight data and update selected flight state (selectedFlight:selectedFlight)
   * also update loader state
   */
  getSelectedFlightData(
    searchId: string,
    sequenceNum: number,
    providerKey: string,
    userCombinedNames: boolean,
    pcc: string
  ) {
    this.loader = true;
    this.subscription.add(
      this.api
        .getSelectedFlight(searchId, sequenceNum, providerKey, pcc)
        .subscribe(
          (res: selectedFlight) => {
            if (res) {
              // updating the selected flight state
              this.selectedFlight = res;
              // updating the loading state
              this.loader = false;
              if (res.status == 'Valid') {
                this.priceWithRecommenedService +=
                  res.airItineraryDTO.itinTotalFare.amount;

                // initilize users forms
                this.buildUsersForm(
                  res.searchCriteria.adultNum,
                  res.searchCriteria.childNum,
                  res.searchCriteria.infantNum,
                  res.passportDetailsRequired,
                  userCombinedNames
                );

                this.fetchLastPassengerData();

                // assign values to fare breakup and fare disscount
                this.calculateFareBreakupDisscount();
                this.calculatePassengersFareBreakupValue();

                this.selectedFlightLang.next(res.searchCriteria.language);
              } else {
                this.selectedFlightError = true;
                console.error('now error happens');
              }
              this.notify.next(1);
            }
          },
          (err: any) => {
            console.error('get selected flight error ->', err);
            this.loader = false;
            this.selectedFlightError = true;
            this.notify.next(1);
          }
        )
    );
  }

  /**
   *
   * @param searchId
   * @param pos
   * this is for fetching the flight offline services data and update offline service state (offlineServices:flightOfflineServices[])
   * also update offlineServicesLoader state
   */
  getAllOfflineServices(searchId: string, pos: string, multiTypes: boolean) {
    this.offlineServicesLoader = true;
    this.subscription.add(
      this.api.offlineServices(searchId, pos).subscribe(
        (res) => {
          this.allOfflineServices = [
            ...res.map((s) => {
              this.offlineServicesResponse.next(res);
              if (s.recommended) {
                this.recommendedOfflineService = s;
                this.priceWithRecommenedService +=
                  this.recommendedOfflineService.servicePrice;
                this.selectedOfflineServices.push(
                  this.recommendedOfflineService.serviceCode
                );
                return { ...s, added: true, interaction: true };
              } else {
                return { ...s, added: false, interaction: false };
              }
            }),
          ];
          if (multiTypes) {
            this.organizedOfllineServices = this.organizeOfflineServices(
              this.allOfflineServices
            );
          }
          this.offlineServicesLoader = false;
        },
        (err) => {
          console.error('get selected flight offline services error ->', err);
          this.offlineServicesLoader = false;
        }
      )
    );
  }

  /**
   *
   * @param data [all offline services data]
   * @returns offline services organized and grouped with the new logic
   */
  organizeOfflineServices(
    data: flightOfflineService[]
  ): flightOfflineService[] {
    let packageServices: flightOfflineService[] = data.filter((s) => {
      return s.serviceType == 'package';
    });
    for (var i = 0; i < packageServices.length; i++) {
      let packageSubServices = packageServices.filter((s) => {
        return (
          s.parentService == packageServices[i].parentService &&
          s.serviceCode != packageServices[i].serviceCode
        );
      });
      packageServices[i].subServices = packageSubServices;
    }

    let allPackageServiceParents: string[] = [];
    if (packageServices.length > 0) {
      for (var i = 0; i < packageServices.length; i++) {
        allPackageServiceParents.push(packageServices[i].parentService || '');
      }
    }
    allPackageServiceParents = [...new Set([...allPackageServiceParents])];

    if (allPackageServiceParents.length > 0) {
      for (var i = 0; i < allPackageServiceParents.length; i++) {
        let firstParentMatch: flightOfflineService = packageServices.filter(
          (s) => {
            return s.parentService == allPackageServiceParents[i];
          }
        )[0];
        packageServices = [
          ...packageServices.filter((s) => {
            return s.parentService != allPackageServiceParents[i];
          }),
        ];
        packageServices = [...packageServices, firstParentMatch];
      }
    }

    return [
      ...data.filter((s) => {
        return s.serviceType != 'package';
      }),
    ].concat(packageServices);
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
  buildUsersForm(
    adults: number,
    childs: number,
    infants: number,
    passportFlag: boolean,
    userCombinedNames: boolean
  ) {

     // Clear existing forms first
  while (this.usersArray.length) {
    this.usersArray.removeAt(0);
  }

  // Store current length once at the beginning
  const initialLength = this.usersArray.length;
  
    // build form when passports details are required
    if (passportFlag) {
      // build adults forms WITH paspport details
      for (var i = 0; i < adults; i++) {
        if (i == 0) {
          this.usersArray.push(
            new FormGroup({
              title: new FormControl('', [Validators.required]),
              firstName: new FormControl('', [
                Validators.required,
                Validators.pattern(
                  userCombinedNames ? '[a-zA-Z ]*' : '^[a-zA-Z]+'
                ),
                Validators.minLength(3),
              ]),
              middleName: new FormControl('', [
                Validators.pattern('^[a-zA-Z]+'),
                Validators.minLength(3),
              ]),
              lastName: new FormControl('', [
                Validators.required,
                Validators.pattern('^[a-zA-Z]+'),
                Validators.minLength(3),
              ]),
              email: new FormControl('', EMAIL_VALIDATION),
              phoneNumber: new FormControl('', [
                Validators.required,
                Validators.maxLength(16),
              ]),
              countryCode: new FormControl(''),
              nationality: new FormControl('', [Validators.required]),
              dateOfBirth: new FormControl('', [Validators.required]),
              PassengerType: new FormControl('ADT'),
              countryOfResidence: new FormControl('', [Validators.required]),
              PassportNumber: new FormControl('', [
                Validators.required,
                this.passportValidator(),
              ]),
              PassportExpiry: new FormControl('', [Validators.required]),
              IssuedCountry: new FormControl('', [Validators.required]),
              isIssuedCountrySelected: new FormControl(null, [Validators.required]),
              position: new FormControl(this.usersArray.length + 1),
            })
          );
        } else {
          this.usersArray.push(
            new FormGroup({
              title: new FormControl('', [Validators.required]),
              firstName: new FormControl('', [
                Validators.required,
                Validators.pattern(
                  userCombinedNames ? '[a-zA-Z ]*' : '^[a-zA-Z]+'
                ),
                Validators.minLength(3),
              ]),
              middleName: new FormControl('', [
                Validators.pattern('^[a-zA-Z]+'),
                Validators.minLength(3),
              ]),
              lastName: new FormControl('', [
                Validators.required,
                Validators.pattern('^[a-zA-Z]+'),
                Validators.minLength(3),
              ]),
              email: new FormControl(''),
              phoneNumber: new FormControl(''),
              countryCode: new FormControl(''),
              nationality: new FormControl('', [Validators.required]),
              dateOfBirth: new FormControl('', [Validators.required]),
              PassengerType: new FormControl('ADT'),
              countryOfResidence: new FormControl('', [Validators.required]),
              PassportNumber: new FormControl('', [
                Validators.required,
                this.passportValidator(),
              ]),
              PassportExpiry: new FormControl('', [Validators.required]),
              IssuedCountry: new FormControl('', [Validators.required]),
              isIssuedCountrySelected: new FormControl(null, [
                Validators.required,
              ]),
              position: new FormControl(this.usersArray.length + 1),
            })
          );
        }
      }

      // build childs forms WITH paspport details
      for (var i = 0; i < childs; i++) {
        this.usersArray.push(
          new FormGroup({
            title: new FormControl('', [Validators.required]),
            firstName: new FormControl('', [
              Validators.required,
              Validators.pattern(
                userCombinedNames ? '[a-zA-Z ]*' : '^[a-zA-Z]+'
              ),
              Validators.minLength(3),
            ]),
            middleName: new FormControl('', [
              Validators.pattern('^[a-zA-Z]+'),
              Validators.minLength(3),
            ]),
            lastName: new FormControl('', [
              Validators.required,
              Validators.pattern("^[a-zA-Z -']+"),
              Validators.minLength(3),
            ]),
            passportnum: new FormControl('', [Validators.max(16)]),
            dateOfBirth: new FormControl('', [Validators.required]),
            nationality: new FormControl('', [Validators.required]),
            PassengerType: new FormControl('CNN'),
            phoneNumber: new FormControl(''),
            countryCode: new FormControl(''),
            countryOfResidence: new FormControl('', [Validators.required]),
            PassportNumber: new FormControl('', [
              Validators.required,
              this.passportValidator(),
            ]),
            PassportExpiry: new FormControl('', [Validators.required]),
            IssuedCountry: new FormControl('', [Validators.required]),
            isIssuedCountrySelected: new FormControl(null, [
              Validators.required,
            ]),
            position: new FormControl(this.usersArray.length),
          })
        );
      }

      // build infants forms WITH paspport details
      for (var i = 0; i < infants; i++) {
        this.usersArray.push(
          new FormGroup({
            title: new FormControl('', [Validators.required]),
            firstName: new FormControl('', [
              Validators.required,
              Validators.pattern(
                userCombinedNames ? '[a-zA-Z ]*' : '^[a-zA-Z]+'
              ),
              Validators.minLength(3),
            ]),
            middleName: new FormControl('', [
              // Validators.required,
              Validators.pattern('^[a-zA-Z]+'),
              Validators.minLength(3),
            ]),
            lastName: new FormControl('', [
              Validators.required,
              Validators.pattern("^[a-zA-Z -']+"),
              Validators.minLength(3),
            ]),
            passportnum: new FormControl('', [Validators.maxLength(12)]),
            dateOfBirth: new FormControl('', [Validators.required]),
            nationality: new FormControl('', [Validators.required]),
            PassengerType: new FormControl('INF'),
            countryCode: new FormControl(''),
            countryOfResidence: new FormControl('', [Validators.required]),
            PassportNumber: new FormControl('', [
              Validators.required,
              this.passportValidator(),
            ]),
            PassportExpiry: new FormControl('', [Validators.required]),
            IssuedCountry: new FormControl('', [Validators.required]),
            isIssuedCountrySelected: new FormControl(null, [
              Validators.required,
            ]),

            position: new FormControl(this.usersArray.length),
          })
        );
      }
    }

    // build form when passports details are NOT required
    else {
      // build adults forms WITHOUT paspport details
      for (var i = 0; i < adults; i++) {
        this.usersArray.push(
          new FormGroup({
            title: new FormControl('', [Validators.required]),
            firstName: new FormControl('', [
              Validators.required,
              Validators.pattern(
                userCombinedNames ? '[a-zA-Z ]*' : '^[a-zA-Z]+'
              ),
              Validators.minLength(3),
            ]),
            middleName: new FormControl('', [
              Validators.pattern('^[a-zA-Z]+'),
              Validators.minLength(3),
            ]),
            lastName: new FormControl('', [
              Validators.required,
              Validators.pattern('^[a-zA-Z]+'),
              Validators.minLength(3),
            ]),
            email: new FormControl('', EMAIL_VALIDATION),
            phoneNumber: new FormControl('', [
              Validators.required,
              Validators.maxLength(5),
            ]),
            countryCode: new FormControl(''),
            nationality: new FormControl('', [Validators.required]),
            dateOfBirth: new FormControl('', [Validators.required]),
            PassengerType: new FormControl('ADT'),
            countryOfResidence: new FormControl('', [Validators.required]),
            PassportNumber: new FormControl('', [this.passportValidator()]),
            PassportExpiry: new FormControl('', [Validators.required]),
            IssuedCountry: new FormControl('', [Validators.required]),
            isIssuedCountrySelected: new FormControl(null, [
              Validators.required,
            ]),

            position: new FormControl(this.usersArray.length + 1),
          })
        );
      }

      // build childs forms WITHOUT paspport details
      for (var i = 0; i < childs; i++) {
        this.usersArray.push(
          new FormGroup({
            title: new FormControl('', [Validators.required]),
            firstName: new FormControl('', [
              Validators.required,
              Validators.pattern(
                userCombinedNames ? '[a-zA-Z ]*' : '^[a-zA-Z]+'
              ),
              Validators.minLength(3),
            ]),
            middleName: new FormControl('', [
              Validators.pattern('^[a-zA-Z]+'),
              Validators.minLength(3),
            ]),
            lastName: new FormControl('', [
              Validators.required,
              Validators.pattern("^[a-zA-Z -']+"),
              Validators.minLength(3),
            ]),
            passportnum: new FormControl('', [Validators.max(16)]),
            dateOfBirth: new FormControl('', [Validators.required]),
            nationality: new FormControl('', [Validators.required]),
            PassengerType: new FormControl('CNN'),
            phoneNumber: new FormControl(''),
            countryCode: new FormControl(''),
            countryOfResidence: new FormControl(''),
            PassportNumber: new FormControl('', [this.passportValidator()]),
            PassportExpiry: new FormControl('', [Validators.required]),
            IssuedCountry: new FormControl('', [Validators.required]),
            isIssuedCountrySelected: new FormControl(null, [
              Validators.required,
            ]),

            position: new FormControl(this.usersArray.length),
          })
        );
      }

      // build infants forms WITHOUT paspport details
      for (var i = 0; i < infants; i++) {
        this.usersArray.push(
          new FormGroup({
            title: new FormControl('', [Validators.required]),
            firstName: new FormControl('', [
              Validators.required,
              Validators.pattern(
                userCombinedNames ? '[a-zA-Z ]*' : '^[a-zA-Z]+'
              ),
              Validators.minLength(3),
            ]),
            middleName: new FormControl('', [
              // Validators.required,
              Validators.pattern('^[a-zA-Z]+'),
              Validators.minLength(3),
            ]),
            lastName: new FormControl('', [
              Validators.required,
              Validators.pattern("^[a-zA-Z -']+"),
              Validators.minLength(3),
            ]),
            passportnum: new FormControl('', [Validators.maxLength(12)]),
            dateOfBirth: new FormControl('', [Validators.required]),
            nationality: new FormControl('', [Validators.required]),
            PassengerType: new FormControl('INF'),
            phoneNumber: new FormControl(''),
            countryCode: new FormControl(''),
            countryOfResidence: new FormControl(''),
            PassportNumber: new FormControl('', [this.passportValidator()]),
            PassportExpiry: new FormControl('', [Validators.required]),
            IssuedCountry: new FormControl('', [Validators.required]),
            isIssuedCountrySelected: new FormControl(null, [
              Validators.required,
            ]),

            position: new FormControl(this.usersArray.length),
          })
        );
      }
    }
  }

  /**
   * Passport validator function
   */
  passportValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const passportPattern = /^[A-Z0-9]{4,9}$/i; // Alphanumeric, 6-9 characters
      const isValid = passportPattern.test(control.value);

      return isValid ? null : { invalidPassport: true };
    };
  }

  /**
   *
   * @param service
   * this for adding a new offline service with the selected flight
   * also adding offline service cost to the whole price
   */
  addOfflineService(service: flightOfflineService) {
    let serviceIndex = this.allOfflineServices.findIndex((s) => {
      return s.serviceCode == service.serviceCode;
    });
    this.selectedOfflineServices.push(service.serviceCode);
    if (this.selectedFlight != undefined) {
      this.selectedFlight.airItineraryDTO.itinTotalFare.amount +=
        service.servicePrice;
      this.priceWithRecommenedService += service.servicePrice;
      this.serviceFees += service.servicePrice;
      //appear validation message based on boolean value
      switch (service.serviceType) {
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
    this.allOfflineServices[serviceIndex].added = true;
    this.allOfflineServices[serviceIndex].interaction = true;
  }

  /**
   *
   * @param service
   * this is to remove an already selected offline service with the selected flight
   * also removing offline service from the whole price
   */
  removeOfflineService(service: flightOfflineService) {
    let serviceIndex = this.allOfflineServices.findIndex((s) => {
      return s.serviceCode == service.serviceCode;
    });
    this.selectedOfflineServices = this.selectedOfflineServices.filter((s) => {
      return s != service.serviceCode;
    });
    if (this.selectedFlight != undefined) {
      //if interacted before
      if (this.serviceFees == 0) {
        this.serviceFees = 0;
      } else {
        this.serviceFees -= service.servicePrice;
        this.priceWithRecommenedService -= service.servicePrice;
        this.selectedFlight.airItineraryDTO.itinTotalFare.amount -=
          service.servicePrice;
      }
      //appear validation message based on boolean value
      switch (service.serviceType) {
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
    this.allOfflineServices[serviceIndex].added = false;
    this.allOfflineServices[serviceIndex].interaction = true;
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
  applyCopounCode(
    copounCode: string,
    searchId: string,
    sequenceNum: number,
    providerKey: string,
    pcc: string
  ) {
    this.copounCodeLoader = true;
    this.subscription.add(
      this.api
        .activateCobon(copounCode, searchId, sequenceNum, providerKey, pcc)
        .subscribe(
          (res) => {
            if (res) {
              // apply disscount on the selected flight price amount
              if (this.selectedFlight) {
                this.copounCodeDetails = res;
                this.selectedFlight.airItineraryDTO.itinTotalFare.amount -=
                  res.promotionDetails.discountAmount;
              }
              this.copounCodeLoader = false;
            }
          },
          (err) => {
            console.error('apply copoun code ERROR', err);
            this.copounCodeError = err;
            this.copounCodeLoader = false;
          }
        )
    );
  }

  /**
   * this is responsible for assigning last passengers form value before last payment
   * it depends on local storage key called (lastPassengers) which contains data for array of passengers
   */
  fetchLastPassengerData() {
    if (localStorage.getItem('lastPassengers')) {
      this.usersArray.setValue(
        JSON.parse(localStorage.getItem('lastPassengers')!)
      );
    }
  }

  /**
   *
   * @returns error type either main form error (email & phone number) or passenger error (error happens while entering passengers data)
   * IT RETURNS (Valid) in the type of string this means that every thing is OK and ready to payment
   */
  validatePassengersForm(): string {
    let error: string = '';
    for (var i = 0; i < this.usersArray.length; i++) {
      if (i == 0 && this.usersArray.at(i).get('email')?.errors != null) {
        error = 'mainFormError';
        return 'mainFormError';
      } else if (this.usersArray.at(i).invalid) {
        error = 'passengersForm';
        return 'passengersForm';
      } else {
        error = 'Valid';
        return 'Valid';
      }
    }

    return error;
  }

  /**
   *
   * @param currentCurrency
   * here is the save booking function which returning the payment link if all params is good
   * it updates the behaviour subject (paymentLink) with the link
   * it also updates the behaviour subject (paymentLinkFailure) with the error
   */
  saveBooking(currentCurrency: string, type: string, pcc: string, brandId: number) {
    this.saveBookingLoadeer = true;
    this.subscription.add(
      this.api
        .saveBooking(
          this.generateSaveBookingBody(
            this.generateCheckoutDetails(currentCurrency),
            this.generateOfflineServices(type),
            this.selectedFlight?.searchCriteria.searchId!,
            this.selectedFlight?.airItineraryDTO.sequenceNum!,
            this.selectedFlight?.airItineraryDTO.pKey!.toString()!,
            pcc,
            "",
            this.home.pointOfSale?.ip || '00.00.000.000',
            this.home.pointOfSale?.country || 'KW',
            "",
            this.selectedFlight?.searchCriteria.language!,
            brandId
          )
        )

        .subscribe(
          {
            next: (res) => {
              this.paymentLink.next(res.getPaymentViewResponse.link);
              this.saveBookingLoadeer = false;
            },
            complete: () => {
              this.notify.next(2);
              this.saveBookingLoadeer = false;
            },
            error: (err) => {
              this.paymentLinkFailure.next('');
              this.saveBookingLoadeer = false;
              this.selectedFlightError = true;
              console.error('SAVE BOOKING ERROR', err);
            
            }
          }
        )
    );
  }
newPaymentSaveBooking(currentCurrency: string, type: string, pcc: string, brandId: number, selectedMethod: mergedGates,payToken:string) {
  this.saveBookingLoadeer = true;
  this.paymentError = false;
  this.subscription.add(
    this.api
    .saveBooking(
      this.generateSaveBookingBody(
          this.generateCheckoutDetails(currentCurrency),
          this.generateOfflineServices(type),
          this.selectedFlight?.searchCriteria.searchId!,
          this.selectedFlight?.airItineraryDTO.sequenceNum!,
          this.selectedFlight?.airItineraryDTO.pKey!.toString()!,
          pcc,
          "",
          this.home.pointOfSale?.ip || '00.00.000.000',
          this.home.pointOfSale?.country || 'KW',
          "",
          this.selectedFlight?.searchCriteria.language!,
          brandId
        )
      )
      .subscribe({
        next: (res) => {
          if(!res.getPaymentViewResponse.link || res.getPaymentViewResponse.link === null){
            this.paymentError = true;
            return
          }
          this.HG = res.savedBookingResponse.hgNumber;
          const url = res.getPaymentViewResponse.link;
          const urlParams = new URLSearchParams(url.split('?')[1]);
          const tokValue = urlParams.get('tok')!;          
          this.Pay(selectedMethod, this.HG, tokValue,payToken);
        },
        error: (err) => {
          this.paymentLinkFailure.next('');
          this.saveBookingLoadeer = false;
          this.paymentError = true;
          this.selectedFlightError = true;
          console.error('SAVE BOOKING ERROR', err);
        }
        // Removed complete handler here since we want loader to continue
      })
  );
}

Pay(selectedMethod: mergedGates, HG: string, token: string, payToken: string) {
  this.paymentError = false; // Reset error flag
  this.api.startPaymentProcess(
    HG,
    this.selectedFlight?.searchCriteria.searchId!,
    token,
    selectedMethod.PaymentMethod,
    selectedMethod.Amount.toString(),
    selectedMethod.GatewayType,
    'mop',
    payToken
  )
  .subscribe({
    next: (val) => {
      this.isPnet = this.api.isPnet;

      if (typeof val === 'string') {
        if (selectedMethod.PaymentMethod === 'MPGS') {
          // 👇 Store the HTML response to a shared service or route param
          this.router.navigate(['flights-checkout/mpgs-auth'], {
            state: { htmlContent: val }
          });
        } else if (!this.isPnet) {
          if (window.self !== window.top) {
            window.parent.location.href = val;
          } else {
            window.location.href = val;
          }
        } else {
          this.redirect = this.sanitizer.bypassSecurityTrustHtml(val);
        }
      } else {
        this.redirect = this.sanitizer.bypassSecurityTrustHtml(val);
      }
    },
    error: (err) => {
      console.error('Payment process error:', err);
      this.saveBookingLoadeer = false;
      this.paymentError = true; // Set error flag
      this.paymentLinkFailure.next('');
    },
    complete: () => {
      this.saveBookingLoadeer = false;
    }
  });
}

  /**
   *
   * @param currentCurrency
   * @returns the passenger details (body param) needed by backend to make the save booking action
   */
  generateCheckoutDetails(currentCurrency: string): CheckOutDetails {
    if (!this.usersArray || this.usersArray.length === 0) {
      throw new Error('Users array is not initialized');
    }

    for (var i = 0; i < this.usersArray.length; i++) {
      const userForm = this.usersArray.at(i);
      
      // Title handling
      const title = userForm.get('title')?.value;
      if (title === 'Male') {
        userForm.get('title')?.setValue('Mr');
      } else if (title === 'Female') {
        userForm.get('title')?.setValue('Ms');
      }
      
      // Date handling
      const dateOfBirth = this.datePipe.transform(
        userForm.get('dateOfBirth')?.value,
        'yyyy-MM-dd'
      ) || '';

      const passportExpiry = this.datePipe.transform(
        userForm.get('PassportExpiry')?.value,
        'yyyy-MM-dd'
      ) || '';

      userForm.get('dateOfBirth')?.setValue(dateOfBirth);
      userForm.get('PassportExpiry')?.setValue(passportExpiry);

      // Phone number handling (with null checks)
      const phoneControl = userForm.get('phoneNumber');
      if (phoneControl?.value) {
        const phoneValue = phoneControl.value;
        
        if (typeof phoneValue === 'object' && phoneValue.dialCode) {
          userForm.get('countryCode')?.setValue(
            String(phoneValue.dialCode).replace('+', '')
          );
          userForm.get('phoneNumber')?.setValue(phoneValue.number || '');
        } else {
          userForm.get('phoneNumber')?.setValue(String(phoneValue));
        }
      }
      

      this.usersArray
        .at(i)
        .get('countryOfResidence')
        ?.setValue(
          this.home.allCountries.filter((c) => {
            return (
              c.countryName ==
              this.usersArray.at(i).get('countryOfResidence')?.value
            );
          })[0].pseudoCountryCode
        );
      this.usersArray
        .at(i)
        .get('IssuedCountry')
        ?.setValue(this.usersArray.at(i).get('countryOfResidence')?.value);
      this.usersArray
        .at(i)
        .get('nationality')
        ?.setValue(this.usersArray.at(i).get('countryOfResidence')?.value);
    }
    return {
      bookingEmail: this.usersArray.at(0).get('email')?.value,
      DiscountCode: this.copounCodeDetails?.promotionDetails.discountCode || '',
      passengersDetails: this.usersArray.value,
      UserCurrency: currentCurrency,
    };
  }

  generateOfflineServices(type: string): OfflineServices {
    let SeletedServicesCodes =
      type == 'premium'
        ? this.selectedOfflineServices
        : this.selectedOfflineServices.filter((s) => {
            return s != this.recommendedOfflineService?.serviceCode;
          });

    return {
      UserSeletedInsurance: { ProductId: '' },
      UserSeletedServices: { SeletedServicesCodes },
    };
  }

  generateSaveBookingBody(
    checkOutDetails: CheckOutDetails,
    offlineServices: OfflineServices,
    searchId: string,
    sequenceNumber: number,
    providerKey: string,
    pcc: string,
    token: string,
    ip: string,
    pos: string,
    notifyToken: string,
    language: string,
    brandId: number
  ): BookingRequest {
    return {
      checkOutDetails,
      offlineServices,
      searchId,
      sequenceNumber,
      providerKey,
      pcc,
      token,
      ip,
      pos,
      notifyToken,
      language,
      brandId
    };
  }

  //-----------------------> Starting Building Fare breakup Functionalities

  /**
   * this function is responsiple for getting disscount from passengers fare breakup
   * it also updates the disscount state fareDisscount : [number,string,string]
   */
  calculateFareBreakupDisscount() {
    if (this.selectedFlight?.airItineraryDTO.passengerFareBreakDownDTOs) {
      this.fareDisscount = this.returnPassTotalFarDifferance(
        this.selectedFlight.airItineraryDTO.passengerFareBreakDownDTOs,
        this.selectedFlight.airItineraryDTO.itinTotalFare.amount,
        this.selectedFlight.airItineraryDTO.itinTotalFare.totalTaxes,
        this.selectedFlight.airItineraryDTO.itinTotalFare.currencyCode,
        this.calcEqfare,
        this.returnCorrectFare
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
  returnPassTotalFarDifferance(
    flightFaresDTO: IPassengerFareBreakDownDTO[],
    totalAmount: number,
    totalTax: number,
    curruncy: string,
    calcEqfare: calcEqfare,
    fareCalc: fareCalc
  ): [number, string, string] {
    let AdtFares = calcEqfare(flightFaresDTO, 'ADT', fareCalc);
    let childFare = calcEqfare(flightFaresDTO, 'CNN', fareCalc);
    let infentFare = calcEqfare(flightFaresDTO, 'INF', fareCalc);
    let TotalFare = AdtFares + childFare + infentFare + totalTax;
    let fareDiff = totalAmount - TotalFare;
    if (fareDiff > 0) {
      return [Math.round(fareDiff), 'Service Fees', curruncy];
    } else if (fareDiff < 0) {
      return [Math.round(-1 * fareDiff), 'Discount', curruncy];
    } else {
      return [0, '', 'KWD'];
    }
  }

  /**
   *
   * @param flightFaresDTO
   * @param type
   * @param farecalc
   * @returns numer of passenger * fare of passenger
   */
  calcEqfare(
    flightFaresDTO: IPassengerFareBreakDownDTO[],
    type: string,
    farecalc: fareCalc
  ): number {
    let fare = farecalc(
      flightFaresDTO.filter((v) => v.passengerType === type)[0]?.flightFaresDTOs
    );
    let quntity = flightFaresDTO.find(
      (v) => v.passengerType === type
    )?.passengerQuantity;
    return fare && quntity ? fare * quntity : 0;
  }

  /**
   *
   * @param fare
   * @returns validate equivelent fare
   */

  returnCorrectFare(fare: IFlightFareDTO[]): number {
    if (fare) {
      let equivfare = fare.find(
        (v) => v.fareType.toLowerCase() === 'equivfare'
      )?.fareAmount;
      let totalFare = fare.find(
        (v) => v.fareType.toLowerCase() === 'totalfare'
      )?.fareAmount;
      let totalTax = fare.find(
        (v) => v.fareType.toLowerCase() === 'totaltax'
      )?.fareAmount;
      if (
        equivfare != undefined &&
        totalFare != undefined &&
        totalTax != undefined
      ) {
        return equivfare > 0 ? equivfare : totalFare - totalTax;
      } else {
        return 0;
      }
    } else {
      return 0;
    }
  }

  /**
   *
   */
  calculatePassengersFareBreakupValue() {
    let AdtFares =
      this.selectedFlight?.airItineraryDTO.passengerFareBreakDownDTOs?.find(
        (v) => v.passengerType === 'ADT'
      );
    let ChildFare =
      this.selectedFlight?.airItineraryDTO.passengerFareBreakDownDTOs?.find(
        (v) => v.passengerType === 'CNN'
      );
    let infFare =
      this.selectedFlight?.airItineraryDTO.passengerFareBreakDownDTOs?.find(
        (v) => v.passengerType === 'INF'
      );
    this.fareBreackup = {
      ADT: {
        totalFare: AdtFares
          ? this.returnPassTotalFar(
              AdtFares.flightFaresDTOs,
              AdtFares.passengerQuantity,
              this.returnCorrectFare
            )
          : [NaN, 'KWD'],
        ScFare: AdtFares
          ? this.returnPassFareScatterd(
              AdtFares.flightFaresDTOs,
              AdtFares.passengerQuantity,
              this.returnCorrectFare
            )
          : [NaN, 'KWD', NaN],
      },
      CNN: {
        totalFare: ChildFare
          ? this.returnPassTotalFar(
              ChildFare.flightFaresDTOs,
              ChildFare.passengerQuantity,
              this.returnCorrectFare
            )
          : [NaN, 'KWD'],
        ScFare: ChildFare
          ? this.returnPassFareScatterd(
              ChildFare.flightFaresDTOs,
              ChildFare.passengerQuantity,
              this.returnCorrectFare
            )
          : [NaN, 'KWD', NaN],
      },
      INF: {
        totalFare: infFare
          ? this.returnPassTotalFar(
              infFare.flightFaresDTOs,
              infFare.passengerQuantity,
              this.returnCorrectFare
            )
          : [NaN, 'KWD'],
        ScFare: infFare
          ? this.returnPassFareScatterd(
              infFare.flightFaresDTOs,
              infFare.passengerQuantity,
              this.returnCorrectFare
            )
          : [NaN, 'KWD', NaN],
      },
    };
  }

  /**
   *
   * @param flightFaresDTO
   * @param passNumber
   * @returns [total value ,curruncy code]
   */
  returnPassTotalFar(
    flightFaresDTO: IFlightFareDTO[],
    passNumber: number,
    calcfare: fareCalc
  ): [number, string] {
    let Total: IFlightFareDTO = flightFaresDTO.filter(
      (v) => v.fareType.toLowerCase() === 'equivfare'
    )[0];
    return Total
      ? [calcfare(flightFaresDTO) * passNumber, Total.currencyCode]
      : [NaN, 'KWD'];
  }

  /**
   *
   * @param flightFaresDTO
   * @param passNumber
   * @returns [total value per passenger ,curruncy code , number of passenger]
   */
  returnPassFareScatterd(
    flightFaresDTO: IFlightFareDTO[],
    passNumber: number,
    calcfare: fareCalc
  ): [number, string, number] {
    let Total: IFlightFareDTO = flightFaresDTO.filter(
      (v) => v.fareType.toLowerCase() === 'equivfare'
    )[0];
    return Total
      ? [calcfare(flightFaresDTO), Total.currencyCode, passNumber]
      : [NaN, 'KWD', NaN];
  }

  //-----------------------> End of Building Fare breakup Functionalities

  updatePackageServiceInteractionValidation(val: boolean) {
    this.packageVaild = val;
  }

  updateYesOrNoServiceInteractionValidation(val: boolean) {
    this.yesOrNoVaild = val;
  }

  getErrorMessage(control: AbstractControl, fieldName: userControllersKeys, lang: 'en' | 'ar' = 'en'): string {
    const errorMessages = FORM_ERROR_MESSAGES[fieldName];
    if (!control || !errorMessages) return '';
  
    const errors = control.errors || {};
  
    for (const errorKey of Object.keys(errors)) {
      if (errorMessages[errorKey as keyof typeof errorMessages]) {
        return errorMessages[errorKey as keyof typeof errorMessages][lang];
      }
    }
    return '';
  }

  /**
   * this function is responsible to destory any opened subscription on this service
   */
  destroyer() {
    // this.subscription.unsubscribe()
    this.selectedFlight = undefined;
    this.allOfflineServices = [];
    this.selectedOfflineServices = [];
    this.recommendedOfflineService = undefined;
    this.priceWithRecommenedService = 0;
    this.offlineServicesLoader = false;
    this.loader = false;
    this.copounCodeLoader = false;
    this.copounCodeDetails = undefined;
    this.copounCodeError = '';
    this.usersForm = new FormGroup({
      users: new FormArray([]),
    });
    this.fareDisscount = [0, '', ''];
    this.fareBreackup = undefined;
    this.paymentLink = new Subject();
    this.selectedFlightLang = new Subject();
    this.offlineServicesResponse = new Subject();
    this.selectedFlightError = false;

    this.yesOrNoVaild = false;
    this.packageVaild = false;
    this.addbuttonVaild = false;
    this.serviceFees = 0;
    this.organizedOfllineServices = [];
  }
}
