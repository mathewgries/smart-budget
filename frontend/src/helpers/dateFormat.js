export function inputDateFormat(date) {
  let result = "";
  if (
    date instanceof Date ||
    Date.parse(date) ||
    new Date(date).toLocaleDateString()
  ) {
    if (!date instanceof Date && !Date.parse(date)) {
      date = new Date(date).toLocaleDateString();
    }
    const convDate = new Date(date);
    const year = convDate.getFullYear();
    let month = convDate.getMonth() + 1;
    let day = convDate.getDate();

    if ((day + "").length === 1) {
      day = "0" + day;
    }
    if ((month + "").length === 1) {
      month = "0" + month;
    }
    result = year + "-" + month + "-" + day; // "2021-11-24
  } else {
    result = "Invalid Format";
  }

	console.log(result)
  return result;
}

export function dateToString(date) {
  //{M}M/{D}D/YYYY
  const convDate = new Date(date);
  const year = convDate.getUTCFullYear().toString();
  let month = (convDate.getUTCMonth() + 1).toString();
  let day = convDate.getUTCDate().toString();

  if (day.length === 1) {
    day = "0" + day;
  }
  if (month.length === 1) {
    month = "0" + month;
  }

  return `${month}/${day}/${year}`;
}
