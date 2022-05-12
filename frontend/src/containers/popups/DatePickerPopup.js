import React, { useState } from "react";
import { inputDateFormat } from "../../helpers/dateFormat"

export default function DatePickerPopup(props) {
  const { onCancel, onConfirm, timeFrame } = props;
  const [dates, setDates] = useState({
    start: inputDateFormat(timeFrame.startDate),
    end: inputDateFormat(timeFrame.endDate),
  });

  function handleCancel() {
    onCancel();
  }

  function handleConfirm() {
    onConfirm(dates);
  }

  function handleOnChange(e) {
		const {name, value} = e.target
		setDates({...dates, [name]: value})
	}

  return (
    <div className="date-picker-popup-wrapper">
      <div className="date-picker-popup">
        <section className="date-display-wrapper">
          <div className="date-display">
            <div>Start</div>
            <input
              type="date"
              name="start"
              value={dates.start}
              onChange={handleOnChange}
            />
          </div>
          <div className="date-display">
            <div>End</div>
            <input
              type="date"
              name="end"
              value={dates.end}
              onChange={handleOnChange}
            />
          </div>
        </section>
        <section className="date-picker-popup-btn-wrapper form-group">
          <button className="btn btn-delete" onClick={handleCancel}>
            Cancel
          </button>
          <button className="btn btn-add-new" onClick={handleConfirm}>
            Confrim
          </button>
        </section>
      </div>
    </div>
  );
}
