import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectAllSignals,
  saveSignal,
} from "../../../redux/investing/signalsSlice";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { onError } from "../../../lib/errorLib";

export default function StrategySignals(props) {
  const dispatch = useDispatch();
  const signals = useSelector((state) => selectAllSignals(state));
  const status = useSelector((state) => state.investingSignals.status);
  const [isLoading, setIsLoading] = useState(false);
  const [newSignal, setNewSignal] = useState("");

  useEffect(() => {
    if (status === "pending" && !isLoading) {
      setIsLoading(true);
    } else if (status !== "pending" && isLoading) {
      setIsLoading(false);
    }
  }, [status, isLoading]);

  function handleOnChange(e) {
    const { value } = e.target;
    setNewSignal(value);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedList = [...signals, newSignal];
      await dispatch(saveSignal(updatedList)).unwrap();
    } catch (e) {
      onError(e);
    }
  };

  return (
    <div className="page-container">
      <div className="page-wrapper">
        <div className="form-wrapper">
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
                  {isLoading ? <LoadingSpinner /> : "Add"}
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
    </div>
  );
}
