import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocument.from(client);

const tableName = process.env.USER_TABLE;

export const getByIdHandler = async (event) => {

  const usr_id = event.pathParameters.usr_id;

  var params = {
    TableName: tableName,
    Key: { usr_id: usr_id },
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
    };
    return response;
  };

  try {
    const data = await ddbDocClient.get(params);
    var item = data.Item;

    var response = {
      statusCode: 200,
      body: JSON.stringify(item)
    };

    return response;

  } catch (err) {
    return formatError(err);
  }

};
