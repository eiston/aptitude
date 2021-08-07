
const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB({ apiVersion: '2012-08-10' });

const GET = 'GET';
const POST = 'POST';


const get = async (event) => {
    try {
        const obj = event.queryStringParameters;
        const ID = obj.id;
        const params = {
            TableName: 'user',
            Key: {
                id: { S: ID }
            }
        };
        let data;
        try {
            data = await ddb.getItem(params).promise();
            console.log("Item read successfully:", data);
        } catch (err) {
            console.log("Error: ", err);
            data = err;
        }
        return {
            'statusCode': 200,
            'body': data
        };
    } catch (err) {
        console.log(err);
        return {
            'statusCode': 500,
            'body': err
        };;
    }
}
const post = async (event) => {
    try {
        const obj = event.body;
        const ID = obj.id;
        const NAME = obj.name;
        const params = {
            TableName: 'user',
            Item: {
                id: { S: ID },
                name: { S: NAME }
            }
        };
        let data;
        let msg;
        try {
            data = await ddb.putItem(params).promise();
            console.log("Item entered successfully:", data);
            msg = 'Item entered successfully';
        } catch (err) {
            console.log("Error: ", err);
            msg = err;
        }
        return {
            'statusCode': 200,
            'body': msg
        };

    } catch (err) {
        console.log(err);
        return {
            'statusCode': 500,
            'body': err
        };
    }
}
exports.handler = async (event) => {
    const { httpMethod } = event;
    switch (httpMethod) {
        case POST:
            return await post(event);
        case GET:
            return await get(event)
        default:
            return {
                'statusCode': 404,
                'body': JSON.stringify({
                    message: 'method not implemented',
                })
            };
    }

};