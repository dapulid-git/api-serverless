import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, GetCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);

const tableName = process.env.SAMPLE_TABLE;

export const putItemHandler = async (event) => {
    /*if (event.httpMethod !== 'POST') {
        throw new Error(`postMethod only accepts POST method, you tried: ${event.httpMethod} method.`);
    }*/

    /*const body = JSON.parse(event.body);

    const id = body.id;
    const name = body.name;

    var params = {
        TableName: tableName,
        Item: { id: id, name: name }
    };

    try {
        const data = await ddbDocClient.send(new PutCommand(params));
    } catch (err) {
        throw new Error(err.stack);
    }

    const response = {
        statusCode: 200,
        body: JSON.stringify(body)
    };*/

    const id = event.pathParameters.id;
    const response = {};

    var params = {
        TableName: tableName,
        Key: { id: id },
    };

    try {
        const data = await ddbDocClient.send(new GetCommand(params));
        var item = data.Item;
    } catch (err) {
        console.log("Error", err);
    }

    response = {
        statusCode: 200,
        body: JSON.stringify(item)
    };

    return response;
};
