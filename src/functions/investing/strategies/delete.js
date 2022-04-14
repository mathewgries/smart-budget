import handler from "../../../util/handler";
import dynamodb from "../../../util/dynamodb";

export const main = handler(async (event) => {
  const data = JSON.parse(event.body);
  const userId = event.requestContext.authorizer.iam.cognitoIdentity.identityId;
  const { strategy, orders } = data;
  let items = [];
  let itemsLength = 0;
  let loopCount = 0;

  items.push({
    Delete: {
      TableName: process.env.TABLE_NAME,
      Key: {
        PK: `USER#${userId}`,
        SK: `${strategy.type}${strategy.id}`,
      },
    },
  });

  orders.forEach((order) =>
    items.push({
      Update: {
				Key: {
					PK: `USER#${userId}`,
					SK: `${order.type}${order.id}`,
				},
				TableName: process.env.TABLE_NAME,
				UpdateExpression: `SET 
					strategyId = :strategyId, 
					modifyDate = :modifyDate`,
				ExpressionAttributeValues: {
					":strategyId": order.strategyId,
					":modifyDate": Date.now(),
				},
			},
    })
  );

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
    await dynamodb.transactWrite(params);
  }
  return { status: true };
});
