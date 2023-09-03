export interface confirmationModel {
    fareAmount: number;
    additionalServicesAmount: number;
    additionalServicesCurrency: string;
    hgNumber: string;
    pnr: string;
    bookingEmail: string;
    status: string;
    issueTicketStatus: boolean;
    userSelectInsurance: boolean;
    promoCode: string;
    promoDiscount: number;
    languageCode: string;
    userCurrencyCode: string;
    schedualChanges: boolean;
    selectedInsurance: any;
    additionalServices: (any)[] ;
    airItineraries: AirItinerariesEntity[] ;
    passengersDetails: (PassengersDetailsEntity)[] ;
  }
  export interface AirItinerariesEntity {
    referralLink: any;
    sequenceNum: number;
    pKey: any;
    isRefundable: boolean;
    itinTotalFare: ItinTotalFare;
    totalDuration: number;
    deptDate: string;
    arrivalDate: string;
    cabinClass: string;
    flightType: string;
    allJourney: AllJourney;
    baggageInformation: any;
    passengerFareBreakDownDTOs: any;
  }
  export interface ItinTotalFare {
    amount: number;
    fareAmount: number;
    promoCode: string;
    promoDiscount: number;
    currencyCode: string;
    totalTaxes: number;
  }
  export interface AllJourney {
    flights: (FlightsEntity)[] ;
  }
  export interface FlightsEntity {
    flightDTO: (FlightDTOEntity)[] ;
    flightAirline: FlightAirlineOrOperatedAirline;
    elapsedTime: number;
    stopsNum: number;
  }
  export interface FlightDTOEntity {
    departureOffset: number;
    arrivalOffset: number;
    isStopSegment: boolean;
    deptTime: string;
    landTime: string;
    departureDate: string;
    arrivalDate: string;
    flightAirline: FlightAirlineOrOperatedAirline;
    operatedAirline: FlightAirlineOrOperatedAirline;
    durationPerLeg: number;
    departureTerminalAirport: DepartureTerminalAirportOrArrivalTerminalAirport;
    arrivalTerminalAirport: DepartureTerminalAirportOrArrivalTerminalAirport;
    transitTime: string;
    flightInfo: FlightInfo;
    segmentDetails: any;
    supplierRefID: string;
  }
  export interface FlightAirlineOrOperatedAirline {
    airlineCode: string;
    airlineName: string;
    airlineLogo: string;
    alternativeBusinessName: any;
    passportDetailsRequired: boolean;
  }
  export interface DepartureTerminalAirportOrArrivalTerminalAirport {
    airportCode: string;
    airportName: string;
    cityName: string;
    cityCode: string;
    countryCode: string;
    countryName: string;
    regionName: string;
  }
  export interface FlightInfo {
    flightNumber: string;
    equipmentNumber: string;
    mealCode: string;
    bookingCode: any;
    cabinClass: string;
  }
  export interface PassengersDetailsEntity {
    title: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    countryOfResidence: string;
    nationality: string;
    issuedCountry: string;
    countryCode: string;
    phoneNumber: string;
    passportNumber: string;
    passportExpiry: string;
    passengerType: string;
    ticketNumber: any;
  }
  