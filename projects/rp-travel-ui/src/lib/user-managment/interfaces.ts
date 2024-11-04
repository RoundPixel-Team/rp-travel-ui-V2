/**
 * this model is mappinf for the user login form
 */
export interface userLoginForm{
    Email: string,
    Password: string,
    Isbase?:number
}


/**
 * this model is mappinf for the user signup form
 */
export interface userSignupForm{
    isbase:number,
    email: string,
    password: string,
    imageURL: string,
    phoneNumber: string,
    confirmPassword: string,
    username: string
}


/**
 * this model is mapping to the response of the user api (login/signup)
 */
export interface userModel{
    Claims: string[],
    Logins: string[],
    Roles: string[],
    ImageURL: string,
    FirstName: string,
    LastName: string,
    AccessToken: string,
    Email: string
    EmailConfirmed: boolean,
    PasswordHash: string,
    SecurityStamp: string,
    PhoneNumber: string,
    PhoneNumberConfirmed: boolean,
    TwoFactorEnabled: boolean,
    LockoutEndDateUtc: any,
    LockoutEnabled: boolean,
    AccessFailedCount: number,
    Id: string,
    UserName: string
}

export interface IRegisterResponse {
  status: number;
  message: string;
  returnObject: string;
}

export interface ILoginResponse {
  status: number;
  message: string;
  returnObject: ReturnObject;
}

export interface ReturnObject {
  userName: string;
  email: string;
  isSuperAdmin: boolean;
  roles: string[];
  activeClaims: string[];
  token: string;
  isAgent: boolean;
  agencyId: string | null;
}

export interface IOtp {
  otp: string;
  email: string;
  password: string;
}