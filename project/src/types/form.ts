export interface ValidationRule {
  validate: (value: string) => boolean;
  message: string;
}

export interface FormField {
  value: string;
  error: string;
  touched: boolean;
  valid: boolean;
}

export interface FormData {
  firstName: FormField;
  lastName: FormField;
  email: FormField;
  password: FormField;
  confirmPassword: FormField;
  phone: FormField;
  website: FormField;
}

export interface FormErrors {
  [key: string]: string;
}