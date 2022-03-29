import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectInvestingAccountById } from "../../../redux/investing/investingAccountsSlice";
import {
  selectOrderCountByTypeAndAccountId,
  selectProfitLossByAccountId,
} from "../../../redux/investing/investingOrdersSlice";
import { Link } from "react-router-dom";
import InvestingBalance from "./InvestingBalance";
import GrowthRate from "./GrowthRate";
import SharesOrdersTable from "./shares/SharesOrdersTable";
import OptionsOrdersTable from "./options/OptionsOrderTable";
import VerticalSpreadsTable from "./spreads/VerticalSpreadsTable";

export default function InvestingJournal(props) {
  const { id } = useParams();
  const account = useSelector((state) => selectInvestingAccountById(state, id));
  const sharesCount = useSelector((state) =>
    selectOrderCountByTypeAndAccountId(state, "shares", id)
  );
  const optionsCount = useSelector((state) =>
    selectOrderCountByTypeAndAccountId(state, "options", id)
  );
  const verticalSpreadsCount = useSelector((state) =>
    selectOrderCountByTypeAndAccountId(state, "verticalSpreads", id)
  );
  const profitLossTotal = useSelector((state) =>
    selectProfitLossByAccountId(state, id)
  );
  const [openOrderSelect, setOpenOrderSelect] = useState(false);
  const [openViewSelect, setOpenViewSelect] = useState(false);
  const [selectedView, setSelectedView] = useState("View All");

  function handleSelectView(e) {
    const { innerText } = e.target;
    setSelectedView(innerText);
  }

  return (
    <div className="page-container">
      <div className="page-wrapper">
        <section className="investing-journal-account-performance-wrapper">
          <div>
            <InvestingBalance account={account} />
          </div>
          <div>
            <GrowthRate growthRate={`P/L$: ${profitLossTotal}`} />
          </div>
          <div>
            <GrowthRate
              growthRate={`P/L%: ${(
                ((account.accountBalance -
                  (account.accountBalance - profitLossTotal)) /
                  (account.accountBalance - profitLossTotal)) *
                100
              ).toFixed(2)}`}
            />
          </div>
        </section>

        <section className="order-accordian-section">
          <div className="order-type-accordian">
            <div className="order-type-accordian-item">
              <div
                className="order-type-accordian-title"
                onClick={() => setOpenOrderSelect(!openOrderSelect)}
              >
                <div>New Order</div>
                <div>{openOrderSelect ? "-" : "+"}</div>
              </div>
              {openOrderSelect && (
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

        <section>
          <div className="order-type-accordian">
            <div className="order-type-accordian-item">
              <div
                className="order-type-accordian-title"
                onClick={() => setOpenViewSelect(!openViewSelect)}
              >
                <div>View Select</div>
                <div>{openViewSelect ? "-" : "+"}</div>
              </div>
              {openViewSelect && (
                <div className="order-type-dropdown-content">
                  <div
                    className="view-selection"
                    value="all"
                    onClick={handleSelectView}
                  >
                    View All
                  </div>
                  <div
                    className="view-selection"
                    value="shares"
                    onClick={handleSelectView}
                  >
                    Shares
                  </div>
                  <div
                    className="view-selection"
                    value="options"
                    onClick={handleSelectView}
                  >
                    Options
                  </div>
                  <div
                    className="view-selection"
                    value="vertical"
                    onClick={handleSelectView}
                  >
                    Vertical Spreads
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="journal-table-section">
          {sharesCount === 0 &&
          optionsCount === 0 &&
          verticalSpreadsCount === 0 ? (
            <div>
              <p>Add your first order...</p>
            </div>
          ) : (
            <div>
              <div>
                {sharesCount > 0 && (
                  <div>
                    {selectedView === "View All" ||
                    selectedView === "Shares" ? (
                      <SharesOrdersTable />
                    ) : null}
                  </div>
                )}
              </div>
              <div>
                {optionsCount > 0 && (
                  <div>
                    {selectedView === "View All" ||
                    selectedView === "Options" ? (
                      <OptionsOrdersTable />
                    ) : null}
                  </div>
                )}
              </div>
              <div>
                {verticalSpreadsCount > 0 && (
                  <div>
                    {selectedView === "View All" ||
                    selectedView === "Vertical Spreads" ? (
                      <VerticalSpreadsTable />
                    ) : null}
                  </div>
                )}
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
