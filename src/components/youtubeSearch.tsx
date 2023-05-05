import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../components/itinBuilderCSS/youtubeSearch.module.css';
import _ from 'lodash';

interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  views: number;
  uploadDate: string;
}

interface YouTubeSearchProps {
  searchQuery: string;
}



const YouTubeSearch: React.FC<YouTubeSearchProps> = ({ searchQuery }) => {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);

  useEffect(() => {
    const fetchVideos = _.debounce(async () => {
      const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
        params: {
          key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY, // Replace with your YouTube API key
          q: searchQuery,
          part: 'snippet',
          type: 'video',
          maxResults: 3,
          videoDefinition: 'high',
        },
      });

      const fetchedVideos = response.data.items.map((item: any) => ({
        id: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnailUrl: item.snippet.thumbnails.high.url,
        
      }));

      setVideos(fetchedVideos);
    }, 500);

    if (searchQuery) {
      fetchVideos();
    }
  }, [searchQuery]);

  return (
    <div>
      {videos.map((video) => (
        <div key={video.id} className={styles.ytVidContainer}>

          <iframe
            className={styles.ytVidIframe}
            src={`https://www.youtube.com/embed/${video.id}`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
          <div className={styles.ytVidTitle}>{video.title}</div>

          {/* <p className={styles.ytVidDesc}>{video.description}</p> */}
        </div>
      ))}
    </div>
  );
};

export default YouTubeSearch;