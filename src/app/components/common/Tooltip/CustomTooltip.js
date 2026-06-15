import React, { useState } from 'react';
import './Tooltip.scss';

const CustomTooltip = ({ children, text }) => {
    const [visible, setVisible] = useState(false);

  return (
    <span 
      className="tooltip-container tooltip-scoped-wrapper" 
      onMouseEnter={() => setVisible(true)} 
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && <span className="tooltip-text">{text}</span>}
    </span>
  );
};

export default CustomTooltip;
