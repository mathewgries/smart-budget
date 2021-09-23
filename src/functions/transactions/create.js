import * as uuid from "uuid";
import handler from "../../util/handler";
import dynamoDb from "../../util/dynamodb";
import { addTransactionHandler } from "../../helpers/currencyHandler";

export const main = handler(async (event) => {
  const data = JSON.parse(event.body);
  const userId = event.requestContext.authorizer.iam.cognitoIdentity.identityId;
  const accountId = data.accountId;

  const params = {
    TransactItems: [
      {
        Put: {
          TableName: process.env.TABLE_NAME,
          Item: {
            PK: `USER#${userId}`,
            SK: `TRANS#${uuid.v1()}`,
            GSI1_PK: `ACCT#${accountId}`,
            transactionAmount: data.transactionAmount,
            transactionDate: data.transactionDate,
            transactionType: data.transactionType,
            category: data.category,
            subCategory: data.subCategory,
            createDate: Date.now(),
            modifyDate: Date.now(),
          },
        },
      },
      {
        Update: {
          TableName: process.env.TABLE_NAME,
          Key: {
            PK: `USER#${userId}`,
            SK: `ACCT#${accountId}`,
          },
          UpdateExpression:
            "SET accountBalance = :accountBalance, modifyDate = :modifyDate",
          ExpressionAttributeValues: {
            ":accountBalance": addTransactionHandler(
              data.accountBalance,
              data.transactionAmount,
              data.transactionType
            ),
            ":modifyDate": Date.now(),
          },
        },
      },
    ],
  };

  await dynamoDb.transactWrite(params);

  return params.TransactItems;
});
