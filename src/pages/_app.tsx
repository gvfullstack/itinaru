import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { Analytics } from '@vercel/analytics/react';
import { RecoilRoot } from 'recoil';
import Head from 'next/head';
import dynamic from 'next/dynamic'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Script from 'next/script';
import TopNavBar from '@/components/topNavBar/topNavBar';

const FirebaseAuthLogic = dynamic(() => import('.././components/FirebaseAuthComponents/firebaseAuthLogic'), { ssr: false });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Script
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-R2FS3JTQJ5');
            `,
          }}
        />
      </Head>

      <RecoilRoot>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <main className="app-container"> 
                  <Head>
                  </Head>
                  <div className="app-container">       
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
    </>
  )
}
