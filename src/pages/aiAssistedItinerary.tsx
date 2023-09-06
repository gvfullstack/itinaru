import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import TopNavBar from '@/components/topNavBar/topNavBar'
import AIItinContainer from '@/components/AIAssistedItinerary/aiItinContainer' 
 

export default function Home() {
  return (
    <>
      <Head>
        <title>AI Assisted Itinerary Builder</title>
        <meta name="description" content="AI Assisted Itinerary builder." />
    
       </Head>

      <main className={styles.main}>
          <AIItinContainer />  
      </main>
    </>
  )
}
