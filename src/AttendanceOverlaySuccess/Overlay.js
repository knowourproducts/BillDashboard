// Overlay.js

import React from "react";
import "./Overlay.css"; // Import your CSS file for styling

function Overlay({ pendingDays, onClose,quotation }) {
    return (
      <div className="overlay" onClick={onClose}>
        <div className="overlay-content" onClick={(e) => e.stopPropagation()}>
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
          <h2 className="form-label">Shel Digtal Library</h2>
          <h4>Renew your subscription in : {pendingDays} Days</h4>
          <p>"{quotation}"</p>
          <p>Attendance marked successfully! </p>
        </div>
      </div>
    );
  }
  
export default Overlay;
