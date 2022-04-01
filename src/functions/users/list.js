import handler from "../../util/handler";
import dynamoDb from "../../util/dynamodb";

export const main = handler(async (event) => {
  const userId = event.requestContext.authorizer.iam.cognitoIdentity.identityId;
  
	const params = {
    TableName: process.env.TABLE_NAME,
    KeyConditionExpression: "PK = :PK",
    ExpressionAttributeValues: {
      ":PK": `USER#${userId}`,
    },
  };

  const result = await dynamoDb.query(params);

  return result.Items;
});
