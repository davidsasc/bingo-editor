import React from 'react';
import { Box, Container } from '@mui/material';
import Header from './Header';
import Footer from './Footer';

const Layout = ({ children, darkMode, onToggleTheme }) => {
  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <Header darkMode={darkMode} onToggleTheme={onToggleTheme} />
      <Container component="main" sx={{ flexGrow: 1, py: 4 }}>
        {children}
      </Container>
      <Footer />
    </Box>
  );
};

export default Layout;
