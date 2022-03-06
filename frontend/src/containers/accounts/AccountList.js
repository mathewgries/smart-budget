import React from "react";
import { Link } from "react-router-dom";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useSelector } from "react-redux";
import { selectAllAcounts } from "../../redux/accountsSlice";

export default function AccountList(props) {
  const accounts = useSelector(selectAllAcounts);
  const accountStatus = useSelector((state) => state.accounts.status);

  return (
    <div>
      {accountStatus === "loading" ? (
        <LoadingSpinner />
      ) : (
        <div>
          {accounts.map((account, index, arr) => (
            <div key={account.id}>
              <Link to={`/accounts/${account.id}`}>
                <div>{account.accountName}</div>
                <div className="text-muted">
                  {new Date(account.createDate).toLocaleString()}
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
