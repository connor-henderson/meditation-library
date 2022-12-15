import "../../styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { Button, CssBaseline, ThemeProvider } from "@mui/material";
import theme from '../assets/theme';
import themeDark from '../assets/theme-dark';
import { useState } from "react";



export default function App({ Component, pageProps }: AppProps) {
  const [darkMode, setDarkMode] = useState(false);

  return (
      <ThemeProvider theme={darkMode ? themeDark : theme}>
        <CssBaseline />
        <SessionProvider session={pageProps.session} refetchInterval={5 * 60}>
        <Button onClick={() => setDarkMode(!darkMode)}>Toggle Dark Mode</Button>
          <Component {...pageProps} />
        </SessionProvider>
      </ThemeProvider>
  );
}
