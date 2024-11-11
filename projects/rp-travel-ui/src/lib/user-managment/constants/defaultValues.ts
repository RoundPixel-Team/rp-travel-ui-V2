import { ITrips, IUser } from "../interfaces";

export const USER_DEFAULT: IUser = {
  firstName: "",
  lastName: "",
  id: "",
  userName: "",
  normalizedUserName: "",
  email: "",
  normalizedEmail: "",
  emailConfirmed: false,
  passwordHash: "",
  securityStamp: "",
  concurrencyStamp: "",
  phoneNumber: null,
  phoneNumberConfirmed: false,
  twoFactorEnabled: false,
  lockoutEnd: null,
  lockoutEnabled: false,
  accessFailedCount: 0,
};

export const TRIPS_DEFAULT: ITrips = {
  historyFlights: [],
  upcomingFlights: []
};