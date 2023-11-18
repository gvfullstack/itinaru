import React, { useState, useEffect } from 'react';
import parse from 'html-react-parser';


function QuillTextParserComponent({ description }: { description: string }) {
  const [isMounted, setIsMounted] = useState(false);
  console.log(isMounted);
  useEffect(() => {
    console.log('QuillTextParserComponent: useEffect');
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null; // or some placeholder/loading state
  }

  const jsxContent = parse(description);
  return <div>{jsxContent}</div>;
}

export default QuillTextParserComponent;
