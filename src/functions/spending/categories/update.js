import handler from "../../../util/handler";
import dynamoDb from "../../../util/dynamodb";

export const main = handler(async (event) => {
  const data = JSON.parse(event.body);
  const userId = event.requestContext.authorizer.iam.cognitoIdentity.identityId;
  const { category, transactions } = data;

  let items = [];
  let itemsLength = 0;
  let loopCount = 0;

  items.push({
    Update: {
      TableName: process.env.TABLE_NAME,
      Key: {
        PK: `USER#${userId}`,
        SK: `${category.type}${category.id}`,
      },
      UpdateExpression: `SET 
			categoryName = :categoryName, 
			subcategories = :subcategories, 
			modifyDate = :modifyDate`,
      ExpressionAttributeValues: {
        ":categoryName": category.categoryName,
        ":subcategories": category.subcategories,
        ":modifyDate": Date.now(),
      },
    },
  });

  if (transactions) {
    if (transactions.length > 0) {
      transactions.forEach((transaction) =>
        items.push({
          Update: {
            TableName: process.env.TABLE_NAME,
            Key: {
              PK: `USER#${userId}`,
              SK: `TRANS#SPENDING#${transaction.id}`,
            },
            UpdateExpression: `SET 
						categoryId = :categoryId, 
						subcategoryId = :subcategoryId, 
						modifyDate = :modifyDate`,
            ExpressionAttributeValues: {
              ":categoryId": transaction.categoryId,
              ":subcategoryId": transaction.subcategoryId,
              ":modifyDate": Date.now(),
            },
          },
        })
      );
    }
  }

  itemsLength = items.length;
  loopCount = Math.ceil(itemsLength / 25);
  for (let i = 0; i < loopCount; i++) {
    let params;
    const startIndex = i * 25;
    const endIndex = startIndex + 25;

    if (i === loopCount - 1) {
      params = { TransactItems: items.slice(startIndex) };
    } else {
      params = { TransactItems: items.slice(startIndex, endIndex) };
    }
    await dynamoDb.transactWrite(params);
  }
  return { status: true };
});
