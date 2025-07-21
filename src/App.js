// src/App.js
import React, { useState } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { getTheme } from './theme/theme';
import Layout from './components/Layout';
import Home from './pages/Home';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const theme = getTheme(darkMode ? 'dark' : 'light');

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Layout darkMode={darkMode} onToggleTheme={() => setDarkMode(!darkMode)}>
        <Home />
      </Layout>
    </ThemeProvider>
  );
}

export default App;
