import * as uuid from "uuid";
import handler from "../../../util/handler"
import dynamoDb from "../../../util/dynamodb";

export const main = handler(async (event) => {
  const userId = event.requestContext.authorizer.iam.cognitoIdentity.identityId;
	const signalId = uuid.v1();
	const type = "INVESTING#SIGNAL"; 

  const params = {
    TableName: process.env.TABLE_NAME,
    Item: {
      PK: `USER#${userId}`,
      SK: `${type}`,
			type: type,
			signalList: [],
      createDate: Date.now(),
      modifyDate: Date.now(),
    },
  };

  await dynamoDb.put(params);

  return params.Item;
});
