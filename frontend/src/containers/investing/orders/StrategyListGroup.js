import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectAllStrategies,
  selectActiveStrategy,
  activeStrategyUpdated,
  activeStrategyRemoved,
} from "../../../redux/investing/strategiesSlice";

function StrategyListItem(props) {
  const { strategy } = props;
  const dispatch = useDispatch();
  const activeStrategy = useSelector((state) => selectActiveStrategy(state));
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (activeStrategy) {
      if (strategy.id === activeStrategy.id) {
        setIsActive(true);
      } else {
        setIsActive(false);
      }
    } else {
      setIsActive(false);
    }
  }, [activeStrategy, strategy.id, isActive]);

  function handleActiveToggle() {
    if (isActive) {
      dispatch(activeStrategyRemoved());
    } else {
      dispatch(activeStrategyUpdated(strategy.id));
    }
  }

  return (
    <li className="list-group-item order-signal-list-item">
      <div>{strategy.strategyName}</div>
      <div>
        <div
          className={`btn ${isActive ? "btn-danger" : "btn-success"}`}
          onClick={handleActiveToggle}
        >
          {isActive ? "Remove" : "Add"}
        </div>
      </div>
    </li>
  );
}

export default function StrategyListGroup(props) {
  const strategies = useSelector(selectAllStrategies);
  const [openStrategies, setOpenStrategies] = useState(false);

  return (
    <div className="order-accordian-section">
      <div className="order-type-accordian">
        <div className="order-type-accordian-item">
          <div
            className="order-type-accordian-title"
            onClick={() => setOpenStrategies(!openStrategies)}
          >
            <div>
              <div>
                Add Strategy <span>(optional)</span>
              </div>
            </div>
            <div>{openStrategies ? "-" : "+"}</div>
          </div>
          {openStrategies && (
            <ul className="list-group">
              {strategies.map((strategy) => (
                <div key={strategy.id}>
                  <StrategyListItem strategy={strategy} />
                </div>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
