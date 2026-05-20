import { Paper, PaperProps } from '@mui/material';

interface CardProps extends Omit<PaperProps, 'variant'> {
  outlined?: boolean;
}

export function Card({
  elevation = 1,
  outlined = false,
  children,
  sx,
  ...props
}: CardProps) {
  return (
    <Paper
      elevation={outlined ? 0 : elevation}
      variant={outlined ? 'outlined' : undefined}
      sx={{ p: 2, ...sx }}
      {...props}
    >
      {children}
    </Paper>
  );
}
