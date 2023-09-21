import React, { useState } from 'react';

interface Range {
  start: number;
  end: number;
}

const TimeSlider: React.FC = () => {
  const [range, setRange] = useState<Range>({ start: 0, end: 96 });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newValue = Number(value);
    setRange(prev => {
      if (name === "start" && newValue < prev.end) {
        return { ...prev, start: newValue };
      } else if (name === "end" && newValue > prev.start) {
        return { ...prev, end: newValue };
      } else {
        return prev;
      }
    });
  };

  const formatTime = (value: number) => {
    const hours = Math.floor(value / 4);
    const minutes = (value % 4) * 15;
    return `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}`;
  }

  return (
    <div>
      <div style={{backgroundColor: 'pink', display: 'flex', flexDirection: 'column', alignItems: 'center', height: 50,width:'40rem' }}>
        <input
          type="range"
          min="0"
          max="96"
          value={range.start}
          onChange={handleInputChange}
          name="start"
          style={{ marginRight:'0', width:'10rem', zIndex: 2, flex: '1', background: 'transparent', backgroundImage: `linear-gradient(to right, blue , blue ${range.start / 96 * 100}%, transparent ${range.start / 96 * 100}%, transparent)` }}
        />
        <div>Start Time: {formatTime(range.start)}</div>
        <input
          type="range"
          min="0"
          max="96"
          value={range.end}
          onChange={handleInputChange}
          name="end"
          style={{ marginLeft:'0',width:'10rem', zIndex: 1, flex: '1', background: 'transparent', backgroundImage: `linear-gradient(to right, transparent, transparent ${range.end / 96 * 100}%, blue ${range.end / 96 * 100}%, blue)` }}
        />
      <div>End Time: {formatTime(range.end)}</div>
      </div>
    </div>
  );
};

export default TimeSlider;
