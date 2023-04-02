import React from "react";

interface Props {
  onClick: () => void;
}

const CreateItineraryButton: React.FC<Props> = ({ onClick }) => {
  return (
    <div>
      <h2>Ready to create your itinerary?</h2>
      <button onClick={onClick}>Create itinerary now</button>
    </div>
  );
};

export default CreateItineraryButton;