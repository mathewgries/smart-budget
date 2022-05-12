import React, { useState } from "react";
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
  const fields = {
    transactionAmount:  "1190.00",
    transactionType: "Withdrawal",
  };
  let date = new Date("03/01/2019");
  const endDate = new Date();

  //BI MONTHLY
  // const handleSubmit = async (e) => {
  //   let accountBalance = account.accountBalance;
  //   while (date.getTime() <= endDate.getTime()) {
  // 		console.log(date)
  // 		const currentDay = date.getDay()

  // 		if(currentDay === 6){
  // 			date.setDate(date.getDate() - 1)
  // 		}else if(currentDay === 0){
  // 			date.setDate(date.getDate() - 2)
  // 		}

  //     try {
  //       setIsLoading(true);
  //       accountBalance = getNewAccountBalance(accountBalance);
  //       await handleSaveNewTransaction(accountBalance);
  //     } catch (e) {
  //       onError(e);
  //     }

  //     date = new Date(date.getFullYear(), date.getMonth() + 2, 0);
  //   }
  //   setIsLoading(false);
  // };

  // DAILY
  const handleSubmit = async (e) => {
    let accountBalance = account.accountBalance;
    while (date.getTime() <= endDate.getTime()) {
      console.log(date);

      try {
        setIsLoading(true);
        accountBalance = getNewAccountBalance(accountBalance);
        await handleSaveNewTransaction(accountBalance);
      } catch (e) {
        onError(e);
      }

      date.setMonth(date.getMonth() + 1);
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
    await dispatch(
      saveNewSpendingTransaction({
        transaction: {
          transactionAmount: fields.transactionAmount,
          transactionDate: Date.parse(date),
          transactionType: "W",
          categoryId: "72bacceb-c9ae-11ec-96d5-1f22d1c68a62",
          subcategoryId: "72baccef-c9ae-11ec-96d5-1f22d1c68a62",
          transactionNote: "Baltimore Ave, Philly",
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
