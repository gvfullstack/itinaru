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
          <title>{`${publicProfile?.username}'s itinaru Profile`}</title>
          <meta name="description" content={`${publicProfile?.username}'s profile: ${publicProfile?.bio}`} />
          <link rel="canonical" href={canonicalUrl} />
          <meta property="og:title" content={`${publicProfile?.username}'s itinaru Profile`} />
          <meta property="og:description" content={`${publicProfile?.username}'s profile: ${publicProfile?.bio}`} />
          <meta property="og:url" content={canonicalUrl} />
          <meta property="og:type" content="profile" />
          <meta property="og:image" content={publicProfile?.profilePictureUrl || ''} />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={`${publicProfile?.username}'s itinaru Profile`} />
          <meta name="twitter:description" content={`${publicProfile?.username}'s profile: ${publicProfile?.bio}`} />
          <meta name="twitter:image" content={publicProfile?.profilePictureUrl || ''} />
      </Head>

      <div style={{display:"flex", justifyContent:"center"}}>
        <PublicProfile publicProfile={publicProfile} userID = {userID}/>
      </div>
    </>
  );
};

export default PublicUserProfilePage;
