import { useState } from "react";
import Input from "../components/input";

type UserInputs = {
  destination: string;
  startTime: Date;
  endTime: Date;
  travelDate: Date;
  specificSites: string;
  excludedSites: string;
  travelerCount: number;
  additionalThemes: string;
  neighborhoods: string;
};


const ItinBuilder = () => {
  const [userInputs, setUserInputs] = useState<UserInputs>({
    destination: "",
    startTime: "",
    endTime: "",
    travelDate: "",
    specificSites: "",
    excludedSites: "",
    travelerCount: 0,
    additionalThemes: "",
    neighborhoods: "",
  });

  const handleInputChange = (
    key: keyof UserInputs,
    value: string | number | Date
  ) => {
    setUserInputs((prevInputs) => ({ ...prevInputs, [key]: value }));
  };

  return (
    <div>
      <h1>Itinerary Builder</h1>
      <Input
        label="Destination"
        value={userInputs.destination}
        onChange={(value) => handleInputChange("destination", value)}
      />
      <Input
        label="Start Time"
        value={userInputs.startTime}
        onChange={(value) => handleInputChange("startTime", value)}
      />
      <Input
        label="End Time"
        value={userInputs.endTime}
        onChange={(value) => handleInputChange("endTime", value)}
      />
      <Input
        label="Travel Date"
        value={userInputs.travelDate}
        onChange={(value) => handleInputChange("travelDate", value)}
      />
      <Input
        label="Specific Sites"
        value={userInputs.specificSites}
        onChange={(value) => handleInputChange("specificSites", value)}
      />
      <Input
        label="Excluded Sites"
        value={userInputs.excludedSites}
        onChange={(value) => handleInputChange("excludedSites", value)}
      />
      <Input
        label="Traveler Count"
        value={userInputs.travelerCount}
        onChange={(value) => handleInputChange("travelerCount", Number(value))}
      />
      <Input
        label="Additional Themes"
        value={userInputs.additionalThemes}
        onChange={(value) => handleInputChange("additionalThemes", value)}
      />
      <Input
        label="Neighborhoods"
        value={userInputs.neighborhoods}
        onChange={(value) => handleInputChange("neighborhoods", value)}
      />
    </div>
  );
};

export default ItinBuilder;