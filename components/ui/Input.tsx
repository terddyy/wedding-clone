/**
 * Input Component
 * 
 * A reusable, styled input field component following accessibility best practices.
 * 
 * FEATURES:
 * - Consistent styling across application
 * - Accessibility (WCAG compliant)
 * - Error state handling
 * - Focus and hover states
 * - Supports all standard HTML input attributes
 */

'use client';

import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

/**
 * Input Component
 * 
 * @param label - Optional label text displayed above input
 * @param error - Optional error message displayed below input
 * @param className - Additional Tailwind CSS classes
 * @param props - All standard HTML input attributes
 */
const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={props.id}
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`
            w-full px-4 py-3 rounded-lg border-2 
            ${error ? 'border-red-500' : 'border-gray-200'}
            focus:outline-none focus:ring-2 
            ${error ? 'focus:ring-red-500' : 'focus:ring-blush-400'}
            transition-all duration-200
            placeholder:text-gray-400
            disabled:bg-gray-100 disabled:cursor-not-allowed
            ${className}
          `}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${props.id}-error` : undefined}
          {...props}
        />
        {error && (
          <p
            id={`${props.id}-error`}
            className="mt-2 text-sm text-red-600"
            role="alert"
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
