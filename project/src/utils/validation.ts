import { ValidationRule } from '../types/form';

// Common validation rules
export const validationRules = {
  required: (fieldName: string): ValidationRule => ({
    validate: (value: string) => value.trim().length > 0,
    message: `${fieldName} is required`
  }),

  minLength: (min: number, fieldName: string = 'Field'): ValidationRule => ({
    validate: (value: string) => value.length >= min,
    message: `${fieldName} must be at least ${min} characters long`
  }),

  maxLength: (max: number, fieldName: string = 'Field'): ValidationRule => ({
    validate: (value: string) => value.length <= max,
    message: `${fieldName} must be no more than ${max} characters long`
  }),

  email: (): ValidationRule => ({
    validate: (value: string) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value);
    },
    message: 'Please enter a valid email address'
  }),

  password: (): ValidationRule => ({
    validate: (value: string) => {
      // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      return passwordRegex.test(value);
    },
    message: 'Password must contain at least 8 characters, including uppercase, lowercase, number, and special character'
  }),

  phone: (): ValidationRule => ({
    validate: (value: string) => {
      const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
      return phoneRegex.test(value);
    },
    message: 'Please enter a valid phone number'
  }),

  url: (): ValidationRule => ({
    validate: (value: string) => {
      if (!value) return true; // Optional field
      try {
        new URL(value);
        return true;
      } catch {
        return false;
      }
    },
    message: 'Please enter a valid URL'
  })
};

export const validateField = (value: string, rules: ValidationRule[]): string => {
  for (const rule of rules) {
    if (!rule.validate(value)) {
      return rule.message;
    }
  }
  return '';
};

export const getPasswordStrength = (password: string): { strength: number; label: string; color: string } => {
  let strength = 0;
  
  if (password.length >= 8) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/\d/.test(password)) strength++;
  if (/[@$!%*?&]/.test(password)) strength++;

  const strengthMap = {
    0: { label: 'Very Weak', color: 'bg-red-500' },
    1: { label: 'Weak', color: 'bg-red-400' },
    2: { label: 'Fair', color: 'bg-amber-400' },
    3: { label: 'Good', color: 'bg-amber-300' },
    4: { label: 'Strong', color: 'bg-green-400' },
    5: { label: 'Very Strong', color: 'bg-green-500' }
  };

  return {
    strength,
    label: strengthMap[strength as keyof typeof strengthMap].label,
    color: strengthMap[strength as keyof typeof strengthMap].color
  };
};