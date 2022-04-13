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
					openUnderlyingPrice = :openUnderlyingPrice,
					closeUnderlyingPrice = :closeUnderlyingPrice,
					strikePrice = :strikePrice,
					contractType = :contractType,
					tradeSide = :tradeSide,
					contractExpirationDate = :contractExpirationDate,
					openDelta = :openDelta,
					closeDelta = :closeDelta,
					openGamma = :openGamma,
					closeGamma = :closeGamma,
					openVega = :openVega,
					closeVega = :closeVega,
					openTheta = :openTheta,
					closeTheta = :closeTheta,
					openImpliedVolatility = :openImpliedVolatility,
					closeImpliedVolatility = :closeImpliedVolatility,
					profitLoss = :profitLoss,
					strategyId = :strategyId,
          modifyDate = :modifyDate`,
          ExpressionAttributeValues: {
            ":ticker": order.ticker,
            ":openDate": order.openDate,
            ":closeDate": order.closeDate,
            ":orderSize": order.orderSize,
            ":openPrice": order.openPrice,
            ":closePrice": order.closePrice,
            ":openUnderlyingPrice": order.openUnderlyingPrice,
            ":closeUnderlyingPrice": order.closeUnderlyingPrice,
            ":strikePrice": order.strikePrice,
            ":contractType": order.contractType,
            ":tradeSide": order.tradeSide,
            ":contractExpirationDate": order.contractExpirationDate,
            ":openDelta": order.openDelta,
            ":closeDelta": order.closeDelta,
            ":openGamma": order.openGamma,
            ":closeGamma": order.closeGamma,
            ":openVega": order.openVega,
            ":closeVega": order.closeVega,
            ":openTheta": order.openTheta,
            ":closeTheta": order.closeTheta,
            ":openImpliedVolatility": order.openImpliedVolatility,
            ":closeImpliedVolatility": order.closeImpliedVolatility,
            ":profitLoss": order.profitLoss,
            ":strategyId": order.strategyId,
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
