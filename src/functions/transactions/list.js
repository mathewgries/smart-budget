import handler from "../../util/handler";
import dynamoDb from "../../util/dynamodb";

export const main = handler(async (event) => {
  const userId = event.requestContext.authorizer.iam.cognitoIdentity.identityId;
  const params = {
    TableName: process.env.TABLE_NAME,
    IndexName: 'userTransactionIndex',
    KeyConditionExpression: "GSI_user_trans_PK = :PK",
    ExpressionAttributeValues: {
      ":PK": `USER#${userId}`,
    },
  };

  const result = await dynamoDb.query(params);

  // Return the matching list of items in response body
  return result.Items;
});
