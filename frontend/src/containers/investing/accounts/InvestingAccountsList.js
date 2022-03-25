import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectAllInvestingAccounts } from "../../../redux/investing/investingAccountsSlice";
import InvestingAccountCard from "./InvestingAccountCard";

export default function InvestingAccountsList(props) {
	const accountList = useSelector(selectAllInvestingAccounts);

  return (
    <div className="account-list-container">
      {accountList.map((account) => (
        <div key={account.id} className="account-list-item-wrapper">
          <Link to={`investing/accounts/${account.id}`}>
            <InvestingAccountCard account={account} />
          </Link>
        </div>
      ))}
    </div>
  );
}
