import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { Analytics } from '@vercel/analytics/react';
import { RecoilRoot } from 'recoil';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Script from 'next/script';
import TopNavBar from '@/components/TopNavBar/topNavBar';
import { ToastContainer } from 'react-toastify';
import { useState, useRef, useEffect } from 'react';
import initDB from '@/lib/db';
import { useRouter } from 'next/router';
import { SpeedInsights } from "@vercel/speed-insights/next"

const FirebaseAuthLogic = dynamic(() => import('.././components/FirebaseAuthComponents/firebaseAuthLogic'), { ssr: false });

export default function App({ Component, pageProps }: AppProps) {
  
  useEffect(() => {
    // Initialize the IndexedDB database
    initDB();
  }, []);
  
  const router = useRouter();


  return (
    <div style={{ width:"100vw", backgroundColor:"red"}}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=0" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"></link>
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"></link>
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"></link>
        <link rel="manifest" href="/site.webmanifest"></link>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-WFW7FT84');`,
          }}
          
        />

      </Head>


      <RecoilRoot>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <main className="app-container">
            <div className="app-container">
              <ToastContainer style={{ zIndex: 99999 }} />
              <div className="nav-container">
                <TopNavBar />
              </div>
              <Component {...pageProps} />
              <Analytics />
              <FirebaseAuthLogic />
              
            </div>
          </main>
        </LocalizationProvider>
      </RecoilRoot>
    </div>
  );
}
