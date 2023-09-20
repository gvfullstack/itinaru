import PublicItinViewContainer from '../../components/PublicItineraryViewComponents/publicItinViewContainer';
import React,{ useEffect} from 'react';
import dynamic from 'next/dynamic';
import {currentlyViewingItineraryState} from '../../components/PublicItineraryViewComponents/publicItinViewAtoms';
import { useRecoilState } from 'recoil';
import {Itinerary} from '../../components/PublicItineraryViewComponents/publicItinViewTypeDefs';
import { GetServerSidePropsContext } from 'next';
import {fetchItineraryFromDatabase} from '../../server/retrieveItinerary/retrieveItinerary';
import dayjs, {Dayjs} from 'dayjs';


export const getServerSideProps = async (context:GetServerSidePropsContext) => {
    const itineraryId = context.params?.itineraryId as string; // Extracting itineraryId from context
    console.log("itineraryId", itineraryId)
   const itineraryData = await fetchItineraryFromDatabase(itineraryId);

    return {
      props: {
        itinerary: itineraryData
      }
    };
  }
  
 
  const ItinPublicViewPage: React.FC<{ itinerary?: Itinerary }> = ({ itinerary }) => {
    const [localItinerary, setItinerary] = useRecoilState<Itinerary>(currentlyViewingItineraryState);

    useEffect(() => {
        if (itinerary) {
            // Convert the startTime and endTime to Dayjs
            const updatedItems = itinerary.items.map(item => ({
                ...item,
                startTime: item.startTime?.time != null ? { time: dayjs(item.startTime.time) } : undefined,
                endTime: item.endTime?.time != null ? { time: dayjs(item.endTime.time) } : undefined
            }));

            // Set the itinerary with the updated items
            setItinerary({
                ...itinerary,
                items: updatedItems
            });
        }
    }, [itinerary, setItinerary]);

    return (
      <>
        <PublicItinViewContainer />
      </>)
  };
  
  export default ItinPublicViewPage;
  
