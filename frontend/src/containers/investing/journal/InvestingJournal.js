import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectInvestingAccountById } from "../../../redux/investing/investingAccountsSlice";
import {
  selectSharesOrdersByAccounGSI,
  selectSharesPLByAccountGSI,
} from "../../../redux/investing/sharesOrdersSlice";
import {
  selectOptionsOrdersByAccountGSI,
  selectOptionsPLByAccountGSI,
} from "../../../redux/investing/optionsOrdersSlice";
import {
  selectVerticalSpreadsOrdersByAccountGSI,
  selectVerticalSpreadsPLByAccountGSI,
} from "../../../redux/investing/verticalSpreadsOrdersSlice";
import { Link } from "react-router-dom";
import InvestingBalance from "./InvestingBalance";
import GrowthRate from "./GrowthRate";
import SharesOrdersTable from "../orders/shares/SharesOrdersTable";
import OptionsOrdersTable from "../orders/options/OptionsOrderTable";
import VerticalSpreadsTable from "../orders/spreads/VerticalSpreadsTable";
import "./journal.css";

export default function InvestingJournal(props) {
  const { id } = useParams();
  const account = useSelector((state) => selectInvestingAccountById(state, id));

  const shares = useSelector((state) =>
    selectSharesOrdersByAccounGSI(state, account.GSI1_PK)
  );
  const options = useSelector((state) =>
    selectOptionsOrdersByAccountGSI(state, account.GSI1_PK)
  );
  const verticalSpreads = useSelector((state) =>
    selectVerticalSpreadsOrdersByAccountGSI(state, account.GSI1_PK)
  );
  const optionsPL = useSelector((state) =>
    selectOptionsPLByAccountGSI(state, account.GSI1_PK)
  );
  const sharesPL = useSelector((state) =>
    selectSharesPLByAccountGSI(state, account.GSI1_PK)
  );

  const vertSpreadsPL = useSelector((state) =>
    selectVerticalSpreadsPLByAccountGSI(state, account.GSI1_PK)
  );
  const status = useSelector((state) => state.investingAccounts.status);
  const [isLoading, setIsLoading] = useState(false);
  const [openOrderSelect, setOpenOrderSelect] = useState(false);
  const [openViewSelect, setOpenViewSelect] = useState(false);
  const [selectedView, setSelectedView] = useState("View All");

  useEffect(() => {
    if (status === "pending" && !isLoading) {
      setIsLoading(true);
    } else if (status !== "pending" && isLoading) {
      setIsLoading(false);
    }
  }, [status, isLoading]);

  function handleSelectView(e) {
    const { innerText } = e.target;
    setSelectedView(innerText);
  }

  function handlePLCalculate() {
    const result = sharesPL + optionsPL + vertSpreadsPL;
    return result;
  }

  function handlePLPercent() {
    const balance = Number.parseFloat(account.accountBalance.replace(",", ""));
    const diff = balance - handlePLCalculate();
    const result = ((balance - diff) / diff) * 100;
    return result;
  }

  return (
    <div className="page-container">
      <div className="page-wrapper">
        <div className="journal-page-container">
          <section className="page-header-wrapper journal-account-name">
            <header className="page-header">
              <Link to={`/investing/accounts/${id}`}>
                <h5>Account: {account.accountName}</h5>
              </Link>
            </header>
          </section>

          <section className="investing-journal-account-performance-wrapper">
            <div className="component-wrapper">
              <InvestingBalance
                accountBalance={account.accountBalance}
                isLoading={isLoading}
              />
            </div>
            <div className="component-wrapper">
              <GrowthRate
                sign={"P/L$:"}
                growthRate={handlePLCalculate().toFixed(2)}
                isLoading={isLoading}
              />
            </div>
            <div className="component-wrapper">
              <GrowthRate
                sign={"P/L%:"}
                growthRate={handlePLPercent().toFixed(2)}
                isLoading={isLoading}
              />
            </div>
          </section>

          <section className="journal-accordian-section">
            <div className="journal-accordian">
              <div>
                <div
                  className="journal-accordian-title"
                  onClick={() => setOpenOrderSelect(!openOrderSelect)}
                >
                  <div>New Order</div>
                  <div>{openOrderSelect ? "-" : "+"}</div>
                </div>
                {openOrderSelect && (
                  <div className="journal-accordian-dropdown-content">
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

          <section className="journal-accordian-section">
            <div className="journal-accordian">
              <div>
                <div
                  className="journal-accordian-title"
                  onClick={() => setOpenViewSelect(!openViewSelect)}
                >
                  <div>View Select</div>
                  <div>{openViewSelect ? "-" : "+"}</div>
                </div>
                {openViewSelect && (
                  <div className="journal-accordian-dropdown-content">
                    <div
                      className="journal-view-selection"
                      value="all"
                      onClick={handleSelectView}
                    >
                      View All
                    </div>
                    <div
                      className="journal-view-selection"
                      value="shares"
                      onClick={handleSelectView}
                    >
                      Shares
                    </div>
                    <div
                      className="journal-view-selection"
                      value="options"
                      onClick={handleSelectView}
                    >
                      Options
                    </div>
                    <div
                      className="journal-view-selection"
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

          {!isLoading && (
            <section className="journal-table-section">
              {shares.length === 0 &&
              options.length === 0 &&
              verticalSpreads.length === 0 ? (
                <div>
                  <p>
                    <span style={{ color: "#ee6c4d" }}>
                      Add your first order...
                    </span>
                  </p>
                </div>
              ) : (
                <div>
                  <div>
                    {shares.length > 0 && (
                      <div>
                        {selectedView === "View All" ||
                        selectedView === "Shares" ? (
                          <SharesOrdersTable orders={shares} />
                        ) : null}
                      </div>
                    )}
                  </div>
                  <div>
                    {options.length > 0 && (
                      <div>
                        {selectedView === "View All" ||
                        selectedView === "Options" ? (
                          <OptionsOrdersTable orders={options} />
                        ) : null}
                      </div>
                    )}
                  </div>
                  <div>
                    {verticalSpreads.length > 0 && (
                      <div>
                        {selectedView === "View All" ||
                        selectedView === "Vertical Spreads" ? (
                          <VerticalSpreadsTable orders={verticalSpreads} />
                        ) : null}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
