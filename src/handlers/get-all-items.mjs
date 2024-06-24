import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocument.from(client);

const tableName = process.env.USER_TABLE;

export const getAllItemsHandler = async (event) => {

    var params = {
        TableName: tableName
    };

    try {
        const data = await ddbDocClient.scan(params);
        var items = data.Items;

        const response = {
            statusCode: 200,
            body: JSON.stringify(items)
        };

        return response;

    } catch (err) {
        console.log("Error", err);
    }
}
