export function inputDateFormat(date) {
  let result = "";
  if (
    date instanceof Date ||
    Date.parse(date) ||
    new Date(date).toLocaleDateString()
  ) {
    if (!date instanceof Date && !Date.parse(date)) {
			date = new Date(date).toLocaleDateString()
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
  return result;
}

export function currencyFieldFormat(){
	
}