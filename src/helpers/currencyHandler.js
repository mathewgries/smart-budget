function dollarsToCents(amount) {
  return Number.parseFloat(amount) * 100;
}

export function addTransactionHandler(
  accountBalance,
  transactionAmount,
  transactionType
) {
  if (transactionType === "W") {
    return (
      (dollarsToCents(accountBalance) - dollarsToCents(transactionAmount)) /
      100
    ).toFixed(2);
  } else {
    return (
      (dollarsToCents(accountBalance) + dollarsToCents(transactionAmount)) /
      100
    ).toFixed(2);
  }
}

export function updateTransactionHelper(oldData, newData, accountBalance) {
  let balance = dollarsToCents(accountBalance);
  const oldAmount = dollarsToCents(oldData.transactionAmount);
  const newAmount = dollarsToCents(newData.transactionAmount);
  const oldType = oldData.transactionType.toUpperCase();
  const newType = newData.transactionType.toUpperCase();

  if ((oldType === newType) & (oldAmount === newAmount)) {
    return accountBalance;
  }

  if (oldType === "W") {
    balance = balance + oldAmount;
  } else {
    balance = balance - oldAmount;
  }

  if (newType === "W") {
    return ((balance - newAmount) / 100).toFixed(2);
  } else {
    return ((balance + newAmount) / 100).toFixed(2);
  }
}

export function deleteTransactionHandler(
  accountBalance,
  transactionAmount,
  transactionType
) {
  if (transactionType === "W") {
    return (
      (dollarsToCents(accountBalance) + dollarsToCents(transactionAmount)) /
      100
    ).toFixed(2);
  } else {
    return (
      (dollarsToCents(accountBalance) - dollarsToCents(transactionAmount)) /
      100
    ).toFixed(2);
  }
}

