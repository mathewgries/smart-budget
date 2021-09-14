import handler from "../../util/handler";
import dynamodb from "../../util/dynamodb";
import updateTransactionHelper from "../../helpers/updateTransactionHelper";

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
            PK: `ACCT#${accountId}`,
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
            ":transactionAmount": newData.transactionAmount || null,
            ":transactionDate": newData.transactionDate || null,
            ":transactionType": newData.transactionType || null,
            ":category": newData.category || null,
            ":subCategory": newData.subCategory || null,
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
            ":accountBalance": updateTransactionHelper(oldData,newData,data.accountBalance),
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
