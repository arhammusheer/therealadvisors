// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method
const { default: axios } = require("axios");
const jwt = require("jsonwebtoken");

const handler = async (event) => {
  try {
    const token = event.queryStringParameters.token;
    const payload = jwt.verify(token, process.env.SECRET);
    if (payload) {
      console.info("invoking discord verification");
      const instance = await axios({
        url: `https://discord.com/api/guilds/${process.env.GUILD_ID}/members/${payload.id}/roles/${process.env.ROLE_ID}`,
        method: "PUT",

        headers: {
          Authorization: `Bot ${process.env.BOT_TOKEN}`,
          "Content-Type": "application/json",
        },
      }).catch((err) => {
        throw err;
      });

      const logging = await axios
        .post(
          `https://discord.com/api/webhooks/${process.env.WEBHOOK_ID}/${process.env.WEBHOOK_TOKEN}`,
          {
            content: `<@${payload.id}> has been verified.`,
          }
        )
        .catch((err) => {
          throw err;
        });

      return {
        statusCode: 204,
        body: instance.statusText,
      };
    }
    return {
      statusCode: 401,
      body: JSON.stringify({ error: "Invalid token" }),
    };
  } catch (error) {
    console.error(error);
    return { statusCode: 500, body: error.toString() };
  }
};

module.exports = { handler };
