import handler from "../../../util/handler";
import dynamoDb from "../../../util/dynamodb";

export const main = handler(async (event) => {
  const data = JSON.parse(event.body);
  const userId = event.requestContext.authorizer.iam.cognitoIdentity.identityId;
  const accountId = data.accountId;
  const transactionId = event.pathParameters.id;

  const params = {
    TransactItems: [
      {
        Update: {
          Key: {
            PK: `USER#${userId}`,
            SK: `TRANS#SPENDING#${transactionId}`,
          },
          TableName: process.env.TABLE_NAME,
          UpdateExpression: `SET 
          transactionAmount = :transactionAmount, 
          transactionDate = :transactionDate, 
          transactionType = :transactionType, 
          category = :category, 
          subCategory = :subCategory,
					transactionNote = :transactionNote,
          modifyDate = :modifyDate`,
          ExpressionAttributeValues: {
            ":transactionAmount": data.transactionAmount,
            ":transactionDate": data.transactionDate,
            ":transactionType": data.transactionType,
            ":category": data.category,
            ":subCategory": data.subCategory,
            ":transactionNote": data.transactionNote,
            ":modifyDate": Date.now(),
          },
        },
      },
      {
        Update: {
          Key: {
            PK: `USER#${userId}`,
            SK: `ACCT#SPENDING#${accountId}`,
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
