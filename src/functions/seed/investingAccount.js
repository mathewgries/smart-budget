import * as uuid from "uuid";
import { selectTicker, randomDate, setOpenDate, setCloseDate, setExpirationDate } from "./helpers";

export const investingAccount = (table, userId, strategies) => {
  let items = [];
  const accountId = uuid.v1();
  const accountType = "ACCT#INVESTING#";

  items.push({
    Put: {
      TableName: table,
      Item: {
        PK: `USER#${userId}`,
        SK: `${accountType}${accountId}`,
        GSI1_PK: `${accountType}${accountId}`,
        id: accountId,
        type: accountType,
        accountName: "Cash Account",
        accountBalance: "10,000",
        createDate: Date.now(),
        modifyDate: Date.now(),
      },
    },
  });

  for (let i = 0; i < 10; i++) {
    const transactionId = uuid.v1();
    const type = "TRANS#INVESTING#";
    const transAmmount = (Math.random() * 100).toFixed(2);
    const date = Date.parse(randomDate(new Date(2021, 0, 1), new Date()));
    const transType = Math.floor(Math.random() * 2) === 1 ? "D" : "W";

    items.push({
      Put: {
        TableName: table,
        Item: {
          PK: `USER#${userId}`,
          SK: `${type}${transactionId}`,
          GSI1_PK: `${accountType}${accountId}`,
          id: transactionId,
          type: type,
          transactionAmount: transAmmount,
          transactionDate: date,
          transactionType: transType,
          transactionNote: `This is note number ${i + 1}`,
          createDate: Date.now(),
          modifyDate: Date.now(),
        },
      },
    });
  }

  for (let i = 0; i < 1; i++) {
    const orderId = uuid.v1();
    const type = "ORDER#OPTIONS#";
    const contractType = Math.floor(Math.random() * 2) === 0 ? "CALL" : "PUT";
    const tradeSide = Math.floor(Math.random() * 2) === 0 ? "LONG" : "SHORT";
    const ticker = selectTicker(contractType, tradeSide);
    const openDate = setOpenDate()
    const closeDate = setCloseDate(openDate)
		const expirationDate = setExpirationDate(closeDate)
    const orderSize = Math.floor(Math.random() * 4) + 1;
    

    items.push({
      Put: {
        TableName: table,
        Item: {
          PK: `USER#${userId}`,
          SK: `${type}${orderId}`,
          GSI1_PK: `${accountType}${accountId}`,
          id: orderId,
          type: type,
          ticker: ticker.ticker,
          openDate: openDate,
          closeDate: closeDate,
          orderSize: orderSize,
          openPrice: ticker.openCost.toFixed(2),
          closePrice: ticker.closeCost.toFixed(2),
          openUnderlyingPrice: ticker.openSharePrice.toFixed(2),
          closeUnderlyingPrice: ticker.closeSharePrice.toFixed(2),
          strikePrice: ticker.openSharePrice.toFixed(0),
          contractType: contractType,
          tradeSide: tradeSide,
          contractExpirationDate: expirationDate,
          openDelta: "0.00",
          closeDelta: "0.00",
          openGamma: "0.00",
          closeGamma: "0.00",
          openVega: "0.00",
          closeVega: "0.00",
          openTheta: "0.00",
          closeTheta: "0.00",
          openImpliedVolatility: "0.00",
          closeImpliedVolatility: "0.00",
          profitLoss: order.profitLoss,
          commissions: "1.30",
          strategyId: order.strategyId,
          createDate: Date.now(),
          modifyDate: Date.now(),
        },
      },
    });
  }

  return items;
};
