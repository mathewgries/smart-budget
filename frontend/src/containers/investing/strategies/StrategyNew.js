import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { onError } from "../../../lib/errorLib";
import { saveStrategy } from "../../../redux/investing/strategiesSlice";

export default function StrategyNew(props) {
  const dispatch = useDispatch();
  const strategiesStatus = useSelector((state) => state.strategies.status);
  const signalsStatus = useSelector((state) => state.signals.status);
  const [isLoading, setIsLoading] = useState(false);
  const [strategy, setStrategy] = useState("");

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

  async function handleSaveStrategy(e) {
    e.preventDefault();
    try {
      await dispatch(
        saveStrategy({ strategy: { strategyName: strategy } })
      ).unwrap();
      setStrategy("");
    } catch (e) {
      onError(e);
    }
  }

  return (
    <div>
      <form onSubmit={handleSaveStrategy} className="categories-form">
        <div className="form-group categories-form">
          <input
            className="form-control"
            name="strategy"
            value={strategy}
            type="text"
            onChange={(e) => setStrategy(e.target.value)}
            disabled={isLoading}
            placeholder="Add new strategy..."
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
