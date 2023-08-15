import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      // TODO: replace `user` and `pass` values from <https://forwardemail.net>
      user: 'reminders.new.info@gmail.com',
      pass: 'gglmyskdmxniwvmm'
    }
  });

  transporter.verify().then(()=>{
    console.log("ready to send emails");
  });