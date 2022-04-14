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
import {
  selectAllSignals,
  updateSignals,
} from "../../../redux/investing/signalsSlice";
import { onError } from "../../../lib/errorLib";
import StrategyNew from "./StrategyNew";
import SignalNew from "./SignalNew";
import AlertPopup from "../../popups/AlertPopup";
import ConfirmationPopup from "../../popups/ConfirmationPopup";
import ReplaceStrategyPopup from "../../popups/ReplaceStrategyPopup";
import DropDownLoader from "../../loadingContainers/DropDownLoader";
import {
  AlertPopupMessage,
  DeleteStrategyConfirmMessage,
  SignalRemoveConfirmMessage,
  SignalDeleteConfirmMessage,
} from "./strategyPopupMessages";

export default function Strategies(props) {
  const dispatch = useDispatch();
  const strategies = useSelector(selectAllStrategies);
  const signals = useSelector((state) => selectAllSignals(state));
  const activeStrategy = useSelector((state) => selectActiveStrategy(state));
  const activeSignals = useSelector((state) => selectActiveSignals(state));
  const strategiesStatus = useSelector((state) => state.strategies.status);
  const signalsStatus = useSelector((state) => state.signals.status);
  const [showAlertPopup, setShowAlertPopup] = useState(false);
  const [showDeleteSignalConfirm, setShowDeleteSignalConfirm] = useState(false);
  const [stagedSignalToDelete, setStagedSignalToDelete] = useState();
  const [showDeleteStrategyConfirm, setShowDeleteStrategyConfirm] =
    useState(false);
  const [stagedStrategyToDelete, setStagedStrategyToDelete] = useState();
  const [selectedReplacementStrategy, setSelectedReplacementStrategy] =
    useState();
  const [showRemoveSignalConfirm, setShowRemoveSignalConfirm] = useState(false);
  const [stagedSignalToRemove, setStagedSignalToRemove] = useState();
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

  function handleAlertPopupCancel() {
    setShowAlertPopup(false);
  }

  function handleStrategyToggle(strategy) {
    dispatch(activeStrategyUpdated(strategy.id));
  }

  async function addSignalToStrategy(signal) {
    if (activeSignals.includes(signal)) {
      setShowAlertPopup(true);
      return;
    } else {
      const updatedSignals = [...activeStrategy.signals, signal];
      await handleUpdateStrategy(updatedSignals);
    }
  }

  // REMOVE SIGNAL FROM STRATEGY
  function handleShowRemoveSignalConfirm(signal) {
    setShowRemoveSignalConfirm(true);
    setStagedSignalToRemove(signal);
  }

  function handleRemoveSignalCancel() {
    setShowRemoveSignalConfirm(false);
  }

  function handleRemoveSignalConfirm() {
    setShowRemoveSignalConfirm(false);
    removeSignalFromStrategy();
  }

  async function removeSignalFromStrategy() {
    const updatedSignals = activeSignals.filter(
      (signal) => signal !== stagedSignalToRemove
    );
    await handleUpdateStrategy(updatedSignals);
  }

  // DELETE SIGNAL
  function handleShowDeleteSignalConfirm(signal) {
    setShowDeleteSignalConfirm(true);
    setStagedSignalToDelete(signal);
  }

  function handleDeleteSignalCancel() {
    setShowDeleteSignalConfirm(false);
  }

  async function handleDeleteSignalConfirm() {
    setShowDeleteSignalConfirm(false);
    await onDeleteSignal();
  }

  async function onDeleteSignal() {
    try {
      await dispatch(
        updateSignals({
          signals: signals.filter((signal) => signal !== stagedSignalToDelete),
          strategies: setStrategiesOnSignalDelete(),
        })
      ).unwrap();
			setStagedSignalToDelete()
    } catch (e) {
      onError(e);
    }
  }

  function setStrategiesOnSignalDelete() {
    return strategies
      .filter((strategy) => strategy.signals.includes(stagedSignalToDelete))
      .map((strategy) => ({
        ...strategy,
        signals: strategy.signals.filter(
          (signal) => signal !== stagedSignalToDelete
        ),
      }));
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

  // REPLACE STRATEGY ON DELETE
  function handleSelectedReplacementStrategy(strategy) {
    setSelectedReplacementStrategy(strategy);
  }

  // DELETE STRATEGY
  function handleShowStrategyConfirm(strategy) {
    setShowDeleteStrategyConfirm(true);
    setStagedStrategyToDelete(strategy);
  }

  function handleStrategyCancel() {
    setSelectedReplacementStrategy();
    setStagedStrategyToDelete();
    setShowDeleteStrategyConfirm(!showDeleteStrategyConfirm);
  }

  async function handleStrategyConfirm() {
    setShowDeleteStrategyConfirm(false);
    await onStrategyDelete(stagedStrategyToDelete);
  }

  async function onStrategyDelete(strategy) {
    try {
      const orders = setOrdersByStrategyId(strategy.id);
      await dispatch(deleteStrategy({ strategy, orders })).unwrap();
      setSelectedReplacementStrategy();
      setStagedStrategyToDelete();
    } catch (e) {
      onError(e);
    }
  }

  function setOrdersByStrategyId(id) {
    return orders
      .filter((order) => order.strategyId === id)
      .map((order) => ({
        ...order,
        strategyId: selectedReplacementStrategy
          ? selectedReplacementStrategy.id
          : null,
      }));
  }

  return (
    <div className="page-container">
      <div className="page-wrapper">
        <div className="form-wrapper">
          <section>
            {showAlertPopup && (
              <section className="confirmation-popup-section">
                <AlertPopup onCancel={handleAlertPopupCancel}>
                  <AlertPopupMessage />
                </AlertPopup>
              </section>
            )}
          </section>

          <section>
            {showDeleteStrategyConfirm && (
              <section className="confirmation-popup-section">
                <ConfirmationPopup
                  onCancel={handleStrategyCancel}
                  onConfirm={handleStrategyConfirm}
                >
                  <DeleteStrategyConfirmMessage />
                  <ReplaceStrategyPopup
                    strategies={strategies}
                    strategyToDelete={stagedStrategyToDelete}
                    handleSelectedReplacementStrategy={
                      handleSelectedReplacementStrategy
                    }
                  ></ReplaceStrategyPopup>
                </ConfirmationPopup>
              </section>
            )}
          </section>

          <section>
            {showRemoveSignalConfirm && (
              <section className="confirmation-popup-section">
                <ConfirmationPopup
                  onCancel={handleRemoveSignalCancel}
                  onConfirm={handleRemoveSignalConfirm}
                >
                  <SignalRemoveConfirmMessage />
                </ConfirmationPopup>
              </section>
            )}
          </section>

          <section>
            {showDeleteSignalConfirm && (
              <section className="confirmation-popup-section">
                <ConfirmationPopup
                  onCancel={handleDeleteSignalCancel}
                  onConfirm={handleDeleteSignalConfirm}
                >
                  <SignalDeleteConfirmMessage />
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
                    {activeStrategy.strategyName}
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

          {(isLoading || !strategies[0] || !activeSignals[0]) && (
            <section>
              <DropDownLoader
                isLoading={isLoading}
                text={!strategies[0] ? "Add a strategy..." : "No signals..."}
              />
            </section>
          )}

          {!isLoading && strategies[0] && activeSignals[0] && (
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
                    View Signals...
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
                              onClick={() =>
                                handleShowRemoveSignalConfirm(signal)
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
                  <li key={signal} className="list-group-item signal-list-item">
                    <div
                      onClick={() => addSignalToStrategy(signal)}
                      className="signal"
                    >
                      {signal}
                    </div>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleShowDeleteSignalConfirm(signal)}
                    >
                      Delete
                    </button>
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
