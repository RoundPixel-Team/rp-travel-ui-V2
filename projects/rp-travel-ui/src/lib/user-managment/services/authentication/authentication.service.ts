import { inject, Injectable } from "@angular/core";
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { EMAIL_VALIDATION, PASSWORD_VALIDATION, PHONE_VALIDATION, REQUIRED_VALIDATION } from "../../constants/validation";
import { BehaviorSubject, Subscription } from "rxjs";
import { AuthApiService } from "./authentication-api.service";
import { ILoginResponse } from "../../interfaces";

@Injectable({
  providedIn: 'root',
}) export class AuthService {
  loginForm: FormGroup = new FormGroup({});
  registerForm: FormGroup = new FormGroup({});

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
   * @params router navigation name to navigate to another page (LOGIN PAGE) after register
   */
  regitserSubmit(){
    this.isLoading = true
    if(this.registerForm.invalid){
      this.registerForm.markAllAsTouched();
      this.isLoading = false
    }
    else{
      this.authApi.registeration(this.registerForm.value).subscribe({
        next: (val: any) => {
          this.isLoading = false
          if(val.Comment){
            localStorage.setItem('authenticatedUser',JSON.stringify(val.applicationUser))
          }
        },
        error: (error:any) => {
          console.log("show me signup error",error);
          this.isLoading = false
        },
      });

      console.log(this.registerForm.value);
    }
  }

  /**
   * this function is responsible to make intgeration between front and backend request (USER LOGIN)
   * @params router navigation name to navigate to another page (HOME PAGE) after login
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
          next: (res: ILoginResponse) => {
            console.log("show me login submit",res);
            this.isLoading = false
            // if(val.Comment){
            //   localStorage.setItem('token',JSON.stringify(val.applicationUser))
            // }
          },
          error: (error: any) => {
            console.log("user login error",error);
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
