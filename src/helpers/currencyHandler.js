function dollarToCents(amount) {
  return Number.parseFloat(amount) * 100;
}

export function addTransactionHandler(
  accountBalance,
  transactionAmount,
  transactionType
) {
  if (transactionType === "W") {
    return (
      (dollarToCents(accountBalance) - dollarToCents(transactionAmount)) /
      100
    ).toFixed(2);
  } else {
    return (
      (dollarToCents(accountBalance) + dollarToCents(transactionAmount)) /
      100
    ).toFixed(2);
  }
}

export function deleteTransactionHandler(
	accountBalance,
	transactionAmount,
	transactionType
  ) {
	if (transactionType === "W") {
	  return (
		(dollarToCents(accountBalance) + dollarToCents(transactionAmount)) /
		100
	  ).toFixed(2);
	} else {
	  return (
		(dollarToCents(accountBalance) - dollarToCents(transactionAmount)) /
		100
	  ).toFixed(2);
	}
  }

export function updateTransactionHelper(oldData, newData, accountBalance) {
  let balance = dollarToCents(accountBalance);
  const oldAmount = dollarToCents(oldData.transactionAmount);
  const newAmount = dollarToCents(newData.transactionAmount);
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
