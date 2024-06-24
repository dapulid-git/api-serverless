import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocument.from(client);

const tableName = process.env.USER_TABLE;

export const putItemHandler = async (event) => {
    if (event.httpMethod !== 'POST') {
        throw new Error(`postMethod only accepts POST method, you tried: ${event.httpMethod} method.`);
    }

    const body = JSON.parse(event.body);
    const usr_id = body.usr_id;
    const name = body.name;
    var response = {};


    var getParams = {
        TableName: tableName,
        Key: { usr_id: usr_id }
    };

    var putParams = {
        TableName: tableName,
        Item: {
            usr_id: usr_id,
            name: name
        }
    };

    try {
        const getData = await ddbDocClient.get(getParams);

        if (getData.Item) {
            if (getData.Item.usr_id === usr_id) {
                response = {
                    statusCode: 400,
                    body: JSON.stringify({
                        title: "Bad Request",
                        code: 400,
                        detail: `User with id: ${getData.Item.usr_id} is already registered.`
                    })
                };
            }
        } else {
            await ddbDocClient.put(putParams);

            response = {
                statusCode: 201,
                body: JSON.stringify({
                    detail: `User: ${name} with id: ${usr_id} was created successfully`
                })
            };
        }

    } catch (err) {
        throw new Error(err.stack);
    }

    return response;
};
