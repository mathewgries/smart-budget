import * as uuid from "uuid";
import handler from "../../util/handler";
import dynamoDb from "../../util/dynamodb";
import { categories } from "../spending/categories/defaultCategories";

export const main = handler(async (event) => {
  const data = JSON.parse(event.body);
  const userId = event.requestContext.authorizer.iam.cognitoIdentity.identityId;

  const params = {
    TransactItems: [
      {
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
      },
      {
        Put: {
          TableName: process.env.TABLE_NAME,
          Item: {
            PK: `USER#${userId}`,
            SK: `USER#SIGNAL`,
            type: "SIGNAL",
            signalList: [],
            createDate: Date.now(),
            modifyDate: Date.now(),
          },
        },
      },
    ],
  };

  for (const prop in categories) {
		const categoryId = uuid.v1();
    params.TransactItems.push({
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

  await dynamoDb.transactWrite(params);

  return params.TransactItems;
});
