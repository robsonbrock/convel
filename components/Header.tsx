'use client';

import {
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Box,
  Tooltip,
  useTheme,
  Divider,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LogoutIcon from '@mui/icons-material/Logout';
import { useTheme as useAppTheme } from '@/context/ThemeContext';
import { UsuarioSession } from '@/lib/auth';
import Link from 'next/link';
import { useState } from 'react';

interface HeaderProps {
  usuario?: UsuarioSession;
  onMenuToggle: () => void;
}

export function Header({ usuario, onMenuToggle }: HeaderProps) {
  const { isDark, toggleTheme } = useAppTheme();
  const muiTheme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      await supabase.auth.signOut();
      window.location.href = '/auth/login';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AppBar position="static" elevation={0}>
      <Toolbar sx={{ px: { xs: 2, sm: 3 } }}>
        {/* Logo */}
        <Link href="/dashboard" style={{ textDecoration: 'none', color: 'inherit', flexGrow: 1 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              cursor: 'pointer',
              transition: 'opacity 200ms ease',
              '&:hover': {
                opacity: 0.8,
              },
            }}
          >
            <Box
              sx={{
                background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                color: 'white',
                width: 40,
                height: 40,
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '1.25rem',
              }}
            >
              C
            </Box>
            <Box>
              <Box
                sx={{
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  color: 'text.primary',
                  lineHeight: 1,
                }}
              >
                ConVEL
              </Box>
              <Box
                sx={{
                  fontSize: '0.65rem',
                  color: 'text.secondary',
                  fontWeight: 500,
                }}
              >
                Sistema de Controle
              </Box>
            </Box>
          </Box>
        </Link>

        {/* Spacer */}
        <Box sx={{ flexGrow: 0 }} />

        {/* Theme Toggle */}
        <Tooltip title={isDark ? 'Modo Claro' : 'Modo Escuro'}>
          <IconButton
            onClick={toggleTheme}
            sx={{
              color: 'text.primary',
              transition: 'all 200ms ease',
              '&:hover': {
                backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
              },
            }}
          >
            {isDark ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
        </Tooltip>

        {/* Mobile Menu Button */}
        <IconButton
          color="inherit"
          onClick={onMenuToggle}
          sx={{
            display: { xs: 'flex', md: 'none' },
            color: 'text.primary',
          }}
        >
          <MenuIcon />
        </IconButton>

        {/* User Menu */}
        <IconButton
          onClick={handleMenuOpen}
          sx={{
            ml: 1,
            transition: 'all 200ms ease',
          }}
        >
          <Avatar
            sx={{
              width: 36,
              height: 36,
              fontSize: '0.875rem',
              background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(79, 70, 229, 0.2)',
            }}
          >
            {usuario?.nome?.[0]?.toUpperCase() || 'U'}
          </Avatar>
        </IconButton>

        {/* User Menu Dropdown */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          PaperProps={{
            sx: {
              mt: 1,
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
              borderRadius: 2,
              minWidth: 240,
            },
          }}
        >
          <MenuItem disabled sx={{ py: 1.5 }}>
            <Box>
              <Box sx={{ fontWeight: 600, color: 'text.primary', fontSize: '0.95rem' }}>
                {usuario?.nome || 'Usuário'}
              </Box>
              <Box sx={{ fontSize: '0.75rem', color: 'text.secondary', mt: 0.5 }}>
                {usuario?.email}
              </Box>
            </Box>
          </MenuItem>
          <Divider />
          <MenuItem
            onClick={() => {
              handleMenuClose();
              handleLogout();
            }}
            sx={{
              color: 'error.main',
              '&:hover': {
                backgroundColor: 'error.lighter',
              },
            }}
          >
            <LogoutIcon sx={{ mr: 1, fontSize: '1.2rem' }} />
            Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
