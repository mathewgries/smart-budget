import * as uuid from "uuid";
import handler from "../../util/handler";
import dynamoDb from "../../util/dynamodb";
import { categories } from "../spending/categories/defaultCategories";
import { defaultSignals } from "../investing/signals/defaultSignals";
import { defaultStrategies } from "../investing/strategies/defaultStrategies";

export const main = handler(async (event) => {
  const data = JSON.parse(event.body);
  const userId = event.requestContext.authorizer.iam.cognitoIdentity.identityId;

  let items = [];
  let itemsLength = 0;
  let loopCount = 0;

  items.push({
    Put: {
      TableName: process.env.TABLE_NAME,
      Item: {
        PK: `USER#${userId}`,
        SK: `USER#INFO`,
        username: data.email || null,
        email: data.email || null,
        dateOfBirth: data.dateOfBirth || null,
        type: "USER#INFO",
        createDate: Date.now(),
        modifyDate: Date.now(),
      },
    },
  });

  items.push({
    Put: {
      TableName: process.env.TABLE_NAME,
      Item: {
        PK: `USER#${userId}`,
        SK: `SIGNALS#`,
        type: "SIGNALS#",
        signalList: defaultSignals,
        createDate: Date.now(),
        modifyDate: Date.now(),
      },
    },
  });

  for (const prop in categories) {
    const categoryId = uuid.v1();
    items.push({
      Put: {
        TableName: process.env.TABLE_NAME,
        Item: {
          PK: `USER#${userId}`,
          SK: `CATEGORY#${categoryId}`,
          id: categoryId,
          type: "CATEGORY#",
          categoryName: prop,
          subcategories: categories[prop],
          createDate: Date.now(),
          modifyDate: Date.now(),
        },
      },
    });
  }

  for (const prop in defaultStrategies) {
    const strategyId = uuid.v1();
    items.push({
      Put: {
        TableName: process.env.TABLE_NAME,
        Item: {
          PK: `USER#${userId}`,
          SK: `STRATEGY#${strategyId}`,
          id: strategyId,
          type: "STRATEGY#",
          strategyName: prop,
          signals: defaultStrategies[prop],
          createDate: Date.now(),
          modifyDate: Date.now(),
        },
      },
    });
  }

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

  return items;
});
