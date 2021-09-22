import handler from "../../util/handler";
import dynamodb from "../../util/dynamodb";

export const main = handler(async (event) => {
  const data = JSON.parse(event.body);
  const userId = event.requestContext.authorizer.iam.cognitoIdentity.identityId;

  const params = {
    TableName: process.env.TABLE_NAME,
    Item: {
      PK: `USER#${userId}`,
      SK: `USER#INFO`,
      username: data.username || null,
      email: data.email || null,
      dateOfBirth: data.dateOfBirth || null,
      createDate: Date.now(),
      modifyDate: Date.now(),
    },
  };

  await dynamodb.put(params);

  return params.Item;
});
