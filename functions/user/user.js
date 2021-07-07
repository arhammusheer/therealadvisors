// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method
const { default: axios } = require("axios");
const jwt = require("jsonwebtoken");

const handler = async (event) => {
  try {
    const token = extractCookies(event.headers.cookie).jwt;
    const payload = jwt.verify(token, process.env.SECRET);
    // await axios.put(
    //   `https://discord.com/api/guilds/${process.env.GUILD_ID}/members/${token.user.id}/roles/${process.env.ROLE_ID}`,
    //   { Authorization: `Bot ${process.env.BOT_TOKEN}` }
    // );
    return {
      statusCode: 200,
      body: JSON.stringify(payload.user),
      // // more keys you can return:
      // headers: { "headerName": "headerValue", ... },
      // isBase64Encoded: true,
    };
  } catch (error) {
    return { statusCode: 500, body: error.toString() };
  }
};

function extractCookies(cookieStr) {
  return cookieStr
    .match(/(^|(?<=, ))[^=;,]+=[^;]+/g)
    .map((cookie) => cookie.split("=").map((v) => v.trim()))
    .filter((v) => v[0].length && v[1].length)
    .reduce((builder, cur) => {
      builder[cur[0]] = cur[1];
      return builder;
    }, {});
}

module.exports = { handler };
