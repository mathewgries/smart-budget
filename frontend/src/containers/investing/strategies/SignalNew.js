import React, { useEffect, useState } from "react";
import * as uuid from "uuid";
import { useSelector, useDispatch } from "react-redux";
import {
  selectAllSignals,
  updateSignals,
} from "../../../redux/investing/signalsSlice";
import AlertPopup from "../../popups/AlertPopup";
import { SignalExistsAlertPopupMessage } from "./strategyPopupMessages";
import { onError } from "../../../lib/errorLib";

export default function StrategyNew(props) {
  const dispatch = useDispatch();
  const signals = useSelector((state) => selectAllSignals(state));
  const strategiesStatus = useSelector((state) => state.strategies.status);
  const signalsStatus = useSelector((state) => state.signals.status);
  const [showAlertPopup, setShowAlertPopup] = useState(false);
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

  function handleAlertPopupCancel() {
    setShowAlertPopup(false);
  }

  async function handleSaveSignal(e) {
    e.preventDefault();
    if (validateSignalName()) {
      setShowAlertPopup(true);
      setSignal("");
      return;
    }
    try {
      await dispatch(
        updateSignals({
          signals: [...signals, { id: uuid.v1(), name: signal }],
        })
      ).unwrap();
      setSignal("");
    } catch (e) {
      onError(e);
    }
  }

  function validateSignalName() {
		const signalNames = signals.map((signal) => signal.name.toLowerCase().replace(/\s/g, ""))
    // const signalsConverted = signals.map((signal) =>
    //   signal.toLowerCase().replace(/\s/g, "")
    // );
    if (signalNames.includes(signal.toLowerCase().replace(/\s/g, ""))) {
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
              <SignalExistsAlertPopupMessage />
            </AlertPopup>
          </section>
        )}
      </section>
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
