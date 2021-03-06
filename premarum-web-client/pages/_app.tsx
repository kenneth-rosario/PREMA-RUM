import * as React from 'react';
import type { AppProps } from 'next/app';
import { CacheProvider, EmotionCache } from '@emotion/react';
import { ThemeProvider, CssBaseline, createTheme, responsiveFontSizes } from '@mui/material';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import createEmotionCache from '../utility/createEmotionCache';
import lightThemeOptions from '../styles/theme/lightThemeOptions';
import Head from 'next/head';
import {MsalProvider} from '@azure/msal-react';
import AuthDefaultLayout from '../components/DefaultLayout'
import {NextPage} from "next";
import {ReactElement, ReactNode} from "react";
import {pca} from "../utility/constants";
import MobileNavbar from "../components/Navigation/MobileNavBar";
import NextNProgress from "nextjs-progressbar";
import {useGoogleAnalytics} from "../utility/hooks/useGoogleAnalytics";
import Script from 'next/script'
import * as gtag from '../utility/gtag'

const clientSideEmotionCache = createEmotionCache();

let lightTheme = createTheme(lightThemeOptions);
lightTheme = responsiveFontSizes(lightTheme);

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout,
  emotionCache?: EmotionCache;
}

const MyApp: React.FunctionComponent<AppPropsWithLayout> = (props) => {
  useGoogleAnalytics()  
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  // Default Layout
  let DefaultLayout:  (page: ReactElement) => ReactNode = 
      ((page: ReactElement) =>
          (<AuthDefaultLayout>
              <MobileNavbar>
                {page}
              </MobileNavbar>
          </AuthDefaultLayout>)); 
  // Overloaded Layout defined on a per page basis
  if (Component.getLayout) {DefaultLayout = Component.getLayout;}
  return (
    <MsalProvider instance={pca}>
      <CacheProvider value={emotionCache}>
        <ThemeProvider theme={lightTheme}>
          <CssBaseline /> 
          <NextNProgress color='white'/>
          <Head>
              <title>PREMARUM</title>
              <meta name="description" content="Easiest way to create enrollment logistical plans for UPRM students." />
              <link rel="icon" href="/prema-icon.png" />
          </Head>
          {DefaultLayout(<Component {...pageProps} />)}
            <Script async
                    src={"https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1454168480250190"}
                    crossOrigin={"anonymous"}
            />
            <Script
                strategy="afterInteractive"
                src={`https://www.googletagmanager.com/gtag/js?id=${gtag.GA_TRACKING_ID}`}
            />
            <Script
                id="gtag-init"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                    __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gtag.GA_TRACKING_ID}', {
                  page_path: window.location.pathname,
                });
              `
                }}
            />
        </ThemeProvider>
      </CacheProvider>
    </MsalProvider>
  );
};

export default MyApp;
