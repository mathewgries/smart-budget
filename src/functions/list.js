import handler from "../util/handler";
import dynamoDb from "../util/dynamodb";

export const main = handler(async (event) => {
  const userId = event.requestContext.authorizer.iam.cognitoIdentity.identityId;
  let result,
    accumulated = [],
    ExclusiveStartKey;

  do {
    result = await dynamoDb.query({
      TableName: process.env.TABLE_NAME,
      ExclusiveStartKey,
      KeyConditionExpression: "PK = :PK",
      ExpressionAttributeValues: {
        ":PK": `USER#${userId}`,
      },
    });
    ExclusiveStartKey = result.LastEvaluatedKey;
    accumulated = [...accumulated, ...result.Items];
  } while (result.LastEvaluatedKey);

  return accumulated;
});
