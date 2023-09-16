import React, { useState, useEffect } from 'react';
import parse from 'html-react-parser';


function itineraryDescriptionComponent({ description }: { description: string }) {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null; // or some placeholder/loading state
  }

  const jsxContent = parse(description);
  return <div>{jsxContent}</div>;
}

export default itineraryDescriptionComponent;
