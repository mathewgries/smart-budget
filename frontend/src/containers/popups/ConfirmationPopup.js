import React from 'react'

export default function ConfirmationPopup(props){
  function handleCancel() {
    props.cancel();
  }

  function handleConfirm() {
    props.onConfirm();
  }

  return (
    <div className="confirmation-popup-wrapper">
      <div className="confirmation-popup">
        <div className="confirm-popup-info-wrapper">
          <p>You are about to delete a transaction!</p>
          <p>This effects account balance as well!</p>
          <p>Please confirm</p>
        </div>
        <div className="confirm-popup-btn-wrapper">
          <button className="btn btn-secondary" onClick={handleCancel}>
            Cancel
          </button>
          <button className="btn btn-danger" onClick={handleConfirm}>
            Confrim
          </button>
        </div>
      </div>
    </div>
  );
};