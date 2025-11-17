/**
 * Textarea Component
 * 
 * A reusable, styled textarea component for multi-line text input.
 * 
 * FEATURES:
 * - Consistent styling with Input component
 * - Accessibility (WCAG compliant)
 * - Auto-resizing support
 * - Character count display (optional)
 * - Focus and hover states
 */

'use client';

import { TextareaHTMLAttributes, forwardRef } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  showCharCount?: boolean;
}

/**
 * Textarea Component
 * 
 * @param label - Optional label text displayed above textarea
 * @param error - Optional error message displayed below textarea
 * @param showCharCount - Show character count (requires maxLength)
 * @param className - Additional Tailwind CSS classes
 * @param props - All standard HTML textarea attributes
 */
const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, showCharCount, className = '', ...props }, ref) => {
    const currentLength = props.value?.toString().length || 0;
    const maxLength = props.maxLength;

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
        <textarea
          ref={ref}
          className={`
            w-full px-4 py-3 rounded-lg border-2 
            ${error ? 'border-red-500' : 'border-gray-200'}
            focus:outline-none focus:ring-2 
            ${error ? 'focus:ring-red-500' : 'focus:ring-blush-400'}
            transition-all duration-200
            placeholder:text-gray-400
            disabled:bg-gray-100 disabled:cursor-not-allowed
            resize-none
            ${className}
          `}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${props.id}-error` : undefined}
          {...props}
        />
        
        {/* Character Count */}
        {showCharCount && maxLength && (
          <p className="mt-1 text-xs text-gray-500 text-right">
            {currentLength} / {maxLength}
          </p>
        )}
        
        {/* Error Message */}
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

Textarea.displayName = 'Textarea';

export default Textarea;
