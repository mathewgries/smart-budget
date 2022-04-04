import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectAllSignals,
  updateSignals,
  addNewSignal,
} from "../../../redux/investing/investingSignalsSlice";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { onError } from "../../../lib/errorLib";

export default function StrategySignals(props) {
  const dispatch = useDispatch();
  const signals = useSelector((state) => selectAllSignals(state));
  const status = useSelector((state) => state.investingSignals.status);
  const [newSignal, setNewSignal] = useState("");

  function handleOnChange(e) {
    const { value } = e.target;
    setNewSignal(value);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const arr = [...signals, newSignal];
      await dispatch(updateSignals(arr)).unwrap();
      dispatch(addNewSignal(newSignal));
    } catch (e) {
      onError(e);
    }
  };

  return (
    <div className="page-container">
      <div className="page-wrapper">
        <section>
          <form onSubmit={handleSubmit}>
						
            <div className="form-group signal-input-group">
              <input
                type="text"
                className="form-control"
                name="newSignal"
                value={newSignal}
                onChange={handleOnChange}
                placeholder="Add new signal..."
								data-lpignore="true"
              />
              <button className="btn btn-primary">
                {status === "pending" ? <LoadingSpinner /> : "Add"}
              </button>
            </div>

          </form>
        </section>
				
        <section>
          <ul className="list-group">
            {signals.map((signal) => (
              <li key={signal} className="list-group-item">
                {signal}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
