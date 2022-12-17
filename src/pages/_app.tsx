import '../../styles/globals.css';
import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import { Button, CssBaseline, Icon, ThemeProvider } from '@mui/material';
import theme from '../assets/theme';
import themeDark from '../assets/theme-dark';
import { useState } from 'react';
import Head from 'next/head';

export default function App({ Component, pageProps }: AppProps) {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <ThemeProvider theme={darkMode ? themeDark : theme}>
      <Head>
        <title>Mindfulnet</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <CssBaseline />
      <Icon></Icon>
      <SessionProvider session={pageProps.session} refetchInterval={5 * 60}>
        <Component {...pageProps} />
        <Button onClick={() => setDarkMode(!darkMode)}>Toggle Dark Mode</Button>
      </SessionProvider>
    </ThemeProvider>
  );
}
