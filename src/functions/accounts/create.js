import * as uuid from "uuid";
import handler from "../../util/handler";
import dynamoDb from "../../util/dynamodb";

export const main = handler(async (event) => {
  const data = JSON.parse(event.body);
  const userId = event.requestContext.authorizer.iam.cognitoIdentity.identityId;

  const params = {
    TableName: process.env.TABLE_NAME,
    Item: {
      // The attributes of the item to be created
      PK: `USER#${userId}`, // The id of the author
      SK: `ACCT#${uuid.v1()}`, // A unique uuid
      accountName: data.accountName, // Parsed from request body
      accountBalance: data.accountBalance, // Starting balance of account
      createDate: Date.now(), // Current Unix timestamp
      modifyDate: Date.now(), // Current Unix timestamp
    },
  };

  await dynamoDb.put(params);

  return params.Item;

});