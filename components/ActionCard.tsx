'use client';

import { Card, CardContent, Box, Typography, useTheme } from '@mui/material';

interface ActionCardProps {
  title: string;
  icon: string;
  onClick?: () => void;
  color?: 'primary' | 'secondary' | 'tertiary' | 'success' | 'warning' | 'error' | 'info';
}

export function ActionCard({
  title,
  icon,
  onClick,
  color = 'primary',
}: ActionCardProps) {
  const theme = useTheme();

  const colorMap: Record<string, any> = {
    primary: theme.palette.primary,
    secondary: theme.palette.secondary,
    tertiary: theme.palette.info,
    success: theme.palette.success,
    warning: theme.palette.warning,
    error: theme.palette.error,
    info: theme.palette.info,
  };

  const selectedColor = colorMap[color];

  return (
    <Card
      onClick={onClick}
      sx={{
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: '-100%',
          width: '100%',
          height: '100%',
          background: `linear-gradient(90deg, transparent, ${selectedColor.main}10, transparent)`,
          transition: 'left 400ms ease',
        },
        '&:hover': {
          transform: 'translateY(-6px) scale(1.02)',
          '&::before': {
            left: '100%',
          },
        },
      }}
    >
      <CardContent sx={{ py: 4, px: 3, position: 'relative', zIndex: 1 }}>
        <Box
          sx={{
            mb: 2,
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              backgroundColor: `${selectedColor.main}15`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 200ms ease',
            }}
          >
            <i
              className="material-icons"
              style={{
                fontSize: '32px',
                color: selectedColor.main,
              }}
            >
              {icon}
            </i>
          </Box>
        </Box>

        <Typography
          variant="body2"
          sx={{
            fontWeight: 600,
            fontSize: '0.95rem',
            color: 'text.primary',
          }}
        >
          {title}
        </Typography>
      </CardContent>
    </Card>
  );
}
