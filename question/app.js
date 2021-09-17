const uuid = require('uuid');

const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB({ apiVersion: '2012-08-10' });
const documentClient = new AWS.DynamoDB.DocumentClient();


module.exports.getQuestion = async (event) => {
    try {
        const ID = event.pathParameters.id;
        const params = {
            TableName: 'question',
            Key: {
                id: ID
            }
        };
        let data;
        try {
            data = await documentClient.get(params).promise();
        } catch (err) {
            data = err.toString();
        }
        return {
            'statusCode': 200,
            'body': data
        };
    } catch (err) {
        return {
            'statusCode': 500,
            'body': err.toString()
        };
    }
}

module.exports.createQuestion = async (event) => {
    try {
        const obj = event.body;
        const ID = uuid.v1();
        const ANSWER = obj.answer;
        const NAME = obj.name;
        const QUESTION = obj.question;
        const WRONG_ANSWERS = obj.wrongAnswers;
        const params = {
            TableName: 'question',
            Item: {
                id: ID,
                answer: ANSWER,
                question: QUESTION,
                wrongAnswers: WRONG_ANSWERS
            }
        };
        let data;
        let msg;
        try {
            data = await documentClient.put(params).promise();
            msg = 'Item entered successfully';
        } catch (err) {
            msg = err.toString();
        }
        return {
            'statusCode': 200,
            'body': {
                msg: msg,
                data: params
            }
        };

    } catch (err) {
        return {
            'statusCode': 500,
            'body': err.toString()
        };
    }
}

module.exports.editQuestion = async (event) => {
    try {
        var params = {
            TableName: 'question',
            Key: {
                id: event.pathParameters.id
            },
            ExpressionAttributeValues: {},
            ExpressionAttributeNames: {},
            UpdateExpression: "",
            ReturnValues: "UPDATED_NEW"
        };

        let prefix = "set ";
        let attributes = Object.keys(event.body);
        for (let i = 0; i < attributes.length; i++) {
            let attribute = attributes[i];
            if (attribute != 'id') {
                params["UpdateExpression"] += prefix + "#" + attribute + " = :" + attribute;
                params["ExpressionAttributeValues"][":" + attribute] = event.body[attribute];
                params["ExpressionAttributeNames"]["#" + attribute] = attribute;
                prefix = ", ";
            }
        }
        const body = await documentClient.update(params).promise();

        return {
            statusCode: 200,
            body
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: error.toString()
        };
    }
};