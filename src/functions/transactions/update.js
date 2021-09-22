import handler from "../../util/handler";
import dynamodb from "../../util/dynamodb";
import { updateTransactionHelper } from "../../helpers/currencyHandler";

export const main = handler(async (event) => {
  const data = JSON.parse(event.body);
  const oldData = data.oldData;
  const newData = data.newData;
  const userId = event.requestContext.authorizer.iam.cognitoIdentity.identityId;
  const accountId = data.accountId;
  const transactionId = event.pathParameters.id;

  const params = {
    TransactItems: [
      {
        Update: {
          TableName: process.env.TABLE_NAME,
          Key: {
            PK: `USER#${userId}`,
            SK: `TRANS#${transactionId}`,
          },
          UpdateExpression: `SET 
          transactionAmount = :transactionAmount, 
          transactionDate = :transactionDate, 
          transactionType = :transactionType, 
          category = :category, 
          subCategory = :subCategory,
          modifyDate = :modifyDate`,
          ExpressionAttributeValues: {
            ":transactionAmount": newData.transactionAmount,
            ":transactionDate": newData.transactionDate,
            ":transactionType": newData.transactionType,
            ":category": newData.category,
            ":subCategory": newData.subCategory,
            ":modifyDate": Date.now(),
          },
        },
      },
      {
        Update: {
          TableName: process.env.TABLE_NAME,
          Key: {
            PK: `USER#${userId}`,
            SK: `ACCT#${accountId}`,
          },
          UpdateExpression:
            "SET accountBalance = :accountBalance, modifyDate = :modifyDate",
          ExpressionAttributeValues: {
            ":accountBalance": updateTransactionHelper(
              oldData,
              newData,
              data.accountBalance
            ),
            ":modifyDate": Date.now(),
          },
        },
      },
    ],

    ReturnValues: "ALL_NEW",
  };

  await dynamodb.transactWrite(params);

  return { status: true };
});
