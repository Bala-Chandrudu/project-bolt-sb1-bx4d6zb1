import React from 'react';
import { useForm } from '../hooks/useForm';
import { FormField } from './FormField';
import { PasswordStrengthIndicator } from './PasswordStrengthIndicator';
import { validationRules } from '../utils/validation';
import { CheckCircle, Send, Loader2 } from 'lucide-react';

export const FormValidationDemo: React.FC = () => {
  const {
    formData,
    updateField,
    handleBlur,
    handleSubmit,
    isSubmitting,
    submitSuccess,
    isFormValid
  } = useForm({
    validationRules: {
      firstName: [validationRules.required('First name'), validationRules.minLength(2, 'First name')],
      lastName: [validationRules.required('Last name'), validationRules.minLength(2, 'Last name')],
      email: [validationRules.required('Email'), validationRules.email()],
      password: [validationRules.required('Password'), validationRules.password()],
      confirmPassword: [validationRules.required('Confirm password')],
      phone: [validationRules.required('Phone number'), validationRules.phone()],
      website: [validationRules.url()]
    },
    onSubmit: async (data) => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Form submitted:', data);
    }
  });

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Success!</h2>
          <p className="text-gray-600 mb-6">Your form has been submitted successfully.</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
          >
            Submit Another Form
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Advanced Form Validation</h1>
          <p className="text-gray-600">Experience real-time validation with beautiful feedback</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="First Name"
              value={formData.firstName.value}
              error={formData.firstName.error}
              valid={formData.firstName.valid}
              touched={formData.firstName.touched}
              placeholder="Enter your first name"
              onChange={(value) => updateField('firstName', value)}
              onBlur={() => handleBlur('firstName')}
              required
            />
            
            <FormField
              label="Last Name"
              value={formData.lastName.value}
              error={formData.lastName.error}
              valid={formData.lastName.valid}
              touched={formData.lastName.touched}
              placeholder="Enter your last name"
              onChange={(value) => updateField('lastName', value)}
              onBlur={() => handleBlur('lastName')}
              required
            />
          </div>

          {/* Email */}
          <FormField
            label="Email Address"
            type="email"
            value={formData.email.value}
            error={formData.email.error}
            valid={formData.email.valid}
            touched={formData.email.touched}
            placeholder="Enter your email address"
            onChange={(value) => updateField('email', value)}
            onBlur={() => handleBlur('email')}
            required
          />

          {/* Password with strength indicator */}
          <FormField
            label="Password"
            type="password"
            value={formData.password.value}
            error={formData.password.error}
            valid={formData.password.valid}
            touched={formData.password.touched}
            placeholder="Create a strong password"
            onChange={(value) => updateField('password', value)}
            onBlur={() => handleBlur('password')}
            required
          >
            <PasswordStrengthIndicator password={formData.password.value} />
          </FormField>

          {/* Confirm Password */}
          <FormField
            label="Confirm Password"
            type="password"
            value={formData.confirmPassword.value}
            error={formData.confirmPassword.error}
            valid={formData.confirmPassword.valid}
            touched={formData.confirmPassword.touched}
            placeholder="Confirm your password"
            onChange={(value) => updateField('confirmPassword', value)}
            onBlur={() => handleBlur('confirmPassword')}
            required
          />

          {/* Phone */}
          <FormField
            label="Phone Number"
            type="tel"
            value={formData.phone.value}
            error={formData.phone.error}
            valid={formData.phone.valid}
            touched={formData.phone.touched}
            placeholder="+1 (555) 123-4567"
            onChange={(value) => updateField('phone', value)}
            onBlur={() => handleBlur('phone')}
            required
          />

          {/* Website (optional) */}
          <FormField
            label="Website"
            type="url"
            value={formData.website.value}
            error={formData.website.error}
            valid={formData.website.valid}
            touched={formData.website.touched}
            placeholder="https://yourwebsite.com (optional)"
            onChange={(value) => updateField('website', value)}
            onBlur={() => handleBlur('website')}
          />

          {/* Submit button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting || !isFormValid}
              className={`
                w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium
                transition-all duration-200 ease-in-out transform
                ${isSubmitting || !isFormValid
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]'
                }
              `}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>Submit Form</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Form status indicator */}
        <div className="mt-6 text-center">
          <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${
            isFormValid 
              ? 'bg-green-100 text-green-700' 
              : 'bg-amber-100 text-amber-700'
          }`}>
            <div className={`w-2 h-2 rounded-full ${
              isFormValid ? 'bg-green-500' : 'bg-amber-500'
            }`} />
            <span>{isFormValid ? 'Form is valid' : 'Please complete all required fields'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};