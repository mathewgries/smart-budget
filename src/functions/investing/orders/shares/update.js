import handler from "../../../../util/handler";
import dynamoDb from "../../../../util/dynamodb";

export const main = handler(async (event) => {
  const data = JSON.parse(event.body);
  const { order, account } = data;
  const userId = event.requestContext.authorizer.iam.cognitoIdentity.identityId;

  const params = {
    TransactItems: [
      {
        Update: {
          Key: {
            PK: `USER#${userId}`,
            SK: `${order.type}${order.id}`,
          },
          TableName: process.env.TABLE_NAME,
          UpdateExpression: `SET 
          	ticker = :ticker,
            openDate = :openDate,
            closeDate = :closeDate,
            orderSize = :orderSize,
            openPrice = :openPrice,
            closePrice = :closePrice,
            tradeSide = :tradeSide,
            profitLoss = :profitLoss,
						strategyId = :strategyId,
					strategyName = :strategyName,
          	modifyDate = :modifyDate`,
          ExpressionAttributeValues: {
            ":ticker": order.ticker,
            ":openDate": order.openDate,
            ":closeDate": order.closeDate,
            ":orderSize": order.orderSize,
            ":openPrice": order.openPrice,
            ":closePrice": order.closePrice,
            ":tradeSide": order.tradeSide,
            ":profitLoss": order.profitLoss,
            ":strategyId": order.strategyId,
            ":strategyName": order.strategyName,
            ":modifyDate": Date.now(),
          },
        },
      },
      {
        Update: {
          Key: {
            PK: `USER#${userId}`,
            SK: `ACCT#INVESTING#${account.id}`,
          },
          TableName: process.env.TABLE_NAME,
          UpdateExpression:
            "SET accountBalance = :accountBalance, modifyDate = :modifyDate",
          ExpressionAttributeValues: {
            ":accountBalance": account.accountBalance,
            ":modifyDate": Date.now(),
          },
        },
      },
    ],

    ReturnValues: "ALL_NEW",
  };

  await dynamoDb.transactWrite(params);

  return { status: true };
});
