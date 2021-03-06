import React from "react";
import "./popups.css"

export default function ConfirmationPopup(props) {
  const { onCancel, onConfirm } = props;
  function handleCancel() {
    onCancel();
  }

  function handleConfirm() {
    onConfirm();
  }

  return (
    <div className="confirmation-popup-wrapper">
      <div className="confirmation-popup">
        <div className="confirm-popup-info-wrapper">{props.children}</div>
        <div className="confirm-popup-btn-wrapper form-group">
          <button className="btn btn-delete" onClick={handleCancel}>
            Cancel
          </button>
          <button className="btn btn-add-new" onClick={handleConfirm}>
            Confrim
          </button>
        </div>
      </div>
    </div>
  );
}
