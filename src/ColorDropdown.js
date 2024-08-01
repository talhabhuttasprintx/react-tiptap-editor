import React from 'react';
import './ColorDropdown.css';

const ColorDropdown = ({ colors, onColorSelect }) => {
  return (
    <div className="colorDropdown">
      {colors.map(color => (
        <div
          key={color}
          className="colorOption"
          style={{ backgroundColor: color }}
          onClick={() => onColorSelect(color)}
        />
      ))}
    </div>
  );
};

export default ColorDropdown;
