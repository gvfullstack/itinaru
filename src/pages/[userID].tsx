import Head from 'next/head';
import { GetServerSideProps } from 'next';
import { getPublicProfileWithAdminSDK } from '../server/profile';
import PublicProfile from '../components/Profile/PublicProfile';
import { AuthenticatedUser } from "@/components/typeDefs";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const userID = context.params?.userID as string; // Extract user ID from URL
  const publicProfile = await getPublicProfileWithAdminSDK(userID);
  return {
    props: { publicProfile, userID },
  };
};

type Props = {
  publicProfile: AuthenticatedUser | null;
  userID: string;
};

const PublicUserProfilePage: React.FC<Props> = ({ publicProfile, userID }) => {   
  const canonicalUrl = `https://www.itinaru.com/${userID}`;
  
  return (
    <>
      <Head>
        <title>{`${publicProfile?.username} itinaru profile page`}</title> 
        <link rel="canonical" href={canonicalUrl} />
      </Head>
      <div style={{display:"flex", justifyContent:"center"}}>
        <PublicProfile publicProfile={publicProfile} />;
      </div>
    </>
  );
};

export default PublicUserProfilePage;
