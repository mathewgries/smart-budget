import React from "react";
import { useSelector } from "react-redux";
import { dateToString } from "../../../helpers/dateFormat";
import { selectCategoryById } from "../../../redux/spending/categoriesSlice";
import "./spendingTransactions.css"

export default function SpendingTransactionCard(props) {
  const { transaction } = props;
  const category = useSelector((state) =>
    selectCategoryById(state, transaction.categoryId)
  );
  const subcategory = category.subcategories.find(
    (subcategory) => subcategory.id === transaction.subcategoryId
  );

  const displayAmount =
    transaction.transactionType === "W"
      ? (Number.parseFloat(transaction.transactionAmount) * -1).toFixed(2)
      : transaction.transactionAmount;

  return (
    <div className="spending-transaction-card-container">
      <section>
        <div>{displayAmount}</div>
        {transaction.categoryId ? (
          <div>{`${category.categoryName}${
            subcategory ? ": " + subcategory.name : ""
          }`}</div>
        ) : (
          "No category"
        )}
      </section>
      <section>
        <div>
          <div className="transaction-card-date-wrapper">
            {dateToString(transaction.transactionDate)}
          </div>
        </div>
      </section>
    </div>
  );
}
