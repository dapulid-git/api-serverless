import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocument.from(client);

const tableName = process.env.EVENT_TABLE;

export const putEventHandler = async (event) => {

    const { usr_id, name, category } = JSON.parse(event.body);

    var getEventParam = {
        TableName: tableName,
        Key: {
            usr_id: usr_id,
            name: name
        }
    };

    var getAllEventsParams = {
        TableName: tableName,
        KeyConditionExpression: "usr_id = :a",
        ExpressionAttributeValues: {
            ":a": usr_id
        }
    };

    var putParams = {
        TableName: tableName,
        Item: {
            usr_id: usr_id,
            name: name,
            category: category
        }
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
        let response = {};

        const getALLEvents = await ddbDocClient.query(getAllEventsParams);
        const getDataEvent = await ddbDocClient.get(getEventParam);

        if (getDataEvent.Item) {
            if (name === getDataEvent.Item.name) {
                response = {
                    statusCode: 400,
                    body: JSON.stringify({
                        detail: `The event with name: ${name} is already registered.`
                    })
                };
                return response;
            }
        } else {
            if (getALLEvents.Count >= 2) {
                response = {
                    statusCode: 400,
                    body: JSON.stringify({
                        detail: `User ${usr_id} cannot create more events`
                    })
                };
                return response;
            } else {
                await ddbDocClient.put(putParams);
                response = {
                    statusCode: 400,
                    body: JSON.stringify({
                        detail: `Event: ${name} was created successfully`
                    })
                };
                return response;
            }
        }
    } catch (error) {
        return formatError(error);
    }
};