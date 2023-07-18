/**
 * this model is mappinf for the user login form
 */
export interface userLoginForm{
    Email: string,
    Password: string,
    Isbase:number
}


/**
 * this model is mappinf for the user signup form
 */
export interface userSignupForm{
    isbase:number,
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    imageURL: string,
    phoneNumber: string,
    confirmPassword: string,
    username: string
}


/**
 * this model is mapping to the response of the user api (login/signup)
 */
export interface userModel{
    AccessToken: string,
    Comment: number,
    Message: string,
    applicationUser: {
    AccessFailedCount: number,
    AccessToken: string,
    Email: string,
    EmailConfirmed: boolean,
    Id: string,
    LockoutEnabled: boolean,
    LockoutEndDateUtc: string,
    Logins: any[],
    PhoneNumber: string,
    PhoneNumberConfirmed: boolean,
    User_Name: string,
    FirstName :string,
    LastName :string
    }
}