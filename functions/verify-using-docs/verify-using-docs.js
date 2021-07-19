// details: https://markus.oberlehner.net/blog/implementing-an-authentication-flow-with-passport-and-netlify-functions/

const cookieParser = require("cookie-parser");
const express = require("express");
const serverless = require("serverless-http");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const Discord = require("discord.js");
const fs = require('fs');

const { COOKIE_SECURE, ENDPOINT } = require("./utils/config");

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use((req, res, next) => {
  try {
    const token = req.cookies.jwt;
    const payload = jwt.decode(token, process.env.SECRET);
    req.user = payload.user;
    if (payload) next();
  } catch (e) {
    res.json(e).status(401);
  }
});

app.post(
  `${ENDPOINT}/verify-using-docs`,
  upload.single("file"),
  async (req, res) => {
    console.log(req.file);
    if (
      !req.file.mimetype.startsWith("image/") &&
      !req.file.mimetype.includes("pdf")
    ) {
      return res
        .json({
          error: "Only PDF and image files are allowed.",
        })
        .status(422);
    }
    try {
    fs.writeFileSync("./upload", req.file.buffer);
      res.json({ ok: true });
      // const client = new Discord.Client();
      // client.once("ready", () => {
      //   const channel = client.channels.cache.get(process.env.CHANNEL_ID);
      //   const embed = new Discord.MessageEmbed()
      //     .setTitle(`Verification Request`)
      //     .setColor("#0099ff")
      //     .setAuthor(`${req.user.username}#${req.user.discriminator}`)
      //     .setTimestamp();
      //   const attachment = new Discord.MessageAttachment(
      //     req.file.buffer,
      //     req.file.originalname
      //   );
      //   channel
      //     .send({ embed, files: [attachment] })
      //     .then(() => {})
      //     .then(() => client.destroy())
      //     .then(() => res.json({ success: true }));
      // });
      // client.login(process.env.BOT_TOKEN);
    } catch (e) {
      console.error("==ERROR==");
      console.error(e);
      return res.json(e).status(e.response.status);
    }
  }
);

const handler = serverless(app);

module.exports = { handler };
