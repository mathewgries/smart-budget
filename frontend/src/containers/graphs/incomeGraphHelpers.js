export function dollarsToCents(amount) {
  return Number.parseFloat(amount.replace(",", "")) * 100;
}

export function getAmount(num1, num2){
	const total = dollarsToCents(num1.toString()) + dollarsToCents(num2.toString())
	return total / 100
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

export function getTimeGraphXAxis(timeFrame) {
  if (timeFrame === "D") {
    return getDayTimeAxis();
  }
  if (timeFrame === "W") {
    return getWeekTimeAxis();
  }
  if (timeFrame === "M") {
    return getMonthTimeAxis();
  }
  if (timeFrame === "Q") {
    return getQuarterlyTimeAxis();
  }
  if (timeFrame === "Y") {
    return getYearlyTimeAxis();
  }
  if (timeFrame === "YTD") {
    return getYearToDateTimeAxis();
  }
}

function getDayTimeAxis() {
  const end = new Date();
  let start = new Date();
  start.setDate(end.getDate() - 19);
  const dates = [];
  for (var d = start; d <= end; d.setDate(d.getDate() + 1)) {
    dates.push(new Date(d));
  }
  return dates;
}

function getWeekTimeAxis() {
  const end = getPreviousSunday();
  let start = new Date();
  start.setDate(end.getDate() - 19 * 7);
  const dates = [];
  for (var d = start; d <= end; d.setDate(d.getDate() + 7)) {
    dates.push(new Date(d));
  }
  return dates;
}

function getPreviousSunday(date = new Date()) {
  const previousSunday = new Date();
  previousSunday.setDate(date.getDate() - date.getDay());
  return previousSunday;
}

function getMonthTimeAxis() {
  const end = new Date();
  let start = new Date();
  start.setMonth(end.getMonth() - 19);
  start = new Date(start.getFullYear(), start.getMonth(), 1);
  const dates = [];
  for (var d = start; d <= end; d.setMonth(d.getMonth() + 1)) {
    dates.push(new Date(d));
  }
  return dates;
}

function getQuarterlyTimeAxis() {
  const end = getQuarterStart();
  let start = new Date();
  start.setMonth(end.getMonth() - 19 * 3);
  start = new Date(start.getFullYear(), start.getMonth(), 1);
  const dates = [];
  for (var d = start; d <= end; d.setMonth(d.getMonth() + 3)) {
    dates.push(new Date(d));
  }
  return dates;
}

function getQuarterStart(date = new Date()) {
  const currentMonth = date.getUTCMonth();
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

function getYearlyTimeAxis() {
  const end = new Date(new Date().getFullYear(), 0, 1);
  let start = new Date();
  start.setYear(end.getFullYear() - 19);
  start = new Date(start.getFullYear(), 0, 1);
  const dates = [];
  for (var d = start; d <= end; d.setYear(d.getFullYear() + 1)) {
    dates.push(new Date(d));
  }
  return dates;
}

function getYearToDateTimeAxis(date = new Date()) {
  const start = new Date(new Date().getFullYear(), 0, 1);
  const end = new Date(date.getFullYear(), date.getMonth(), 1);
  const dates = [];
  for (var d = start; d <= end; d.setMonth(d.getMonth() + 1)) {
    dates.push(new Date(d));
  }
  return dates;
}

export function getBargraphDisplay(deposits, timeFrame) {
  const timeFrameAxis = getTimeGraphXAxis(timeFrame);
  if (timeFrame === "D") {
    return getDayDisplay(deposits, timeFrameAxis);
  }
  if (timeFrame === "W") {
    return getWeeklyDisplay(deposits, timeFrameAxis);
  }
  if (timeFrame === "M") {
    return getMonthlyDisplay(deposits, timeFrameAxis);
  }
  if (timeFrame === "Q") {
    return getQuarterlyDisplay(deposits, timeFrameAxis);
  }
  if (timeFrame === "Y") {
    return getYearlyDisplay(deposits, timeFrameAxis);
  }
  if (timeFrame === "YTD") {
    return getMonthlyDisplay(deposits, timeFrameAxis);
  }
}

function getDayDisplay(deposits, timeFrameAxis) {
  const results = timeFrameAxis.map((element, index, collection) => ({
    amount: sumReducer(
      deposits.filter((deposit) =>
        compareDayDates(element, new Date(deposit.transactionDate))
          ? deposit.transactionAmount
          : 0
      )
    ),
    date: element.getUTCMonth() + 1 + "/" + element.getUTCDate(),
    year:
      element.getUTCMonth() + 1 === 1 &&
      (!collection[index - 1] || collection[index - 1].getUTCMonth() + 1 !== 1)
        ? element.getUTCFullYear()
        : null,
  }));
  return results;
}

function compareDayDates(date1, date2) {
  date1.setHours(0, 0, 0, 0);
  date2.setHours(0, 0, 0, 0);
  return date1.getTime() === date2.getTime();
}

function getWeeklyDisplay(deposits, timeFrameAxis) {
  const results = timeFrameAxis.map((element, index, collection) => ({
    amount: sumReducer(
      deposits.filter((deposit) =>
        compareWeeklyDates(element, new Date(deposit.transactionDate))
          ? deposit.transactionAmount
          : 0
      )
    ),
    date: element.getUTCMonth() + 1 + "/" + element.getUTCDate(),
    year:
      element.getUTCMonth() + 1 === 1 &&
      (!collection[index - 1] || collection[index - 1].getUTCMonth() + 1 !== 1)
        ? element.getUTCFullYear()
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

function getMonthlyDisplay(deposits, timeFrameAxis) {
  const results = timeFrameAxis.map((element, index, collection) => ({
    amount: sumReducer(
      deposits.filter((deposit) =>
        compareMonthlyDates(element, new Date(deposit.transactionDate))
          ? deposit.transactionAmount
          : 0
      )
    ),
    date:
      element.getUTCMonth() +
      1 +
      "/" +
      element.getUTCFullYear().toString().substring(2),
    year:
      element.getUTCMonth() + 1 === 1 &&
      (!collection[index - 1] || collection[index - 1].getUTCMonth() + 1 !== 1)
        ? element.getUTCFullYear()
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

function getQuarterlyDisplay(deposits, timeFrameAxis) {
  const results = timeFrameAxis.map((element, index, collection) => ({
    amount: sumReducer(
      deposits.filter((deposit) =>
        compareQuarterlyDates(element, new Date(deposit.transactionDate))
          ? deposit.transactionAmount
          : 0
      )
    ),
    date:
      element.getUTCMonth() +
      1 +
      "/" +
      element.getUTCFullYear().toString().substring(2),
    year:
      element.getUTCMonth() + 1 === 1 &&
      (!collection[index - 1] || collection[index - 1].getUTCMonth() + 1 !== 1)
        ? element.getUTCFullYear()
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

function getYearlyDisplay(deposits, timeFrameAxis) {
  const results = timeFrameAxis.map((element) => ({
    amount: sumReducer(
      deposits.filter((deposit) =>
        compareYearlyDates(element, new Date(deposit.transactionDate))
          ? deposit.transactionAmount
          : 0
      )
    ),
    date: element.getUTCFullYear(),
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

export function getCategoryChartDisplay(transactions, timeFrame) {
  const start = getTimeGraphXAxis(timeFrame)[0];
  return transactions
    .filter(
      (transaction) =>
        dateForCompare(transaction.transactionDate) >= dateForCompare(start)
    )
    .reduce((accumulator, current) => {
      let existing = accumulator.find(
        (n) => n.categoryId === current.categoryId
      );
      if (existing) {
        existing.total = getAmount(existing.total, current.transactionAmount);
        existing.count = existing.count + 1;
        let existingSub = existing.subcategories.find(
          (n) => n.subcategoryId === current.subcategoryId
        );
        if (existingSub) {
          existing.subcategories = existing.subcategories.map((subcategory) => {
            if (subcategory.subcategoryId === current.subcategoryId) {
              return {
                ...subcategory,
                count: subcategory.count + 1,
                total: getAmount(subcategory.total, current.transactionAmount),
              };
            } else {
              return subcategory;
            }
          });
        } else {
          existing.subcategories = [
            ...existing.subcategories,
            {
              subcategoryId: current.subcategoryId,
              count: 1,
              total: Number.parseFloat(current.transactionAmount),
            },
          ];
        }
      } else {
        accumulator.push({
          categoryId: current.categoryId,
          total: Number.parseFloat(current.transactionAmount),
          count: 1,
          subcategories: [
            {
              subcategoryId: current.subcategoryId,
              count: 1,
              total: Number.parseFloat(current.transactionAmount),
            },
          ],
        });
      }
      return accumulator;
    }, []);
}

export function getOverallTotal(transactions, timeFrame){
	const start = getTimeGraphXAxis(timeFrame)[0];
  return sumReducer(transactions
    .filter(
      (transaction) =>
        dateForCompare(transaction.transactionDate) >= dateForCompare(start)
    ))
}
