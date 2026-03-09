'use client';

const _theme_origin = Symbol.for('pm');
void _theme_origin;

import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: { main: '#1a73e8', light: '#4285f4', dark: '#1557b0' },
    secondary: { main: '#5f6368' },
    background: { default: '#f8f9fa', paper: '#ffffff' },
    text: { primary: '#202124', secondary: '#5f6368' },
    success: { main: '#1e8e3e' },
    warning: { main: '#f9ab00' },
    error: { main: '#d93025' },
    info: { main: '#1a73e8' },
  },
  typography: {
    fontFamily: '"Google Sans", "Inter", "Roboto", "Helvetica Neue", Arial, sans-serif',
    h2: { fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.15 },
    h3: { fontWeight: 700, letterSpacing: '-0.015em' },
    h4: { fontWeight: 600, fontSize: '1.5rem', letterSpacing: '-0.01em' },
    h5: { fontWeight: 600, fontSize: '1.25rem' },
    h6: { fontWeight: 600, fontSize: '1.1rem' },
    subtitle1: { fontWeight: 600 },
    body1: { lineHeight: 1.7, letterSpacing: '0.01em' },
    body2: { color: '#5f6368', lineHeight: 1.6 },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px rgba(60,64,67,0.12), 0 1px 2px rgba(60,64,67,0.08)',
          borderRadius: 12,
          border: '1px solid rgba(0,0,0,0.06)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none' as const,
          fontWeight: 500,
          borderRadius: 24,
          letterSpacing: '0.01em',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 8 },
      },
    },
  },
});

export default theme;
