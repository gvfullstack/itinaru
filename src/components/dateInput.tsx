import React from "react";

interface Props {
  travelDate: string;
}

const DateInput: React.FC<Props> = ({ travelDate }) => {
  return (
    <div>
      <h2>What day are you traveling?</h2>
      <label htmlFor="travelDate">Travel date:</label>
      <input type="date" id="travelDate" value={travelDate} />
    </div>
  );
};

export default DateInput;