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
    Delete: {
      TableName: process.env.TABLE_NAME,
      Key: {
        PK: `USER#${userId}`,
        SK: `CATEGORY#${category.id}`,
      },
    },
  });

  if (transactions.length > 0) {
    transactions.forEach((transactions) =>
      items.push({
        Update: {
          TableName: process.env.TABLE_NAME,
          Key: {
            PK: `USER#${userId}`,
            SK: `TRANS#SPENDING#${transactions.id}`,
          },
          UpdateExpression: `SET 
					categoryName = :categoryName, 
					categoryId = :categoryId, 
					subcategory = :subcategory, 
					modifyDate = :modifyDate`,
          ExpressionAttributeValues: {
            ":categoryName": "",
            ":categoryId": "",
            ":subcategory": "",
            ":modifyDate": Date.now(),
          },
        },
      })
    );
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
