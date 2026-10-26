import { createTheme, PaletteMode } from '@mui/material';

export const display = '"Fraunces", Georgia, serif';
const body = '"Instrument Sans", system-ui, sans-serif';

export const buildTheme = (mode: PaletteMode) => {
  const dark = mode === 'dark';
  return createTheme({
    palette: {
      mode,
      primary: { main: dark ? '#6FC2A5' : '#1F5C4A' },
      secondary: { main: dark ? '#E48A62' : '#C0572B' },
      background: { default: dark ? '#111614' : '#F3F0E8', paper: dark ? '#19201D' : '#FBF9F4' },
      text: { primary: dark ? '#E9EEEA' : '#1B231F', secondary: dark ? '#9AA79F' : '#5B665F' },
      divider: dark ? '#2A332F' : '#E2DDD0',
      success: { main: dark ? '#7FD1A0' : '#2E7D55' },
      error: { main: dark ? '#F08C7E' : '#B3402F' },
      warning: { main: dark ? '#E3B454' : '#A8741A' },
    },
    shape: { borderRadius: 10 },
    typography: {
      fontFamily: body,
      h1: { fontFamily: display }, h2: { fontFamily: display }, h3: { fontFamily: display },
      h4: { fontFamily: display, fontWeight: 600 }, h5: { fontFamily: display, fontWeight: 600 },
      h6: { fontFamily: display, fontWeight: 600 }, button: { textTransform: 'none', fontWeight: 600 },
    },
    components: {
      MuiPaper: { defaultProps: { elevation: 0 }, styleOverrides: { root: { backgroundImage: 'none' } } },
      MuiCssBaseline: { styleOverrides: { body: { WebkitFontSmoothing: 'antialiased' }, ':focus-visible': { outline: '2px solid currentColor', outlineOffset: 2 } } },
    },
  });
};
