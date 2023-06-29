import { createTheme, ThemeOptions } from '@mui/material';

declare module '@mui/material/styles' {
  interface Palette {
    memoLevels: {
      1: string,
      2: string,
      3: string,
      4: string,
      5: string,
    }
  }

  interface PaletteOptions {
    memoLevels?: {
      1: string,
      2: string,
      3: string,
      4: string,
      5: string,
    }
  }
}

const Theme: ThemeOptions = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#FFFFFF',
    },
    secondary: {
      main: '#DDDDDD',
    },
    text: {
      primary: '#FFFFFF',
      secondary: 'rgba(220, 220, 220, 1)',
      disabled: 'rgba(0,124,4, 1)',
    },
    memoLevels: {
      1: '#ce261b',
      2: '#eded23',
      3: '#34c7cc',
      4: '#3374cc',
      5: '#58cc4e',
    },
  },
})

export default Theme;