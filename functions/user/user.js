// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method
const jwt = require("jsonwebtoken");

const handler = async (event) => {
  if (!event.headers.cookie) {
    return {
      statusCode: 400,
      body: `{ message: "Missing cookie" }`,
    };
  }
  const token = extractCookies(event.headers.cookie).jwt;
  if (!token) {
    return {
      statusCode: 401,
      body: `{ message: "No token Provided" }`,
    };
  }
  const payload = jwt.verify(token, process.env.SECRET);
  if (payload) {
    return {
      statusCode: 200,
      body: JSON.stringify(payload.user),
      // // more keys you can return:
      // headers: { "headerName": "headerValue", ... },
      // isBase64Encoded: true,
    };
  } else {
    return {
      statusCode: 401,
      body: `{ message: "Invalid Token, Login has expired" }`,
    };
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
