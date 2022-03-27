import * as uuid from "uuid";
import handler from "../../../../util/handler";
import dynamoDb from "../../../../util/dynamodb";

export const main = handler(async (event) => {
  const data = JSON.parse(event.body);
  const userId = event.requestContext.authorizer.iam.cognitoIdentity.identityId;
  const accountId = data.accountId;
  const orderId = uuid.v1();
  const type = "INVESTING#ORDER#VERTSPREAD#";

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
            openValue: data.openValue,
            closeValue: data.closeValue,
            strikeUpperLegPrice: data.strikeUpperLegPrice,
            strikeLowerLegPrice: data.strikeLowerLegPrice,
            contractType: data.contractType,
            tradeSide: data.tradeSide,
            spreadExpirationDate: data.spreadExpirationDate,
            openDelta: data.openDelta,
            closeDelta: data.closeDelta,
            openGamma: data.openGamma,
            closeGamma: data.closeGamma,
            openVega: data.openVega,
            closeVega: data.closeVega,
            openTheta: data.openTheta,
            closeTheta: data.closeTheta,
            openImpliedVolatility: data.openImpliedVolatility,
            closeImpliedVolatility: data.closeImpliedVolatility,
            profitLoss: data.profitLoss,
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
