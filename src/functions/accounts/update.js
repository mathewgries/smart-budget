import handler from "../../util/handler";
import dynamodb from "../../util/dynamodb";

export const main = handler(async (event) => {
  const data = JSON.parse(event.body);
  const userId = event.requestContext.authorizer.iam.cognitoIdentity.identityId;
  const accountId = event.pathParameters.id;

  const params = {
    TableName: process.env.TABLE_NAME,
    Key: {
      PK: `USER#${userId}`,
      SK: `ACCT#${accountId}`,
    },
    UpdateExpression:
      "SET accountName = :accountName, accountBalance = :accountBalance, modifyDate = :modifyDate",
    ExpressionAttributeValues: {
      ":accountName": data.accountName || null,
      ":accountBalance": data.accountBalance || null,
      ":modifyDate": Date.now(),
    },
    ReturnValues: "ALL_NEW",
  };

  await dynamodb.update(params);

  return { status: true };
});
