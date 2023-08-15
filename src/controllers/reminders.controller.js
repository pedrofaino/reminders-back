import { Reminder } from "../models/Reminder.js";
import { transporter } from "../utils/mailer.js";

export const getReminders = async (req, res) => {
  try {
    const { query } = req.query;
    if(query===""){
      const reminders = await Reminder.find({ uid: req.uid });
      return res.json({reminders})
    }
    const reminders = await Reminder.find({ uid: req.uid, description:{$regex:query, $options:"i"} });
    return res.json({ reminders });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "error de servidor" });
  }
};

export const getReminder = async (req, res) => {
  try {
    const { id } = req.params;
    const reminder = await Reminder.findById(id);

    if (!reminder)
      return res.status(404).json({ error: "No existe el reminder." });

    if (!reminder.uid.equals(req.uid))
      return res.status(401).json({ error: "No le pertenece ese id." });

    return res.json({ reminder });
  } catch (error) {
    console.log(error);
    if (error.kind === "ObjectId") {
      return res.status(403).json({ error: "Formato id incorrecto." });
    }
    return res.status(500).json({ error: "Error de servidor." });
  }
};

export const createReminder = async (req, res) => {
  try {
    const { description, date, when, other, email, yesterday, week } = req.body;
    const reminder = new Reminder({
      description,
      date,
      when,
      other,
      uid: req.uid,
      yesterday,
      week,
    });
    const newReminder = await reminder.save();
    whenReminder(description, date, when, email, other, yesterday, week);
    return res.status(201).json({ newReminder });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "error de servidor" });
  }
};

export const removeReminder = async (req, res) => {
  try {
    const { id } = req.params;
    const reminder = await Reminder.findById(id);

    if (!reminder)
      return res.status(404).json({ error: "No existe el reminder." });

    if (!reminder.uid.equals(req.uid))
      return res.status(401).json({ error: "No le pertenece ese id." });

    await reminder.deleteOne();

    return res.status(200).json({ message: "El recordatorio fue eliminado." });
  } catch (error) {
    console.log(error);
    if (error.kind === "ObjectId") {
      return res.status(403).json({ error: "Formato id incorrecto." });
    }
    return res.status(500).json({ error: "Error de servidor." });
  }
};

export const updateReminder = async (req, res) => {
  try {
    const { id } = req.params;
    const { description, date, when, other, email, yesterday, week } = req.body;

    const reminder = await Reminder.findById(id);

    if (!reminder)
      return res.status(404).json({ error: "No existe el reminder." });

    if (!reminder.uid.equals(req.uid))
      return res.status(401).json({ error: "No le pertenece ese id." });

    reminder.description = description;
    reminder.date = date;
    reminder.when = when;
    reminder.other = other;
    reminder.yesterday = yesterday;
    reminder.week = week;

    await reminder.save();

    whenReminder(description, date, when, email, other, yesterday, week);

    return res.json({ message: "El reminder fue actualizado." });
  } catch (error) {
    console.log(error);
    if (error.kind === "ObjectId") {
      return res.status(403).json({ error: "Formato id incorrecto." });
    }
    return res.status(500).json({ error: "Error de servidor." });
  }
};

export const whenReminder = (
  description,
  date,
  when,
  email,
  other,
  yesterday,
  week
) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const timeZoneOffset = date.getTimezoneOffset() * 60000;
    const adjustedDate = new Date(date.getTime() + timeZoneOffset);
    const options = {
      month: "2-digit",
      day: "2-digit",
    };
    return adjustedDate.toLocaleDateString("es-ES", options);
  };

  setInterval(() => {
    const currentDate = formatDate(new Date());
    const targetDate = formatDate(when);
    const dat = formatDate(date);

    if (week === true) {
      const previousDate = new Date(date);
      const dayF = formatDate(previousDate.setDate(previousDate.getDate() - 7));
      if (dayF === currentDate) {
        sendEmailNotification(email, description, other, dat);
      }
    }

    if (yesterday === true) {
      const previousDate = new Date(date);
      const dayF = formatDate(previousDate.setDate(previousDate.getDate() - 1));
      if (dayF === currentDate) {
        sendEmailNotification(email, description, other, dat);
      }
    }

    if (currentDate === targetDate) {
      sendEmailNotification(email, description, other, dat);
    }

    if (currentDate === dat) {
      sendEmailNotification(email, description, other, dat);
    }
  }, 24 * 60 * 60 * 1000);
};

export const sendEmailNotification = async (
  email,
  description,
  other,
  date
) => {
  try {
    await transporter.sendMail({
      from: '"New Reminder" <reminders.new.info@gmail.com>', // sender address
      to: email, // list of receivers
      subject: "Recordatorio", // Subject line
      text: "Recuerda que tiene tal recordatorio", // plain text body
      html: other
        ? `<b>Recorda que tenes el día ${date} tenes: ${description}, y que pensaste esto: ${other}<b>`
        : `<b>Recorda que tenes el: ${description}<b>`, // html body
    });
  } catch (error) {
    console.log(error);
  }
};
