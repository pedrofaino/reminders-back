import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: 'reminders.new.info@gmail.com',
      pass: 'vfrfwmidqynreysr'
    }
  });

  transporter.verify().then(()=>{
    console.log("ready to send emails");
  });