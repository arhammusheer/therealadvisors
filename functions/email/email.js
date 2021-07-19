const jwt = require("jsonwebtoken");
const sgMail = require("@sendgrid/mail");
const { default: axios } = require("axios");

const BASE_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8888"
    : process.env.URL;
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

    const alreadyVerifiedResponse = await axios({
      url: `https://discord.com/api/guilds/${process.env.GUILD_ID}/members/${payload.user.id}`,
      method: "GET",
      headers: {
        Authorization: `Bot ${process.env.BOT_TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    if (alreadyVerifiedResponse.data.roles.includes(process.env.ROLE_ID)) {
      return { statusCode: 200, body: "User already verified" };
    }

    const newPayload = jwt.sign(
      { collegEmail: event.body.email, id: payload.user.id },
      process.env.SECRET,
      {
        expiresIn: "1h",
      }
    );

    const msg = {
      to: JSON.parse(event.body).email, // Change to your recipient
      from: "therealadvisors@croissant.ml", // Change to your verified sender
      subject: "Verification Email",
      html: Template(payload.user, `${BASE_URL}/verify/${newPayload}`),
      text: `
Hey there ${payload.user.username}#${payload.user.discriminator}!

Please verify your email by clicking the link below.
${BASE_URL}/verify/${newPayload}

This link will expire in 1 hour.

Thanks

Team Real Advisors
        `,
    };

    try {
      console.log("Trying to send an email");
      await sgMail
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

const Template = (user, link) => `<!DOCTYPE html>
<!-- Set the language of your main document. This helps screenreaders use the proper language profile, pronunciation, and accent. -->
<html lang="en">
  <head>
    <!-- The title is useful for screenreaders reading a document. Use your sender name or subject line. -->
    <title>An Accessible Account Update Email</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <!-- Never disable zoom behavior! Fine to set the initial width and scale, but allow users to set their own zoom preferences. -->
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <style type="text/css">
        /* CLIENT-SPECIFIC STYLES */
        body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
        img { -ms-interpolation-mode: bicubic; }

        /* RESET STYLES */
        img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
        table { border-collapse: collapse !important; }
        body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; }

        /* iOS BLUE LINKS */
        a[x-apple-data-detectors] {
            color: inherit !important;
            text-decoration: none !important;
            font-size: inherit !important;
            font-family: inherit !important;
            font-weight: inherit !important;
            line-height: inherit !important;
        }

        /* GMAIL BLUE LINKS */
        u + #body a {
            color: inherit;
            text-decoration: none;
            font-size: inherit;
            font-family: inherit;
            font-weight: inherit;
            line-height: inherit;
        }

        /* SAMSUNG MAIL BLUE LINKS */
        #MessageViewBody a {
            color: inherit;
            text-decoration: none;
            font-size: inherit;
            font-family: inherit;
            font-weight: inherit;
            line-height: inherit;
        }

        /* These rules set the link and hover states, making it clear that links are, in fact, links. */
        /* Embrace established conventions like underlines on links to keep emails accessible. */
        a { color: #B200FD; font-weight: 600; text-decoration: underline; }
        a:hover { color: #000000 !important; text-decoration: none !important; }

        /* These rules adjust styles for desktop devices, keeping the email responsive for users. */
        /* Some email clients don't properly apply media query-based styles, which is why we go mobile-first. */
        @media screen and (min-width:600px) {
            h1 { font-size: 48px !important; line-height: 48px !important; }
            .intro { font-size: 24px !important; line-height: 36px !important; }
        }
    </style>
  </head>
  <body style="margin: 0 !important; padding: 0 !important;">

    <!-- Some preview text. -->
    <div style="display: none; max-height: 0; overflow: hidden;">
            
    </div>
    <!-- Get rid of unwanted preview text. -->
    <div style="display: none; max-height: 0px; overflow: hidden;">
    &nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;
    </div>

    <!-- This ghost table is used to constrain the width in Outlook. The role attribute is set to presentation to prevent it from being read by screenreaders. -->
    <!--[if (gte mso 9)|(IE)]>
    <table cellspacing="0" cellpadding="0" border="0" width="600" align="center" role="presentation"><tr><td>
    <![endif]-->
    <!-- The role and aria-label attributes are added to wrap the email content as an article for screen readers. Some of them will read out the aria-label as the title of the document, so use something like "An email from Your Brand Name" to make it recognizable. -->
    <!-- Default styling of text is applied to the wrapper div. Be sure to use text that is large enough and has a high contrast with the background color for people with visual impairments. -->
    <div role="article" aria-label="An email from Your Brand Name" lang="en" style="background-color: white; color: #2b2b2b; font-family: 'Avenir Next', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; font-size: 18px; font-weight: 400; line-height: 28px; margin: 0 auto; max-width: 600px; padding: 40px 20px 40px 20px;">
        
        <!-- Logo section and header. Headers are useful landmark elements. -->
        <header>
            <!-- Since this is a purely decorative image, we can leave the alternative text blank. -->
            <!-- Linking images also helps with Gmail displaying download links next to them. -->
            <a href="https://therealadvisors.netlify.app">
                <center><img src="//therealadvisors.netlify.app/logo.svg" style="background-color: #000000; border-radius: 100%" alt="" height="80" width="80"></center>
            </a>
            <!-- The h1 is the main heading of the document and should come first. -->
            <!-- We can override the default styles inline. -->
            <h1 style="color: #000000; font-size: 32px; font-weight: 800; line-height: 32px; margin: 48px 0; text-align: center;">
                Welcome to The Real Advisors
            </h1>
        </header>

        <!-- Main content section. Main is a useful landmark element. -->
        <main>
            <!-- This div is purely presentational, providing a container for the message. -->
            <div style="background-color: ghostwhite; border-radius: 4px; padding: 24px 48px;">
                <!-- This ghost table is used solely for padding in Word-based Outlook clients. -->
                <!--[if (gte mso 9)|(IE)]>
                <table cellspacing="0" cellpadding="0" border="0" width="600" align="center" role="presentation"><tr><td style="background-color: ghostwhite;font-family: 'Avenir Next', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; padding: 24px 48px 24px 48px;">
                <![endif]-->

                <!-- Body copy -->
                <p>
                    Hey there ${user.username}#${user.discriminator}
                    To get the verified role, we need to verify your email. To do that, you can just click the link below.
                </p>
        
                <!-- This link uses descriptive text to inform the user what will happen with the link is tapped. -->
                <!-- It also uses inline styles since some email clients won't render embedded styles from the head. -->
                <a href="${link}" style="color: #B200FD; text-decoration: underline;">Verify Email Now</a>

                <p>
                    If you think this email was sent in error, you can ignore this email, if you want to take further action, reply to this email. Thank you!  
                </p>
                <!--[if (gte mso 9)|(IE)]>
                </td></tr></table>
                <![endif]-->
            </div>
        </main>

        <!-- Footer information. Footer is a useful landmark element. -->
        <footer>
            <!-- Since this is a transactional email, you aren't required to include opt-out language. -->
            <p style="font-size: 16px; font-weight: 400; line-height: 24px; margin-top: 48px;">
                You received this email because you are trying to get verified on our discord server.
            </p>
    
            <!-- The address element does exactly what it says. By default, it is block-level and italicizes text. You can override this behavior inline. -->
            <address style="font-size: 16px; font-style: normal; font-weight: 400; line-height: 24px;">
                <strong>Your Friends:</strong> The Real Advisors Team
            </address>
        </footer>

    </div>
    <!--[if (gte mso 9)|(IE)]>
    </td></tr></table>
    <![endif]-->
  </body>
</html>`;

module.exports = { handler };
