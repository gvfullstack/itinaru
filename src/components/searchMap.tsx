import React from 'react';

const myAPIKEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

const center = {
    lat: 37.3688,
    lng: -122.0363,
  };

const SearchMap = ({ q }) => {

  const src = `https://www.google.com/maps/embed/v1/search?key=${myAPIKEY}&q=historical+sites+in+sunnyvale`;

  return (
    <div>
    <iframe
      width="90%"
      height="500rem"
      frameborder="0"
      style={{ border: 20 }}
      referrerpolicy="no-referrer-when-downgrade"
      src={src}
      allowfullscreen
      center={center}
    //   source="outdoor"
    />

    <iframe
    width="90%"
    height="500rem"
    frameborder="0"
    style={{ border: 20 }}
    referrerpolicy="no-referrer-when-downgrade"
    src={src}
    allowfullscreen
    center={center}
  //   source="outdoor"
  />
  </div>
  );
};

export default SearchMap;