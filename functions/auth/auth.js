// details: https://markus.oberlehner.net/blog/implementing-an-authentication-flow-with-passport-and-netlify-functions/

const cookieParser = require("cookie-parser");
const express = require("express");
const passport = require("passport");
const serverless = require("serverless-http");

const { applyPassportStrategies } = require("./utils/auth");
const { COOKIE_SECURE, ENDPOINT } = require("./utils/config");

applyPassportStrategies();

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

const handleCallback = (req, res) => {
  res
    .cookie("jwt", req.user.jwt, { httpOnly: true, COOKIE_SECURE })
    .redirect("/dashboard");
};

app.get(
  `${ENDPOINT}/discord`,
  passport.authenticate("discord", { session: false })
);
app.get(
  `${ENDPOINT}/discord/callback`,
  passport.authenticate("discord", { failureRedirect: "/", session: false }),
  handleCallback
);

const handler = serverless(app);

module.exports = { handler };
