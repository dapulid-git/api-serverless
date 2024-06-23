import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);

const tableName = process.env.SAMPLE_TABLE;

export const putItemHandler = async (event) => {
    if (event.httpMethod !== 'POST') {
        throw new Error(`postMethod only accepts POST method, you tried: ${event.httpMethod} method.`);
    }

    const body = JSON.parse(event.body);

    const id = body.id;
    const name = body.name;

    const response = {};

    var getUserByIdParams = {
        TableName: tableName,
        Key: { id: id },
    };

    var params = {
        TableName: tableName,
        Item: { id: id, name: name }
    };

    try {
        const requestUserId = await ddbDocClient.send(new GetCommand(getUserByIdParams));

        if (requestUserId.Item.id === id) {
            response = {
                statusCode: 400,
                body: {
                    title: "Bad Request",
                    description: `user with id ${JSON.stringify(body.id)} is already created`
                }
            }
        } else {
            const data = await ddbDocClient.send(new PutCommand(params));

            response = {
                statusCode: 200,
                body: {
                    title: "OK",
                    description: `User: ${JSON.stringify(body.name)} created successfully`
                }
            };

        }
    } catch (err) {
        console.log("Error", err);
    }

    return response;
};
