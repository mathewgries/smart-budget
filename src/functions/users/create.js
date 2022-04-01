import handler from "../../util/handler";
import dynamoDb from "../../util/dynamodb";
import { categories } from "../spending/categories/defaultCategories";

export const main = handler(async (event) => {
  const data = JSON.parse(event.body);
  const userId = event.requestContext.authorizer.iam.cognitoIdentity.identityId;
  const type = "CATEGORY";

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
						type: 'USER#INFO',
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
            SK: `USER#CATEGORY`,
            type: type,
            categoryMap: categories,
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
            type: 'SIGNAL',
            signalList: [],
            createDate: Date.now(),
            modifyDate: Date.now(),
          },
        },
      },
    ],
  };

  await dynamoDb.transactWrite(params);

  return params.TransactItems;
});
