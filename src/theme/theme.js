import { createTheme } from '@mui/material/styles';

export const getTheme = (mode) =>
  createTheme({
    palette: {
      mode,
      ...(mode === 'light'
        ? {
            primary: { main: '#0c2d0aff' },
            background: { default: '#ffffffff', paper: '#fff' },
          }
        : {
            primary: { main: '#90caf9' },
            background: { default: '#121212', paper: '#1d1d1d' },
          }),
    },
  });
