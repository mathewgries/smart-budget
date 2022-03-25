import React from "react";
import InvestingBalance from "./InvestingBalance";
import GrowthRate from "./GrowthRate";
import InvestingOrders from "./InvestingOrders";

export default function InvestingJournal(props) {
  return (
    <div className="page-container">
      <div className="page-wrapper">
        <div>Investing Journal</div>
        <section className="investing-journal-account-performance-wrapper">
          <div>
            <InvestingBalance />
          </div>
          <div>
            <GrowthRate />
          </div>
          <div>
            <GrowthRate />
          </div>
        </section>
        <section>
          <InvestingOrders />
        </section>
      </div>
    </div>
  );
}
