export const tickers = [
  { ticker: "AAPL", underLow: 150.1, underHigh: 180.9 },
  { ticker: "FB", underLow: 190.1, underHigh: 235.9 },
  { ticker: "TSLA", underLow: 690.1, underHigh: 1145.9 },
  { ticker: "SPY", underLow: 425.1, underHigh: 460.9 },
  { ticker: "AMD", underLow: 90.1, underHigh: 160.9 },
];

export function randomDate(start, end) {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
}

export function setOpenDate() {
  const date = new Date(randomDate(new Date(2022, 0, 1), new Date()));
  const dayOfWeek = new Date(date).getDay();
  let resultDate = new Date(date.getTime());
  if (dayOfWeek === 0) {
    resultDate.setDate(date.getDate() + 1);
  }
  if (dayOfWeek === 6) {
    resultDate.setDate(date.getDate() - 1);
  }
  return Date.parse(resultDate);
}

export function setCloseDate(openDate) {
  const dayOfWeek = new Date(openDate).getDay();
  let resultDate;
  if (dayOfWeek === 5) {
    resultDate = new Date(openDate);
  } else {
    resultDate = randomDate(new Date(openDate), new Date());
    const resultDay = resultDate.getDay();
    if (resultDay === 0) {
      resultDate.setDate(resultDate.getDate() + 1);
    }
    if (resultDay === 6) {
      resultDate.setDate(resultDate.getDate() - 1);
    }
  }
  return Date.parse(resultDate);
}

export function setExpirationDate(closeDate) {
  const date = new Date(closeDate);
  const closeDay = new Date(date).getDay();
  let resultDate = new Date(closeDate);
  if (closeDay !== 5) {
    const diff = 5 - closeDay;
    resultDate.setDate(date.getDate() + (diff + closeDay));
  }
  return Date.parse(resultDate);
}

function dollarsToCents(amount) {
  return Number.parseFloat(amount) * 100;
}

export function selectOptionsTicker(contractType, tradeSide) {
  const selectedTicker = tickers[Math.floor(Math.random() * tickers.length)];
  const openSharePrice =
    Math.random() * (selectedTicker.underHigh - selectedTicker.underLow + 1) +
    selectedTicker.underLow;
  const closeSharePrice =
    Math.random() * (selectedTicker.underHigh - selectedTicker.underLow + 1) +
    selectedTicker.underLow;
  return {
    ticker: selectedTicker.ticker,
    openSharePrice: openSharePrice.toFixed(2),
    closeSharePrice: closeSharePrice.toFixed(2),
    openCost: setOptionsOpenCost(
      contractType,
      tradeSide,
      openSharePrice,
      closeSharePrice
    ),
    closeCost: setOptionsCloseCost(
      contractType,
      tradeSide,
      openSharePrice,
      closeSharePrice
    ),
  };
}

export function setOptionsOpenCost(
  contractType,
  tradeSide,
  openSharePrice,
  closeSharePrice
) {
  const premLow = 11;
  const premHigh = 89;
  const premMid = dollarsToCents(premHigh - (premHigh - premLow) / 2);
  let result;

  if (contractType === "CALL") {
    if (tradeSide === "LONG") {
      if (openSharePrice < closeSharePrice) {
        result = Math.random() * (premMid - premLow + 1) + premLow;
      } else {
        result = Math.random() * (premHigh - premMid + 1) + premMid;
      }
    } else if (tradeSide === "SHORT") {
      if (openSharePrice > closeSharePrice) {
        result = Math.random() * (premMid - premLow + 1) + premLow;
      } else {
        result = Math.random() * (premHigh - premMid + 1) + premMid;
      }
    }
  } else if (contractType === "PUT") {
    if (tradeSide === "LONG") {
      if (openSharePrice > closeSharePrice) {
        result = Math.random() * (premMid - premLow + 1) + premLow;
      } else {
        result = Math.random() * (premHigh - premMid + 1) + premMid;
      }
    } else if (tradeSide === "SHORT") {
      if (openSharePrice < closeSharePrice) {
        result = Math.random() * (premMid - premLow + 1) + premLow;
      } else {
        result = Math.random() * (premHigh - premMid + 1) + premMid;
      }
    }
  }
  return (result / 100).toFixed(2);
}

export function setOptionsCloseCost(
  contractType,
  tradeSide,
  openSharePrice,
  closeSharePrice
) {
  const premLow = 11;
  const premHigh = 89;
  const premMid = dollarsToCents(premHigh - (premHigh - premLow) / 2);
  let result;

  if (contractType === "CALL") {
    if (tradeSide === "LONG") {
      if (openSharePrice < closeSharePrice) {
        result = Math.random() * (premHigh - premMid + 1) + premMid;
      } else {
        result = Math.random() * (premMid - premLow + 1) + premLow;
      }
    } else if (tradeSide === "SHORT") {
      if (openSharePrice > closeSharePrice) {
        result = Math.random() * (premHigh - premMid + 1) + premMid;
      } else {
        result = Math.random() * (premMid - premLow + 1) + premLow;
      }
    }
  } else if (contractType === "PUT") {
    if (tradeSide === "LONG") {
      if (openSharePrice > closeSharePrice) {
        result = Math.random() * (premHigh - premMid + 1) + premMid;
      } else {
        result = Math.random() * (premMid - premLow + 1) + premLow;
      }
    } else if (tradeSide === "SHORT") {
      if (openSharePrice < closeSharePrice) {
        result = Math.random() * (premHigh - premMid + 1) + premMid;
      } else {
        result = Math.random() * (premMid - premLow + 1) + premLow;
      }
    }
  }
  return (result / 100).toFixed(2);
}

export function selectSharesTicker() {
  const selectedTicker = tickers[Math.floor(Math.random() * tickers.length)];
  const openSharePrice =
    Math.random() * (selectedTicker.underHigh - selectedTicker.underLow + 1) +
    selectedTicker.underLow;
  const closeSharePrice =
    Math.random() * (selectedTicker.underHigh - selectedTicker.underLow + 1) +
    selectedTicker.underLow;
  return {
    ticker: selectedTicker.ticker,
    openSharePrice: openSharePrice.toFixed(2),
    closeSharePrice: closeSharePrice.toFixed(2),
  };
}

export function setSpreadLegs(underLyingOpen, contractType) {
  return {
    lowerLeg:
      contractType === "CALL"
        ? dollarsToCents(underLyingOpen).toFixed(0)
        : dollarsToCents(underLyingOpen - 5).toFixed(0),
    upperLeg:
      contractType === "CALL"
        ? dollarsToCents(underLyingOpen + 5).toFixed(0)
        : dollarsToCents(underLyingOpen).toFixed(0),
  };
}

export function optionsProfitLossHandler(
  orderSize,
  openContractPrice,
  closeContractPrice,
  tradeSide
) {
  const result = calculateProfitLoss(
    orderSize,
    openContractPrice,
    closeContractPrice,
    tradeSide
  );
  return result.toFixed(2);
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

function calculateProfitLoss(orderSize, openPrice, closePrice, tradeSide) {
  const openCost = dollarsToCents(openPrice) * orderSize;
  const closeCost = dollarsToCents(closePrice) * orderSize;

  return tradeSide === "LONG"
    ? closeCost - openCost
    : (closeCost - openCost) * -1;
}
