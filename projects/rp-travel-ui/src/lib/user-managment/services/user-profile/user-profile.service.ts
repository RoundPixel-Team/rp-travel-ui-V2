import { inject, Injectable } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
} from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { USER_DEFAULT } from '../../constants/defaultValues';
import {
  FIRST_NAME_ERROR_MESSAGES,
  LAST_NAME_ERROR_MESSAGES,
  PASSWORD_ERROR_MESSAGES,
  PHONE_ERROR_MESSAGES,
} from '../../constants/error-messages';
import {
  PASSWORD_VALIDATION,
  PHONE_VALIDATION,
  REQUIRED_VALIDATION,
} from '../../constants/validation';
import { IUser } from '../../interfaces';
import { UserProfileApiService } from './user-profile-api.service';
import { SharedService } from '../shared.service';

@Injectable({
  providedIn: 'root',
})
export class UserProfileService {
  /**
   * Injects the FormBuilder service to handle form controls and validations.
   */
  fb = inject(FormBuilder);

  sharedService = inject(SharedService);

  /**
   * Form group to handle user profile information.
   * Initialized as an empty FormGroup and configured with form controls later.
   * @type {FormGroup}
   */
  profileForm: FormGroup = new FormGroup({});

  /**
   * Form group to handle password change functionality.
   * Initialized as an empty FormGroup and configured with form controls later.
   * @type {FormGroup}
   */
  changePasswordForm: FormGroup = new FormGroup({});

  /**
   * Subject to notify subscribers of changes in the authentication process, such as:
   * - Errors
   * - Successful registration
   * - Successful login
   * @type {Subject<number>}
   */

  notify: Subject<number> = new Subject();

  /**
   * Subscription to manage and unsubscribe from observables when no longer needed.
   * Initialized as a new Subscription.
   * @type {Subscription}
   */
  subscription: Subscription = new Subscription();

  /**
   * Boolean flag to indicate if a process is currently loading.
   * @type {boolean}
   */
  isLoading: boolean = false;

  /**
   * The currently authenticated user information.
   * @type {IUser}
   */
  user: IUser = USER_DEFAULT;

  /**
   * Injects the UserProfileApiService to handle API calls related to user profile operations.
   */
  userProfileApi = inject(UserProfileApiService);

  /**
   * Initializes the profile form with form controls and validations for the user's profile.
   * - `firstName`: required field.
   * - `lastName`: required field.
   * - `userPhoneNumber`: field with phone number validation.
   */
  initProfileForm() {
    this.profileForm = new FormGroup({
      firstName: new FormControl('', REQUIRED_VALIDATION),
      lastName: new FormControl('', REQUIRED_VALIDATION),
      userPhoneNumber: new FormControl('', PHONE_VALIDATION),
    });
  }

  /**
   * Initializes the change password form with form controls and validations.
   * - `oldPassword`: field with password validation.
   * - `newPassword`: field with password validation.
   * - `confirmPassword`: field with password validation.
   *
   * The form includes a custom validator (`confirmPasswordValidator`) to ensure the new password and confirm password fields match.
   */
  initChangePasswordForm() {
    this.changePasswordForm = new FormGroup(
      {
        oldPassword: new FormControl('', PASSWORD_VALIDATION),
        newPassword: new FormControl('', PASSWORD_VALIDATION),
        confirmPassword: new FormControl('', PASSWORD_VALIDATION),
      },
      {
        validators: this.confirmPasswordValidator,
      },
    );
  }

  /**
   * Custom validator function to check if the `newPassword` and `confirmPassword` fields match.
   * @param {AbstractControl} control - The form group to validate.
   * @returns {ValidationErrors | null} - Returns an error object with a `mismatch` key if passwords don't match, or `null` if they do.
   */
  confirmPasswordValidator(control: AbstractControl) {
    return control.get('newPassword')?.value ===
      control.get('confirmPassword')?.value
      ? null
      : { mismatch: true };
  }

  /**
   * Fetches the user's profile data from the backend using the stored token.
   *
   * This function handles integration between the frontend and backend for user registration data.
   * - Sets `isLoading` to `true` while the request is in progress.
   * - Retrieves the token from localStorage. If no token is found, sets `isLoading` to `false`.
   * - Sends a request to the backend if a token is available, updating the `user` object with the response data on success.
   * - Emits a notification:
   *   - `0` on successful data retrieval.
   *   - `1` on error.
   */
  getUserProfile() {
    this.isLoading = true;
    let token = localStorage.getItem('token');

    if (!token) {
      this.isLoading = false;
    } else {
      token = JSON.parse(token);
      this.subscription.add(
        this.userProfileApi.getUserProfileApi(token!).subscribe({
          next: (res) => {
            this.user = res.returnObject;
            this.isLoading = false;
            this.notify.next(0);
          },
          error: (error: any) => {
            this.isLoading = false;
            this.notify.next(1);
          },
        }),
      );
    }
  }

  /**
   * Sends an update request to the backend with the user profile form data.
   *
   * This function handles integration between the frontend and backend for updating user registration data.
   * - Sets `isLoading` to `true` while the request is in progress.
   * - Retrieves the token from localStorage. If no token is found or the form is invalid, marks all form fields as touched and sets `isLoading` to `false`.
   * - If valid, sends an update request to the backend with the form data.
   * - Updates the `user` object with the response data on success.
   * - Emits a notification:
   *   - `2` on successful update.
   *   - `1` on error.
   */
  editUserProfile() {
    this.isLoading = true;
    let token = localStorage.getItem('token');
    if (this.profileForm.invalid || !token) {
      this.profileForm.markAllAsTouched();
      this.isLoading = false;
    } else {
      token = JSON.parse(token);
      let body = {
        ...this.profileForm.value,
        userId: this.user.id,
        phoneNumber: this.user.phoneNumber,
        operatorId: 0,
      };
      (console.log(body), 'body');
      this.subscription.add(
        this.userProfileApi.editUserProfileApi(token!, body).subscribe({
          next: (res) => {
            this.user = res.returnObject;
            this.isLoading = false;
            this.notify.next(2);
          },
          error: (error: any) => {
            this.isLoading = false;
            this.notify.next(1);
          },
        }),
      );
    }
  }

  /**
   * Sends a request to the backend to change the user's password.
   *
   * This function facilitates the integration between frontend and backend for password change functionality.
   * - Sets `isLoading` to `true` while the request is in progress.
   * - Retrieves the token from localStorage. If no token is found or the form is invalid, marks all form fields as touched and sets `isLoading` to `false`.
   * - If valid, sends the password change request to the backend with the form data.
   * - Checks the response status:
   *   - `status === 1`: Emits a notification (`1`) indicating an error during the password change.
   *   - `status !== 1`: Emits a notification (`2`) indicating a successful password change.
   * - Emits a notification (`1`) on error.
   */
  changePassword() {
    this.isLoading = true;
    let token = localStorage.getItem('token');

    if (this.changePasswordForm.invalid || !token) {
      this.changePasswordForm.markAllAsTouched();
      this.isLoading = false;
    } else {
      token = JSON.parse(token);
      this.subscription.add(
        this.userProfileApi
          .changePasswordApi(token!, {
            oldPassword: this.sharedService.encryptData(
              this.changePasswordForm.value.oldPassword,
            ),
            newPassword: this.sharedService.encryptData(
              this.changePasswordForm.value.newPassword,
            ),
            confirmPassword: this.sharedService.encryptData(
              this.changePasswordForm.value.confirmPassword,
            ),
          })
          .subscribe({
            next: (val) => {
              if (val.status === 1) {
                this.isLoading = false;
                this.notify.next(1);
              } else {
                this.isLoading = false;
                this.notify.next(2);
              }
            },
            error: (error: any) => {
              this.isLoading = false;
              this.notify.next(1);
            },
          }),
      );
    }
  }

  /**
   * Retrieves the appropriate error message for the first name field based on validation errors.
   *
   * @param {AbstractControl} firstNameControl - The form control for the first name field.
   * @param {'en' | 'ar'} [lang='en'] - The language code for the error message (default is 'en' for English).
   * @returns {string} - The localized error message if there's a 'required' validation error; otherwise, an empty string.
   */
  getFirstNameErrorMessage(
    firstNameControl: AbstractControl,
    lang: 'en' | 'ar' = 'en',
  ) {
    if (firstNameControl.hasError('required')) {
      return FIRST_NAME_ERROR_MESSAGES.required[lang];
    }
    return '';
  }

  /**
   * Retrieves the appropriate error message for the last name field based on validation errors.
   *
   * @param {AbstractControl} lastNameControl - The form control for the last name field.
   * @param {'en' | 'ar'} [lang='en'] - The language code for the error message (default is 'en' for English).
   * @returns {string} - The localized error message if there's a 'required' validation error; otherwise, an empty string.
   */
  getLastNameErrorMessage(
    lastNameControl: AbstractControl,
    lang: 'en' | 'ar' = 'en',
  ) {
    if (lastNameControl.hasError('required')) {
      return LAST_NAME_ERROR_MESSAGES.required[lang];
    }
    return '';
  }

  /**
   * Retrieves the appropriate error message for the password field based on validation errors.
   *
   * @param {AbstractControl} passwordControl - The form control for the password field.
   * @param {'en' | 'ar'} [lang='en'] - The language code for the error message (default is 'en' for English).
   * @returns {string} - The localized error message if there's a 'required', 'minlength', or 'pattern' validation error; otherwise, an empty string.
   */
  getPasswordErrorMessage(
    passwordControl: AbstractControl,
    lang: 'en' | 'ar' = 'en',
  ) {
    if (passwordControl.hasError('required')) {
      return PASSWORD_ERROR_MESSAGES.required[lang];
    }
    if (passwordControl.hasError('minlength')) {
      return PASSWORD_ERROR_MESSAGES.minlength[lang];
    }
    if (passwordControl.hasError('pattern')) {
      return PASSWORD_ERROR_MESSAGES.pattern[lang];
    }
    return '';
  }

  /**
   * Retrieves the appropriate error message for the phone number field based on validation errors.
   *
   * @param {AbstractControl} phoneControl - The form control for the phone number field.
   * @param {'en' | 'ar'} [lang='en'] - The language code for the error message (default is 'en' for English).
   * @returns {string} - The localized error message if there's a 'required', 'minlength', or 'pattern' validation error; otherwise, an empty string.
   */
  getPhoneErrorMessage(
    phoneControl: AbstractControl,
    lang: 'en' | 'ar' = 'en',
  ) {
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

  /**
   * Unsubscribes from all active subscriptions to prevent memory leaks.
   *
   * This function should be called when the component is destroyed to ensure proper cleanup of resources.
   */
  destroyer() {
    this.subscription.unsubscribe();
  }
}
