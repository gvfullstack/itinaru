import Head from 'next/head'
// import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import BrandName from '@/components/brandName'
import HomeComponent from '../components/homeComponent'
import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
} from 'recoil';

import YouTubeSearch from '@/components/youtubeSearch'

const inter = Inter({ subsets: ['latin'] })


export default function Home() {
  return (
    <>
      <Head>
        <title>itinaru</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>

      <RecoilRoot>
      <main className={styles.main}>
          <BrandName />
          <HomeComponent />  
        
      </main>
      </RecoilRoot>
    </>
  )
}
