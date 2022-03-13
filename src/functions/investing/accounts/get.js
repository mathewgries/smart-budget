import handler from "../../../util/handler";
import dynamoDb from "../../../util/dynamodb";

export const main = handler(async (event) => {
  const accountId = event.pathParameters.id;

  const params = {
    TableName: process.env.TABLE_NAME,
		IndexName: "accountIndex",
		KeyConditionExpression: "GSI1_PK = :GSI1_PK",
    ExpressionAttributeValues: {
      ":GSI1_PK": `ACCT#INVESTING#${accountId}`,
    },
  };

  const result = await dynamoDb.query(params);

  if (!result.Items) {
    throw new Error("Item not found.");
  }

  return result.Items;
});
