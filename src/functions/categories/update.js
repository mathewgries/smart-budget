import handler from "../../util/handler";
import dynamodb from "../../util/dynamodb";

export const main = handler(async (event) => {
  const data = JSON.parse(event.body);
  const userId = event.requestContext.authorizer.iam.cognitoIdentity.identityId;

  const params = {
    TableName: process.env.TABLE_NAME,
    Key: {
      PK: `USER#${userId}`,
      SK: "USER#CATEGORY",
    },
    UpdateExpression:
      "SET categoryMap = :categoryMap, modifyDate = :modifyDate",
    ExpressionAttributeValues: {
      ":categoryMap": data,
      ":modifyDate": Date.now(),
    },
    ReturnValues: "ALL_NEW",
  };

  await dynamodb.update(params);

  return { status: true };
});