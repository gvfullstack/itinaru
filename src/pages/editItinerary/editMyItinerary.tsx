import React, {useEffect, useRef} from 'react';
import dynamic from 'next/dynamic';
// import EditFormContainer from '../../components/EditFormComponents/editFormContainer';
import {currentlyEditingItineraryState} from '../../components/EditFormComponents/editFormAtoms';
import { useRecoilValue } from 'recoil';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';


const SkeletonForm = () => {
  return (
    <div style={{ opacity: 0.5, marginTop: "4rem", padding: "2rem 15rem"}}>
      {/* Adjust the skeleton form as needed */}
      <div style={{ width: '100%', height: '40px', backgroundColor: 'grey', marginBottom: '10px', borderRadius: "10px" }}></div>
      <div style={{ width: '100%', height: '80px', backgroundColor: 'grey', marginBottom: '10px', borderRadius: "10px" }}></div>
      <div style={{ width: '100%', height: '40px', backgroundColor: 'grey', marginBottom: '10px', borderRadius: "10px" }}></div>
      <div style={{ width: '100%', height: '40px', backgroundColor: 'grey', marginBottom: '10px', borderRadius: "10px" }}></div>
      <div style={{gap:"1rem",  width: '100%', display: "flex", height: '40px', marginBottom: '10px', borderRadius: "10px" }}>
          <div style={{ width: "1rem", height: '1rem', backgroundColor: 'grey', marginBottom: '10px', borderRadius: "10px" }}></div>
          <div style={{ width: '1rem', height: '1rem', backgroundColor: 'grey', marginBottom: '10px', borderRadius: "10px" }}></div>
          <div style={{ width: '1rem', height: '1rem', backgroundColor: 'grey', marginBottom: '10px', borderRadius: "10px" }}></div>

      </div>
      
    </div>
  );
}

const EditFormContainer = dynamic(() => import('../../components/EditFormComponents/editFormContainer'), {
  loading: () => <SkeletonForm />,
  ssr: false
  });

const EFEditPage: React.FC = () => {
  const router = useRouter();
  const editItineraryState = useRecoilValue(currentlyEditingItineraryState);
  const toastShownRef = useRef(false);

  useEffect(() => {
    if (!editItineraryState.id && !toastShownRef.current) {
      router.push('/');
      toast.error("Please select an itinerary to edit.");
      toastShownRef.current = true;
    }
  }, []);
  
  return (
    <>
      <EditFormContainer />
    </>)
};

export default EFEditPage;

