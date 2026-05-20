import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'filled' | 'tonal' | 'outlined' | 'text';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export function Button({
  variant = 'filled',
  size = 'md',
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles = 'font-medium rounded-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2';

  const variants = {
    filled: 'bg-primary-40 text-primary-99 hover:shadow-elevation-1 focus:ring-primary-40',
    tonal: 'bg-secondary-90 text-secondary-40 hover:shadow-elevation-1 focus:ring-secondary-40',
    outlined: 'border-2 border-secondary-50 text-secondary-40 hover:bg-primary-5 focus:ring-secondary-40',
    text: 'text-primary-40 hover:bg-primary-95 focus:ring-primary-40',
  };

  const sizes = {
    sm: 'px-3 py-2 text-label-sm',
    md: 'px-6 py-3 text-label-md',
    lg: 'px-8 py-4 text-label-lg',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    />
  );
}
