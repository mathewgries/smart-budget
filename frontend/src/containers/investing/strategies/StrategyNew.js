import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { onError } from "../../../lib/errorLib";
import { saveStrategy } from "../../../redux/investing/strategiesSlice";
import AlertPopup from "../../popups/AlertPopup";
import { StrategyNameExistsAlertPopupMessage } from "./strategyPopupMessages";

export default function StrategyNew(props) {
  const { strategies } = props;
  const dispatch = useDispatch();
  const strategiesStatus = useSelector((state) => state.strategies.status);
  const signalsStatus = useSelector((state) => state.signals.status);
  const [showAlertPopup, setShowAlertPopup] = useState(false);
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

  function handleAlertPopupCancel() {
    setShowAlertPopup(false);
  }

  async function handleSaveStrategy(e) {
    e.preventDefault();
    if (validateStrategyName()) {
      setShowAlertPopup(true);
      setStrategy("");
      return;
    }

    try {
      await dispatch(
        saveStrategy({ strategy: { strategyName: strategy } })
      ).unwrap();
      setStrategy("");
    } catch (e) {
      onError(e);
    }
  }

  function validateStrategyName() {
    const existingNames = strategies.map((strategy) =>
      strategy.strategyName.toLowerCase().replace(/\s/g, "")
    );
    if (existingNames.includes(strategy.toLowerCase().replace(/\s/g, ""))) {
      return true;
    } else {
      return false;
    }
  }

  return (
    <div>
      <section>
        {showAlertPopup && (
          <section className="confirmation-popup-section">
            <AlertPopup onCancel={handleAlertPopupCancel}>
              <StrategyNameExistsAlertPopupMessage />
            </AlertPopup>
          </section>
        )}
      </section>
      <form onSubmit={handleSaveStrategy} className="categories-form">
        <div className="form-group categories-form">
          <input
            className="form-control"
            name="strategy"
            value={strategy}
            type="text"
            onChange={(e) => setStrategy(e.target.value)}
            disabled={isLoading}
						data-lpignore="true"
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
