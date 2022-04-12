import React from "react";

export default function AlertPopup(props) {
  const { onCancel } = props;

  function handleCancel() {
    onCancel();
  }

  return (
    <div className="confirmation-popup-wrapper">
      <div className="confirmation-popup">
        <div className="confirm-popup-info-wrapper">{props.children}</div>
        <div className="confirm-popup-btn-wrapper">
          <button className="btn btn-secondary" onClick={handleCancel}>
            Got It
          </button>
        </div>
      </div>
    </div>
  );
}
