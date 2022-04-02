import handler from "../../../../util/handler"
import dynamoDb from "../../../../util/dynamodb"

export const main = handler(async (event) => {
  const data = JSON.parse(event.body);
  const userId = event.requestContext.authorizer.iam.cognitoIdentity.identityId;
  const accountId = data.accountId;
  const orderId = event.pathParameters.id;
  const type = "ORDER#SHARES#";

  const params = {
    TransactItems: [
      {
        Update: {
          Key: {
            PK: `USER#${userId}`,
            SK: `${type}${orderId}`,
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
						signalList = :signalList,
          	modifyDate = :modifyDate`,
          ExpressionAttributeValues: {
            ":ticker": data.ticker,
            ":openDate": data.openDate,
            ":closeDate": data.closeDate,
            ":orderSize": data.orderSize,
            ":openPrice": data.openPrice,
            ":closePrice": data.closePrice,
            ":tradeSide": data.tradeSide,
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
