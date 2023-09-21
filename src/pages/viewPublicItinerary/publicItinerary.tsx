import PublicItinViewContainer from '../../components/PublicItineraryViewComponents/publicItinViewContainer';
import React,{ useEffect, useRef} from 'react';
import dynamic from 'next/dynamic';
import {currentlyViewingItineraryState} from '../../components/PublicItineraryViewComponents/publicItinViewAtoms';
import { useRecoilValue } from 'recoil';
import {Itinerary} from '../../components/PublicItineraryViewComponents/publicItinViewTypeDefs';
import { GetServerSidePropsContext } from 'next';
import dayjs, {Dayjs} from 'dayjs';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';


  const ItinPublicViewPage: React.FC = () => {
    const router = useRouter();
    const editItineraryState = useRecoilValue(currentlyViewingItineraryState);
    const toastShownRef = useRef(false);
  
    useEffect(() => {
      if (!editItineraryState.id && !toastShownRef.current) {
        router.push('/');
        toast.error("Please select an itinerary to view.");
        toastShownRef.current = true;
      }
    }, []);
    
    return (
      <>
        <PublicItinViewContainer />
      </>)
  };
  
  export default ItinPublicViewPage;
  
