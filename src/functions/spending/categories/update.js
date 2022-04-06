import handler from "../../../util/handler";
import dynamoDb from "../../../util/dynamodb";

export const main = handler(async (event) => {
  const data = JSON.parse(event.body);
  const userId = event.requestContext.authorizer.iam.cognitoIdentity.identityId;

  const params = {
    TableName: process.env.TABLE_NAME,
    Key: {
      PK: `USER#${userId}`,
      SK: `${data.type}${data.id}`,
    },
    UpdateExpression:
      "SET categoryName = :categoryName, subcategories = :subcategories, modifyDate = :modifyDate",
    ExpressionAttributeValues: {
      ":categoryName": data.categoryName,
			":subcategories": data.subcategories,
      ":modifyDate": Date.now(),
    },
    ReturnValues: "ALL_NEW",
  };

  await dynamoDb.update(params);

  return { status: true };
});