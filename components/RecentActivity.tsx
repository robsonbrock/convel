'use client';

import { Card, CardContent, Box, Typography, useTheme } from '@mui/material';

interface Activity {
  id: string;
  title: string;
  description: string;
  icon: string;
  timestamp: Date;
  type: 'info' | 'success' | 'warning' | 'error';
}

interface RecentActivityProps {
  activities?: Activity[];
}

export function RecentActivity({ activities = [] }: RecentActivityProps) {
  const theme = useTheme();

  const typeColors: Record<string, string> = {
    info: theme.palette.info.main,
    success: theme.palette.success.main,
    warning: theme.palette.warning.main,
    error: theme.palette.error.main,
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Agora';
    if (diffMins < 60) return `${diffMins}m atrás`;
    if (diffHours < 24) return `${diffHours}h atrás`;
    if (diffDays < 7) return `${diffDays}d atrás`;

    return date.toLocaleDateString('pt-BR');
  };

  return (
    <Card>
      <CardContent sx={{ p: 3 }}>
        {activities.length === 0 ? (
          <Box
            sx={{
              textAlign: 'center',
              py: 5,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                backgroundColor: 'action.hover',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <i
                className="material-icons"
                style={{
                  fontSize: '40px',
                  opacity: 0.4,
                }}
              >
                history
              </i>
            </Box>
            <Typography
              variant="body2"
              color="textSecondary"
              sx={{ fontWeight: 500 }}
            >
              Nenhuma atividade recente para exibir
            </Typography>
          </Box>
        ) : (
          <Box>
            {activities.map((activity, index) => (
              <Box
                key={activity.id}
                sx={{
                  display: 'flex',
                  gap: 2,
                  pb: 2,
                  mb: index < activities.length - 1 ? 2 : 0,
                  borderBottom: index < activities.length - 1 ? '1px solid' : 'none',
                  borderColor: 'divider',
                  position: 'relative',
                }}
              >
                {/* Timeline dot */}
                <Box
                  sx={{
                    flexShrink: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      backgroundColor: typeColors[activity.type],
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: `0 0 12px ${typeColors[activity.type]}40`,
                    }}
                  >
                    <i
                      className="material-icons"
                      style={{
                        fontSize: '20px',
                        color: 'white',
                      }}
                    >
                      {activity.icon}
                    </i>
                  </Box>
                  {index < activities.length - 1 && (
                    <Box
                      sx={{
                        width: 2,
                        height: 24,
                        backgroundColor: 'divider',
                        mt: 1,
                      }}
                    />
                  )}
                </Box>

                {/* Activity content */}
                <Box sx={{ flex: 1, pt: 0.5 }}>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 600, mb: 0.5 }}
                  >
                    {activity.title}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="textSecondary"
                    sx={{ display: 'block', mb: 1 }}
                  >
                    {activity.description}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: 'text.secondary',
                      fontSize: '0.75rem',
                    }}
                  >
                    {formatTime(activity.timestamp)}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
