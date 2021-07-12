const jwt = require("jsonwebtoken");
const sgMail = require("@sendgrid/mail");

const BASE_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8888"
    : process.env.BASE_URL;

const ENDPOINT =
  process.env.NODE_ENV === "development" ? "/.netlify/functions" : "/api";

const handler = async (event) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  if (!event.headers.cookie) {
    return callback({
      statusCode: 400,
      body: "Missing cookie",
    });
  }
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: `{"message":"Method Not Allowed"}`,
    };
  }
  const token = extractCookies(event.headers.cookie).jwt;
  try {
    const payload = jwt.verify(token, process.env.SECRET);
    const newPayload = jwt.sign(
      { collegEmail: event.body.email, id: payload.user.id },
      process.env.SECRET,
      {
        expiresIn: "1h",
      }
    );

    const msg = {
      to: JSON.parse(event.body).email, // Change to your recipient
      // to: payload.user.email,
      from: "therealadvisors@croissant.ml", // Change to your verified sender
      subject: "Verification Email",
      text: `
Hey there ${payload.user.username}#${payload.user.discriminator}!

Please verify your email by clicking the link below.
${BASE_URL}${ENDPOINT}/verify?token=${newPayload}

This link will expire in 1 hour.

Thanks

Team Real Advisors
        `,
    };

    try {
      console.log("Trying to send an email");
      sgMail
        .send(msg)
        .then(() => {
          console.info(`Email sent to ${msg.to}`);
        })
        .catch((err) => {
          console.error(err);
          throw err;
        });
      return {
        statusCode: 204,
        body: `{"message":"Sent"}`,
      };
    } catch (err) {
      console.error(err);
      return {
        statusCode: 500,
        body: `{message:"Unable to Send email due to an internal server error"}`,
      };
    }
  } catch (error) {
    console.error(error);
    return {
      statusCode: 419,
      body: `{"message":"Auth not valid", reason:${error}}`,
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
