export function dollarsToCents(amount) {
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
  const oldType = oldData.transactionType.charAt(0).toUpperCase();
  const newType = newData.transactionType.charAt(0).toUpperCase();

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

function calculateProfitLoss(orderSize, openPrice, closePrice, tradeSide) {
  const openCost = dollarsToCents(openPrice) * orderSize;
  const closeCost = dollarsToCents(closePrice) * orderSize;

  return tradeSide === "LONG"
    ? closeCost - openCost
    : (closeCost - openCost) * -1;
}

export function sharesProfitLossHandler(
  orderSize,
  openSharePrice,
  closeSharePrice,
  tradeSide
) {
  return (
    calculateProfitLoss(orderSize, openSharePrice, closeSharePrice, tradeSide) /
    100
  ).toFixed(2);
}

export function optionsProfitLossHandler(
  orderSize,
  openContractPrice,
  closeContractPrice,
  tradeSide
) {
  return calculateProfitLoss(
    orderSize,
    openContractPrice,
    closeContractPrice,
    tradeSide
  ).toFixed(2);
}

export function addOrderHandler(profitLoss, accountBalance) {
  return (
    (dollarsToCents(accountBalance) + dollarsToCents(profitLoss)) /
    100
  ).toFixed(2);
}

export function optionPLPercent(openPrice, closePrice, tradeSide,){
	const openConv = dollarsToCents(openPrice)
	const cloesConv = dollarsToCents(closePrice)

	const num = ((cloesConv - openConv)/openConv)*100
	return (tradeSide === "LONG" ? num : num * -1).toFixed(2)
}
