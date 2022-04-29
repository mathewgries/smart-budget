import * as uuid from "uuid";
import {
  selectOptionsTicker,
  selectSharesTicker,
  randomDate,
  setOpenDate,
  setCloseDate,
  setExpirationDate,
  setSpreadLegs,
  optionsProfitLossHandler,
  sharesProfitLossHandler,
} from "./helpers";

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
        accountBalance: "10000.00",
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

  for (let i = 0; i < 5; i++) {
    const orderId = uuid.v1();
    const type = "ORDER#OPTIONS#";
    const contractType = Math.floor(Math.random() * 2) === 0 ? "CALL" : "PUT";
    const tradeSide = Math.floor(Math.random() * 2) === 0 ? "LONG" : "SHORT";
    const ticker = selectOptionsTicker(contractType, tradeSide);
    const openDate = setOpenDate();
    const closeDate = setCloseDate(openDate);
    const expirationDate = setExpirationDate(closeDate);
    const orderSize = Math.floor(Math.random() * 1) + 1;
    const profitLoss = optionsProfitLossHandler(
      orderSize,
      ticker.openCost,
      ticker.closeCost,
      tradeSide
    );
    const strategy = strategies[Math.floor(Math.random() * strategies.length)];

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
          openPrice: ticker.openCost,
          closePrice: ticker.closeCost,
          openUnderlyingPrice: ticker.openSharePrice,
          closeUnderlyingPrice: ticker.closeSharePrice,
          strikePrice: ticker.openSharePrice,
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
          profitLoss: profitLoss,
          commissions: "1.30",
          strategyId: strategy.id,
          createDate: Date.now(),
          modifyDate: Date.now(),
        },
      },
    });
  }

  for (let i = 0; i < 5; i++) {
    const orderId = uuid.v1();
    const type = "ORDER#SHARES#";
    const tradeSide = Math.floor(Math.random() * 2) === 0 ? "LONG" : "SHORT";
    const ticker = selectSharesTicker();
    const openDate = setOpenDate();
    const closeDate = setCloseDate(openDate);
    const orderSize = Math.floor(Math.random() * 10) + 1;
    const profitLoss = sharesProfitLossHandler(
      orderSize,
      ticker.openSharePrice,
      ticker.closeSharePrice,
      tradeSide
    );
    const strategy = strategies[Math.floor(Math.random() * strategies.length)];

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
          openPrice: ticker.openSharePrice,
          closePrice: ticker.closeSharePrice,
          tradeSide: tradeSide,
          profitLoss: profitLoss,
          commissions: "1.30",
          strategyId: strategy.id,
          createDate: Date.now(),
          modifyDate: Date.now(),
        },
      },
    });
  }

  for (let i = 0; i < 5; i++) {
    const orderId = uuid.v1();
    const type = "ORDER#VERTSPREADS#";
    const contractType = Math.floor(Math.random() * 2) === 0 ? "CALL" : "PUT";
    const tradeSide = Math.floor(Math.random() * 2) === 0 ? "LONG" : "SHORT";
    const ticker = selectOptionsTicker(contractType, tradeSide);
    const openDate = setOpenDate();
    const closeDate = setCloseDate(openDate);
    const expirationDate = setExpirationDate(closeDate);
    const orderSize = Math.floor(Math.random() * 1) + 1;
    const spreadLegs = setSpreadLegs(ticker.openSharePrice, contractType);
    const profitLoss = optionsProfitLossHandler(
      orderSize,
      ticker.openCost,
      ticker.closeCost,
      tradeSide
    );
    const strategy = strategies[Math.floor(Math.random() * strategies.length)];

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
          openPrice: ticker.openCost,
          closePrice: ticker.closeCost,
          openUnderlyingPrice: ticker.openSharePrice,
          closeUnderlyingPrice: ticker.closeSharePrice,
          strikeUpperLegPrice: spreadLegs.upperLeg,
          strikeLowerLegPrice: spreadLegs.lowerLeg,
          contractType: contractType,
          tradeSide: tradeSide,
          spreadExpirationDate: expirationDate,
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
          profitLoss: profitLoss,
          commissions: "1.30",
          strategyId: strategy.id,
          createDate: Date.now(),
          modifyDate: Date.now(),
        },
      },
    });
  }

  return items;
};
