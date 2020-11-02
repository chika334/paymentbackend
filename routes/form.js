const nodemailer = require('nodemailer');
const express = require('express')
const router = express.Router()

router.post('/contact', (req, res) => {
  async function main() {

  const {email, name, message} = req.body;

  const output = `
    <p>You have a new contact request</p>
    <h3>Contact Details</h3>
    <ul>
      <li>Email: ${email}</li>
      <li>Name: ${name}</li>
    </ul>
    <h3>Message</h3>
    ${message}
  `;

  // / async..await is not allowed in global scope, must use a wrapper

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: `neilbloguser@gmail.com`, // generated ethereal user
      pass: 'johnCENA19', // generated ethereal password
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: email, // sender address
    to: process.env.EMAIL_TO, // list of receivers
    subject: `Request message from ${email} neilblog user`, // Subject line
    text: "Hello world?", // plain text body
    html: output, // html body
  })
  .then(sent => {
    return res.json({
      success: true
    })
  })
}

main().catch(console.error);

})

module.exports = router
