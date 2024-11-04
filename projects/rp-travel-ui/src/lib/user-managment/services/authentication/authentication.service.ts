import { inject, Injectable } from "@angular/core";
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { EMAIL_VALIDATION, PASSWORD_VALIDATION, PHONE_VALIDATION, REQUIRED_VALIDATION } from "../../constants/validation";
import { BehaviorSubject, Subject, Subscription } from "rxjs";
import { AuthApiService } from "./authentication-api.service";
import { ILoginResponse } from "../../interfaces";

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
      phoneNumber: new FormControl('', PHONE_VALIDATION),
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
      this.authApi.registeration(this.registerForm.value).subscribe({
        next: (res) => {
          this.notify.next(res.status);

          const userInfo = {
            email: this.registerForm.controls['email'].value,
            password: this.registerForm.controls['password'].value
          }

          localStorage.setItem('userInfo',JSON.stringify(userInfo));
        },
        error: (error:any) => {
          this.notify.next(error.error.status);
          this.isLoading = false
        },
      });
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
      console.log({otp, ...userInfo})
      this.authApi.otpVerification({otp, ...userInfo}).subscribe({
        next: (res) => {
          this.notify.next(res.status);
          
          this.isLoading = false;
          if(res.status === 0){
            localStorage.setItem('token',JSON.stringify(res.returnObject.token));
          }
        },
        error: (error:any) => {
          this.notify.next(error.error.status);
          this.isLoading = false
        },
      });
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
            this.notify.next(res.status);
            this.isLoading = false
            if(res.status === 0){
              localStorage.setItem('token',JSON.stringify(res.returnObject.token));
            }
          },
          error: (error: any) => {
            this.notify.next(error.error.status);
            this.isLoading = false
          }
        })
      )

      console.log(this.loginForm.value);
    }
  }

  destroyer() {
    this.subscription.unsubscribe();
  }
}
