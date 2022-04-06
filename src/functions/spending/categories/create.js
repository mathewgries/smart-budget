import * as uuid from "uuid";
import handler from "../../../util/handler"
import dynamoDb from "../../../util/dynamodb";

export const main = handler(async (event) => {
  const data = JSON.parse(event.body);
  const userId = event.requestContext.authorizer.iam.cognitoIdentity.identityId;
	const categoryId = uuid.v1();
	const type = "CATEGORY#"; 

  const params = {
    TableName: process.env.TABLE_NAME,
    Item: {
      PK: `USER#${userId}`,
      SK: `${type}${categoryId}`,
			id: categoryId,
			type: type,
      categoryName: data.categoryName,
      subcategories: data.subcategories,
      createDate: Date.now(),
      modifyDate: Date.now(),
    },
  };

  await dynamoDb.put(params);

  return params.Item;
});
