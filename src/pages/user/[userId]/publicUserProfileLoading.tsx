import { useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from './publicUserProfileLoading.module.css';

const PublicUserProfileLoading = () => {
  const router = useRouter();
  const { userId } = router.query;  // Extract userId from the URL query parameters

  useEffect(() => {
    // Ensure userId is available before navigating
    if (userId) {
      // Use the passed userId to navigate to the user's profile page
      router.push(`/${userId}`);
    }
  }, [router, userId]);  // Include userId in the dependency array to react to changes

  return (
    <div className={styles.loaderContainer}>
      <p>Loading...</p>  {/* Your Skeleton or Loader Here */}
    </div>
  );
};

export default PublicUserProfileLoading;
