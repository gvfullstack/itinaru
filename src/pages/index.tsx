import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import SearchBar from '../components/SearchBar/searchBar'
import ItineraryEditForm from '@/components/EditFormComponents/itineraryEditForm'

export default function Home() {
  
  return (
    <>
      <Head>
        <title>itinaru</title>
        <meta name="description" content="Itinerary builder." />
           
       </Head>

      <main className={styles.main}>
          {/* <SearchBar /> */}
          <ItineraryEditForm />
      </main>
    </>
  )
}
