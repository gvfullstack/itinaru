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


const FirebaseAuthLogic = dynamic(() => import('.././components/FirebaseAuthComponents/firebaseAuthLogic'), { ssr: false });

export default function App({ Component, pageProps }: AppProps) {
  
  useEffect(() => {
    // Initialize the IndexedDB database
    initDB();
  }, []);
  
  const router = useRouter();


  useEffect(() => {
    const handleRouteChange = (url: string ) => {
      window.gtag('config', 'G-N8B4BB2RHJ', {
        page_path: url,
      });
    };

    // When the component is mounted, subscribe to route changes
    router.events.on('routeChangeComplete', handleRouteChange);

    // Unsubscribe from the event if the component is unmounted
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);


  return (
    <div style={{ width:"100%" }}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"></link>
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"></link>
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"></link>
        <link rel="manifest" href="/site.webmanifest"></link>
      </Head>

      <Script
        id="gtag-config"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-N8B4BB2RHJ');
          `,
        }}
      />

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
