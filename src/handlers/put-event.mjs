import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocument.from(client);

const tableName = process.env.EVENT_TABLE;

export const putEventHandler = async (event) => {
    if (event.httpMethod !== 'POST') {
        throw new Error(`postMethod only accepts POST method, you tried: ${event.httpMethod} method.`);
    }

    const body = JSON.parse(event.body);

    const evn_id = body.evn_id;
    const usr_id = body.usr_id;
    const name = body.name;

    var response = {};

    var getParams = {
        TableName: tableName,
        Key: { evn_id: evn_id }
    };

    var putParams = {
        TableName: tableName,
        Item: {
            evn_id: evn_id,
            usr_id: usr_id,
            name: name
        }
    };

    try {
        const getData = await ddbDocClient.get(getParams);

        if (getData.Item) {
            if (getData.Item.evn_id === evn_id) {
                response = {
                    statusCode: 400,
                    body: JSON.stringify({
                        title: "Bad Request",
                        code: 400,
                        detail: `The event with id: ${getData.Item.evn_id} is already registered.`
                    })
                };
            }
        } else {
            await ddbDocClient.put(putParams);

            response = {
                statusCode: 201,
                body: JSON.stringify({
                    detail: `Event: ${name} with id: ${evn_id} was created successfully`
                })
            };
        }

    } catch (err) {
        throw new Error(err.stack);
    }

    return response;
};
