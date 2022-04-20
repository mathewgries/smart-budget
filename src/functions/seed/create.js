import handler from "../../util/handler";
import dynamoDb from "../../util/dynamodb";
import { buildUserDefaults } from "./user";
import { spendingAccount } from "./spendingAccount";
import { investingAccount } from "./investingAccount";

export const main = handler(async (event) => {
  const data = JSON.parse(event.body);
  const table = process.env.TABLE_NAME;
  const { user } = data;

  let items = [];
  let itemsLength = 0;
  let loopCount = 0;

  const userData = buildUserDefaults(table, user);
  const categories = userData
    .filter((data) => data.Put.Item.type === "CATEGORY#")
    .map((category) => category.Put.Item);
  const strategies = userData
    .filter((data) => data.Put.Item.type === "STRATEGY#")
    .map((strategy) => strategy.Put.Item);
  const spendingAccountData = spendingAccount(table, user.id, categories);
  const investingAccountData = investingAccount(table, user.id, strategies);

  items = items.concat(userData);
  items = items.concat(spendingAccountData);
  items = items.concat(investingAccountData);

  itemsLength = items.length;
  loopCount = Math.ceil(itemsLength / 25);
  for (let i = 0; i < loopCount; i++) {
    let params;
    const startIndex = i * 25;
    const endIndex = startIndex + 25;

    if (i === loopCount - 1) {
      params = { TransactItems: items.slice(startIndex) };
    } else {
      params = { TransactItems: items.slice(startIndex, endIndex) };
    }
    await dynamoDb.transactWrite(params);
  }
  return { status: true };
});
