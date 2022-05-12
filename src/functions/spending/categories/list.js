import handler from "../../../util/handler";
import dynamoDb from "../../../util/dynamodb";

export const main = handler(async (event) => {
  const userId = event.requestContext.authorizer.iam.cognitoIdentity.identityId;
	
  const params = {
    TableName: process.env.TABLE_NAME,
    KeyConditionExpression: "#PK = :PK and begins_with(#SK, :SK)",
    ExpressionAttributeNames: {
      "#PK": "PK",
      "#SK": "SK",
    },
    ExpressionAttributeValues: {
      ":PK": `USER#${userId}`,
      ":SK": "CATEGORY#",
    },
  };

  const result = await dynamoDb.query(params);

  return result.Items;
});
