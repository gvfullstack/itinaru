import React from 'react';
import { useRecoilState } from 'recoil';
import { UserPreferences } from "../typeDefs" 
import { userPreferencesAtom} from "@/atoms/atoms";

const ViewAllFavPlacesPrevVisited = (props: any) =>{
    const [userPreferences, setUserPreferencesAtom] = useRecoilState(userPreferencesAtom);
    const favPlacesPrevVisited = userPreferences.favoritePlacesPreviouslyVisited?? [];

    const handleRemove = (site: string) => {
        setUserPreferencesAtom((prevUserPreferenceState) => ({
          ...prevUserPreferenceState,
          favoritePlacesPreviouslyVisited: prevUserPreferenceState.favoritePlacesPreviouslyVisited?.filter((item) => item !== site)
        }));
      };
      

    const siteElements = favPlacesPrevVisited.map((site: string) => (
        <div style={{ display: 'flex', flexDirection: 'row', width:'100%'}} key={site}>
        <button style={{ width: '1rem', height: '1rem', borderRadius: '5px', display: 'flex', justifyContent: 'center', alignItems: 'center', borderStyle:'none', backgroundColor:'white' }} onClick={() => handleRemove(site)}>x</button>
            {site}
        </div>
      ));

    return (
        <div style={{ position: 'fixed', top: 0, 
            left: 0, right: 0, bottom: 0, backgroundColor: 'white', 
            zIndex: 9999, height: '100vh', width: '100vw', display:'flex', flexDirection:'column', alignItems:"center"}}>
                <h2 style={{textAlign:"center"}}>Favorite places previously visited</h2>
                <div style={{maxWidth:'320px'}}>{siteElements}</div>    
                <button onClick={props.handleClose}>close</button>
        </div>
    )
}

export default ViewAllFavPlacesPrevVisited;