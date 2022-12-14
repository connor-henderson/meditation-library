import "../../styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";

const theme = createTheme({
  palette: {
    mode: "light",
  },
});

export default function App({ Component, pageProps }: AppProps) {
  return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SessionProvider session={pageProps.session} refetchInterval={5 * 60}>
          <Component {...pageProps} />
        </SessionProvider>
      </ThemeProvider>
  );
}
