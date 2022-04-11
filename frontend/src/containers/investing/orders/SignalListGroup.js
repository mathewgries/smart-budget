import React, { useState } from "react";
import { useSelector } from "react-redux";
import { selectAllSignals } from "../../../redux/investing/signalsSlice";

function SignalListItem(props) {
  const { signal, handleSignalSelection, persistState } = props;
  const [isAdded, setIsAdded] = useState(persistState);

  function handleToggle() {
    setIsAdded(!isAdded);
    handleSignalSelection(signal, !isAdded);
  }

  return (
    <li className="list-group-item order-signal-list-item">
      <div>{signal}</div>
      <div>
        <div
          className={`btn ${isAdded ? "btn-danger" : "btn-success"}`}
          onClick={handleToggle}
        >
          {isAdded ? "Remove" : "Add"}
        </div>
      </div>
    </li>
  );
}

export default function SignalsListGroup(props) {
  const signals = useSelector((state) => selectAllSignals(state));
  const [openSignals, setOpenSignals] = useState(false);
  const { handleSignalSelection, selectedSignals, editPage } = props;

  return (
    <div className="order-accordian-section">
      <div className="order-type-accordian">
        <div className="order-type-accordian-item">
          <div
            className="order-type-accordian-title"
            onClick={() => setOpenSignals(!openSignals)}
          >
            <div>
              {editPage ? (
                <div>Edit Signals</div>
              ) : (
                <div>
                  Add Signals<span>(optional)</span>
                </div>
              )}
            </div>
            <div>{openSignals ? "-" : "+"}</div>
          </div>
          {openSignals && (
            <ul className="list-group">
              {signals.map((signal) => (
                <div key={signal}>
                  <SignalListItem
                    signal={signal}
                    handleSignalSelection={handleSignalSelection}
                    persistState={
                      selectedSignals.includes(signal) ? true : false
                    }
                  />
                </div>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
