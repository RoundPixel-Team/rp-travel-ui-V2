// this is the base model for the backend response
export interface baseSearchResult {
    status: string;
    searchResultException:{code:string,exceptionMessage:string}
}
  
/**
 * this is the the model of the backend on case of status 200
 */
export interface FlightSearchResult extends baseSearchResult  {
    pnr?:any;
    fareAmount?:any;
    airlines: any[];
    airItineraries: IAirItinerary[];
    searchCriteria: ISearchCriteria;
    cabinClasses:string[]
    passengersDetails?: any[],
}

export interface searchCriteriaFlights{
    arrivingTo: string;
    departingFrom: string;
    departingOnDate: string;
}

/**
 * Filter Form Model 
 * [this is a generic model for the filter containing all filter criteria and you can use only what you need]
 */

export interface flighFilterForm{
  airlines?:string[]
  bookingSite?:string[]
  stopsForm:{noStops:boolean,oneStop:boolean,twoAndm:boolean}
  sameAirline?:boolean
  priceSlider?:number[]
  durationSlider?:number[]
  dpartingSlider?:number[]
  arrivingSlider?:number[]
  returnSlider?:number[]
  experience?:{overNight:boolean,longStops:boolean}
  flexibleTickets?:{refund:boolean,nonRefund:boolean}
}


/**
 * Filter Model 
 * [this is a generic model for the filter containing all filter criteria and you can use only what you need]
 */

export class flightResultFilter {
  constructor(
    public sameAirline: boolean,
    public priceMin?: number,
    public priceMax?: number,
    public durationMin?: number,
    public durationMax?: number,
    public depatingMin?: number,
    public departingMax?: number,
    public arrivingMin?: number,
    public arrivingMax?: number,
    public returnMin?: number,
    public returnMax?: number,
    public stops?: number[],
    public experience?: boolean[],
    public flexibleTicket?: boolean[],
    public airlines?: string[],
    public bookingSites?: string[],
    public departSchedule?: any,
    public schedreturnScheduleule?: any
  ) {}
}


export interface filterFlightInterface{
  sameAirline?:boolean,
  priceMin?:number,
  priceMax?:number,
  durationMin?:number,
  durationMax?:number,
  depatingMin?:number,
  departingMax?:number,
  arrivingMin?:number,
  arrivingMax?:number,
  returnMin?:number,
  returnMax?:number,
  stops?:number[],
  experience?:boolean[],
  flexibleTicket?:boolean[],
  airlines?:string[],
  bookingSites?:string[],
  schedule?:number,
}

/**
 * this model is mapping to flight fare rules response
 */
export interface FareRules {
  departureCountry: string;
  arrivalCountry: string;
  adtRules: fares[];
  cnnRules: fares[];
  infRules: fares[];
}

export interface fares {
  fareRule: string;
  title: string;
}

export interface fareRulesResponse{
  errorMessage: string;
  fares:FareRules[];
}

export class SearchFlightModule { 
  
  constructor (
    public lan:string,
    public currency:string,
    public pointOfReservation:string,
    public flightType:string,
    public flightsInfo:string,
    public passengers:string,
    public Cclass:string,
    public serachId:any,
    public showDirect :boolean,
    public preferredAirLine :string,


    
    ){} 

}

export interface customAirlineFilter {
  logo: string;
  stops: string | number;
  price: string | number;
  currency: string;
  name: string;
  selected:boolean;
}

export interface IAirItinerary {
  otaName?:string;
  providerLogo?:string;
  flightSignature?:string;
  overNight?:number;
  stopsTime?:number;
  experiance:number;
  referralLink: string | null;
  sequenceNum: number;
  pKey: string;
  pcc: string;
  isRefundable: boolean;
  itinTotalFare: ItinTotalFare;
  totalDuration: number;
  deptDate: string;
  arrivalDate: string;
  cabinClass: string;
  flightType: string;
  allJourney: IAllJourney;
  baggageInformation: IBaggageInformation[];
  passengerFareBreakDownDTOs: IPassengerFareBreakDownDTO[];
  searchCriteria?: ISearchCriteria;
}

export interface ISearchCriteria {
  searchResultReturned: boolean;
  searchId: string;
  source: string;
  device: string | null;
  pos: string;
  currency: string;
  language: string;
  flights: IFlightSearch[];
  flightType: string;
  preferredAirline: string | null;
  selectedFlightClass: string;
  adultNum: number;
  childNum: number;
  infantNum: number;
  totalPassengersNum: number;
  selectDirectFlightsOnly: boolean;
  childAges: number;
  infantAges: number;
}

export interface IFlightSearch {
  departingFrom: string;
  arrivingTo: string;
  departingOnDate: string;
}

export interface IBaggageInformation {
  baggage: string;
  childBaggage: string | null;
  infantBaggage: string | null;
  airlineName: string;
  deptCity: string;
  landCity: string;
  flightNum: string;
}

export interface IPassengerFareBreakDownDTO {
  key: string;
  pricingMethod: string;
  cancelPenaltyDTOs: IPenaltyDTO[];
  changePenaltyDTOs: IPenaltyDTO[];
  passengerQuantity: number;
  passengerType: string;
  passengersRef: string[];
  flightFaresDTOs: IFlightFareDTO[];
  taxes: ITax[];
}

export interface IPenaltyDTO {
  price: number;
  curency: string;
  percentage: number;
  percentageApplied: boolean;
  sector: string;
  time: string | null;
}

export interface IFlightFareDTO {
  fareAmount: number;
  fareType: string;
  currencyCode: string;
}

export interface ITax {
  taxCode: string;
  amount: number;
  taxName: string | null;
  taxCurrencyCode: string;
  content: string;
  countryCode: string | null;
}

export interface IAllJourney {
  flights: IFlight[];
}

export interface IFlight {
  flightDTO: IFlightDTO[];
  flightAirline: IAirlineInfo;
  elapsedTime: number;
  stopsNum: number;
}

export interface IFlightDTO {
  departureOffset: number;
  arrivalOffset: number;
  isStopSegment: boolean;
  deptTime: string;
  landTime: string;
  departureDate: string;
  arrivalDate: string;
  flightAirline: IAirlineInfo;
  operatedAirline: IAirlineInfo;
  durationPerLeg: number;
  departureTerminalAirport: IAirportInfo;
  arrivalTerminalAirport: IAirportInfo;
  transitTime: string;
  flightInfo: IFlightInfo;
  segmentDetails: ISegmentDetails;
  supplierRefID: string;
}

export interface ISegmentDetails {
  baggage: string;
  childBaggage: string;
  infantBaggage: string;
  uniqueKey: string;
}

export interface IAirlineInfo {
  airlineCode: string;
  airlineName: string;
  airlineLogo: string;
  alternativeBusinessName: string | null;
  passportDetailsRequired: boolean;
}

export interface IAirportInfo {
  airportCode: string;
  airportName: string;
  cityName: string;
  cityCode: string;
  countryCode: string;
  countryName: string;
  regionName: string;
  terminal: string | null;
  cityImage: string;
}

export interface IFlightInfo {
  flightNumber: string;
  equipmentNumber: string;
  mealCode: string;
  bookingCode: string | null;
  cabinClass: string;
}

export interface FlightSearchResponse {
  status: string;
  errorMessage: string;
  brands: Brand[];
  flightType: string;
}

export interface Brand {
  brandName: string;
  brandId: string;
  sequenceNumber: number;
  cabinClasse: string;
  baggageAllowances: BaggageAllowance[] | null;
  brandedFaresDTOs: FareDetail[];
  adminCharges: adminCharge[];
  itinTotalFare: ItinTotalFare;
  passengerFareBreakDowns: PassengerFareBreakDown[];
  optionalServices: OptionalService[];
}

export interface BaggageAllowance {
  paxType: string;
  baggageAllowanceDetails: BaggageAllowanceDetail[];
}

export interface BaggageAllowanceDetail {
  baggage: string;
  flightRoute: string;
  baggageAllowanceInfo: BaggageAllowanceInfo;
}

export interface BaggageAllowanceInfo {
  unit: string;
  size: string;
  dimensions?: string | null; // Optional since it's sometimes null
}

export interface FareDetail {
  fareAmount: number;
  fareType: string;
  currencyCode: string;
}

export interface adminCharge {
  price: number;
  curency: string;
  Type: string;
  sector: string;
}

export interface ItinTotalFare {
  amount: number;
  fareAmount: number;
  promoCode: string | null;
  promoDiscount: number;
  currencyCode: string;
  totalTaxes: number;
  dName: string | null;
  mName: string | null;
}

export interface PassengerFareBreakDown {
  key: string;
  pricingMethod: string;
  cancelPenaltyDTOs: Penalty[];
  changePenaltyDTOs: Penalty[];
  passengerQuantity: number;
  passengerType: string;
  passengersRef: string | null;
  flightFaresDTOs: FareDetail[];
  taxes: any; // Define structure if needed
}

export interface Penalty {
  price: number;
  curency: string;
  percentage: number;
  percentageApplied: boolean;
  sector: string;
  time: string;
}

export interface OptionalService {
  chargeable: string;
  key: string;
  type: string;
  tag: string;
  serviceInfo: ServiceInfo;
}

export interface ServiceInfo {
  description: string[];
  dimension?: Dimension | null;
}

export interface Dimension {
  height: string;
  width: string;
}
