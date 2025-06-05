// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import MapContainer from './features/MapView/MapContainer';
import { CssBaseline } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';

// Puedes personalizar tu tema MUI si lo deseas
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <MapContainer />
    </ThemeProvider>
  </React.StrictMode>
);
