import admin from 'firebase-admin';
import dbServer from '../../utils/firebase.admin';
import {TransformedItinerary} from '../../components/EditFormComponents/editFormTypeDefs';

type SitemapItinerary = {
    id: string;
    // Add any other properties you might need for the sitemap
  };

export async function fetchItineraries(): Promise<SitemapItinerary[]> {
    const itinerariesRef = dbServer.collection('itineraries');
    const snapshot = await itinerariesRef.where('settings.visibility', '==', 'public').where('isDeleted', '==', false).get();
  
    const itineraries: SitemapItinerary[] = [];
    snapshot.forEach(doc => {
      const itineraryData = doc.data();
      // Assuming 'id' is a direct property of the document
      if (itineraryData.id && !itineraryData.isDeleted) {
        itineraries.push({ id: itineraryData.id });
      }
    });
  
    return itineraries;
  }
  
  