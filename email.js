const sgMail = require("@sendgrid/mail");
const api_key =
  "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";

sgMail.setApiKey(api_key);

sgMail
  .send({
    to: "abul.kalam.work369@gmail.com",
    from: "abul.kalam.work369@gmail.com",
    subject: "This is a test email",
    text: "Hello hello distik distik...",
  })
  .then(() => {
    console.log("Email sent.");
  })
  .catch((error) => {
    console.log(error.response.body);
  });
