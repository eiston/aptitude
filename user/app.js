
const AWS = require('aws-sdk');
const uuid = require('uuid');
const db = new AWS.DynamoDB({ apiVersion: '2012-08-10' });
const TableName = 'user';
const idAttributeName = 'id';


module.exports.getUser = async event => {
    try {
        const body = await db.getItem({
            TableName: 'user',
            Key: {
                id: { S: event.pathParameters.id }
            }
        }).promise();
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
}

module.exports.editProfile = async event => {
    try {
        var params = {
            TableName: 'user',
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


module.exports.signup = async event => {
    const Item = {
        id: { S: uuid.v1() },
        name: { S: event.body.name }
    }
    try {
        await db.putItem({
            TableName: 'user',
            Item
        }).promise();
        return {
            statusCode: 200,
            body: Item
        };

    } catch (error) {
        return {
            statusCode: 500,
            body: error
        };
    }
}

module.exports.deleteUser = async event => {
    try {
        await db.deleteItem({
            TableName,
            Key: {
                id: event.pathParameters.id
            }
        }).promise();

        return { statusCode: 200 };
    } catch (error) {
        return {
            statusCode: 500,
            body: error
        };
    }
};
