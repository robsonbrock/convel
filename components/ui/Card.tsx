import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  elevation?: 0 | 1 | 2 | 3 | 4 | 5;
  variant?: 'filled' | 'outlined';
}

export function Card({
  children,
  className = '',
  elevation = 1,
  variant = 'filled'
}: CardProps) {
  const elevationClasses = {
    0: 'shadow-elevation-0',
    1: 'shadow-elevation-1',
    2: 'shadow-elevation-2',
    3: 'shadow-elevation-3',
    4: 'shadow-elevation-4',
    5: 'shadow-elevation-5',
  };

  const variantClasses = {
    filled: 'bg-primary-99',
    outlined: 'bg-primary-99 border border-secondary-80',
  };

  return (
    <div
      className={`${variantClasses[variant]} rounded-lg p-6 ${elevationClasses[elevation]} ${className}`}
    >
      {children}
    </div>
  );
}
