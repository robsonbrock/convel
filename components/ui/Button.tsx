import { Button as MuiButton, ButtonProps as MuiButtonProps } from '@mui/material';

interface ButtonProps extends Omit<MuiButtonProps, 'variant' | 'size'> {
  variant?: 'filled' | 'tonal' | 'outlined' | 'text';
  size?: 'small' | 'medium' | 'large';
}

export function Button({
  variant = 'filled',
  size = 'medium',
  children,
  ...props
}: ButtonProps) {
  const variantMap = {
    filled: 'contained' as const,
    tonal: 'contained' as const,
    outlined: 'outlined' as const,
    text: 'text' as const,
  };

  return (
    <MuiButton
      variant={variantMap[variant]}
      size={size}
      color={variant === 'tonal' ? 'secondary' : 'primary'}
      {...props}
    >
      {children}
    </MuiButton>
  );
}
