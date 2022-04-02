import handler from "../../../../util/handler";
import dynamoDb from "../../../../util/dynamodb";

export const main = handler(async (event) => {
  const data = JSON.parse(event.body);
  const userId = event.requestContext.authorizer.iam.cognitoIdentity.identityId;
  const accountId = data.accountId;
  const orderId = event.pathParameters.id;

  const params = {
    TransactItems: [
      {
        Update: {
          Key: {
            PK: `USER#${userId}`,
            SK: `ORDER#VERTSPREADS#${orderId}`,
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
            strikeUpperLegPrice = :strikeUpperLegPrice,
            strikeLowerLegPrice = :strikeLowerLegPrice,
            contractType = :contractType,
            tradeSide = :tradeSide,
            spreadExpirationDate = :spreadExpirationDate,
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
            signalList = :signalList,
          	modifyDate = :modifyDate`,
          ExpressionAttributeValues: {
            ":ticker": data.ticker,
            ":openDate": data.openDate,
            ":closeDate": data.closeDate,
            ":orderSize": data.orderSize,
            ":openPrice": data.openPrice,
            ":closePrice": data.closePrice,
            ":openUnderlyingPrice": data.openUnderlyingPrice,
            ":closeUnderlyingPrice": data.closeUnderlyingPrice || null,
            ":strikeUpperLegPrice": data.strikeUpperLegPrice || null,
            ":strikeLowerLegPrice": data.strikeLowerLegPrice,
            ":contractType": data.contractType,
            ":tradeSide": data.tradeSide,
            ":spreadExpirationDate": data.spreadExpirationDate,
            ":openDelta": data.openDelta || null,
            ":closeDelta": data.closeDelta || null,
            ":openGamma": data.openGamma || null,
            ":closeGamma": data.closeGamma || null,
            ":openVega": data.openVega || null,
            ":closeVega": data.closeVega || null,
            ":openTheta": data.openTheta || null,
            ":closeTheta": data.closeTheta || null,
            ":openImpliedVolatility": data.openImpliedVolatility || null,
            ":closeImpliedVolatility": data.closeImpliedVolatility || null,
            ":profitLoss": data.profitLoss,
            ":signalList": data.signalList,
            ":modifyDate": Date.now(),
          },
        },
      },
      {
        Update: {
          Key: {
            PK: `USER#${userId}`,
            SK: `ACCT#INVESTING#${accountId}`,
          },
          TableName: process.env.TABLE_NAME,
          UpdateExpression:
            "SET accountBalance = :accountBalance, modifyDate = :modifyDate",
          ExpressionAttributeValues: {
            ":accountBalance": data.accountBalance,
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
