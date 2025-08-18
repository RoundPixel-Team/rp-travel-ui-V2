import { Validators } from "@angular/forms";
import { EMAIL_PATTERN, PASSWORD_PATTERN, PHONE_PATTERN } from "./patterns";

export const REQUIRED_VALIDATION = [Validators.required];

export const EMAIL_VALIDATION = [
  Validators.email,
  Validators.minLength(8),
  Validators.required,
  Validators.pattern(EMAIL_PATTERN)
]

export const PASSWORD_VALIDATION = [
  Validators.required,
  Validators.minLength(8),
  Validators.pattern(PASSWORD_PATTERN)
]

export const PHONE_VALIDATION =   [
  Validators.required,
  // Validators.minLength(10),
  Validators.pattern(PHONE_PATTERN)
]
