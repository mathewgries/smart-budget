import * as uuid from "uuid";
import handler from "../../util/handler";
import dynamoDb from "../../util/dynamodb";
import { defaultCategories } from "../spending/categories/defaultCategories";
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

  const signals = defaultSignals.map((signal) => ({
    id: uuid.v1(),
    name: signal,
  }));
  items.push({
    Put: {
      TableName: process.env.TABLE_NAME,
      Item: {
        PK: `USER#${userId}`,
        SK: `SIGNALS#`,
        type: "SIGNALS#",
        signals: signals,
        createDate: Date.now(),
        modifyDate: Date.now(),
      },
    },
  });

  for (const prop in defaultCategories) {
    const categoryId = uuid.v1();
		const subcategories = defaultCategories[prop].map((subcategory) => ({
			id: uuid.v1(),
			name: subcategory
		}))
    items.push({
      Put: {
        TableName: process.env.TABLE_NAME,
        Item: {
          PK: `USER#${userId}`,
          SK: `CATEGORY#${categoryId}`,
          id: categoryId,
          type: "CATEGORY#",
          categoryName: prop,
          subcategories: subcategories,
          createDate: Date.now(),
          modifyDate: Date.now(),
        },
      },
    });
  }

  for (const prop in defaultStrategies) {
    const strategyId = uuid.v1();
    const signalIds = signals
      .filter((signal) => defaultStrategies[prop].includes(signal.name))
      .map((signal) => signal.id);
    items.push({
      Put: {
        TableName: process.env.TABLE_NAME,
        Item: {
          PK: `USER#${userId}`,
          SK: `STRATEGY#${strategyId}`,
          id: strategyId,
          type: "STRATEGY#",
          strategyName: prop,
          signals: signalIds,
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
