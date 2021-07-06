const Discord = require("discord.js");

const handler = async function () {
  try {
    const webhookClient = new Discord.WebhookClient(
      process.env.WEBHOOK_ID,
      process.env.WEBHOOK_TOKEN
    );
    const embed = new Discord.MessageEmbed()
      .setTitle("Croissant Verified")
      .setColor("#0099ff");

    webhookClient.send("Croissant verification", {
      username: "croissant",
      embeds: [embed],
    });
    return {
      statusCode:200,
      body:"Success"
    }
  } catch (error) {
    // output to netlify function log
    console.log(error);
    return {
      statusCode: 500,
      // Could be a custom message or object i.e. JSON.stringify(err)
      body: JSON.stringify({ msg: error }),
    };
  }
};

module.exports = { handler };
