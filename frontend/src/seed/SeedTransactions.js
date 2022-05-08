import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { saveNewSpendingTransaction } from "../redux/spending/spendingTransactionsSlice";
import { selectSpendingAccountById } from "../redux/spending/spendingAccountsSlice";
import { addTransactionHandler } from "../helpers/currencyHandler";
import { onError } from "../lib/errorLib";
import LoadingSpinner from "../components/LoadingSpinner";

export default function SeedTransactions(props) {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const account = useSelector((state) => selectSpendingAccountById(state, id));
  const [fields, setFields] = useState({
    transactionAmount: "134.95",
    transactionType: "Withdrawal",
  });
  const date = new Date("03/01/2019");
  const endDate = new Date();

  const handleSubmit = async (e) => {
		let accountBalance = account.accountBalance
    while (date.getTime() < endDate.getTime()) {
      try {
        setIsLoading(true);
        accountBalance = getNewAccountBalance(accountBalance);
        await handleSaveNewTransaction(accountBalance);
      } catch (e) {
        onError(e);
      }
			date.setUTCMonth(date.getUTCMonth() + 1);
    }
    setIsLoading(false);
  };

  const getNewAccountBalance = (accountBalance) => {
    const result = addTransactionHandler(
      accountBalance,
      fields.transactionAmount,
      fields.transactionType.charAt(0)
    );
    return result;
  };

  const handleSaveNewTransaction = async (newAccountBalance) => {
    // console.log({
    //   transaction: {
    //     transactionAmount: fields.transactionAmount,
    //     transactionDate: Date.parse(date),
    //     transactionType: "W",
    //     categoryId: "72bacce3-c9ae-11ec-96d5-1f22d1c68a62",
    //     subcategoryId: "72bacce6-c9ae-11ec-96d5-1f22d1c68a62",
    //     transactionNote: "Gold Standard",
    //   },
    //   account: {
    //     id: account.id,
    //     accountBalance: newAccountBalance,
    //   },
    // });
    await dispatch(
      saveNewSpendingTransaction({
        transaction: {
          transactionAmount: fields.transactionAmount,
          transactionDate: Date.parse(date),
          transactionType: "W",
          categoryId: "72bacceb-c9ae-11ec-96d5-1f22d1c68a62",
          subcategoryId: "72baccf2-c9ae-11ec-96d5-1f22d1c68a62",
          transactionNote: "State Farm",
        },
        account: {
          id: account.id,
          accountBalance: newAccountBalance,
        },
      })
    ).unwrap();
  };

  return (
    <div className="page-container">
      <div className="page-wrapper">
        <div>
          <button className="btn btn-add-new" onClick={handleSubmit}>
            {isLoading ? <LoadingSpinner /> : "Run Seed"}
          </button>
        </div>
      </div>
    </div>
  );
}

// GSI1_PK: "ACCT#SPENDING#9aa5db80-ce4c-11ec-9639-51cefeb499dc"
// PK: "USER#us-east-1:599e1944-109f-499e-a207-95c6eefcf056"
// SK: "TRANS#SPENDING#85056580-ce7d-11ec-8169-b50ef9c4e9b8"
// categoryId: "72bacceb-c9ae-11ec-96d5-1f22d1c68a62"
// createDate: 1651979903960
// id: "85056580-ce7d-11ec-8169-b50ef9c4e9b8"
// modifyDate: 1651979903960
// subcategoryId: "72baccf2-c9ae-11ec-96d5-1f22d1c68a62"
// transactionAmount: "134.95"
// transactionDate: 1651363200000
// transactionNote: "State Farm"
// transactionType: "W"
// type: "TRANS#SPENDING#"
