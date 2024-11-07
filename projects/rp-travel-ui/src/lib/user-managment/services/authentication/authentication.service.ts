import { inject, Injectable } from "@angular/core";
import { AbstractControl, FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { Subject, Subscription } from "rxjs";
import { EMAIL_ERROR_MESSAGES, FIRST_NAME_ERROR_MESSAGES, LAST_NAME_ERROR_MESSAGES, PASSWORD_ERROR_MESSAGES, PHONE_ERROR_MESSAGES, USER_NAME_ERROR_MESSAGES } from "../../constants/error-messages";
import { EMAIL_VALIDATION, PASSWORD_VALIDATION, PHONE_VALIDATION, REQUIRED_VALIDATION } from "../../constants/validation";
import { AuthApiService } from "./authentication-api.service";

@Injectable({
  providedIn: 'root',
}) export class AuthService {
  loginForm: FormGroup = new FormGroup({});
  registerForm: FormGroup = new FormGroup({});

  /**
   * To notify when any change happens in the authentication process such as:
   * - Errors
   * - Successfully Register
   * - Successfully Loged In
   */

  notify: Subject<number> = new Subject();
  subscription: Subscription = new Subscription();
  isLoading: boolean = false;
  user: any = {}

  authApi = inject(AuthApiService)
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
      validators: this.confirmPasswordValidator,
    });
  }

  confirmPasswordValidator(control: AbstractControl) {
    return control.get('password')?.value === control.get('confirmPassword')?.value ? null : {mismatch: true}
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
            this.notify.next(0);
  
            const userInfo = {
              email: this.registerForm.controls['email'].value,
              password: this.registerForm.controls['password'].value
            }
  
            localStorage.setItem('userInfo',JSON.stringify(userInfo));
          },
          error: (error:any) => {
            this.notify.next(1);
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
              localStorage.setItem('token',JSON.stringify(res.returnObject.token));
              this.notify.next(0);
            } else {
              this.notify.next(1);
            }
          },
          error: (error:any) => {
            this.notify.next(1);
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
              localStorage.setItem('token',JSON.stringify(res.returnObject.token));
              this.notify.next(0);
            }else{
              this.notify.next(1);
            }
          },
          error: (error: any) => {
            this.notify.next(1);
            this.isLoading = false
          }
        })
      )
    }
  }

  /**
   * this function is responsible to make intgeration between front and backend request (USER REGISTER)
   */
  externalLogin(provider: string){
    this.subscription.add(
      this.authApi.externalLoginApi(provider).subscribe()
    )
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
