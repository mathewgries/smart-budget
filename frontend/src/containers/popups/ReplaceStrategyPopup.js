import React, { useState } from "react";
import "./popups.css"

export default function ReplaceStrategyPopup(props) {
  const { strategies, strategyToDelete, handleSelectedReplacementStrategy } =
    props;
  const [isChecked, setIsChecked] = useState();
  const strategyList = strategies.filter(
    (strategy) => strategy.id !== strategyToDelete.id
  );

  function handleChange(strategy) {
    if (strategy.id === isChecked) {
      setIsChecked();
      handleSelectedReplacementStrategy();
    } else {
      setIsChecked(strategy.id);
      handleSelectedReplacementStrategy(strategy);
    }
  }

  return (
    <div>
      <section>
        <p>To replace this strategy on orders, select your replacement below</p>
      </section>
      <section>
        <ul className="list-group">
          {strategyList.map((strategy) => (
            <ul
              key={strategy.id}
              className="list-group-item replace-strategy-list-item"
            >
              <div>{strategy.strategyName}</div>
              <div>
                <input
                  type="checkbox"
                  onChange={() => handleChange(strategy)}
                  checked={isChecked === strategy.id}
                />
              </div>
            </ul>
          ))}
        </ul>
      </section>
    </div>
  );
}
