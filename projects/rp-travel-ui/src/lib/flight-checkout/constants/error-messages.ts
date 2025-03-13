export const FORM_ERROR_MESSAGES = {
  title: {
    required: {
      en: 'Title is required.',
      ar: 'اللقب مطلوب.',
    },
  },
  firstName: {
    required: {
      en: 'First Name is required.',
      ar: 'الاسم الأول مطلوب.',
    },
    minlength: {
      en: 'First Name must be at least 3 characters long.',
      ar: 'يجب أن يتكون الاسم الأول من 3 أحرف على الأقل.',
    },
    pattern: {
      en: 'First Name must contain only letters.',
      ar: 'يجب أن يحتوي الاسم الأول على أحرف فقط.',
    },
  },
  middleName: {
    minlength: {
      en: 'Middle Name must be at least 3 characters long.',
      ar: 'يجب أن يتكون الاسم الأوسط من 3 أحرف على الأقل.',
    },
    pattern: {
      en: 'Middle Name must contain only letters.',
      ar: 'يجب أن يحتوي الاسم الأوسط على أحرف فقط.',
    },
  },
  lastName: {
    required: {
      en: 'Last Name is required.',
      ar: 'الاسم الأخير مطلوب.',
    },
    minlength: {
      en: 'Last Name must be at least 3 characters long.',
      ar: 'يجب أن يتكون الاسم الأخير من 3 أحرف على الأقل.',
    },
    pattern: {
      en: 'Last Name must contain only letters.',
      ar: 'يجب أن يحتوي الاسم الأخير على أحرف فقط.',
    },
  },
  email: {
    required: {
      en: 'Email is required.',
      ar: 'البريد الإلكتروني مطلوب.',
    },
    email: {
      en: 'Please enter a valid email address.',
      ar: 'يرجى إدخال عنوان بريد إلكتروني صالح.',
    },
  },
  phoneNumber: {
    required: {
      en: 'Phone number is required.',
      ar: 'رقم الهاتف مطلوب.',
    },
    maxlength: {
      en: 'Phone number must not exceed 16 digits.',
      ar: 'يجب ألا يتجاوز رقم الهاتف 16 رقماً.',
    },
  },
  nationality: {
    required: {
      en: 'Nationality is required.',
      ar: 'الجنسية مطلوبة.',
    },
  },
  dateOfBirth: {
    required: {
      en: 'Date of Birth is required.',
      ar: 'تاريخ الميلاد مطلوب.',
    },
  },
  countryOfResidence: {
    required: {
      en: 'Country of Residence is required.',
      ar: 'بلد الإقامة مطلوب.',
    },
  },
  PassportNumber: {
    required: {
      en: 'Passport Number is required.',
      ar: 'رقم جواز السفر مطلوب.',
    },
    invalidPassport: {
      en: 'Passport Number must be 4-9 alphanumeric characters.',
      ar: 'يجب أن يتكون رقم جواز السفر من 4 إلى 9 أحرف وأرقام.',
    },
  },
  PassportExpiry: {
    required: {
      en: 'Passport Expiry Date is required.',
      ar: 'تاريخ انتهاء صلاحية جواز السفر مطلوب.',
    },
  },
  IssuedCountry: {
    required: {
      en: 'Issued Country is required.',
      ar: 'بلد الإصدار مطلوب.',
    },
  },
  isIssuedCountrySelected: {
    required: {
      en: 'Please select the Issued Country.',
      ar: 'يرجى تحديد بلد الإصدار.',
    },
  },
};
