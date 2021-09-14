import * as uuid from "uuid";
import handler from "../../util/handler";
import dynamoDb from "../../util/dynamodb";

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
            PK: `ACCT#${accountId}`,
            SK: `TRANS#${uuid.v1()}`,
            GSI_user_trans_PK: `USER#${userId}`,
            transactionAmount: data.transactionAmount,
            transactionDate: data.transactionDate,
            transactionType: data.transactionType,
            category: data.category,
            subCategory: data.subCategory,
            createDate: Date.now(), // Current Unix timestamp
            modifyDate: Date.now(), // Current Unix timestamp
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
            ":accountBalance":
              data.transactionType === "W"
                ? data.accountBalance - data.transactionAmount
                : data.accountBalance + data.transactionAmount,
            ":modifyDate": Date.now(),
          },
        },
      },
    ],
  };

  await dynamoDb.transactWrite(params);

  return params.TransactItems.Item;
});
