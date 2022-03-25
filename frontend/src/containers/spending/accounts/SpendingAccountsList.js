import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectAllSpendingAcounts } from "../../../redux/spending/spendingAccountsSlice";
import SpendingAccountCard from "./SpendingAccountCard";

export default function SpendingAccountsList(props) {
  const accountList = useSelector(selectAllSpendingAcounts);

  return (
    <div className="account-list-container">
      {accountList.map((account) => (
        <div key={account.id} className="account-list-item-wrapper">
          <Link to={`spending/accounts/${account.id}`}>
            <SpendingAccountCard account={account} />
          </Link>
        </div>
      ))}
    </div>
  );
}
