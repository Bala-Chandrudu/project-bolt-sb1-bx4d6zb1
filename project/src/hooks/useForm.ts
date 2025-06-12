import { useState, useCallback } from 'react';
import { FormData, FormField, ValidationRule } from '../types/form';
import { validateField } from '../utils/validation';

const createInitialField = (): FormField => ({
  value: '',
  error: '',
  touched: false,
  valid: false
});

const initialFormData: FormData = {
  firstName: createInitialField(),
  lastName: createInitialField(),
  email: createInitialField(),
  password: createInitialField(),
  confirmPassword: createInitialField(),
  phone: createInitialField(),
  website: createInitialField()
};

interface UseFormProps {
  validationRules: { [key: string]: ValidationRule[] };
  onSubmit: (data: { [key: string]: string }) => Promise<void>;
}

export const useForm = ({ validationRules, onSubmit }: UseFormProps) => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const updateField = useCallback((fieldName: keyof FormData, value: string) => {
    setFormData(prev => {
      const rules = validationRules[fieldName] || [];
      const error = validateField(value, rules);
      
      // Special case for confirm password
      if (fieldName === 'confirmPassword') {
        const passwordValue = prev.password.value;
        if (value !== passwordValue && value.length > 0) {
          return {
            ...prev,
            [fieldName]: {
              value,
              error: 'Passwords do not match',
              touched: true,
              valid: false
            }
          };
        }
      }

      // If password changes, revalidate confirm password
      const updatedData = {
        ...prev,
        [fieldName]: {
          value,
          error,
          touched: true,
          valid: !error
        }
      };

      if (fieldName === 'password' && prev.confirmPassword.value) {
        const confirmPasswordError = value !== prev.confirmPassword.value ? 'Passwords do not match' : '';
        updatedData.confirmPassword = {
          ...prev.confirmPassword,
          error: confirmPasswordError,
          valid: !confirmPasswordError
        };
      }

      return updatedData;
    });
  }, [validationRules]);

  const handleBlur = useCallback((fieldName: keyof FormData) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: {
        ...prev[fieldName],
        touched: true
      }
    }));
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mark all fields as touched first
    const touchedData = Object.keys(formData).reduce((acc, key) => {
      const fieldKey = key as keyof FormData;
      const rules = validationRules[fieldKey] || [];
      const error = validateField(formData[fieldKey].value, rules);
      
      // Special validation for confirm password
      let finalError = error;
      if (fieldKey === 'confirmPassword') {
        const passwordValue = formData.password.value;
        if (formData[fieldKey].value !== passwordValue) {
          finalError = 'Passwords do not match';
        }
      }
      
      acc[fieldKey] = { 
        ...formData[fieldKey], 
        touched: true,
        error: finalError,
        valid: !finalError
      };
      return acc;
    }, {} as FormData);

    setFormData(touchedData);

    // Check if all required fields are valid
    const requiredFields = ['firstName', 'lastName', 'email', 'password', 'confirmPassword', 'phone'];
    const isFormValid = requiredFields.every(key => {
      const fieldKey = key as keyof FormData;
      return touchedData[fieldKey].valid && touchedData[fieldKey].value.trim() !== '';
    }) && (touchedData.website.value === '' || touchedData.website.valid); // Website is optional

    if (!isFormValid) {
      return; // Don't submit if form is invalid
    }

    setIsSubmitting(true);
    setSubmitSuccess(false);

    try {
      const submitData = Object.keys(formData).reduce((acc, key) => {
        const fieldKey = key as keyof FormData;
        acc[key] = formData[fieldKey].value;
        return acc;
      }, {} as { [key: string]: string });

      await onSubmit(submitData);
      setSubmitSuccess(true);
      setFormData(initialFormData); // Reset form
    } catch (error) {
      console.error('Form submission error:', error);
    }

    setIsSubmitting(false);
  }, [formData, onSubmit, validationRules]);

  // Calculate if form is valid for button state
  const requiredFields = ['firstName', 'lastName', 'email', 'password', 'confirmPassword', 'phone'];
  const isFormValid = requiredFields.every(key => {
    const fieldKey = key as keyof FormData;
    return formData[fieldKey].valid && formData[fieldKey].value.trim() !== '';
  }) && (formData.website.value === '' || formData.website.valid);

  return {
    formData,
    updateField,
    handleBlur,
    handleSubmit,
    isSubmitting,
    submitSuccess,
    isFormValid
  };
};