import handler from "../../util/handler";
import dynamodb from "../../util/dynamodb";

export const main = handler(async (event) => {
  const data = JSON.parse(event.body);
  const userId = event.requestContext.authorizer.iam.cognitoIdentity.identityId;
  const categoryId = event.pathParameters.id;

  const params = {
    TableName: process.env.TABLE_NAME,
    Key: {
      PK: `USER#${userId}`,
      SK: `${data.type}${categoryId}`,
    },
    UpdateExpression:
      `SET 
			categoryName = :categoryName, 
			subCategories = :subCategories, 
			modifyDate = :modifyDate`,
    ExpressionAttributeValues: {
      ":categoryName": data.categoryName,
      ":subCategories": data.subCategories,
      ":modifyDate": Date.now(),
    },
    ReturnValues: "ALL_NEW",
  };

  await dynamodb.update(params);

  return { status: true };
});