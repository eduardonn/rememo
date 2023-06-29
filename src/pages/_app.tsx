import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { ThemeProvider } from '@mui/material';
import CustomTheme from '@/styles/CustomTheme';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={CustomTheme}>
      <Component {...pageProps} />
    </ThemeProvider>
  )
}
