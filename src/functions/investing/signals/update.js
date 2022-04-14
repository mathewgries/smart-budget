import handler from "../../../util/handler";
import dynamoDb from "../../../util/dynamodb";

export const main = handler(async (event) => {
  const data = JSON.parse(event.body);
  const userId = event.requestContext.authorizer.iam.cognitoIdentity.identityId;
  const { signals, strategies } = data;

  let items = [];
  let itemsLength = 0;
  let loopCount = 0;

  items.push({
    Update: {
      TableName: process.env.TABLE_NAME,
      Key: {
        PK: `USER#${userId}`,
        SK: "SIGNALS#",
      },
      UpdateExpression:
        "SET signalList = :signalList, modifyDate = :modifyDate",
      ExpressionAttributeValues: {
        ":signalList": signals,
        ":modifyDate": Date.now(),
      },
    },
  });

  if (strategies) {
    if (strategies.length > 0) {
      strategies.forEach((strategy) =>
        items.push({
          Update: {
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
          },
        })
      );
    }
  }

  itemsLength = items.length;
  loopCount = Math.ceil(itemsLength / 25);
  for (let i = 0; i < loopCount; i++) {
    let params;
    const startIndex = i * 25;
    const endIndex = startIndex + 25;

    if (i === loopCount - 1) {
      params = { TransactItems: items.slice(startIndex) };
    } else {
      params = { TransactItems: items.slice(startIndex, endIndex) };
    }
    await dynamoDb.transactWrite(params);
  }
  return { status: true };
});
