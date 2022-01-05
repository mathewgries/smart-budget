import * as uuid from "uuid";
import handler from "../../util/handler";
import dynamodb from "../../util/dynamodb";

export const main = handler(async (event) => {
  const data = JSON.parse(event.body);
  const userId = event.requestContext.authorizer.iam.cognitoIdentity.identityId;
	const categoryId = uuid.v1();
	const type = 'CATEG#'

  const params = {
    TableName: process.env.TABLE_NAME,
    Item: {
      PK: `USER#${userId}`,
      SK: `${type}${categoryId}`,
			GSI1_PK: `${type}USER#${userId}`,
      id: categoryId,
			type: type,
      categoryName: data.categoryName,
			subCategories: data.subCategories || null,
      createDate: Date.now(),
      modifyDate: Date.now(),
    },
  };

  await dynamodb.put(params);

  return params.Item;
});
