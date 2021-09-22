import handler from "../../util/handler";
import dynamoDb from "../../util/dynamodb";
import { deleteTransactionHandler } from "../../helpers/currencyHandler";

export const main = handler(async (event) => {
  const data = JSON.parse(event.body);
  const userId = event.requestContext.authorizer.iam.cognitoIdentity.identityId;
  const accountId = data.accountId;
  const transactionId = event.pathParameters.id;

  const params = {
    TransactItems: [
      {
        Delete: {
          TableName: process.env.TABLE_NAME,
          Key: {
            PK: `USER#${userId}`,
            SK: `TRANS#${transactionId}`,
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
            ":accountBalance": deleteTransactionHandler(
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

  return { status: true };
});
