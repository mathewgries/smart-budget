import * as uuid from "uuid";
import handler from "../../../util/handler";
import dynamoDb from "../../../util/dynamodb";

export const main = handler(async (event) => {
  const data = JSON.parse(event.body);
  const userId = event.requestContext.authorizer.iam.cognitoIdentity.identityId;
  const accountId = data.accountId;
  const transactionId = uuid.v1();
  const type = "TRANS#INVESTING#";

  const params = {
    TransactItems: [
      {
        Put: {
          TableName: process.env.TABLE_NAME,
          Item: {
            PK: `USER#${userId}`,
            SK: `${type}${transactionId}`,
            GSI1_PK: `ACCT#INVESTING#${accountId}`,
            id: transactionId,
            type: type,
            transactionAmount: data.transactionAmount,
            transactionDate: Date.parse(data.transactionDate),
            transactionType: data.transactionType,
            transactionNote: data.transactionNote,
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
            SK: `ACCT#INVESTING#${accountId}`,
          },
          UpdateExpression:
            "SET accountBalance = :accountBalance, modifyDate = :modifyDate",
          ExpressionAttributeValues: {
            ":accountBalance": data.accountBalance,
            ":modifyDate": Date.now(),
          },
        },
      },
    ],
  };

  await dynamoDb.transactWrite(params);

  return {
    transaction: params.TransactItems[0].Put.Item,
    account: params.TransactItems[1].Update.ExpressionAttributeValues,
  };
});