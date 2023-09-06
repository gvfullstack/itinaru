import React, { useState, useRef, useEffect } from 'react';
import NewItineraryTitleInput from './jumboPlusFunctionality/newItineraryTItleInput';

const styles = {
  container: {
    fontSize: '2rem',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    color: 'white',
  },
  plusSign: {
    cursor: 'pointer',
  }
};

const JumboPlus: React.FC = () => {
  const [showItineraryInput, setShowItineraryInput] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handlePlusClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the event from bubbling up.
    setShowItineraryInput(!showItineraryInput);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowItineraryInput(false);
      }
    };
  
    // Attach the listener to the document
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      // Clean up the listener on unmount
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  
  return (
    <div style={styles.container} ref={containerRef}>
      {!showItineraryInput && <span style={styles.plusSign} onClick={handlePlusClick}>+</span>}
      {showItineraryInput && <NewItineraryTitleInput hideBox={()=>{setShowItineraryInput(false)}} />}
    </div>
  );
}

export default JumboPlus;
