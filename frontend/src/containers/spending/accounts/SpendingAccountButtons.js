import React from "react";

export default function SpendingAccountButtons(props) {
  return (
    <div className="spending-account-btn-container">
      <button className="btn btn-primary">Edit</button>
      <button className="btn btn-danger">Delete</button>
    </div>
  );
}
