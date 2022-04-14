import * as uuid from "uuid";
import handler from "../../../../util/handler";
import dynamoDb from "../../../../util/dynamodb";

export const main = handler(async (event) => {
  const data = JSON.parse(event.body);
  const { order, account } = data;
  const userId = event.requestContext.authorizer.iam.cognitoIdentity.identityId;
  const orderId = uuid.v1();
  const type = "ORDER#VERTSPREADS#";

  const params = {
    TransactItems: [
      {
        Put: {
          TableName: process.env.TABLE_NAME,
          Item: {
            PK: `USER#${userId}`,
            SK: `${type}${orderId}`,
            GSI1_PK: `ACCT#INVESTING#${account.id}`,
            id: orderId,
            type: type,
            ticker: order.ticker,
            openDate: order.openDate,
            closeDate: order.closeDate,
            orderSize: order.orderSize,
            openPrice: order.openPrice,
            closePrice: order.closePrice,
            openUnderlyingPrice: order.openUnderlyingPrice || null,
            closeUnderlyingPrice: order.closeUnderlyingPrice || null,
            strikeUpperLegPrice: order.strikeUpperLegPrice,
            strikeLowerLegPrice: order.strikeLowerLegPrice,
            contractType: order.contractType,
            tradeSide: order.tradeSide,
            spreadExpirationDate: order.spreadExpirationDate,
            openDelta: order.openDelta || null,
            closeDelta: order.closeDelta || null,
            openGamma: order.openGamma || null,
            closeGamma: order.closeGamma || null,
            openVega: order.openVega || null,
            closeVega: order.closeVega || null,
            openTheta: order.openTheta || null,
            closeTheta: order.closeTheta || null,
            openImpliedVolatility: order.openImpliedVolatility || null,
            closeImpliedVolatility: order.closeImpliedVolatility || null,
            profitLoss: order.profitLoss,
						commissions: order.commissions,
            strategyId: order.strategyId,
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
            SK: `ACCT#INVESTING#${account.id}`,
          },
          UpdateExpression:
            "SET accountBalance = :accountBalance, modifyDate = :modifyDate",
          ExpressionAttributeValues: {
            ":accountBalance": account.accountBalance,
            ":modifyDate": Date.now(),
          },
        },
      },
    ],
  };

  await dynamoDb.transactWrite(params);

  return {
    order: params.TransactItems[0].Put.Item,
    account,
  };
});
