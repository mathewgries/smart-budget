import handler from "../../util/handler";
import dynamoDb from "../../util/dynamodb";

export const main = handler(async (event) => {
  const data = JSON.parse(event.body);
  const accountId = data.accountId;
  const transactionId = event.pathParameters.id;

  const params = {
    TableName: process.env.TABLE_NAME,
    Key: {
      PK: `ACCT#${accountId}`,
      SK: `TRANS#${transactionId}`,
    },
  };

  await dynamoDb.delete(params);

  return { status: true };
});
