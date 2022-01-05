import handler from "../../util/handler";
import dynamodb from "../../util/dynamodb";

export const main = handler(async (event) => {
  const userId = event.requestContext.authorizer.iam.cognitoIdentity.identityId;
  const categoryId = event.pathParameters.id;

  const params = {
    TableName: process.env.TABLE_NAME,
		Key: {
      PK: `USER#${userId}`,
      SK: `CATEG#${categoryId}`,
    },
  };

  await dynamodb.delete(params);

  return { status: true };
});
