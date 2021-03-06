import handler from "../../../util/handler";
import dynamoDb from "../../../util/dynamodb";

export const main = handler(async (event) => {
  const userId = event.requestContext.authorizer.iam.cognitoIdentity.identityId;
  let result,
    accumulated = [],
    ExclusiveStartKey;

  do {
    result = await dynamoDb.query({
      TableName: process.env.TABLE_NAME,
      ExclusiveStartKey,
      KeyConditionExpression: "#PK = :PK and begins_with(#SK, :SK)",
      ExpressionAttributeNames: {
        "#PK": "PK",
        "#SK": "SK",
      },
      ExpressionAttributeValues: {
        ":PK": `USER#${userId}`,
        ":SK": "TRANS#SPENDING#",
      },
    });
    ExclusiveStartKey = result.LastEvaluatedKey;
    accumulated = [...accumulated, ...result.Items];
  } while (result.LastEvaluatedKey);

  return accumulated;
});
