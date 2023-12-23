import PublicItinViewContainer from '../../components/PublicItineraryViewComponents/publicItinViewContainer';
import React,{ useEffect} from 'react';
import dynamic from 'next/dynamic';
import {currentlyViewingItineraryState} from '../../components/PublicItineraryViewComponents/publicItinViewAtoms';
import { useRecoilState } from 'recoil';
import {Itinerary} from '../../components/PublicItineraryViewComponents/publicItinViewTypeDefs';
import { GetServerSidePropsContext } from 'next';
import {fetchItineraryFromDatabase} from '../../server/retrieveItinerary/retrieveItinerary';
import dayjs, {Dayjs} from 'dayjs';
import styles from '@/styles/Home.module.css'
import { authServer } from '@/utils/firebase.admin';

export const getServerSideProps = async (context:GetServerSidePropsContext) => {
  const itineraryId = context.params?.itineraryId as string; // Extracting itineraryId from context
  const idToken = context.req.cookies['idToken']; // Replace with your cookie name


   try {
      let decodedToken;

      let  userId;

      if (!idToken) {
        userId = "unknownUser";
      }else{
        decodedToken = await authServer.verifyIdToken(idToken);
        userId = decodedToken.uid;
      }

      const itineraryData = await fetchItineraryFromDatabase(itineraryId, userId);

      return {
        props: {
          itinerary: itineraryData
        }
      };
    } catch (error) {
      console.error('Error verifying token:', error);
      // Handle the error (e.g., token is invalid)
      return { props: { itinerary: null } };
    }
  }
  
 
  const ItinPublicViewPage: React.FC<{ itinerary?: Itinerary | null }> = ({ itinerary }) => {
    const [localItinerary, setItinerary] = useRecoilState<Itinerary | null>(currentlyViewingItineraryState);
  
    useEffect(() => {
      if (itinerary) {
        // Convert the startTime and endTime to Dayjs
        const updatedItems = itinerary.items?.map(item => ({
            ...item,
            startTime: item.startTime?.time != null ? { time: dayjs(item.startTime.time) } : undefined,
            endTime: item.endTime?.time != null ? { time: dayjs(item.endTime.time) } : undefined
        }));
  
        // Set the itinerary with the updated items
        setItinerary({
            ...itinerary,
            items: updatedItems
        });
      } else {
        setItinerary(null);
      }
    }, [itinerary, setItinerary]);
  
    return (
      <div className={styles.publicItinViewMain}>
        {localItinerary ? (
          <PublicItinViewContainer />
        ) : (
          <p className={styles.deletedMessage}>This itinerary has been deleted or is unavailable.</p>
        )}
      </div>
    );
  };
  
  export default ItinPublicViewPage;
  
