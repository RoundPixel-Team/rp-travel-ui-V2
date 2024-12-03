import { inject, Injectable } from "@angular/core";
import { AbstractControl, FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { Subject, Subscription } from "rxjs";
import { 
  EMAIL_ERROR_MESSAGES, 
  FIRST_NAME_ERROR_MESSAGES, 
  LAST_NAME_ERROR_MESSAGES, 
  PASSWORD_ERROR_MESSAGES, 
  PHONE_ERROR_MESSAGES, 
  USER_NAME_ERROR_MESSAGES 
} from "../../constants/error-messages";
import { 
  EMAIL_VALIDATION, 
  PASSWORD_VALIDATION, 
  PHONE_VALIDATION, 
  REQUIRED_VALIDATION 
} from "../../constants/validation";
import { AuthApiService } from "./authentication-api.service";
import { Router } from "@angular/router";
import { TRIPS_DEFAULT, USER_DEFAULT } from "../../constants/defaultValues";
import { UserProfileService } from "../user-profile/user-profile.service";
import { TripsService } from "../trips/trips.service";
import { jwtDecode } from "jwt-decode";
import { 
  FORGET_PASSWORD_STATUS, 
  LOGIN_STATUS, 
  OTP_STATUS, 
  REGISTER_STATUS, 
  RESET_PASSWORD_STATUS, 
  VERIFY_TOKEN_STATUS 
} from "../../constants/statuses";
import { SharedService } from "../shared.service";
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root',
}) export class AuthService {
  /** Form group for login functionality */
  loginForm: FormGroup = new FormGroup({});
  
  /** Form group for registration (sign-up) functionality */
  registerForm: FormGroup = new FormGroup({});
  
  /** Form group for the forget password functionality */
  forgetPasswordForm: FormGroup = new FormGroup({});
  
  /** Form group for the reset password functionality */
  resetPasswordForm: FormGroup = new FormGroup({});

  /**
   * Subject to notify changes during the authentication process:
   * - Errors
   * - Successful registration
   * - Successful login
   */
  notify: Subject<string> = new Subject();

  /** Subscription instance to manage observable subscriptions */
  subscription: Subscription = new Subscription();

  /** Tracks whether the authentication process is currently loading */
  isLoading: boolean = false;

  /** Stores the current user's data */
  user: any = {};

  /** Flag to track if a popup is currently opened */
  private popupOpened = false;

  /** Local storage key for storing JWT tokens */
  private tokenKey = 'token';

  /** Local storage key for storing hashed tokens */
  private tokenHashKey = 'tokenHash';

  /** Secret key used for token hashing */
  private secret = 'RP-1011101';

  /** Dependencies injected using Angular's `inject` API */
  authApi = inject(AuthApiService);
  sharedService = inject(SharedService);
  userProfileService = inject(UserProfileService);
  tripsService = inject(TripsService);
  router = inject(Router);
  fb = inject(FormBuilder);

  /**
   * Initializes the login form with email and password fields.
   */
  initLoginForm() {
    this.loginForm = new FormGroup({
      email: new FormControl('', EMAIL_VALIDATION),
      password: new FormControl('', REQUIRED_VALIDATION),
    });
  }

  /**
   * Initializes the registration (sign-up) form with the necessary fields.
   * Includes a custom validator for password confirmation.
   */
  initRegisterForm() {
    this.registerForm = new FormGroup({
      firstName: new FormControl('', REQUIRED_VALIDATION),
      lastName: new FormControl('', REQUIRED_VALIDATION),
      username: new FormControl('', REQUIRED_VALIDATION),
      email: new FormControl('', EMAIL_VALIDATION),
      password: new FormControl('', PASSWORD_VALIDATION),
      confirmPassword: new FormControl('', PASSWORD_VALIDATION),
      userPhoneNumber: new FormControl('', PHONE_VALIDATION),
      isTemporary: new FormControl(true),
      isOAuthEnabled: new FormControl(false)
    }, {
      validators: this.confirmPasswordValidator('password'),
    });
  }

  /**
   * Initializes the forget password form with an email field.
   */
  initForgetPasswordForm() {
    this.forgetPasswordForm = new FormGroup({
      email: new FormControl('', EMAIL_VALIDATION),
    });
  }

  /**
   * Initializes the reset password form with token, email, and new password fields.
   * Includes a custom validator for password confirmation.
   * 
   * @param token - The reset token required for password reset.
   * @param email - The email of the user resetting their password.
   */
  initResetPasswordForm(token: string, email: string) {
    this.resetPasswordForm = new FormGroup({
      token: new FormControl(token),
      email: new FormControl(email),
      newPassword: new FormControl('', PASSWORD_VALIDATION),
      confirmPassword: new FormControl('', PASSWORD_VALIDATION),
    }, {
      validators: this.confirmPasswordValidator('newPassword'),
    });
  }

  /**
   * Custom validator to check if the password and confirm password fields match.
   * 
   * @param controlName - The name of the control to compare with the confirm password field.
   * @returns A validation function.
   */
  confirmPasswordValidator(controlName: string) {
    return (control: AbstractControl) => {
      return control.get(controlName)?.value === control.get('confirmPassword')?.value 
        ? null 
        : { mismatch: true };
    };
  }

  /**
   * Stores the authentication token in local storage.
   * Also generates a hash of the token for additional security.
   * 
   * @param token - The JWT token to be stored.
   * @returns A promise that resolves once the token and hash are stored.
   */
  async setToken(token: string): Promise<void> {
    localStorage.setItem(this.tokenKey, token);
    const tokenHash = await this.generateTokenHash(token, this.secret);
    localStorage.setItem(this.tokenHashKey, tokenHash);
  }

  /**
   * Generates a secure hash of the token using the provided secret.
   * 
   * @param token - The JWT token to be hashed.
   * @param secret - The secret key used for hashing.
   * @returns The hashed token.
   */
  generateTokenHash(token: string, secret: string): string {
    const hash = CryptoJS.HmacSHA256(token, secret);

    return hash.toString(CryptoJS.enc.Hex);
  }

  /**
   * this function is responsible to make intgeration between front and backend request (USER REGISTER)
   */
  regitserSubmit(){
    this.isLoading = true
    if(this.registerForm.invalid){
      this.registerForm.markAllAsTouched();
      this.isLoading = false
    }
    else{
      this.subscription.add(
        this.authApi.registeration(
          {
            ...this.registerForm.value, 
            password: this.sharedService.encryptData(this.registerForm.value.password),
            confirmPassword: this.sharedService.encryptData(this.registerForm.value.confirmPassword),
          }
        ).subscribe({
          next: (res) => {
            this.notify.next(REGISTER_STATUS.success);
  
            const userInfo = {
              email: this.registerForm.controls['email'].value,
              password: this.sharedService.encryptData(this.registerForm.controls['password'].value)
            }
  
            localStorage.setItem('userInfo',JSON.stringify(userInfo));
          },
          error: (error:any) => {
            this.notify.next(REGISTER_STATUS.faild);
            this.isLoading = false
          },
        })
      )
    }
  }

  /**
   * this function is responsible to make intgeration between front and backend request (USER REGISTER)
   */
  otpSubmit(otp: string){
    this.isLoading = true
    if(this.registerForm.invalid){
      this.isLoading = false
    }
    else{
      const userInfo = JSON.parse(localStorage.getItem('userInfo') ?? "");

      this.subscription.add(
        this.authApi.otpVerification({otp, ...userInfo}).subscribe({
          next: (res) => {
            this.isLoading = false;
  
            if(res.status === 0){
              const token = JSON.stringify(res.returnObject.token);
              this.setToken(token);
              this.notify.next(OTP_STATUS.success);
            } else {
              this.notify.next(OTP_STATUS.faild);
            }
          },
          error: (error:any) => {
            this.notify.next(OTP_STATUS.faild);
            this.isLoading = false
          },
        })
      )
    }
  }

  /**
   * this function is responsible to make intgeration between front and backend request (USER LOGIN)
   */
  loginSubmit(){
    this.isLoading = true
    if(this.loginForm.invalid){
      this.loginForm.markAllAsTouched()
      this.isLoading = false
    }
    else {
      this.subscription.add(
        this.authApi.login(
          {
            ...this.loginForm.value, 
            password: this.sharedService.encryptData(this.loginForm.value.password)
          }
        ).subscribe({
          next: (res) => {
            this.isLoading = false;

            if(res.status === 0){
              const token = JSON.stringify(res.returnObject.token);
              this.setToken(token);
              this.notify.next(LOGIN_STATUS.success);
            }else{
              this.notify.next(LOGIN_STATUS.faild);
            }
          },
          error: (error: any) => {
            this.notify.next(LOGIN_STATUS.faild);
            this.isLoading = false
          }
        })
      )
    }
  }

  /**
   * this function is responsible to make intgeration between front and backend request (USER LOGIN)
   */
  forgetPassword(){
    this.isLoading = true
    if(this.forgetPasswordForm.invalid){
      this.forgetPasswordForm.markAllAsTouched()
      this.isLoading = false
    }
    else {
      this.subscription.add(
        this.authApi.forgetPasswordApi(this.forgetPasswordForm.value).subscribe({
          next: (res) => {
            this.isLoading = false;

            if(res.status === 0){
              this.notify.next(FORGET_PASSWORD_STATUS.success);
            }else{
              this.notify.next(FORGET_PASSWORD_STATUS.faild);
            }
          },
          error: (error: any) => {
            this.notify.next(FORGET_PASSWORD_STATUS.faild);
            this.isLoading = false
          }
        })
      )
    }
  }

  /**
   * this function is responsible to make intgeration between front and backend request (USER LOGIN)
   */
  restPassword(){
    this.isLoading = true
    if(this.resetPasswordForm.invalid){
      this.resetPasswordForm.markAllAsTouched()
      this.isLoading = false
    }
    else {
      this.subscription.add(
        this.authApi.restPasswordApi(
          {
            ...this.resetPasswordForm.value,
            newPassword: this.sharedService.encryptData(this.resetPasswordForm.value.newPassword),
            confirmPassword: this.sharedService.encryptData(this.resetPasswordForm.value.confirmPassword),
          }
        ).subscribe({
          next: (res) => {
            this.isLoading = false;

            if(res.status === 0){
              this.notify.next(RESET_PASSWORD_STATUS.success);
            }else{
              this.notify.next(RESET_PASSWORD_STATUS.faild);
            }
          },
          error: (error: any) => {
            this.notify.next(RESET_PASSWORD_STATUS.faild);
            this.isLoading = false
          }
        })
      )
    }
  }

  /**
   * this function is responsible to make intgeration between front and backend request (USER LOGIN)
   */
  verifyResetPasswordToken(token: string, email: string){
    this.isLoading = true;

    this.subscription.add(
      this.authApi.verifyResetPasswordTokenApi(
        {
          email,
          token
        }
      ).subscribe({
        next: (res) => {
          this.isLoading = false;

          if(res.status === 0){
            this.notify.next(VERIFY_TOKEN_STATUS.success);
          }else{
            this.notify.next(VERIFY_TOKEN_STATUS.faild);
          }
        },
        error: (error: any) => {
          this.notify.next(VERIFY_TOKEN_STATUS.faild);
          this.isLoading = false
        }
      })
    )
  }

  authenticateWithProvider(providerUrl: string): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.popupOpened) {
        reject("Popup already opened");
        return;
      }

      // Open the popup only if not opened
      const popup = window.open(providerUrl, '_blank', 'width=500,height=600');
      
      if (!popup) {
        reject("Popup blocked or failed to open");
        return;
      }

      this.popupOpened = true; // Set flag to prevent reopening

      // Listen for messages from the popup
      const messageListener = (event: MessageEvent) => {
        if (event.origin !== window.location.origin) return; // Validate origin

        if (event.data && event.data.authenticated) {
          resolve(event.data); // Pass authentication response
          window.removeEventListener('message', messageListener); // Clean up listener
          this.popupOpened = false; // Reset flag
          popup.close();
        }
      };

      window.addEventListener('message', messageListener);
    });
  }



  async getToken(): Promise<string | null> {
    const token = localStorage.getItem(this.tokenKey);
    const tokenHash = localStorage.getItem(this.tokenHashKey);
    if (token && tokenHash) {
      const currentHash = this.generateTokenHash(token, this.secret);
      if (currentHash === tokenHash) {
        return token;
      } else {
        this.removeToken();
        return null;
      }
    }
    return null;
  }

  removeToken() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.tokenHashKey);

    this.userProfileService.user = USER_DEFAULT;
    this.tripsService.allTrips = TRIPS_DEFAULT;

    this.notify.next("Loged Out")
  }

  isTokenExpired(): boolean {
    const token = localStorage.getItem(this.tokenKey);
    if (!token) return true;

    const { exp } = jwtDecode<{ exp: number }>(token);
    return Date.now() >= exp * 1000;
  }

  getFirstNameErrorMessage(firstNameControl: AbstractControl, lang: 'en' | 'ar' = 'en') {
    if (firstNameControl.hasError('required')) {
      return FIRST_NAME_ERROR_MESSAGES.required[lang];
    }
    return '';
  }
  
  getLastNameErrorMessage(lastNameControl: AbstractControl, lang: 'en' | 'ar' = 'en') {
    if (lastNameControl.hasError('required')) {
      return LAST_NAME_ERROR_MESSAGES.required[lang];
    }
    return '';
  }
  
  getUserNameErrorMessage(userNameControl: AbstractControl, lang: 'en' | 'ar' = 'en') {
    if (userNameControl.hasError('required')) {
      return USER_NAME_ERROR_MESSAGES.required[lang];
    }
    return '';
  }
  
  getEmailErrorMessage(emailControl: AbstractControl, lang: 'en' | 'ar' = 'en') {
    if (emailControl.hasError('required')) {
      return EMAIL_ERROR_MESSAGES.required[lang];
    }
    if (emailControl.hasError('minlength')) {
      return EMAIL_ERROR_MESSAGES.minlength[lang];
    }
    if (emailControl.hasError('email')) {
      return EMAIL_ERROR_MESSAGES.email[lang];
    }
    if (emailControl.hasError('pattern')) {
      return EMAIL_ERROR_MESSAGES.pattern[lang];
    }
    return '';
  }
  
  getPasswordErrorMessage(passwordControl: AbstractControl, lang: 'en' | 'ar' = 'en', isRegister: boolean = false) {
    if (passwordControl.hasError('required')) {
      return PASSWORD_ERROR_MESSAGES.required[lang];
    }
    if (passwordControl.hasError('minlength')) {
      return PASSWORD_ERROR_MESSAGES.minlength[lang];
    }
    if (passwordControl.hasError('pattern') && isRegister) {
      return PASSWORD_ERROR_MESSAGES.pattern[lang];
    }
    return '';
  }
  
  getPhoneErrorMessage(phoneControl: AbstractControl, lang: 'en' | 'ar' = 'en') {
    if (phoneControl.hasError('required')) {
      return PHONE_ERROR_MESSAGES.required[lang];
    }
    if (phoneControl.hasError('minlength')) {
      return PHONE_ERROR_MESSAGES.minlength[lang];
    }
    if (phoneControl.hasError('pattern')) {
      return PHONE_ERROR_MESSAGES.pattern[lang];
    }
    return '';
  }  

  destroyer() {
    this.subscription.unsubscribe();
  }
}
