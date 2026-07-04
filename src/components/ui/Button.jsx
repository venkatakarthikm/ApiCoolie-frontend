import React from 'react';

/**
 * Reusable loading-aware Button primitive.
 * Enforces loading state spinners and disabling behaviors.
 */
export function Button({
  children,
  loading = false,
  disabled = false,
  variant = 'primary', // 'primary' | 'secondary' | 'outline' | 'danger'
  type = 'button',
  className = '',
  onClick,
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg text-sm px-4 py-2.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-primary text-white hover:bg-opacity-90 active:scale-[0.98]',
    secondary: 'bg-secondary text-primary hover:bg-opacity-80 active:scale-[0.98]',
    outline: 'border border-border text-foreground hover:bg-muted/10',
    danger: 'bg-red-500 text-white hover:bg-red-600 active:scale-[0.98]',
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2.5 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {children}
    </button>
  );
}
