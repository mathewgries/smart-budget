import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectAllSignals,
  selectSignalById,
  updateSignals,
} from "../../../redux/investing/signalsSlice";
import AlertPopup from "../../popups/AlertPopup";
import { SignalExistsAlertPopupMessage } from "./strategyPopupMessages";
import { onError } from "../../../lib/errorLib";
import "./strategies.css"

export default function SignalEdit(props) {
  const dispatch = useDispatch();
  const signals = useSelector(selectAllSignals);
  const strategiesStatus = useSelector((state) => state.strategies.status);
  const signalsStatus = useSelector((state) => state.signals.status);
  const [showAlertPopup, setShowAlertPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [signal, setSignal] = useState(
    useSelector((state) => selectSignalById(state, props.signalId))
  );

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

  async function handleUpdateSignal(e) {
    e.preventDefault();
    if (validateSignalName()) {
      setShowAlertPopup(true);
      return;
    }

    const newSignals = signals.map((item) =>
      item.id === signal.id ? signal : item
    );

    try {
      props.handleSignalToUpdate();
      await dispatch(
        updateSignals({
          signals: newSignals,
        })
      ).unwrap();
    } catch (e) {
      onError(e);
    }
  }

  function validateSignalName() {
    const signalNames = signals.map((signal) =>
      signal.name.toLowerCase().replace(/\s/g, "")
    );
    if (signalNames.includes(signal.name.toLowerCase().replace(/\s/g, ""))) {
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
      <form onSubmit={handleUpdateSignal} className="categories-form">
        <div className="form-group">
          <input
            className="form-control"
            name="signal"
            value={signal.name}
            type="text"
            onChange={(e) => setSignal({ ...signal, name: e.target.value })}
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
