
const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB({ apiVersion: '2012-08-10' });

const GET = 'GET';
const POST = 'POST';


module.exports.getQuestion = async (event) => {
    try {
        const obj = event.queryStringParameters;
        const ID = obj.id;
        const params = {
            TableName: 'question',
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
        };
    }
}

module.exports.createQuestion = async (event) => {
    try {
        const obj = event.body;
        const ID = obj.id;
        const ANSWER = obj.answer;
        const NAME = obj.name;
        const QUESTION = obj.question;
        const WRONG_ANSWERS = obj.wrongAnswers.map(ans => ({S: ans}));
        const params = {
            TableName: 'question',
            Item: {
                id: { S: ID },
                answer: { S: ANSWER },
                question: { S: QUESTION },
                wrongAnswers: { L: WRONG_ANSWERS }
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
            console.log("Params: ", params);
            msg = err;
        }
        return {
            'statusCode': 200,
            'body': {
                msg: msg,
                data: params
            }
        };

    } catch (err) {
        console.log(err);
        return {
            'statusCode': 500,
            'body': err
        };
    }
}

module.exports.editQuestion = async (event) => {
    try {
        var params = {
            TableName,
            Key: {
                id: event.pathParameters.id
            },
            ExpressionAttributeValues: {},
            ExpressionAttributeNames: {},
            UpdateExpression: "",
            ReturnValues: "UPDATED_NEW"
        };

        let prefix = "set ";
        let attributes = Object.keys(item);
        for (let i = 0; i < attributes.length; i++) {
            let attribute = attributes[i];
            if (attribute != idAttributeName) {
                params["UpdateExpression"] += prefix + "#" + attribute + " = :" + attribute;
                params["ExpressionAttributeValues"][":" + attribute] = item[attribute];
                params["ExpressionAttributeNames"]["#" + attribute] = attribute;
                prefix = ", ";
            }
        }
        const body = await documentClient.updateItem(params).promise();

        return {
            statusCode: 200,
            body
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: error
        };
    }
};