import { AlgoliaHitType } from '../searchTypeDefs'; // Adjust import as necessary
import ItinGalleryComponent from '../../ItinGallery/itinGalleryComponent';

type HitsListProps = {
    hits: AlgoliaHitType[];
};

const HitsList: React.FC<HitsListProps> = ({ hits }) => {
    return (
        <>
            {hits.map((itin, index) => (
               <ItinGalleryComponent 
                    key={index}
                    itinId={itin.objectID || ''}
                    userId={itin.uid || ''}
                    title={itin.settings?.title || ''}
                    description={itin.settings?.description || ''}
                    neighborhood={itin.settings?.neighborhood || ''}
                    city={itin.settings?.city || ''}
                    state={itin.settings?.state || ''}
                    duration={itin.settings?.duration || ''}
                    imageUrl={itin.settings?.galleryPhotoUrl || ''}
                />
            ))}
        </>
    );
};

export default HitsList;
