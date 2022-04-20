import * as uuid from "uuid";
import handler from "../../../util/handler";
import dynamoDb from "../../../util/dynamodb";

export const main = handler(async (event) => {
  const data = JSON.parse(event.body);
  const userId = event.requestContext.authorizer.iam.cognitoIdentity.identityId;
  const { transaction, account } = data;
  const transactionId = uuid.v1();
  const type = "TRANS#SPENDING#";

  const params = {
    TransactItems: [
      {
        Put: {
          TableName: process.env.TABLE_NAME,
          Item: {
            PK: `USER#${userId}`,
            SK: `${type}${transactionId}`,
            GSI1_PK: `ACCT#SPENDING#${account.id}`,
            id: transactionId,
            type: type,
            transactionAmount: transaction.transactionAmount,
            transactionDate: transaction.transactionDate,
            transactionType: transaction.transactionType,
            categoryName: transaction.categoryName,
            categoryId: transaction.categoryId,
            subcategory: transaction.subcategory,
            transactionNote: transaction.transactionNote,
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
            SK: `ACCT#SPENDING#${account.id}`,
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
    transaction: params.TransactItems[0].Put.Item,
    account,
  };
});
