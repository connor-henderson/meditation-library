import '../../styles/globals.css';
import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import {
  Box,
  Button,
  Container,
  CssBaseline,
  Divider,
  Icon,
  ThemeProvider,
} from '@mui/material';
import theme from '../assets/theme';
import themeDark from '../assets/theme-dark';
import { useState } from 'react';
import Head from 'next/head';
import Sidenav from '../components/Sidenav';
import routes from '../components/Sidenav/routes';
import Navbar from '../components/NavBar/Desktop';
import MobileNavbar from '../components/NavBar/Mobile';
import breakpoints from '../assets/theme/base/breakpoints';

export default function App({ Component, pageProps }: AppProps) {
  const [darkMode, setDarkMode] = useState(false);
  const [miniSidenav, setMiniSidenav] = useState(true);
  const [onMouseEnter, setOnMouseEnter] = useState(false);

  // Open sidenav when mouse enter on mini sidenav
  const handleOnMouseEnter = () => {
    if (miniSidenav && !onMouseEnter) {
      setMiniSidenav(false);
      setOnMouseEnter(true);
    }
  };

  // Close sidenav when mouse leave mini sidenav
  const handleOnMouseLeave = () => {
    if (onMouseEnter) {
      setMiniSidenav(true);
      setOnMouseEnter(false);
    }
  };

  return (
    <ThemeProvider theme={darkMode ? themeDark : theme}>
      <Head>
        <title>Mindfulnet</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <CssBaseline />
      <Icon></Icon>
      <SessionProvider session={pageProps.session} refetchInterval={5 * 60}>
        <Sidenav
          color="info"
          routes={routes}
          onMouseEnter={handleOnMouseEnter}
          onMouseLeave={handleOnMouseLeave}
          setMiniSidenav={setMiniSidenav}
          miniSidenav={miniSidenav}
        />
        {window.innerWidth <= breakpoints.values.md ? (
          <MobileNavbar><p>test</p></MobileNavbar>
        ) : (
          <Navbar setMiniSidenav={setMiniSidenav} miniSidenav={miniSidenav} />
        )}
        <Container>
          <Box sx={{ my: 2 }}>
            {[...new Array(12)]
              .map(
                () => `Cras mattis consectetur purus sit amet fermentum.
Cras justo odio, dapibus ac facilisis in, egestas eget quam.
Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
Praesent commodo cursus magna, vel scelerisque nisl consectetur et.`
              )
              .join('\n')}
          </Box>
        </Container>
        <Component {...pageProps} />
        <Button onClick={() => setDarkMode(!darkMode)}>Toggle Dark Mode</Button>
        <Divider />
      </SessionProvider>
    </ThemeProvider>
  );
}
