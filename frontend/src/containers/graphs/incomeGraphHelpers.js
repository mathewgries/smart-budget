export function dollarsToCents(amount) {
  return Number.parseFloat(amount.replace(",", "")) * 100;
}

export function getAmount(num1, num2) {
  const total =
    dollarsToCents(num1.toString()) + dollarsToCents(num2.toString());
  return total / 100;
}

export function sumReducer(transactions) {
  const amountsArray = transactions.map((transaction) =>
    dollarsToCents(transaction.transactionAmount)
  );

  let initialValue = 0;
  const total = amountsArray.reduce(
    (previousValue, currentValue) => previousValue + currentValue,
    initialValue
  );
  return total / 100;
}

export function getMinDate(transactionDates) {
  return Math.min(...transactionDates);
}

export function getMinValue(amounts) {
  return Math.min(...amounts);
}

export function getMaxValue(amounts) {
  return Math.max(...amounts);
}

export function dateForCompare(date) {
  const newDate = new Date(date);
  newDate.setHours(0, 0, 0, 0);
  return newDate.getTime();
}

export function setFixedTimeFrame(timeFrame, minDate) {
  minDate = new Date(minDate);
  let endDate = new Date();
  let startDate = new Date();
  switch (timeFrame) {
    case "D":
      startDate.setDate(startDate.getDate() - 6);
      break;
    case "W":
      startDate.setDate(endDate.getDate() - 7 * 7);
      if (startDate.getTime() < minDate.getTime()) {
        startDate.setDate(
          minDate.getDate() + ((0 - 1 - minDate.getDay() + 7) % 7) + 1
        );
      } else {
        startDate.setDate(
          startDate.getDate() + ((0 - 1 - startDate.getDay() + 7) % 7) + 1
        );
      }
      break;
    case "M":
      startDate.setMonth(endDate.getMonth() - 7);
      if (startDate.getTime() < minDate.getTime()) {
        startDate = new Date(minDate.getFullYear(), minDate.getMonth() + 1, 1);
      } else {
        startDate = new Date(
          startDate.getFullYear(),
          startDate.getMonth() + 1,
          1
        );
      }
      break;
    case "Q":
      const currentQuarter = getQuarterStart();
      startDate.setMonth(currentQuarter.getMonth() - 3 * 6);
			if (startDate.getTime() < minDate.getTime()) {
        startDate = new Date(minDate.getFullYear(), minDate.getMonth(), 1);
      } else {
        startDate = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
      }
      startDate = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
      break;
    case "Y":
      startDate.setMonth(endDate.getMonth() - 7 * 12);
      if (startDate.getTime() < minDate.getTime()) {
        startDate = new Date(minDate.getFullYear(), 0, 1);
      } else {
        startDate = new Date(startDate.getFullYear(), 0, 1);
      }
      break;
    case "YTD":
      startDate = new Date(new Date().getFullYear(), 0, 1);
      break;
    default:
      startDate.setDate(endDate.getDate() - 7);
      break;
  }

  return {
    label: timeFrame,
    startDate: new Date(startDate).setHours(0, 0, 0, 0),
    endDate: new Date(endDate).setHours(23, 59, 59),
  };
}

export function getTransactionsForTimeFrame(transactions, startDate, endDate) {
  return transactions.filter(
    (transaction) =>
      dateForCompare(transaction.transactionDate) >=
        dateForCompare(startDate) &&
      dateForCompare(transaction.transactionDate) <= dateForCompare(endDate)
  );
}

export function getTimeGraphXAxis(timeFrame) {
  if (timeFrame.label === "D") {
    return getDayTimeAxis(timeFrame);
  }
  if (timeFrame.label === "W") {
    return getWeekTimeAxis(timeFrame);
  }
  if (timeFrame.label === "M") {
    return getMonthTimeAxis(timeFrame);
  }
  if (timeFrame.label === "Q") {
    return getQuarterlyTimeAxis(timeFrame);
  }
  if (timeFrame.label === "Y") {
    return getYearlyTimeAxis(timeFrame);
  }
  if (timeFrame.label === "YTD") {
    return getYearToDateTimeAxis(timeFrame);
  }
}

function getDayTimeAxis(timeFrame) {
  const end = new Date(timeFrame.endDate);
  let start = new Date(timeFrame.startDate);
  const dates = [];
  for (var d = start; d <= end; d.setDate(d.getDate() + 1)) {
    dates.push(new Date(d));
  }
  return dates;
}

function getWeekTimeAxis(timeFrame) {
  const end = getPreviousSunday(timeFrame.endDate);
  let start = new Date(timeFrame.startDate);
  const dates = [];
  for (var d = start; d <= end; d.setDate(d.getDate() + 7)) {
    dates.push(new Date(d));
  }
  return dates;
}

function getPreviousSunday(date = new Date()) {
  const previousSunday = new Date();
  const newDate = new Date(date);
  previousSunday.setDate(newDate.getDate() - newDate.getDay());
  return previousSunday;
}

function getMonthTimeAxis(timeFrame) {
  const end = new Date(timeFrame.endDate);
  let start = new Date(timeFrame.startDate);
  const dates = [];
  for (var d = start; d <= end; d.setMonth(d.getMonth() + 1)) {
    dates.push(new Date(d));
  }
  return dates;
}

function getQuarterlyTimeAxis(timeFrame) {
  const end = getQuarterStart(timeFrame.endDate);
  let start = new Date(timeFrame.startDate);
  const dates = [];
  for (var d = start; d <= end; d.setMonth(d.getMonth() + 3)) {
    dates.push(new Date(d));
  }
  return dates;
}

function getQuarterStart(date = new Date()) {
  const newDate = new Date(date);
  const currentMonth = newDate.getMonth();
  const currentQuarter = new Date();
  if (currentMonth >= 9) {
    currentQuarter.setMonth(currentMonth - (currentMonth - 9));
  } else if (currentMonth >= 6) {
    currentQuarter.setMonth(currentMonth - (currentMonth - 6));
  } else if (currentMonth >= 3) {
    currentQuarter.setMonth(currentMonth - (currentMonth - 3));
  } else if (currentMonth >= 0) {
    currentQuarter.setMonth(currentMonth - (currentMonth - 0));
  }

  return new Date(currentQuarter.getFullYear(), currentQuarter.getMonth(), 1);
}

function getYearlyTimeAxis(timeFrame) {
  const end = new Date(new Date(timeFrame.endDate).getFullYear(), 0, 1);
  let start = new Date(timeFrame.startDate);
  const dates = [];
  for (var d = start; d <= end; d.setYear(d.getFullYear() + 1)) {
    dates.push(new Date(d));
  }
  return dates;
}

function getYearToDateTimeAxis(timeFrame, date = new Date()) {
  const newDate = new Date(date);
  const start = new Date(new Date().getFullYear(), 0, 1);
  const end = new Date(newDate.getFullYear(), newDate.getMonth(), 1);
  const dates = [];
  for (var d = start; d <= end; d.setMonth(d.getMonth() + 1)) {
    dates.push(new Date(d));
  }
  return dates;
}

export function getBargraphDisplay(transactions, timeFrame) {
  const timeFrameAxis = getTimeGraphXAxis(timeFrame);
  if (timeFrame.label === "D") {
    return getDayDisplay(transactions, timeFrameAxis);
  }
  if (timeFrame.label === "W") {
    return getWeeklyDisplay(transactions, timeFrameAxis);
  }
  if (timeFrame.label === "M") {
    return getMonthlyDisplay(transactions, timeFrameAxis);
  }
  if (timeFrame.label === "Q") {
    return getQuarterlyDisplay(transactions, timeFrameAxis);
  }
  if (timeFrame.label === "Y") {
    return getYearlyDisplay(transactions, timeFrameAxis);
  }
  if (timeFrame.label === "YTD") {
    return getMonthlyDisplay(transactions, timeFrameAxis);
  }
}

function getDayDisplay(transactions, timeFrameAxis) {
  const results = timeFrameAxis.map((element, index, collection) => ({
    amount: sumReducer(
      transactions.filter((transaction) =>
        compareDayDates(element, new Date(transaction.transactionDate))
          ? transaction.transactionAmount
          : 0
      )
    ),
    date: element.getMonth() + 1 + "/" + element.getDate(),
    year:
      element.getMonth() + 1 === 1 &&
      (!collection[index - 1] || collection[index - 1].getMonth() + 1 !== 1)
        ? element.getFullYear()
        : null,
  }));
  return results;
}

function compareDayDates(date1, date2) {
  date1.setHours(0, 0, 0, 0);
  date2.setHours(0, 0, 0, 0);
  return date1.getTime() === date2.getTime();
}

function getWeeklyDisplay(transactions, timeFrameAxis) {
  const results = timeFrameAxis.map((element, index, collection) => ({
    amount: sumReducer(
      transactions.filter((transaction) =>
        compareWeeklyDates(element, new Date(transaction.transactionDate))
          ? transaction.transactionAmount
          : 0
      )
    ),
    date: element.getMonth() + 1 + "/" + element.getDate(),
    year:
      element.getMonth() + 1 === 1 &&
      (!collection[index - 1] || collection[index - 1].getMonth() + 1 !== 1)
        ? element.getFullYear()
        : null,
  }));
  return results;
}

function compareWeeklyDates(date1, date2) {
  const nextSaturday = new Date(date1);
  nextSaturday.setDate(nextSaturday.getDate() + 6);

  date1.setHours(0, 0, 0, 0);
  date2.setHours(0, 0, 0, 0);
  nextSaturday.setHours(0, 0, 0, 0);

  return (
    date2.getTime() >= date1.getTime() &&
    date2.getTime() <= nextSaturday.getTime()
  );
}

function getMonthlyDisplay(transactions, timeFrameAxis) {
  const results = timeFrameAxis.map((element, index, collection) => ({
    amount: sumReducer(
      transactions.filter((transaction) =>
        compareMonthlyDates(element, new Date(transaction.transactionDate))
          ? transaction.transactionAmount
          : 0
      )
    ),
    date:
      element.getMonth() +
      1 +
      "/" +
      element.getFullYear().toString().substring(2),
    year:
      element.getMonth() + 1 === 1 &&
      (!collection[index - 1] || collection[index - 1].getMonth() + 1 !== 1)
        ? element.getFullYear()
        : null,
  }));
  return results;
}

function compareMonthlyDates(date1, date2) {
  const nextMonth = new Date(date1);
  nextMonth.setMonth(nextMonth.getMonth() + 1);

  date1.setHours(0, 0, 0, 0);
  date2.setHours(0, 0, 0, 0);
  nextMonth.setHours(0, 0, 0, 0);

  return (
    date2.getTime() >= date1.getTime() && date2.getTime() < nextMonth.getTime()
  );
}

function getQuarterlyDisplay(transactions, timeFrameAxis) {
  const results = timeFrameAxis.map((element, index, collection) => ({
    amount: sumReducer(
      transactions.filter((transaction) =>
        compareQuarterlyDates(element, new Date(transaction.transactionDate))
          ? transaction.transactionAmount
          : 0
      )
    ),
    date:
      element.getMonth() +
      1 +
      "/" +
      element.getFullYear().toString().substring(2),
    year:
      element.getMonth() + 1 === 1 &&
      (!collection[index - 1] || collection[index - 1].getMonth() + 1 !== 1)
        ? element.getFullYear()
        : null,
  }));
  return results;
}

function compareQuarterlyDates(date1, date2) {
  const nextQuarter = new Date(date1);
  nextQuarter.setMonth(nextQuarter.getMonth() + 3);

  date1.setHours(0, 0, 0, 0);
  date2.setHours(0, 0, 0, 0);
  nextQuarter.setHours(0, 0, 0, 0);

  return (
    date2.getTime() >= date1.getTime() &&
    date2.getTime() < nextQuarter.getTime()
  );
}

function getYearlyDisplay(transactions, timeFrameAxis) {
  const results = timeFrameAxis.map((element) => ({
    amount: sumReducer(
      transactions.filter((transaction) =>
        compareYearlyDates(element, new Date(transaction.transactionDate))
          ? transaction.transactionAmount
          : 0
      )
    ),
    date: element.getFullYear(),
    year: null,
  }));
  return results;
}

function compareYearlyDates(date1, date2) {
  const nextYear = new Date(date1);
  nextYear.setMonth(nextYear.getMonth() + 12);

  date1.setHours(0, 0, 0, 0);
  date2.setHours(0, 0, 0, 0);
  nextYear.setHours(0, 0, 0, 0);

  return (
    date2.getTime() >= date1.getTime() && date2.getTime() < nextYear.getTime()
  );
}

export function getOverallTotal(transactions, timeFrame) {
  const start = getTimeGraphXAxis(timeFrame)[0];
  return sumReducer(
    transactions.filter(
      (transaction) =>
        dateForCompare(transaction.transactionDate) >= dateForCompare(start)
    )
  );
}

export function reduceCategories(transactions) {
  return transactions.reduce((a, b) => {
    const exists = a.find((n) => n.categoryId === b.categoryId);
    if (exists) {
      exists.count += 1;
      exists.total += Number.parseFloat(b.transactionAmount);
    } else {
      a.push({
        categoryId: b.categoryId,
        count: 1,
        total: Number.parseFloat(b.transactionAmount),
        subcategories: transactions
          .filter((n) => n.categoryId === b.categoryId)
          .map((x) => ({
            subcategoryId: x.subcategoryId,
            transactionAmount: Number.parseFloat(x.transactionAmount),
          })),
      });
    }
    return a;
  }, []);
}

export function reduceSubcategories(category, subcategories) {
  return category.subcategories.reduce((a, b) => {
    const exists = a.find((n) => n.subcategoryId === b.subcategoryId);
    if (exists) {
      exists.count += 1;
      exists.total += Number.parseFloat(b.transactionAmount);
    } else {
      a.push({
        subcategoryId: b.subcategoryId,
        count: 1,
        total: Number.parseFloat(b.transactionAmount),
				name: subcategories.find((n) => n.id === b.subcategoryId).name
      });
    }
    return a;
  }, []);
}