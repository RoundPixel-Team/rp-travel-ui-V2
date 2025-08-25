
import { baseSearchResult, customAirlineFilter, FareRules, fareRulesResponse, fares, filterFlightInterface, flighFilterForm, FlightSearchResult, IAirItinerary, IAirlineInfo, IAirportInfo, IAllJourney, IBaggageInformation, IFlight, IFlightDTO, IFlightFareDTO, IFlightInfo, IPassengerFareBreakDownDTO, IPenaltyDTO, ISearchCriteria, ISegmentDetails, ITax, ItinTotalFare, searchCriteriaFlights } from './interfaces';

export const ITINERARY_DEFAULT: IAirItinerary = {
    referralLink: '',
    sequenceNum: 0,
    pKey: '',
    pcc: '',
    isRefundable: false,
    itinTotalFare: {
        amount: 0,
        fareAmount: 0,
        promoCode: '',
        promoDiscount: 0,
        currencyCode: '',
        totalTaxes: 0,
        dName: null,
        mName: null,
    },
    totalDuration: 0,
    deptDate: '',
    arrivalDate: '',
    cabinClass: '',
    flightType: '',
    allJourney: {
        flights: [],
    },
    baggageInformation: [],
    passengerFareBreakDownDTOs: [],
    experiance: 0
};

export const ALL_JOURNEY_DEFAULT: IAllJourney = {
  flights: [],
};

export const FLIGHT_AIRLINE_DEFAULT: IAirlineInfo = {
  airlineCode: '',
  airlineName: '',
  airlineLogo: '',
  alternativeBusinessName: '',
  passportDetailsRequired: false,
};

export const AIRPORT_DEFAULT: IAirportInfo = {
  airportCode: '',
  airportName: '',
  cityName: '',
  cityCode: '',
  countryCode: '',
  countryName: '',
  regionName: '',
  terminal: '',
  cityImage: '',
};

export const FLIGHT_INFO_DEFAULT: IFlightInfo = {
  flightNumber: '',
  equipmentNumber: '',
  mealCode: '',
  bookingCode: '',
  cabinClass: '',
};

export const SEGMENT_DETAILS_DEFAULT: ISegmentDetails = {
  uniqueKey: '',
  baggage: '',
  childBaggage: '',
  infantBaggage: '',
};

export const PASSENGER_FARE_BREAKDOWN_DEFAULT: IPassengerFareBreakDownDTO = {
  key: '',
  pricingMethod: '',
  cancelPenaltyDTOs: [],
  changePenaltyDTOs: [],
  passengerQuantity: 0,
  passengerType: '',
  passengersRef: [],
  flightFaresDTOs: [],
  taxes: [],
};

export const PENALTY_DTO_DEFAULT: IPenaltyDTO = {
  price: 0,
  curency: '',
  percentage: 0,
  sector: '',
  percentageApplied: false,
  time: null
};

export const FLIGHT_FARE_DTO_DEFAULT: IFlightFareDTO = {
  fareAmount: 0,
  fareType: '',
  currencyCode: '',
};

export const TAX_DEFAULT: ITax = {
  taxCode: '',
  amount: 0,
  taxName: null,
  taxCurrencyCode: '',
  content: '',
  countryCode: null,
};

export const FLIGHT_SEARCH_CRITERIA_DEFAULT: ISearchCriteria = {
  searchResultReturned: false,
  searchId: '',
  source: '',
  device: null,
  pos: '',
  currency: '',
  language: 'en',
  flights: [],
  flightType: '',
  preferredAirline: null,
  selectedFlightClass: '',
  adultNum: 0,
  childNum: 0,
  infantNum: 0,
  totalPassengersNum: 0,
  selectDirectFlightsOnly: false,
  childAges: 0,
  infantAges: 0,
};

export const FLIGHT_SEARCH_DEFAULT: FlightSearchResult = {
  status: 'Invalid',
  airItineraries: [],
  airlines: [],
  cabinClasses: [],
  searchCriteria: FLIGHT_SEARCH_CRITERIA_DEFAULT,
  searchResultException: {
    code: '400',
    exceptionMessage: 'Invalid Data',
  }
};

export const FLIGHT_DEFAULT: IFlight = {
  flightDTO: [],
  flightAirline: FLIGHT_AIRLINE_DEFAULT,
  elapsedTime: 0,
  stopsNum: 0,
};

export const FLIGHT_DTO_DEFAULT: IFlightDTO = {
  departureOffset: 0,
  arrivalOffset: 0,
  isStopSegment: false,
  deptTime: '',
  landTime: '',
  departureDate: '',
  arrivalDate: '',
  flightAirline: FLIGHT_AIRLINE_DEFAULT,
  operatedAirline: FLIGHT_AIRLINE_DEFAULT,
  durationPerLeg: 0,
  departureTerminalAirport: AIRPORT_DEFAULT,
  arrivalTerminalAirport: AIRPORT_DEFAULT,
  transitTime: '',
  flightInfo: FLIGHT_INFO_DEFAULT,
  segmentDetails: SEGMENT_DETAILS_DEFAULT,
  supplierRefID: ''
};

// Default baseSearchResult
export const BASE_SEARCH_RESULT_DEFAULT: baseSearchResult = {
  status: '',
  searchResultException: { code: '', exceptionMessage: '' },
};

const SEARCH_CRITERIA_DEFAULT: ISearchCriteria = {
  searchResultReturned: false,
  searchId: '',
  source: '',
  device: null,
  pos: '',
  currency: 'USD', // or any default currency
  language: 'en',   // or any default language
  flights: [
    {
      departingFrom: '',
      arrivingTo: '',
      departingOnDate: ''
    }
  ],
  flightType: 'OneWay', // or 'RoundTrip' / 'MultiCity' depending on your logic
  preferredAirline: null,
  selectedFlightClass: 'Economy', // or 'Business', etc.
  adultNum: 1,
  childNum: 0,
  infantNum: 0,
  totalPassengersNum: 1,
  selectDirectFlightsOnly: false,
  childAges: 0,
  infantAges: 0
};

// Default FlightSearchResult
export const FLIGHT_SEARCH_RESULT_DEFAULT : FlightSearchResult = {
  ...BASE_SEARCH_RESULT_DEFAULT,
  pnr: null,
  fareAmount: null,
  airlines: [],
  airItineraries: [],
  searchCriteria: SEARCH_CRITERIA_DEFAULT,
  cabinClasses: [],
  passengersDetails: [],
};

// Default searchCriteriaFlights
export const SEARCH_CRITERIA_FLIGHTS_DEFAULT: searchCriteriaFlights = {
  arrivingTo: '',
  departingFrom: '',
  departingOnDate: '',
};

// Default airItineraries
export const AIR_ITINERARIES_DEFAULT: IAirItinerary = {
  referralLink: '',
  otaName: '',
  providerLogo: '',
  pKey: '0',
  flightSignature: '',
  overNight: 0,
  stopsTime: 0,
  experiance: 0,
  sequenceNum: 0,
  isRefundable: false,
  itinTotalFare: { amount: 0, currencyCode: '', totalTaxes: 0, dName: '', fareAmount: 0, mName: '', promoCode: '', promoDiscount: 0 },
  totalDuration: 0,
  deptDate: '',
  arrivalDate: '',
  cabinClass: '',
  flightType: '',
  allJourney: { flights: [] },
  baggageInformation: [],
  passengerFareBreakDownDTOs: [],
  pcc: '',
};

// Default flighFilterForm
export const FLIGHT_FILTER_FORM_DEFAULT: flighFilterForm = {
  airlines: [],
  bookingSite: [],
  stopsForm: { noStops: false, oneStop: false, twoAndm: false },
  sameAirline: false,
  priceSlider: [],
  durationSlider: [],
  dpartingSlider: [],
  arrivingSlider: [],
  returnSlider: [],
  experience: { overNight: false, longStops: false },
  flexibleTickets: { refund: false, nonRefund: false },
};

// Default flightResultFilter

// Default filterFlightInterface
export const FILTER_FLIGHT_INTERFACE_DEFAULT: filterFlightInterface = {};

// Default FareRules
export const FARE_RULES_DEFAULT: FareRules = {
  departureCountry: '',
  arrivalCountry: '',
  adtRules: [],
  cnnRules: [],
  infRules: [],
};

// Default fares
export const FARES_DEFAULT: fares = {
  fareRule: '',
  title: '',
};

// Default itinTotalFare
export const ITIN_TOTAL_FARE_DEFAULT: ItinTotalFare = {
  amount: 0,
  currencyCode: '',
  totalTaxes: 0,
  fareAmount: 0,
  promoCode: '',
  promoDiscount: 0,
  dName: '',
  mName: ''
};


// Default baggageInformation
export const BAGGAGE_INFORMATION_DEFAULT: IBaggageInformation = {
  baggage: '',
  childBaggage: '',
  infantBaggage: '',
  airlineName: '',
  deptCity: '',
  landCity: '',
  flightNum: '',
};

// Default passengerFareBreakDownDTOs
export const PASSENGER_FARE_BREAKDOWN_DTOS_DEFAULT: IPassengerFareBreakDownDTO = {
  key: '',
  cancelPenaltyDTOs: [],
  changePenaltyDTOs: [],
  passengerQuantity: 0,
  passengersRef: [],
  pricingMethod: '',
  passengerType: '',
  flightFaresDTOs: [],
  taxes: [],
};

// Default customAirlineFilter
export const CUSTOM_AIRLINE_FILTER_DEFAULT: customAirlineFilter = {
  logo: '',
  stops: '',
  price: '',
  currency: '',
  name: '',
  selected: false,
};

// Default fareRulesResponse
export const FARE_RULES_RESPONSE_DEFAULT: fareRulesResponse = {
  errorMessage: '',
  fares: [],
};
