import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';

import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import AppRoutes from './routes/AppRoutes';

// Create a basic MUI theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#3567e8',
    },
    secondary: {
      main: '#31b2ff',
    },
    background: {
      default: '#f4f7ff',
    },
  },
  typography: {
    fontFamily: '"Manrope", "Segoe UI", sans-serif',
    h1: { fontFamily: '"Space Grotesk", "Manrope", sans-serif' },
    h2: { fontFamily: '"Space Grotesk", "Manrope", sans-serif' },
    h3: { fontFamily: '"Space Grotesk", "Manrope", sans-serif' },
    h4: { fontFamily: '"Space Grotesk", "Manrope", sans-serif' },
    h5: { fontFamily: '"Space Grotesk", "Manrope", sans-serif' },
    h6: { fontFamily: '"Space Grotesk", "Manrope", sans-serif' },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <NotificationProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;