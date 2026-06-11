import { IAirItinerary } from '../flight-result/interfaces';

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
export interface GoogleAuthResponse {
  iss: string;
  azp: string;
  aud: string;
  sub: string;
  hd: string;
  email: string;
  email_verified: boolean;
  nbf: number;
  name: string;
  picture: string;
  given_name: string;
  family_name: string;
  iat: number;
  exp: number;
  jti: string;
}

export interface IUserResponse {
  status: number;
  message: string;
  returnObject: {
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
  };
}
