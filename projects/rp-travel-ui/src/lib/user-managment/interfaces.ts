export interface ILoginForm {
  email: string;
  password: string;
}

export interface IRegitserForm {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  userPhoneNumber: string;
  isTemporary: boolean;
  isOAuthEnabled: boolean;
}

export interface IForgetPasswordForm {
  email: string;
}

export interface IResetPasswordForm {
  token: string;
  email: string;
  newPassword: string;
  confirmPassword: string;
}

export interface IVerifyResetPasswordToken {
  token: string;
  email: string;
}

export interface IRegisterResponse {
  status: number;
  message: string;
  returnObject: string;
}

export interface ILoginResponse {
  status: number;
  message: string;
  returnObject: ILogin;
}

export interface ILogin {
  userName: string;
  email: string;
  isSuperAdmin: boolean;
  roles: string[];
  activeClaims: string[];
  token: string;
  isAgent: boolean;
  agencyId: string | null;
}

export interface IUserResponse {
  status: number;
  message: string;
  returnObject: IUser;
}

export interface IUser {
  firstName: string;
  lastName: string;
  id: string;
  userName: string;
  normalizedUserName: string;
  email: string;
  normalizedEmail: string;
  emailConfirmed: boolean;
  passwordHash: string;
  securityStamp: string;
  concurrencyStamp: string;
  phoneNumber: string | null;
  phoneNumberConfirmed: boolean;
  twoFactorEnabled: boolean;
  lockoutEnd: Date | null;
  lockoutEnabled: boolean;
  accessFailedCount: number;
}

export interface IOtp {
  otp: string;
  email: string;
  password: string;
}

export interface IForgetPasswordResponse {
  status: number;
  message: string;
  returnObject: string;
}

export interface IResetPasswordResponse {
  status: number;
  message: string;
  returnObject: string;
}

export interface IPassengerDetail {
  title: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  countryOfResidence: string;
  nationality: string;
  issuedCountry: string;
  countryCode: string | null;
  phoneNumber: string | null;
  passportNumber: string;
  passportExpiry: string;
  passengerType: string;
  ticketNumber: string | null;
}

export interface IFlightModel {
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
  selectedInsurance: string | null;
  additionalServices: any[];
  airItineraries: IAirItinerary[];
  passengersDetails: IPassengerDetail[];
}

export interface IAirItinerary {
  referralLink: string | null;
  sequenceNum: number;
  pKey: string | null;
  pcc: string | null;
  isRefundable: boolean;
  itinTotalFare: IItineraryFare;
  totalDuration: number;
  deptDate: string;
  arrivalDate: string;
  cabinClass: string;
  flightType: string;
  allJourney: IAllJourney;
  baggageInformation: any | null;
  passengerFareBreakDownDTOs: any | null;
}

export interface IItineraryFare {
  amount: number;
  fareAmount: number;
  promoCode: string;
  promoDiscount: number;
  currencyCode: string;
  totalTaxes: number;
  dName: string | null;
  mName: string | null;
}

export interface IAllJourney {
  flights: IFlight[];
}

export interface IFlight {
  flightDTO: IFlightSegment[];
  flightAirline: IAirlineInfo;
  elapsedTime: number;
  stopsNum: number;
}

export interface IFlightSegment {
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
  segmentDetails: any | null;
  supplierRefID: string;
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

export interface ITrips {
  historyFlights: IFlightModel[];
  upcomingFlights: IFlightModel[];
}

export interface ICardModel {
  route: string;
  dates: string;
  ticketNumber: IPassengerDetail[];
  itineraryNumber: string;
  bookingRef: string;
  airline: string;
  flightType: string;
  cityImage: string;
}

export interface IResetPasswordForm {
  token: string;
  email: string;
  newPassword: string;
  confirmPassword: string;
}
