import * as uuid from "uuid";
import handler from "../../../util/handler";
import dynamoDb from "../../../util/dynamodb";

export const main = handler(async (event) => {
  const data = JSON.parse(event.body);
  const { category } = data;
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
      categoryName: category.categoryName,
      subcategories: category.subcategories,
      createDate: Date.now(),
      modifyDate: Date.now(),
    },
  };

  await dynamoDb.put(params);

  return params.Item;
});
