import * as uuid from "uuid";
import handler from "../../../util/handler";
import dynamoDb from "../../../util/dynamodb";

export const main = handler(async (event) => {
  const data = JSON.parse(event.body);
  const userId = event.requestContext.authorizer.iam.cognitoIdentity.identityId;
  const accountId = data.accountId;
  const orderId = uuid.v1();
  const type = "INVESTING#ORDER#OPTION#";


// accountId: "66941e00-a24c-11ec-b081-3776eb702261"


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
						strikePrice: data.strikePrice,
						contractType: data.contractType,
						orderSide: data.orderSide,
						orderSize: data.orderSize,
            openPrice: data.openPrice,
						closePrice: data.closePrice,
						openDate: data.openDate,
						closeDate: data.closeDate,
						result: data.result,
						resultDollars: data.resultDollars,
						resultPercent: data.resultPercent,
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
    transaction: params.TransactItems[0].Put.Item,
    account: params.TransactItems[1].Update.ExpressionAttributeValues,
  };
});
