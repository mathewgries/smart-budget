import * as uuid from "uuid";
import handler from "../../../../util/handler";
import dynamoDb from "../../../../util/dynamodb";

export const main = handler(async (event) => {
  const data = JSON.parse(event.body);
  const userId = event.requestContext.authorizer.iam.cognitoIdentity.identityId;
  const accountId = data.accountId;
  const orderId = uuid.v1();
  const type = "ORDER#OPTIONS#";

  const params = {
    TransactItems: [
      {
        Put: {
          TableName: process.env.TABLE_NAME,
          Item: {
            PK: `USER#${userId}`,
            SK: `${type}${orderId}`,
            GSI1_PK: `ACCT#INVESTING#${accountId}`,
            id: orderId,
            type: type,
            ticker: data.ticker,
            openDate: data.openDate,
            closeDate: data.closeDate,
            orderSize: data.orderSize,
            openPrice: data.openPrice,
            closePrice: data.closePrice,
            openUnderlyingPrice: data.openUnderlyingPrice,
            closeUnderlyingPrice: data.closeUnderlyingPrice,
            strikePrice: data.strikePrice,
            contractType: data.contractType,
            tradeSide: data.tradeSide,
            contractExpirationDate: data.contractExpirationDate,
            openDelta: data.openDelta || null,
            closeDelta: data.closeDelta || null,
            openGamma: data.openGamma || null,
            closeGamma: data.closeGamma || null,
            openVega: data.openVega || null,
            closeVega: data.closeVega || null,
            openTheta: data.openTheta || null,
            closeTheta: data.closeTheta || null,
            openImpliedVolatility: data.openImpliedVolatility || null,
            closeImpliedVolatility: data.closeImpliedVolatility || null,
            profitLoss: data.profitLoss,
						signalList: data.signalList,
            createDate: Date.now(),
            modifyDate: Date.now(),
          },
        },
      },
      {
        Update: {
          TableName: process.env.TABLE_NAME,
          Key: {
            PK: `USER#${userId}`,
            SK: `ACCT#INVESTING#${accountId}`,
          },
          UpdateExpression:
            "SET accountBalance = :accountBalance, modifyDate = :modifyDate",
          ExpressionAttributeValues: {
            ":accountBalance": data.accountBalance,
            ":modifyDate": Date.now(),
          },
        },
      },
    ],
  };

  await dynamoDb.transactWrite(params);

  return {
    order: params.TransactItems[0].Put.Item,
    account: params.TransactItems[1].Update.ExpressionAttributeValues,
  };
});
