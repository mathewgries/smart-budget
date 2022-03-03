import React from "react";
import { BsArrowRepeat } from "react-icons/bs";
import "./LoaderButton.css";

export default function LoaderButton({
  className = ""
}) {
  return (
    <div
      className={`loading-spinner ${className}`}
    >
      <BsArrowRepeat className="spinning" />
    </div>
  );
}
