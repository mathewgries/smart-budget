import handler from '../../util/handler';
import dynamodb from '../../util/dynamodb';

export const main = handler(async (event) => {
    const data = JSON.parse(event.body);
    const userId = event.requestContext.authorizer.iam.cognitoIdentity.identityId;

    const params = {
        TableName: process.env.TABLE_NAME,
        Key: {
            PK: `USER#${userId}`,
            SK: `USER#${userId}#INFO`,
        },
        UpdateExpressoin: `SET username = :username, email = :email, dateOfBirth = :dateOfBirth, modifyDate = :modifyDate`,
        ExpressionAttributeValues: {
            ":username": data.username || null,
            ":email": data.email || null,
            ":dateOfBirth": data.dateOfBirth,
            ":modifyDate": Date.now(),

        },
        ReturnValues: "ALL_NEW",
    };

    await dynamodb.update(params);

    return { status: true };
})