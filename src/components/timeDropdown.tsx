import React from "react";

interface Props {
  startTime: string;
  endTime: string;
}

const TimeDropdown: React.FC<Props> = ({ startTime, endTime }) => {
  return (
    <div>
      <h2>What time do you want to start and end your day?</h2>
      <label htmlFor="startTime">Start time:</label>
      <select id="startTime" value={startTime}>
        <option value="9:00am">9:00am</option>
        <option value="10:00am">10:00am</option>
        {/* Add more options */}
      </select>
      <label htmlFor="endTime">End time:</label>
      <select id="endTime" value={endTime}>
        <option value="5:00pm">5:00pm</option>
        <option value="6:00pm">6:00pm</option>
        {/* Add more options */}
      </select>
    </div>
  );
};

export default TimeDropdown;