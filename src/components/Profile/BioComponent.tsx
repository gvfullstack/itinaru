import React, { useState, useEffect } from 'react';
import parse from 'html-react-parser';

function BioComponent({ bio }: { bio: string }) {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null; // or some placeholder/loading state
  }

  const jsxContent = parse(bio);
  
  return <div>{jsxContent}</div>;
}

export default BioComponent;
