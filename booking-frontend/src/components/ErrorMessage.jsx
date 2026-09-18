import React from "react";

const ErrorMessage = ({ message, onDismiss }) => {
  if (!message) return null;

  return (
    <div className="error-banner">
      <div className="error-banner-content">
        <span className="error-icon">⚠️</span>
        <span className="error-text">{message}</span>
      </div>
      {onDismiss && (
        <button type="button" className="error-dismiss-btn" onClick={onDismiss} aria-label="Dismiss error">
          ✕
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
