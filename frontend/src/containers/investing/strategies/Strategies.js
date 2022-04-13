import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectAllStrategies,
  selectActiveStrategy,
  selectActiveSignals,
  activeStrategyUpdated,
  updateStrategy,
  deleteStrategy,
} from "../../../redux/investing/strategiesSlice";
import { selectAllSharesOrders } from "../../../redux/investing/sharesOrdersSlice";
import { selectAllOptionsOrders } from "../../../redux/investing/optionsOrdersSlice";
import { selectAllVerticalSpreadsOrders } from "../../../redux/investing/verticalSpreadsOrdersSlice";
import { selectAllSignals } from "../../../redux/investing/signalsSlice";
import { onError } from "../../../lib/errorLib";
import StrategyNew from "./StrategyNew";
import SignalNew from "./SignalNew";
import AlertPopup from "../../popups/AlertPopup";
import ConfirmationPopup from "../../popups/ConfirmationPopup";
import DropDownLoader from "../../loadingContainers/DropDownLoader";
import LoadingSpinner from "../../../components/LoadingSpinner";

const AlertMessage = () => {
  return (
    <div>
      <p>The strategy already contains that signal!</p>
    </div>
  );
};

const StrategyConfirmMessage = () => {
  return (
    <div>
      <p>You are about to delete a strategy!</p>
      <p>The strategy will be removed from all orders as well</p>
      <p>Please Confrim!</p>
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
  const [showAlert, setShowAlert] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [strategyDelete, setStrategyDelete] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const orders = useSelector(selectAllSharesOrders)
    .concat(useSelector(selectAllOptionsOrders))
    .concat(useSelector(selectAllVerticalSpreadsOrders));

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

  function handleAlertCancel() {
    setShowAlert(!showAlert);
  }

  function handleStrategyCancel() {
    setShowConfirm(!showConfirm);
  }

  function handleStrategyToggle(strategy) {
    dispatch(activeStrategyUpdated(strategy.id));
  }

  async function addSignalToStrategy(signal) {
    if (activeSignals.includes(signal)) {
      setShowAlert(true);
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

  function handleShowStrategyConfirm(strategy) {
    setShowConfirm(true);
    setStrategyDelete(strategy);
  }

  async function handleStrategyConfirm() {
    setShowConfirm(false);
    await onStrategyDelete(strategyDelete);
  }

  async function onStrategyDelete(strategy) {
    try {
      const orders = setOrdersByStrategyId(strategy.id);
      await dispatch(deleteStrategy({ strategy, orders })).unwrap();
    } catch (e) {
      onError(e);
    }
  }

  function setOrdersByStrategyId(id) {
    return orders.filter((order) => order.strategyId === id);
  }

  return (
    <div className="page-container">
      <div className="page-wrapper">
        <div className="form-wrapper">
          <section>
            {showAlert && (
              <section className="confirmation-popup-section">
                <AlertPopup onCancel={handleAlertCancel}>
                  <AlertMessage />
                </AlertPopup>
              </section>
            )}
          </section>

          <section>
            {showConfirm && (
              <section className="confirmation-popup-section">
                <ConfirmationPopup
                  onCancel={handleStrategyCancel}
                  onConfirm={handleStrategyConfirm}
                >
                  <StrategyConfirmMessage />
                </ConfirmationPopup>
              </section>
            )}
          </section>

          <section>
            <div>
              <header>
                <h5>Strategies</h5>
              </header>
            </div>
          </section>

          <section>
            <StrategyNew />
          </section>

          {(isLoading || !strategies[0]) && (
            <section>
              <DropDownLoader
                isLoading={isLoading}
                text={"Add a strategy..."}
              />
            </section>
          )}

          {!isLoading && strategies[0] && (
            <section>
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
                              onClick={() =>
                                handleShowStrategyConfirm(strategy)
                              }
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
            </section>
          )}

          {(isLoading || !strategies[0]) && (
            <section>
              <DropDownLoader
                isLoading={isLoading}
                text={"Add a strategy..."}
              />
            </section>
          )}

          {!isLoading && strategies[0] && (
            <section>
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
                      "View Signals..."
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
            </section>
          )}

          <section>
            <div>
              <header>
                <h5>Signals</h5>
              </header>
            </div>
          </section>

          <section>
            <SignalNew />
          </section>

          {signals.length > 0 && (
            <section>
              <ul className="list-group">
                {signals.map((signal) => (
                  <li
                    key={signal}
                    className="list-group-item"
                    onClick={() => addSignalToStrategy(signal)}
                  >
                    {signal}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
