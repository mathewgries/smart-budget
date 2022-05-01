import React, { useState } from "react";
import "./inputFields.css"

export default function CurrencyInput(props) {
  const { inputLabel, inputName, inputValue, inputChangeHandler, isDisabled } =
    props;
  const [keyEvent, setKeyEvent] = useState("");

  function handleOnChange(e) {
    let newValue = "";
    if (validateIsNumber()) {
      newValue = addNumberToInput();
    } else if (validateDelete()) {
      newValue = deleteFromInput();
    } else {
      return;
    }
    inputChangeHandler({ name: inputName, value: newValue });
  }

  function handleKeyPress(e) {
    setKeyEvent(e.key);
  }

  function addNumberToInput() {
    let newValue = removeDecimal(inputValue);
    newValue = setDecimalPlace(newValue + keyEvent);
    if (newValue.charAt(0) === "0") {
      newValue = newValue.substring(1);
    }
    return newValue;
  }

  function validateIsNumber() {
    return Number(keyEvent) || keyEvent === "0";
  }

  function deleteFromInput() {
    let newValue = removeDecimal(inputValue);
    newValue = setDecimalPlace(newValue.substring(0, newValue.length - 1));
    if (newValue.length < 4) {
      newValue = "0" + newValue;
    }
    return newValue;
  }

  function validateDelete() {
    return (
      (keyEvent.toLowerCase() === "backspace" ||
        keyEvent.toLowerCase() === "delete") &&
      inputValue !== "0.00"
    );
  }

  function setDecimalPlace(value) {
    return `${value.substring(0, value.length - 2)}.${value.substring(
      value.length - 2
    )}`;
  }

  function removeDecimal(value) {
    return value.replace(".", "");
  }

  return (
    <div className="form-group">
      <label>{inputLabel}</label>
      <input
        className="form-control currency-input-control"
        type="text"
        name={inputName}
        value={inputValue || "0.00"}
        onKeyDown={handleKeyPress}
        onChange={handleOnChange}
        disabled={isDisabled}
        data-lpignore="true"
      />
    </div>
  );
}
