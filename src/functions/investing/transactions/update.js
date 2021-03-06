import handler from "../../../util/handler";
import dynamoDb from "../../../util/dynamodb";

export const main = handler(async (event) => {
  const data = JSON.parse(event.body);
  const userId = event.requestContext.authorizer.iam.cognitoIdentity.identityId;
  const { transaction, account } = data;

  const params = {
    TransactItems: [
      {
        Update: {
          Key: {
            PK: `USER#${userId}`,
            SK: `${transaction.type}${transaction.id}`,
          },
          TableName: process.env.TABLE_NAME,
          UpdateExpression: `SET 
          transactionAmount = :transactionAmount, 
          transactionDate = :transactionDate, 
          transactionType = :transactionType, 
					transactionNote = :transactionNote,
          modifyDate = :modifyDate`,
          ExpressionAttributeValues: {
            ":transactionAmount": transaction.transactionAmount,
            ":transactionDate": transaction.transactionDate,
            ":transactionType": transaction.transactionType,
            ":transactionNote": transaction.transactionNote,
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
