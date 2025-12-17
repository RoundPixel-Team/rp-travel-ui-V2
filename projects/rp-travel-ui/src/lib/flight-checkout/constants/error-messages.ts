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
      en: 'Your name is too short (minimum 2 characters).',
      ar: 'اسمك قصير جداً (الحد الأدنى حرفين).',
    },
    lettersOnly: {
      en: 'First Name is required to be letters only.',
      ar: 'يجب أن يحتوي الاسم الأول على أحرف فقط.',
    },
    leadingTrailingSpaces: {
      en: 'Please remove any spaces at the beginning or end of your name.',
      ar: 'يرجى إزالة أي مسافات في بداية أو نهاية اسمك.',
    },
  },
  middleName: {
    minlength: {
      en: 'Middle Name must be at least 2 characters long.',
      ar: 'يجب أن يتكون الاسم الأوسط من حرفين على الأقل.',
    },
    lettersOnly: {
      en: 'Middle Name is required to be letters only.',
      ar: 'يجب أن يحتوي الاسم الأوسط على أحرف فقط.',
    },
    leadingTrailingSpaces: {
      en: 'Please remove any spaces at the beginning or end of your name.',
      ar: 'يرجى إزالة أي مسافات في بداية أو نهاية اسمك.',
    },
  },
  lastName: {
    required: {
      en: 'Last Name is required.',
      ar: 'الاسم الأخير مطلوب.',
    },
    minlength: {
      en: 'Last Name must be at least 2 characters long.',
      ar: 'يجب أن يتكون الاسم الأخير من حرفين على الأقل.',
    },
    lettersOnly: {
      en: 'Last Name is required to be letters only.',
      ar: 'يجب أن يحتوي الاسم الأخير على أحرف فقط.',
    },
    leadingTrailingSpaces: {
      en: 'Please remove any spaces at the beginning or end of your name.',
      ar: 'يرجى إزالة أي مسافات في بداية أو نهاية اسمك.',
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
