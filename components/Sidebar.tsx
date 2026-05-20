'use client';

import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { UsuarioSession } from '@/lib/auth';
import { menuItems } from '@/lib/permissions';

interface SidebarProps {
  usuario: UsuarioSession;
  open: boolean;
  onClose: () => void;
}

const iconMap: Record<string, string> = {
  'Dashboard': 'dashboard',
  'Usuários': 'people',
  'Categorias': 'category',
  'Autores': 'create',
  'Livros': 'menu_book',
  'Leitores': 'person',
  'Vendas': 'shopping_cart',
  'Empréstimos': 'assignment',
};

export function Sidebar({ usuario, open, onClose }: SidebarProps) {
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  const pathname = usePathname();

  const visibleItems = menuItems.filter(item =>
    item.roles.includes(usuario.role)
  );

  const content = (
    <Box sx={{ width: 250, display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* User Profile Card */}
      <Box
        sx={{
          p: 2.5,
          background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
          color: 'white',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            mb: 1,
          }}
        >
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '1rem',
            }}
          >
            {usuario.nome?.[0]?.toUpperCase() || 'U'}
          </Box>
          <Box>
            <Box sx={{ fontWeight: 600, fontSize: '0.95rem' }}>
              {usuario.nome}
            </Box>
            <Box sx={{ fontSize: '0.7rem', opacity: 0.85 }}>
              Vendedor
            </Box>
          </Box>
        </Box>
        <Box sx={{ fontSize: '0.75rem', opacity: 0.8, wordBreak: 'break-word' }}>
          {usuario.email}
        </Box>
      </Box>

      <Divider sx={{ my: 0 }} />

      {/* Navigation Menu */}
      <List sx={{ p: 0, flex: 1, overflow: 'auto' }}>
        {visibleItems.map(item => {
          const isActive = pathname === item.href;
          const icon = iconMap[item.label] || 'dashboard';

          return (
            <ListItem
              key={item.href}
              component={Link}
              href={item.href}
              onClick={() => isMobile && onClose()}
              sx={{
                pl: 2,
                pr: 2,
                py: 1.25,
                mb: 0.5,
                mx: 1,
                borderRadius: 1,
                position: 'relative',
                transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
                backgroundColor: isActive ? 'action.selected' : 'transparent',
                color: isActive ? 'primary.main' : 'text.primary',
                fontWeight: isActive ? 600 : 500,
                '&::before': isActive ? {
                  content: '""',
                  position: 'absolute',
                  left: 0,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: 4,
                  height: 24,
                  borderRadius: '0 2px 2px 0',
                  background: 'linear-gradient(180deg, #4f46e5 0%, #7c3aed 100%)',
                } : {},
                '&:hover': {
                  backgroundColor: isActive ? 'action.selected' : 'action.hover',
                  pl: 2.5,
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 40,
                  color: isActive ? 'primary.main' : 'text.secondary',
                  transition: 'color 200ms ease',
                }}
              >
                <i className="material-icons" style={{ fontSize: '22px' }}>
                  {icon}
                </i>
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  sx: {
                    fontSize: '0.95rem',
                  },
                }}
              />
            </ListItem>
          );
        })}
      </List>
    </Box>
  );

  return (
    <Drawer
      variant={isMobile ? 'temporary' : 'permanent'}
      open={open}
      onClose={onClose}
      sx={{
        width: 250,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 250,
          boxSizing: 'border-box',
          mt: isMobile ? 0 : '64px',
          height: isMobile ? '100vh' : 'calc(100vh - 64px)',
          borderRight: '1px solid',
          borderColor: 'divider',
        },
      }}
    >
      {content}
    </Drawer>
  );
}
