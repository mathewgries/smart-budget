import handler from '../../util/handler';
import dynamodb from '../../util/dynamodb';

export const main = handler(async (event) => {
  const data = JSON.parse(event.body);
  const userId = event.requestContext.authorizer.iam.cognitoIdentity.identityId;

  const params = {
    TableName: process.env.TABLE_NAME,
    Item: {
      // The attributes of the item to be created
      PK: `USER#${userId}`, // The id of the author
      SK: `USER#INFO`, // A unique uuid
      username: data.username, // Parsed from request body
      email: data.email, // Starting balance of account
      dateOfBirth: data.dateOfBirth,
      createDate: Date.now(), // Current Unix timestamp
      modifyDate: Date.now(), // Current Unix timestamp
    },
  };

  await dynamodb.put(params);

  return params.Item;

});