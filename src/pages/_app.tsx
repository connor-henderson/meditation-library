import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import {
  Box,
  Button,
  Container,
  CssBaseline,
  Divider,
  ThemeProvider,
} from '@mui/material';
import theme from '../assets/theme';
import themeDark from '../assets/theme-dark';
import { createContext, useContext, useEffect, useState } from 'react';
import Head from 'next/head';
import Sidenav from '../components/Sidenav';
import routes from '../components/Sidenav/routes';
import Navbar from '../components/NavBar/Desktop';
import MobileNavbar from '../components/NavBar/Mobile';
import { AuthorWithWorks } from './api/hello';
import breakpoints from '../assets/theme/base/breakpoints';

const ContentContext = createContext<AuthorWithWorks[]>([]);
export const useContentContext = () => useContext(ContentContext);

export default function App({ Component, pageProps }: AppProps) {
  const [darkMode, setDarkMode] = useState(false);
  const [miniSidenav, setMiniSidenav] = useState(true);
  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [content, setContent] = useState<AuthorWithWorks[]>([]);

  const getContent = async () => {
    const res = await fetch('http://localhost:3000/api/hello');
    const json = await res.json();
    setContent(json);
  };

  useEffect(() => {
    getContent();
  }, []);

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
  useEffect(() => {
    const smallWindow = window.innerWidth <= breakpoints.values.sm;
    setMobile(smallWindow);
  }, []);

  return (
    <ThemeProvider theme={darkMode ? themeDark : theme}>
      <ContentContext.Provider value={content}>
        <Head>
          <title>Mindfulnet</title>
          <meta name="viewport" content="initial-scale=1, width=device-width" />
        </Head>
        <CssBaseline />
        <SessionProvider session={pageProps.session} refetchInterval={5 * 60}>
          <Sidenav
            color="info"
            routes={routes}
            onMouseEnter={handleOnMouseEnter}
            onMouseLeave={handleOnMouseLeave}
            setMiniSidenav={setMiniSidenav}
            miniSidenav={miniSidenav}
          />
          {mobile ? (
            <MobileNavbar setMiniSidenav={setMiniSidenav}>
              <p>test</p>
            </MobileNavbar>
          ) : (
            <Navbar setMiniSidenav={setMiniSidenav} miniSidenav={miniSidenav} />
          )}
          <Container>
            <Box sx={{ my: 6, marginX: 10 }}>
              <Component {...pageProps} />
            </Box>
          </Container>
          <Button onClick={() => setDarkMode(!darkMode)}>
            Toggle Dark Mode
          </Button>
          <Divider />
        </SessionProvider>
      </ContentContext.Provider>
    </ThemeProvider>
  );
}
