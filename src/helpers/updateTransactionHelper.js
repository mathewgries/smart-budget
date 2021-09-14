const updateTransactionHelper = (oldData, newData, accountBalance) => {
  let balance = accountBalance;
  const oldAmount = oldData.transactionAmount;
  const newAmount = newData.transactionAmount;
  const oldType = oldData.transactionType;
  const newType = newData.transactionType;

  if ((oldType === newType) & (oldAmount === newAmount)) {
    return balance;
  }

  if (oldType === "W") {
    balance = balance + oldAmount;
  } else {
    balance = balance - oldAmount;
  }

  if (newType === "W") {
    return balance - newAmount;
  } else {
    return balance + newAmount;
  }
};

export default updateTransactionHelper;
