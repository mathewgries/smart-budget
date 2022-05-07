import * as uuid from "uuid";
import { randomDate } from "./helpers";

export const spendingAccount = (table, userId, categories) => {
  let items = [];
  const accountId = uuid.v1();
  const accountType = "ACCT#SPENDING#";

  items.push({
    Put: {
      TableName: table,
      Item: {
        PK: `USER#${userId}`,
        SK: `${accountType}${accountId}`,
        GSI1_PK: `${accountType}${accountId}`,
        id: accountId,
        type: accountType,
        accountName: "Checking Account",
        accountBalance: "10000.00",
        createDate: Date.now(),
        modifyDate: Date.now(),
      },
    },
  });

  for (let i = 0; i < 300; i++) {
    const transactionId = uuid.v1();
    const type = "TRANS#SPENDING#";
    const transAmmount = (Math.random() * 300).toFixed(2);
    const date = Date.parse(randomDate(new Date(2021, 0, 1), new Date()));
    const category = categories[Math.floor(Math.random() * categories.length)];
    const subcategories = category.subcategories;
    const subcategory =
      subcategories[Math.floor(Math.random() * subcategories.length)];
    const transType = category.categoryName === "income" ? "D" : "W";

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
          categoryId: category.id,
          subcategoryId: subcategory.id,
          transactionNote: `This is note number ${i + 1}`,
          createDate: Date.now(),
          modifyDate: Date.now(),
        },
      },
    });
  }

  return items;
};
