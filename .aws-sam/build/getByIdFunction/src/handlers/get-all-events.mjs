import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocument.from(client);

const tableName = process.env.EVENT_TABLE;

export const getAllEventsHandler = async (event) => {

    var params = {
        TableName: tableName
    };

    var formatError = function (error) {
        var response = {
            "statusCode": error.statusCode,
            "headers": {
                "Content-Type": "text/plain",
                "x-amzn-ErrorType": error.code
            },
            "isBase64Encoded": false,
            "body": error.code + ": " + error.message
        }
        return response
    }

    try {
        const data = await ddbDocClient.scan(params);
        var items = data.Items;

        const response = {
            statusCode: 200,
            body: JSON.stringify(items)
        };

        return response;

    } catch (err) {
        return formatError(err);
    }

}
