import React from 'react';
import { AppBar, Toolbar, Typography, Switch } from '@mui/material';

const Header = ({ darkMode, onToggleTheme }) => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Bingo Creator
        </Typography>
        <Switch checked={darkMode} onChange={onToggleTheme} />
      </Toolbar>
    </AppBar>
  );
};

export default Header;