import React from "react";

interface PageComponentProps {
  createButtonText?: string;
  handleCreateItinerary?: () => void;
}

const CreateItineraryButton: React.FC<Props> = ({ createButtonText, handleCreateItinerary }) => {
  return (
    <div>
      <button onClick={handleCreateItinerary}>{createButtonText}</button>
    </div>
  );
};

export default CreateItineraryButton;