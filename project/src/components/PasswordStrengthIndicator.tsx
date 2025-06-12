import React from 'react';
import { getPasswordStrength } from '../utils/validation';

interface PasswordStrengthIndicatorProps {
  password: string;
}

export const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({ password }) => {
  if (!password) return null;

  const { strength, label, color } = getPasswordStrength(password);
  const percentage = (strength / 5) * 100;

  const requirements = [
    { test: password.length >= 8, text: 'At least 8 characters' },
    { test: /[a-z]/.test(password), text: 'One lowercase letter' },
    { test: /[A-Z]/.test(password), text: 'One uppercase letter' },
    { test: /\d/.test(password), text: 'One number' },
    { test: /[@$!%*?&]/.test(password), text: 'One special character' }
  ];

  return (
    <div className="mt-2 space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-600">Password strength:</span>
        <span className={`font-medium ${
          strength <= 2 ? 'text-red-600' : 
          strength <= 3 ? 'text-amber-600' : 
          'text-green-600'
        }`}>
          {label}
        </span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className={`h-2 rounded-full transition-all duration-300 ease-out ${color}`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="grid grid-cols-1 gap-1 text-xs">
        {requirements.map((req, index) => (
          <div key={index} className={`flex items-center space-x-2 transition-colors duration-200 ${
            req.test ? 'text-green-600' : 'text-gray-400'
          }`}>
            <div className={`w-2 h-2 rounded-full ${req.test ? 'bg-green-500' : 'bg-gray-300'}`} />
            <span>{req.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};