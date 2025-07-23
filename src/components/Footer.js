// src/components/Footer.js
import React from 'react';
import { Box, Link, Typography, useTheme } from '@mui/material';

const Footer = () => {
  const theme = useTheme();
  const year = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        py: 2,
        textAlign: 'center',
        backgroundColor: theme.palette.mode === 'light' ? 'grey.100' : 'grey.900',
        color: theme.palette.text.secondary,
      }}
    >
      <Typography variant="body2">
        © {year} David Schwab.{' '}
        <Link
          href="https://github.com/davidsasc/bingo-editor"
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            color: theme.palette.primary.main,
            textDecoration: 'underline',
          }}
        >
          Source on GitHub
        </Link>
        . Licensed under{' '}
        <Link href="https://opensource.org/licenses/MIT" target="_blank" rel="noopener">
          MIT.
        </Link>
      </Typography>
    </Box>
  );
};

export default Footer;
