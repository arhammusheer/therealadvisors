// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method
const { default: axios } = require("axios");
const jwt = require("jsonwebtoken");

const handler = async (event) => {
  try {
    const token = event.queryStringParameters.token;
    const payload = jwt.verify(token, process.env.SECRET);
    // let responseData = {};
    if (payload) {
      console.info("invoking discord verification");
      let responseData = {};
      const request = await axios({
        url: "https://discord.com/api/guilds/${process.env.GUILD_ID}/members/${payload.id}/roles/${process.env.ROLE_ID}",
        method: "PUT",
        
        headers: {
          Authorization: `Bot ${process.env.BOT_TOKEN}`,
          "Content-Type": "application/json",
        },
      });

      const response = await instance.then((response) =>
        console.log(response.statusText)
      );
      return {
        statusCode: response.statusCode,
        body: response.statusText,
      };
    }
    return {
      statusCode: 401,
      body: JSON.stringify({ error: "Invalid token" }),
    };
  } catch (error) {
    return { statusCode: 500, body: error.toString() };
  }
};

module.exports = { handler };
