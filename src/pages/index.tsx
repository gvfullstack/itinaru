import Head from 'next/head'
// import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import BrandName from '@/components/brandName'
<<<<<<< HEAD
import ItinBuilder from './ItinBuilder'
=======
import HomeComponent from '../components/homeComponent'
// import SearchMap from '@/components/searchMap'
import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
} from 'recoil';
>>>>>>> 5283079ed629e50554d6b34ed7aded3b37613e05

const inter = Inter({ subsets: ['latin'] })

interface Neighborhood {
  neighborhood: string,
  coordinates: { lat: number, lng: number }[];
}

export const neighborhoodsState = atom<Neighborhood[]>({
  key: 'neighborhoodsState', 
  default: []
});

export const selectedNeighborhoodsState = atom<any[]>({
  key: 'selectedNeighborhoodsState', 
  default: []
});

export const keyOfMultiSelectButtonState = atom({
  key: 'keyOfMultiSelectButtonState', 
  default: ""
});

export const handleMultiSelectState = atom({
  key: 'handleMultiSelectState', 
  default: []
});


export default function Home() {
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <RecoilRoot>
      <main className={styles.main}>
<<<<<<< HEAD
          {/* <BrandName /> */}
          <ItinBuilder />
=======
          <BrandName />
          <HomeComponent />
          
>>>>>>> 5283079ed629e50554d6b34ed7aded3b37613e05
      </main>
      </RecoilRoot>
    </>
  )
}
