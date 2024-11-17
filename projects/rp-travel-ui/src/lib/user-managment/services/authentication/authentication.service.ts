import { inject, Injectable } from "@angular/core";
import { AbstractControl, FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { Subject, Subscription } from "rxjs";
import { EMAIL_ERROR_MESSAGES, FIRST_NAME_ERROR_MESSAGES, LAST_NAME_ERROR_MESSAGES, PASSWORD_ERROR_MESSAGES, PHONE_ERROR_MESSAGES, USER_NAME_ERROR_MESSAGES } from "../../constants/error-messages";
import { EMAIL_VALIDATION, PASSWORD_VALIDATION, PHONE_VALIDATION, REQUIRED_VALIDATION } from "../../constants/validation";
import { AuthApiService } from "./authentication-api.service";
import { Router } from "@angular/router";
import { TRIPS_DEFAULT, USER_DEFAULT } from "../../constants/defaultValues";
import { UserProfileService } from "../user-profile/user-profile.service";
import { TripsService } from "../trips/trips.service";
import { jwtDecode } from "jwt-decode";
import { FORGET_PASSWORD_STATUS, LOGIN_STATUS, OTP_STATUS, REGISTER_STATUS, RESET_PASSWORD_STATUS } from "../../constants/statuses";
@Injectable({
  providedIn: 'root',
}) export class AuthService {
  loginForm: FormGroup = new FormGroup({});
  registerForm: FormGroup = new FormGroup({});
  forgetPasswordForm: FormGroup = new FormGroup({});
  resetPasswordForm: FormGroup = new FormGroup({});

  /**
   * To notify when any change happens in the authentication process such as:
   * - Errors
   * - Successfully Register
   * - Successfully Loged In
   */

  notify: Subject<string> = new Subject();
  subscription: Subscription = new Subscription();
  isLoading: boolean = false;
  user: any = {}

  private tokenKey = 'token';
  private tokenHashKey = 'tokenHash';
  private secret = 'RP-1011101';

  authApi = inject(AuthApiService)
  userProfileService = inject(UserProfileService);
  tripsService = inject(TripsService);
  router = inject(Router);
  fb = inject(FormBuilder);

  /**
   * this function is responsible to initialize the Login Form
   */
  initLoginForm() {
    this.loginForm = new FormGroup({
      email: new FormControl('', EMAIL_VALIDATION),
      password: new FormControl('', REQUIRED_VALIDATION),
    });
  }

  /**
   * this function is responsible to initialize the Register(sign up) Form
   */
  initRegisterForm() {
    this.registerForm = new FormGroup({
      firstName: new FormControl('', REQUIRED_VALIDATION),
      lastName: new FormControl('', REQUIRED_VALIDATION),
      username: new FormControl ('', REQUIRED_VALIDATION),
      email: new FormControl('', EMAIL_VALIDATION),
      password: new FormControl('', PASSWORD_VALIDATION),
      confirmPassword: new FormControl('', PASSWORD_VALIDATION),
      userPhoneNumber: new FormControl('', PHONE_VALIDATION),
      isTemporary: new FormControl(true),
      isOAuthEnabled: new FormControl(false)
    },
    {
      validators: this.confirmPasswordValidator('password'),
    });
  }

  /**
   * this function is responsible to initialize the Login Form
   */
  initForgetPasswordForm() {
    this.forgetPasswordForm = new FormGroup({
      email: new FormControl('', EMAIL_VALIDATION)
    });
  }

  /**
   * this function is responsible to initialize the Register(sign up) Form
   */
  initResetPasswordForm(token: string, email: string) {
    this.resetPasswordForm = new FormGroup({
      token: new FormControl(token),
      email: new FormControl(email),
      newPassword: new FormControl('', PASSWORD_VALIDATION),
      confirmPassword: new FormControl('', PASSWORD_VALIDATION),
    },
    {
      validators: this.confirmPasswordValidator('newPassword'),
    });
  }

  confirmPasswordValidator(controlName: string) {
    return (control: AbstractControl) => {
      return control.get(controlName)?.value === control.get('confirmPassword')?.value ? null : {mismatch: true}
    }
  }

  async setToken(token: string): Promise<void> {
    localStorage.setItem(this.tokenKey, token);
    const tokenHash = await this.generateTokenHash(token, this.secret);
    localStorage.setItem(this.tokenHashKey, tokenHash);
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
        this.authApi.registeration(this.registerForm.value).subscribe({
          next: (res) => {
            this.notify.next(REGISTER_STATUS.success);
  
            const userInfo = {
              email: this.registerForm.controls['email'].value,
              password: this.registerForm.controls['password'].value
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
        this.authApi.login(this.loginForm.value).subscribe({
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
        this.authApi.restPasswordApi(this.resetPasswordForm.value).subscribe({
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

  // /**
  //  * this function is responsible to make intgeration between front and backend request (USER REGISTER)
  //  */
  // externalLogin(provider: string){
  //   this.subscription.add(
  //     this.authApi.externalLoginApi(provider).subscribe()
  //   )
  // }

  private popupOpened = false; // Flag to track if popup is opened

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

  async generateTokenHash(token: string, secret: string): Promise<string> {
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(token));
    return Array.from(new Uint8Array(signature))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  async getToken(): Promise<string | null> {
    const token = localStorage.getItem(this.tokenKey);
    const tokenHash = localStorage.getItem(this.tokenHashKey);
    if (token && tokenHash) {
      const currentHash = await this.generateTokenHash(token, this.secret);
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
