import { Injectable,inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { UserManagmentApiService } from './user-managment-api.service';
import { Router } from '@angular/router';
import { userModel } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class UserManagmentService {
  //#region Variablses
  subscription: Subscription = new Subscription();
  api = inject(UserManagmentApiService) 
  loginForm: FormGroup = new FormGroup({});
  registerForm: FormGroup = new FormGroup({});

  loading : boolean = false

  currentUser! : userModel | undefined;
  userChange : Subject<string> = new Subject
  //#endregion

  constructor(private __fb: FormBuilder,private __router: Router) {}
  /**
   * this function is responsible to initialize the Login Form
   */
  initLoginForm() {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl(false, [Validators.required]),
    });
  }
  /**
   * this function is responsible to initialize the Register(sign up) Form
   */
  initRegisterForm() {
    this.registerForm = this.__fb.group( {
    Isbase:new FormControl(1),
    Email: new FormControl('',[Validators.email,Validators.minLength(8),Validators.required]),
    Password: new FormControl('',[Validators.required,Validators.minLength(8)]),
    FirstName: new FormControl(''),
    LastName: new FormControl(''),
    ImageURL: new FormControl(''),
    PhoneNumber: new FormControl('',[Validators.required,Validators.minLength(5)]),
    ConfirmPassword: new FormControl('',[Validators.required,Validators.minLength(8)]),
    User_Name: new FormControl (''),
    notification:new FormControl(true)
    },
    {
      validators: this.ConfirmPasswordValidator('Password', 'ConfirmPassword'),
    });
  }
  /**
   * this function is responsible to check validation between password and confirm password
   */
  ConfirmPasswordValidator(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      let control = formGroup.controls[controlName];
      let matchingControl = formGroup.controls[matchingControlName];

      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ custom: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }
  /**
   * this function is responsible to make intgeration between front and backend request (USER LOGIN)
   * @params router navigation name to navigate to another page (HOME PAGE) after login
   */
  loginSubmit(routerName:string){
    this.loading = true
    if(this.loginForm.invalid){
      this.loginForm.markAllAsTouched()
      this.loading = false
    }
    else {
      this.subscription.add(
        this.api.login(this.loginForm.value).subscribe((val:any)=>{
          console.log("show me login submit",val);
          this.loading = false
          if(val.Comment){
            localStorage.setItem('authenticatedUser',JSON.stringify(val.applicationUser))
            this.currentUser = val.applicationUser
            this.userChange.next('authenticated')
          }else{
            this.userChange.next('invalid user')
          }
          
        },
        (err:any)=>{console.log("user login error",err);this.loading = false})
      );
    }
  }
  /**
   * this function is responsible to make intgeration between front and backend request (USER REGISTER)
   * @params router navigation name to navigate to another page (LOGIN PAGE) after register
  */
  regitserSubmit(routerName:string){
    this.loading = true
    if(this.registerForm.invalid){
      this.registerForm.markAllAsTouched();
      this.loading = false
    }
    else{
      this.api.signup(this.registerForm.value).subscribe((val:any)=>{
        console.log("show me register submit",val)
        
        this.loading = false
        if(val.Comment){
          localStorage.setItem('authenticatedUser',JSON.stringify(val.applicationUser))
          this.currentUser = val.applicationUser
          this.userChange.next('authenticated')
        }else{
          this.userChange.next('invalid user')
        }
      },(error:any)=>{
        console.log("show me signup error",error);
        this.loading = false
      })
    }
  }

  /**
   * this function is responsible to destory any opened subscription on this service
   */
  destroyer() {
    this.subscription.unsubscribe();
  }
}
