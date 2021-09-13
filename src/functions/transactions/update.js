import handler from "../../util/handler";
import dynamodb from "../../util/dynamodb";

export const main = handler(async (event) => {
  const data = JSON.parse(event.body);
  const accountId = data.accountId;
  const transactionId = event.pathParameters.id;

  const paramsTrans = {
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
      ":transactionAmount": data.transactionAmount || null,
      ":transactionDate": data.transactionDate || null,
      ":transactionType": data.transactionType || null,
      ":category": data.category || null,
      ":subCategory": data.subCategory || null,
      ":modifyDate": Date.now(),
    },
    ReturnValues: "ALL_NEW",
  };

  await dynamodb.update(paramsTrans);

  return { status: true };
});
