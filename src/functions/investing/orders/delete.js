import handler from "../../../util/handler"
import dynamoDb from "../../../util/dynamodb";

export const main = handler(async (event) => {
  const data = JSON.parse(event.body);
  const userId = event.requestContext.authorizer.iam.cognitoIdentity.identityId;
  const { order, account } = data;

  const params = {
    TransactItems: [
      {
        Delete: {
          TableName: process.env.TABLE_NAME,
          Key: {
            PK: `USER#${userId}`,
            SK: `${order.type}${order.id}`,
          },
        },
      },
      {
        Update: {
          TableName: process.env.TABLE_NAME,
          Key: {
            PK: `USER#${userId}`,
            SK: `ACCT#INVESTING#${account.id}`,
          },
          UpdateExpression:
            "SET accountBalance = :accountBalance, modifyDate = :modifyDate",
          ExpressionAttributeValues: {
            ":accountBalance": account.accountBalance,
            ":modifyDate": Date.now(),
          },
        },
      },
    ],
  };

  await dynamoDb.transactWrite(params);

  return { status: true };
});
