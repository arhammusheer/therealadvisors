const sgMail = require("@sendgrid/mail");
const jwt = require("jsonwebtoken");

const BASE_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8888"
    : process.env.BASE_URL;
const ENDPOINT =
  process.env.NODE_ENV === "development" ? "/.netlify/functions" : "/api";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const handler = async (event) => {
  if (event.httpMethod === "POST") {
    if (!event.headers.cookie) {
      return {
        statusCode: 400,
        body: "Missing cookie",
      };
    }
    try {
      const token = extractCookies(event.headers.cookie).jwt;

      const payload = jwt.verify(token, process.env.SECRET, {
        expiresIn: "1h",
      });
      if (payload) {
        const newPayload = jwt.sign(
          { collegEmail: event.body.email, id: payload.user.id },
          process.env.SECRET
        );
        console.log(JSON.parse(event.body).email);

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
        sgMail
          .send(msg)
          .then(() => {
            console.log("Email sent");
          })
          .catch((error) => {
            console.error(error);
          });
        return {
          statusCode: 200,
          body: "Email Sent",
        };
      }
      return {
        statusCode: 401,
        body: "Invalid token",
      };
    } catch (error) {
      return { statusCode: 500, body: error.toString() };
    }
  } else {
    return {
      statusCode: 405,
      body: "Method not allowed",
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
