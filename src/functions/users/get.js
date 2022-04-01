import handler from "../../util/handler"
import dynamoDb from "../../util/dynamodb";

export const main = handler(async (event) => {
  const userId = event.requestContext.authorizer.iam.cognitoIdentity.identityId;

  const params = {
    TableName: process.env.TABLE_NAME,
    Key: {
      PK: `USER#${userId}`,
      SK: `USER#INFO`,
    },
  };

  const result = await dynamoDb.get(params);
  if (!result.Item) {
    throw new Error("Item not found.");
  }

  return result.Item;
});
