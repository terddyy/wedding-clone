/**
 * Button Component
 * 
 * A reusable, styled button component with multiple variants.
 * 
 * FEATURES:
 * - Multiple variants (primary, secondary, outline)
 * - Loading state with spinner
 * - Disabled state
 * - Accessibility (WCAG compliant)
 * - Responsive sizing
 */

'use client';

import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  isLoading?: boolean;
  fullWidth?: boolean;
}

/**
 * Button Component
 * 
 * @param children - Button content (text, icon, etc.)
 * @param variant - Visual style variant
 * @param isLoading - Show loading spinner and disable button
 * @param fullWidth - Make button full width of container
 * @param className - Additional Tailwind CSS classes
 * @param props - All standard HTML button attributes
 */
export default function Button({
  children,
  variant = 'primary',
  isLoading = false,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  // Base styles applied to all buttons
  const baseStyles = `
    px-6 py-3 rounded-lg font-semibold
    transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
    ${fullWidth ? 'w-full' : ''}
  `;

  // Variant-specific styles
  const variantStyles = {
    primary: `
      bg-blush-500 text-white
      hover:bg-blush-600
      focus:ring-blush-400
      active:bg-blush-700
    `,
    secondary: `
      bg-sky-500 text-white
      hover:bg-sky-600
      focus:ring-sky-400
      active:bg-sky-700
    `,
    outline: `
      bg-transparent border-2 border-blush-500 text-blush-600
      hover:bg-blush-50
      focus:ring-blush-400
      active:bg-blush-100
    `,
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center justify-center">
          {/* Loading Spinner */}
          <svg
            className="animate-spin -ml-1 mr-3 h-5 w-5 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  );
}
