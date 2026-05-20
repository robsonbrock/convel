'use client';

import { Card, CardContent, Box, Typography, Stack, useTheme } from '@mui/material';
import { useMemo } from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: string;
  trend?: {
    value: number;
    direction: 'up' | 'down';
  };
  color?: 'primary' | 'secondary' | 'tertiary' | 'success' | 'warning' | 'error' | 'info';
}

export function StatCard({
  label,
  value,
  icon,
  trend,
  color = 'primary',
}: StatCardProps) {
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
  const bgGradient = useMemo(() => {
    const isDark = theme.palette.mode === 'dark';
    const colorLight = selectedColor.light || selectedColor.main;
    const colorDark = selectedColor.dark || selectedColor.main;

    if (isDark) {
      return `linear-gradient(135deg, rgba(${hexToRgb(colorLight)}, 0.15) 0%, rgba(${hexToRgb(colorDark)}, 0.05) 100%)`;
    }
    return `linear-gradient(135deg, rgba(${hexToRgb(colorLight)}, 0.1) 0%, rgba(${hexToRgb(selectedColor.main)}, 0.05) 100%)`;
  }, [selectedColor, theme.palette.mode]);

  return (
    <Card
      sx={{
        background: bgGradient,
        transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.palette.mode === 'dark'
            ? '0 12px 32px rgba(99, 102, 241, 0.2)'
            : '0 12px 32px rgba(79, 70, 229, 0.15)',
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Stack spacing={2}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
            }}
          >
            <Box
              sx={{
                p: 1.5,
                borderRadius: 2,
                backgroundColor: `${selectedColor.main}15`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 48,
                height: 48,
              }}
            >
              <i
                className="material-icons"
                style={{
                  fontSize: '24px',
                  color: selectedColor.main,
                }}
              >
                {icon}
              </i>
            </Box>

            {trend && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  backgroundColor: trend.direction === 'up' ? '#dcfce7' : '#fee2e2',
                  color: trend.direction === 'up' ? '#166534' : '#991b1b',
                  px: 1,
                  py: 0.5,
                  borderRadius: 1,
                  fontSize: '0.75rem',
                  fontWeight: 600,
                }}
              >
                <i
                  className="material-icons"
                  style={{ fontSize: '14px' }}
                >
                  {trend.direction === 'up' ? 'trending_up' : 'trending_down'}
                </i>
                {Math.abs(trend.value)}%
              </Box>
            )}
          </Box>

          <Box>
            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
                fontWeight: 500,
                mb: 0.5,
              }}
            >
              {label}
            </Typography>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                background: `linear-gradient(135deg, ${selectedColor.main} 0%, ${selectedColor.light || selectedColor.main} 100%)`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {value}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (result) {
    return `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`;
  }
  return '79, 70, 229';
}
