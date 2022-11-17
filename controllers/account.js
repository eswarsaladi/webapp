const Account = require("../models/account");
const { v4: uuidv4 } = require("uuid");
const { dynamodb, sns, ddb } = require("../awsConfig");
const logger = require("../utils/logger");

async function get(request, response) {
  const { accountId } = request.params;
  const { username } = request.user;

  const userDetails = await Account.get(accountId, username);
  if (userDetails.response && userDetails.response["first_name"])
    response.status(200).json({ ...userDetails.response });
  else response.status(403).json({ error: "Forbidden" });
}

async function update(request, response) {
  const { accountId } = request.params;
  const { username } = request.user;
  const userDetails = request.body;

  const result = await Account.update(accountId, username, userDetails);
  response.status(200).json({ result });
}

async function create(request, response) {
  const userDetails = request.body;
  const result = await Account.create(userDetails);

  // add to dynamodb
  const table = "csye6225";
  const expires = new Date(Date.now() + 5 * 60 * 1000);

  const dynamoParams = {
    TableName: table,
    Item: {
      id: userDetails.username,
      token: uuidv4(),
      expiry: Math.floor(expires.getTime() / 1000),
    },
  };
  const dynamodata = await dynamodb.put(dynamoParams);
  logger.info("added item", JSON.stringify(dynamodata));

  // publish to sns topic
  const snsParams = {
    Message: userDetails.username,
    TopicArn: process.env.SNS_TOPIC_ARN,
  };

  await sns.publish(snsParams).promise();
  logger.info("username sent to topic");

  if (result.error) {
    response.status(400).json({ error: result.error });
  } else {
    response.status(200).json({ ...result.response });
  }
}

async function verifyToken(request, response) {
  try {
    const { email, token } = request.params;

    if (email == undefined || token == undefined) {
      response.status(400).json({ error: "Invalid Email or token" });
      return;
    }

    let queryParams = {
      TableName: "csye6225",
      Key: {
        id: { S: email },
      },
    };

    const data = await ddb.getItem(queryParams).promise();

    const t = Object.values(data.Item.token)[0];
    if (token !== t) {
      return response.status(400).json({ error: "Token invalid" });
    }

    if (Math.floor(Date.now() / 1000) > data.Item.expiryDate.N) {
      return res.status(400).json({ error: "Token Expired" });
    }

    await Account.updateWithUsername(email, { is_verified: true });

    return response.status(200).send("Successfully Verified");
  } catch (error) {
    return response.status(400).json({ error: error.toString() });
  }
}

module.exports = { get, update, create, verifyToken };
