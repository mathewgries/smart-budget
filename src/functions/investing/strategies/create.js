import * as uuid from "uuid";
import handler from "../../../util/handler";
import dynamoDb from "../../../util/dynamodb";

export const main = handler(async (event) => {
  const data = JSON.parse(event.body);
  const userId = event.requestContext.authorizer.iam.cognitoIdentity.identityId;
  const strategyId = uuid.v1();
  const type = "STRATEGY#";
  const { strategy } = data;

  const params = {
    TableName: process.env.TABLE_NAME,
    Item: {
      PK: `USER#${userId}`,
      SK: `${type}${strategyId}`,
			id: strategyId,
      type: type,
      strategyName: strategy.strategyName,
      signals: [],
      createDate: Date.now(),
      modifyDate: Date.now(),
    },
  };

  await dynamoDb.put(params);

  return params.Item;
});
