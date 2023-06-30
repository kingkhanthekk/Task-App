const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

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
