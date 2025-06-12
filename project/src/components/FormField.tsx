import React from 'react';
import { AlertCircle, Check } from 'lucide-react';

interface FormFieldProps {
  label: string;
  type?: string;
  value: string;
  error: string;
  valid: boolean;
  touched: boolean;
  placeholder?: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  required?: boolean;
  children?: React.ReactNode;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  type = 'text',
  value,
  error,
  valid,
  touched,
  placeholder,
  onChange,
  onBlur,
  required = false,
  children
}) => {
  const hasError = touched && error;
  const hasSuccess = touched && valid && value;

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          placeholder={placeholder}
          className={`
            w-full px-4 py-3 border rounded-lg transition-all duration-200 ease-in-out
            focus:outline-none focus:ring-2 focus:ring-offset-1
            ${hasError 
              ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
              : hasSuccess
              ? 'border-green-300 focus:border-green-500 focus:ring-green-200'
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
            }
            ${hasError ? 'pr-10' : hasSuccess ? 'pr-10' : ''}
          `}
        />
        
        {/* Status icon */}
        {touched && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            {hasError ? (
              <AlertCircle className="h-5 w-5 text-red-500" />
            ) : hasSuccess ? (
              <Check className="h-5 w-5 text-green-500" />
            ) : null}
          </div>
        )}
      </div>

      {/* Additional content (like password strength) */}
      {children}

      {/* Error message */}
      {hasError && (
        <div className="flex items-center space-x-1 text-sm text-red-600 animate-fade-in">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};