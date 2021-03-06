import * as uuid from "uuid";
import handler from "../../../util/handler";
import dynamoDb from "../../../util/dynamodb";

export const main = handler(async (event) => {
  const data = JSON.parse(event.body);
  const userId = event.requestContext.authorizer.iam.cognitoIdentity.identityId;
  const accountId = uuid.v1();
  const type = "ACCT#INVESTING#";

  const params = {
    TableName: process.env.TABLE_NAME,
    Item: {
      PK: `USER#${userId}`,
      SK: `${type}${accountId}`,
      GSI1_PK: `${type}${accountId}`,
      id: accountId,
      type: type,
      accountName: data.accountName,
      accountBalance: data.accountBalance,
      createDate: Date.now(),
      modifyDate: Date.now(),
    },
  };

  await dynamoDb.put(params);

  return params.Item;
});
