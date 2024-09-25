const nodemailer = require('nodemailer');

class EmailClient {
  constructor(user) {
    this.user = user;
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user,
        pass: process.env.GTP,
        port: 465
      }
    });
  }

  async mailMe(args) {
    const { to, subject, token, uri } = args;
    const url = uri || "https://provisionspall-hwvs.onrender.com/dashboard"

    // The html content
    const html = `<html>
    <body>
        <h1 style="color: blue;">Delivery - Business Application</h1>
        <br>
        <p>Copy this token and paste it in the
            <a href=${ url }> reset password page </a></p>
        <code>${ token }</code>
        <h1>OR</h1>
        <p>Directly update your password <a href="${ url }?token=${ token }"> here</a>.</p>
    </body>
    </html>`
    const mailOptions = {
      from: this.user,
      to,
      subject,
      html
    };

    this.transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
      console.log('Email sent: ' + info.response);
      }
    });
  }
}

const emailClient = new EmailClient('chinonsodomnic@gmail.com');
module.exports = emailClient;
