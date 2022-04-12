import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectAllStrategies,
  selectActiveStrategy,
  selectActiveSignals,
  activeStrategyUpdated,
  updateStrategy,
} from "../../../redux/investing/strategiesSlice";
import { selectAllSignals } from "../../../redux/investing/signalsSlice";
import { onError } from "../../../lib/errorLib";
import StrategyNew from "./StrategyNew";
import SignalNew from "./SignalNew";
import AlertPopup from "../../popups/AlertPopup";
import LoadingSpinner from "../../../components/LoadingSpinner";

const AlertMessage = () => {
  return (
    <div>
      <p>The strategy already contains that signal!</p>
    </div>
  );
};

export default function Strategies(props) {
  const dispatch = useDispatch();
  const strategies = useSelector(selectAllStrategies);
  const signals = useSelector((state) => selectAllSignals(state));
  const activeStrategy = useSelector((state) => selectActiveStrategy(state));
  const activeSignals = useSelector((state) => selectActiveSignals(state));
  const strategiesStatus = useSelector((state) => state.strategies.status);
  const signalsStatus = useSelector((state) => state.signals.status);
  const [showConfrim, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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

  function handleCancel() {
    setShowConfirm(!showConfrim);
  }

  function handleStrategyToggle(strategy) {
    dispatch(activeStrategyUpdated(strategy.id));
  }

  async function addSignalToStrategy(signal) {
    if (activeSignals.includes(signal)) {
      setShowConfirm(true);
      return;
    } else {
      const updatedSignals = [...activeStrategy.signals, signal];
      await handleUpdateStrategy(updatedSignals);
    }
  }

  async function removeSignalFromStrategy(signalToRemove) {
    const updatedSignals = activeSignals.filter(
      (signal) => signal !== signalToRemove
    );
    await handleUpdateStrategy(updatedSignals);
  }

  async function handleUpdateStrategy(updatedSignals) {
    try {
      await dispatch(
        updateStrategy({
          strategy: {
            ...activeStrategy,
            signals: updatedSignals,
          },
        })
      ).unwrap();
    } catch (e) {
      onError(e);
    }
  }

  return (
    <div className="page-container">
      <div className="page-wrapper">
        <section>
          {showConfrim && (
            <section className="confirmation-popup-section">
              <AlertPopup onCancel={handleCancel}>
                <AlertMessage />
              </AlertPopup>
            </section>
          )}
        </section>
        <div className="form-wrapper">
          <section>
            <div>
              <header>
                <h5>Strategies</h5>
              </header>
            </div>

            <div>
              <StrategyNew />
            </div>

            <div>
              <div className="categories-dropdown-section">
                <div className="dropdown form-group">
                  <button
                    className="btn dropdown-toggle"
                    type="input"
                    id="dropdownMenuButton"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <LoadingSpinner />
                    ) : (
                      `${activeStrategy.strategyName}`
                    )}
                  </button>
                  <div
                    className="dropdown-menu"
                    aria-labelledby="dropdownMenuButton"
                  >
                    {strategies.map((strategy) => (
                      <div key={strategy.id} className="category-list-item">
                        <div
                          className="dropdown-item"
                          onClick={() => handleStrategyToggle(strategy)}
                        >
                          <div>{strategy.strategyName}</div>
                        </div>
                        <div className="category-btn-container">
                          <div>
                            <button
                              className="btn btn-danger btn-sm"
                              // onClick={() => handleShowCategoryConfirm(category)}
                              disabled={isLoading}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="categories-dropdown-section">
                <div className="dropdown form-group">
                  <button
                    className="btn dropdown-toggle"
                    type="input"
                    id="dropdownMenuButton"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <LoadingSpinner />
                    ) : activeSignals.length === 0 ? (
                      "No Signals In Strategy..."
                    ) : (
                      "Signals In Strategy..."
                    )}
                  </button>
                  <div
                    className="dropdown-menu"
                    aria-labelledby="dropdownMenuButton"
                  >
                    {activeSignals.map((signal) => (
                      <div key={signal} className="category-list-item">
                        <div className="dropdown-item">
                          <div>{signal}</div>
                        </div>
                        <div className="category-btn-container">
                          <div>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => removeSignalFromStrategy(signal)}
                              disabled={isLoading}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section>
            <div>
              <header>
                <h5>Signals</h5>
              </header>
            </div>

            <div>
              <SignalNew />
            </div>

            <div>
              <ul className="list-group">
                {signals.length > 0 &&
                  signals.map((signal) => (
                    <li
                      key={signal}
                      className="list-group-item"
                      onClick={() => addSignalToStrategy(signal)}
                    >
                      {signal}
                    </li>
                  ))}
              </ul>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
