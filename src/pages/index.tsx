import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import SearchBar from '../components/SearchBar/searchBar'
import ItineraryItemForm from '../components/EditFormComponents/EditFormITEMComponents/itineraryItemForm'

export default function Home() {

return (
    <>
      <Head>
        <title>itinaru</title>
        <meta name="description" content="Itinerary builder." />
       </Head>
      

      <main className={styles.main}>        
          <SearchBar />
      </main>
    </>
  )
}
