import React, { useState, useEffect } from 'react';
import parse from 'html-react-parser';

function ItemDescriptionStaticComponent({ description }: { description: string }) {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null; // or some placeholder/loading state
  }

  const jsxContent = parse(description);
  
  return <div 
          style={{width:"100%",textAlign:'left', wordWrap: "break-word"}}>
            {jsxContent}
        </div>;
}

export default ItemDescriptionStaticComponent;
