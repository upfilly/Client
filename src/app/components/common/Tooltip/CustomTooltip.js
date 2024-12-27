import React, { useState } from 'react';
import './Tooltip.css';

const CustomTooltip = ({ children, text }) => {
    const [visible, setVisible] = useState(false);

  return (
    <span 
      className="tooltip-container" 
      onMouseEnter={() => setVisible(true)} 
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && <span className="tooltip-text">{text}</span>}
    </span>
  );
};

export default CustomTooltip;
