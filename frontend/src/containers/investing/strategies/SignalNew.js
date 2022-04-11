import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectAllSignals,
  saveSignal,
} from "../../../redux/investing/signalsSlice";
import { onError } from "../../../lib/errorLib";

export default function StrategyNew(props) {
  const dispatch = useDispatch();
  const signals = useSelector((state) => selectAllSignals(state));
  const strategiesStatus = useSelector((state) => state.strategies.status);
  const signalsStatus = useSelector((state) => state.signals.status);
  const [isLoading, setIsLoading] = useState(false);
  const [signal, setSignal] = useState("");

  useEffect(() => {
    function validateStatus() {
      if (strategiesStatus === "pending" || signalsStatus === "pending") {
        return true;
      } else {
        return false;
      }
    }

    if (validateStatus() && !isLoading) {
      setIsLoading(true);
    } else if (!validateStatus() && isLoading) {
      setIsLoading(false);
    }
  }, [strategiesStatus, signalsStatus, isLoading]);

  async function handleSaveSignal(e) {
    e.preventDefault();
    try {
      await dispatch(saveSignal([...signals, signal])).unwrap();
      setSignal("");
    } catch (e) {
      onError(e);
    }
  }

  return (
    <div>
      <form onSubmit={handleSaveSignal} className="categories-form">
        <div className="form-group categories-form">
          <input
            className="form-control"
            name="signal"
            value={signal}
            type="text"
            onChange={(e) => setSignal(e.target.value)}
            disabled={isLoading}
            placeholder="Add new signal..."
          />
        </div>
        <div className="form-group">
          <button className="btn btn-primary" disabled={isLoading}>
            Add
          </button>
        </div>
      </form>
    </div>
  );
}
