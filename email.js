const sgMail = require("@sendgrid/mail");
const api_key =
  "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";

sgMail.setApiKey(api_key);

const sendWelcomeEmail = (username, emailAddress) => {
  sgMail.send({
    to: emailAddress,
    from: "abul.kalam.work369@gmail.com",
    subject: "Thanks for joining in!",
    text: `Welcome to the Task App ${username}.`,
  });
};

const sendCancelEmail = (username, emailAddress) => {
  sgMail.send({
    to: emailAddress,
    from: "abul.kalam.work369@gmail.com",
    subject: "Successfully unsubscribed!",
    text: `It is sad to hear that you have unsubscribed from Task App. ${username}, let us know why you made that decision`,
  });
};

module.exports = {
  sendWelcomeEmail,
  sendCancelEmail,
};
