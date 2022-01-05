import handler from "../../util/handler";
import dynamoDb from "../../util/dynamodb";

export const main = handler(async (event) => {
	const userId = event.requestContext.authorizer.iam.cognitoIdentity.identityId;

  const params = {
    TableName: process.env.TABLE_NAME,
		IndexName: "accountIndex",
		KeyConditionExpression: "#GSI1_PK = :GSI1_PK",
		ExpressionAttributeNames: {
      "#GSI1_PK": "GSI1_PK"
    },
    ExpressionAttributeValues: {
      ":GSI1_PK": `CATEG#USER#${userId}`,
    },
  };

  const result = await dynamoDb.query(params);

  if (!result.Items) {
    throw new Error("Item not found.");
  }

  return result.Items;
});
