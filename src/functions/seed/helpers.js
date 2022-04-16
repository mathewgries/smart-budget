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
  const dayOfWeek = openDate.getDay();
  let resultDate;
  if (dayOfWeek === 5) {
    resultDate = openDate;
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
	const closeDay = closeDate.getDay()
	let resultDate = closeDate;
	if (closeDay !== 5) {
		const diff = 5 - closeDay
		resultDate.setDate(closeDate.getDate() + diff);
	}
	return Date.parse(resultDate);
}


export function selectTicker(contractType, tradeSide) {
  const selectedTicker = tickers[Math.floor(Math.random() * tickers.length)];
  return {
    ticker: selectTicker.ticker,
    openSharePrice:
      Math.random() * (selectedTicker.underHigh - selectedTicker.underLow + 1) +
      selectedTicker.underLow,
    closeSharePrice:
      Math.random() * (selectedTicker.underHigh - selectedTicker.underLow + 1) +
      selectedTicker.underLow,
    openCost: setOpenCost(
      contractType,
      tradeSide,
      openSharePrice,
      closeSharePrice
    ),
    closeCost: setCloseCost(
      contractType,
      tradeSide,
      openSharePrice,
      closeSharePrice
    ),
  };
}

export function setOpenCost(
  contractType,
  tradeSide,
  openSharePrice,
  closeSharePrice
) {
  const premLow = 1.1;
  const premHigh = 8.9;
  const premMid = premHigh - (premHigh - premLow) / 2;

  if (contractType === "CALL") {
    if (tradeSide === "LONG") {
      if (openSharePrice < closeSharePrice) {
        return Math.random() * (premMid - premLow + 1) + premLow;
      } else {
        return Math.random() * (premHigh - premMid + 1) + premMid;
      }
    } else if (tradeSide === "SHORT") {
      if (openSharePrice > closeSharePrice) {
        return Math.random() * (premMid - premLow + 1) + premLow;
      } else {
        return Math.random() * (premHigh - premMid + 1) + premMid;
      }
    }
  } else if (contractType === "PUT") {
    if (tradeSide === "LONG") {
      if (openSharePrice > closeSharePrice) {
        return Math.random() * (premMid - premLow + 1) + premLow;
      } else {
        return Math.random() * (premHigh - premMid + 1) + premMid;
      }
    } else if (tradeSide === "SHORT") {
      if (openSharePrice < closeSharePrice) {
        return Math.random() * (premMid - premLow + 1) + premLow;
      } else {
        return Math.random() * (premHigh - premMid + 1) + premMid;
      }
    }
  }
}

export function setCloseCost(
  contractType,
  tradeSide,
  openSharePrice,
  closeSharePrice
) {
  const premLow = 1.1;
  const premHigh = 8.9;
  const premMid = premHigh - (premHigh - premLow) / 2;

  if (contractType === "CALL") {
    if (tradeSide === "LONG") {
      if (openSharePrice < closeSharePrice) {
        return Math.random() * (premHigh - premMid + 1) + premMid;
      } else {
        return Math.random() * (premMid - premLow + 1) + premLow;
      }
    } else if (tradeSide === "SHORT") {
      if (openSharePrice > closeSharePrice) {
        return Math.random() * (premHigh - premMid + 1) + premMid;
      } else {
        return Math.random() * (premMid - premLow + 1) + premLow;
      }
    }
  } else if (contractType === "PUT") {
    if (tradeSide === "LONG") {
      if (openSharePrice > closeSharePrice) {
        return Math.random() * (premHigh - premMid + 1) + premMid;
      } else {
        return Math.random() * (premMid - premLow + 1) + premLow;
      }
    } else if (tradeSide === "SHORT") {
      if (openSharePrice < closeSharePrice) {
        return Math.random() * (premHigh - premMid + 1) + premMid;
      } else {
        return Math.random() * (premMid - premLow + 1) + premLow;
      }
    }
  }
}
