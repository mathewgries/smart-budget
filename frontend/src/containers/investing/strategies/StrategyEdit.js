import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { onError } from "../../../lib/errorLib";
import {
  updateStrategy,
  selectActiveStrategy,
} from "../../../redux/investing/strategiesSlice";
import "./strategies.css"

export default function StrategyEdit(props) {
  const dispatch = useDispatch();
  const activeStrategy = useSelector((state) => selectActiveStrategy(state));
  const strategiesStatus = useSelector((state) => state.strategies.status);
  const signalsStatus = useSelector((state) => state.signals.status);
  const [isLoading, setIsLoading] = useState(false);
  const [strategy, setStrategy] = useState(activeStrategy.strategyName);

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

  async function handleUpdateStrategy(e) {
    e.preventDefault();
    try {
      await dispatch(
        updateStrategy({
          strategy: {
            ...activeStrategy,
            strategyName: strategy,
          },
        })
      ).unwrap();
			props.toggleStrategyEdit()
    } catch (e) {
      onError(e);
    }
  }

  return (
    <div>
      <form onSubmit={handleUpdateStrategy} className="strategy-edit-form">
        <div className="form-group">
          <input
            className="form-control"
            name="strategy"
            value={strategy}
            type="text"
            onChange={(e) => setStrategy(e.target.value)}
						data-lpignore="true"
            disabled={isLoading}
          />
        </div>
        <div className="form-group">
          <button className="btn btn-add-new" disabled={isLoading}>
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
