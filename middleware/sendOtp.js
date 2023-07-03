const nodemailer = require("nodemailer");
// const ejs = require("ejs");
const SendOtp = async (email, otp, name) => {
console.log("otp",otp)
console.log("name",name)
  //   console.log("email", email);

  // Sending Otp to phone number
  // const accountSid = process.env.TWILIO_ACCOUNT_SID;
  // const authToken = process.env.TWILIO_AUTH_TOKEN;
  // const phone_no = process.env.TWILIO_PHONE_NUMBER;
  // const client = twilio(accountSid, authToken);

  // if (number) {
  //   console.log('+=====+++++++++++++++++++++++',number)
  //   await client.messages
  //     .create({
  //       body: `Your Otp is ${otp}`,
  //       from: phone_no,
  //       to: number,
  //     })
  //     .then((message) => console.log(message.sid))
  //     .done();
  // }

  // console.log("result", result);

  // Sending Otp to email
  var transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Otp",
    html: `<div><span>Hello ${name}</span>
    <br /><br />
    <span>
      Thank you for choosing Audio Guide. Use the following OTP to complete your
      Sign Up procedures.
    </span>
    <br /><br />
    <b>${otp}</b>
    <br /><br />
    <span>If you didn’t request this, you can ignore this email.</span>
    <br /><br />
    <span>
      Remember, no one from audio guide Ltd ("audio guide") will ever contact
      you, either by email or phone, to request your password.
    </span>
    <br /><br />
    <span>
      Regards,<br />
      Audio Guide Ltd
    </span></div>`,
  };
  if (email) {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log("Otp sent your email:", info.messageId, info.response);
    });
  }
};

module.exports = SendOtp;
