import React, { useState, useEffect } from "react";
import { sumReducer } from "./incomeGraphHelpers";

export default function TotalAmounts(props) {
  const { deposits, withdrawals } = props;

  useEffect(() => {
    const amounts = deposits.map((dep) => dep.transactionAmount);
  }, [deposits, withdrawals]);

  return (
    <div>
      <section>
        <header>
          <h5>Totals</h5>
        </header>
      </section>
      <section className="">
        <div>Deposits: {sumReducer(deposits)}</div>
        <div>Withdrawals: {sumReducer(withdrawals)}</div>
      </section>
    </div>
  );
}
