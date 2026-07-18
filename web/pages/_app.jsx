import * as React from "react";
import Head from "next/head";
import { CacheProvider } from "@emotion/react";
import { Box } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { StyledEngineProvider, ThemeProvider } from "@mui/material/styles";
import Header from "../src/components/header";
import createEmotionCache from "../src/createEmotionCache";
import theme from "../src/theme";
import "../src/index.css";

const clientSideEmotionCache = createEmotionCache();

export default function MyApp(props) {
  const {
    Component,
    emotionCache = clientSideEmotionCache,
    pageProps,
  } = props;

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <StyledEngineProvider injectFirst>
          <Box sx={{
            mt: 12
          }}>
            <Header />
            <Component {...pageProps} />
          </Box>
        </StyledEngineProvider>
      </ThemeProvider>
    </CacheProvider>
  );
}
