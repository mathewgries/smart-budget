import handler from "../../../util/handler";
import dynamodb from "../../../util/dynamodb";

export const main = handler(async (event) => {
  const data = JSON.parse(event.body);
  const userId = event.requestContext.authorizer.iam.cognitoIdentity.identityId;
  const { strategy } = data;

  const params = {
    TableName: process.env.TABLE_NAME,
    Key: {
      PK: `USER#${userId}`,
      SK: `STRATEGY#${strategy.id}`,
    },
    UpdateExpression: `SET 
			strategyName = :strategyName, 
			signals = :signals,
			modifyDate = :modifyDate`,
    ExpressionAttributeValues: {
      ":strategyName": strategy.strategyName,
      ":signals": strategy.signals,
      ":modifyDate": Date.now(),
    },
    ReturnValues: "ALL_NEW",
  };

  return await dynamodb.update(params);
});
