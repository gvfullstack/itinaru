import { GetServerSideProps } from 'next';
import { getPublicProfileWithAdminSDK } from '../server/profile';
import PublicProfile from '../components/Profile/PublicProfile';
import { AuthenticatedUser } from "@/components/typeDefs";
import TopNavBar from '@/components/topNavBar/topNavBar';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const userID = context.params?.userID as string; // Extract user ID from URL
  const publicProfile = await getPublicProfileWithAdminSDK(userID);
  return {
    props: { publicProfile },
  };
};

type Props = {
  publicProfile: AuthenticatedUser | null; // Replace with the appropriate type
};

const PublicUserProfilePage: React.FC<Props> = ({ publicProfile }) => {   
  return <>
    <div style={{display:"flex", justifyContent:"center"}}>
      <PublicProfile publicProfile={publicProfile} />;
    </div>

  </>
};

export default PublicUserProfilePage;
