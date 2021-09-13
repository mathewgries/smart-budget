import * as uuid from "uuid";
import handler from "../../util/handler";
import dynamoDb from "../../util/dynamodb";

export const main = handler(async (event) => {
  const data = JSON.parse(event.body);
  const userId = event.requestContext.authorizer.iam.cognitoIdentity.identityId;
  const accountId = data.accountId;

  const params = {
    TableName: process.env.TABLE_NAME,
    Item: {
      PK: `ACCT#${accountId}`,
      SK: `TRANS#${uuid.v1()}`,
      GSI_user_trans_PK: `USER#${userId}`,
      transactionAmount: data.transactionAmount,
      transactionDate: data.transactionDate,
      transactionType: data.transactionType,
      category: data.category,
      subCategory: data.subCategory,
      createDate: Date.now(), // Current Unix timestamp
      modifyDate: Date.now(), // Current Unix timestamp
    },
  };

  await dynamoDb.put(params);

  return params.Item;
});
