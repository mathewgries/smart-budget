import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectInvestingAccountById } from "../../../redux/investing/investingAccountsSlice";
import { Link } from "react-router-dom";
import InvestingBalance from "./InvestingBalance";
import GrowthRate from "./GrowthRate";
import InvestingOrders from "./InvestingOrders";

export default function InvestingJournal(props) {
  const { id } = useParams();
  const account = useSelector((state) => selectInvestingAccountById(state, id));
  const [isActive, setIsActive] = useState(false);

  return (
    <div className="page-container">
      <div className="page-wrapper">
        <div>Investing Journal</div>
        <section className="investing-journal-account-performance-wrapper">
          <div>
            <InvestingBalance account={account} />
          </div>
          <div>
            <GrowthRate />
          </div>
          <div>
            <GrowthRate />
          </div>
        </section>
        <section>
          <div className="order-type-accordian">
            <div className="order-type-accordian-item">
              <div
                className="order-type-accordian-title"
                onClick={() => setIsActive(!isActive)}
              >
                <div>New Order</div>
                <div>{isActive ? "-" : "+"}</div>
              </div>
              {isActive && (
                <div className="order-type-dropdown-content">
                  <div>
                    <Link to={`/investing/orders/shares/new/${id}`}>
                      Shares
                    </Link>
                  </div>
                  <div>
                    <Link to={`/investing/orders/options/new/${id}`}>
                      Options
                    </Link>
                  </div>
                  <div>
                    <Link to={`/investing/orders/spreads/vertical/new/${id}`}>
                      Vertical Spread
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
