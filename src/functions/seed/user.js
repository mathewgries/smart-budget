import * as uuid from "uuid";
import { defaultSignals } from "../investing/signals/defaultSignals";
import { defaultCategories } from "../spending/categories/defaultCategories";
import { defaultStrategies } from "../investing/strategies/defaultStrategies";

export const buildUserDefaults = (table, user) => {
  let items = [];

  items.push({
    Put: {
      TableName: table,
      Item: {
        PK: `USER#${user.id}`,
        SK: `USER#INFO`,
        username: user.email || null,
        email: user.email || null,
        dateOfBirth: user.dateOfBirth || null,
        type: "USER#INFO",
        createDate: Date.now(),
        modifyDate: Date.now(),
      },
    },
  });

  items.push({
    Put: {
      TableName: table,
      Item: {
        PK: `USER#${user.id}`,
        SK: `SIGNALS#`,
        type: "SIGNALS#",
        signalList: defaultSignals,
        createDate: Date.now(),
        modifyDate: Date.now(),
      },
    },
  });

  for (const prop in defaultCategories) {
    const categoryId = uuid.v1();
    items.push({
      Put: {
        TableName: table,
        Item: {
          PK: `USER#${user.id}`,
          SK: `CATEGORY#${categoryId}`,
          id: categoryId,
          type: "CATEGORY#",
          categoryName: prop,
          subcategories: defaultCategories[prop],
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
        TableName: table,
        Item: {
          PK: `USER#${user.id}`,
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

	return items
};
