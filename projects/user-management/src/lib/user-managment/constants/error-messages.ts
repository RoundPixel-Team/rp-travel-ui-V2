export const FIRST_NAME_ERROR_MESSAGES = {
  required: {
    en: 'First Name is required.',
    ar: 'الاسم الأول مطلوب.'
  }
};

export const LAST_NAME_ERROR_MESSAGES = {
  required: {
    en: 'Last Name is required.',
    ar: 'الاسم الأخير مطلوب.'
  }
};

export const USER_NAME_ERROR_MESSAGES = {
  required: {
    en: 'User Name is required.',
    ar: 'اسم المستخدم مطلوب.'
  }
};

export const EMAIL_ERROR_MESSAGES = {
  required: {
    en: 'Email is required.',
    ar: 'البريد الإلكتروني مطلوب.'
  },
  minlength: {
    en: 'Email must be at least 8 characters long.',
    ar: 'يجب أن يكون البريد الإلكتروني مكونًا من 8 أحرف على الأقل.'
  },
  email: {
    en: 'Please enter a valid email address.',
    ar: 'يرجى إدخال عنوان بريد إلكتروني صالح.'
  },
  pattern: {
    en: 'Email format is invalid.',
    ar: 'تنسيق البريد الإلكتروني غير صالح.'
  }
};

export const PASSWORD_ERROR_MESSAGES = {
  required: {
    en: 'Password is required.',
    ar: 'كلمة المرور مطلوبة.'
  },
  minlength: {
    en: 'Password must be at least 8 characters long.',
    ar: 'يجب أن تتكون كلمة المرور من 8 أحرف على الأقل.'
  },
  pattern: {
  en: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
  ar: "يجب أن تحتوي كلمة المرور على حرف كبير واحد على الأقل، وحرف صغير واحد، ورقم واحد، وحرف خاص واحد."
  }
};

export const PHONE_ERROR_MESSAGES = {
  required: {
    en: 'Phone number is required.',
    ar: 'رقم الهاتف مطلوب.'
  },
  minlength: {
    en: 'Phone number must be at least 10 digits long.',
    ar: 'يجب أن يتكون رقم الهاتف من 10 أرقام على الأقل.'
  },
  pattern: {
    en: 'Phone number format is invalid. Please enter a valid phone number.',
    ar: 'تنسيق رقم الهاتف غير صالح. يرجى إدخال رقم هاتف صالح.'
  }
};
