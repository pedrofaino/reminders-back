import { Reminder } from "../models/Reminder.js";

export const getReminders = async (req, res) => {
  try {
    const reminders = await Reminder.find({ uid: req.uid });
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

    if (!reminder) return res.status(404).json({ error: "No existe el reminder." });

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
    const { description, date, when } = req.body;
    const reminder = new Reminder({ description , date, when, uid: req.uid });
    const newReminder = await reminder.save();
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

    if (!reminder) return res.status(404).json({ error: "No existe el reminder." });
    
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
    const {description, date, when} = req.body;

    const reminder = await Reminder.findById(id);

    if (!reminder) return res.status(404).json({ error: "No existe el reminder." });

    if (!reminder.uid.equals(req.uid))
      return res.status(401).json({ error: "No le pertenece ese id." });

    reminder.description = description;
    reminder.date = date;
    reminder.when = when;

    await reminder.save();

    return res.json({ message: "El reminder fue actualizado." });
  } catch (error) {
    console.log(error);
    if (error.kind === "ObjectId") {
      return res.status(403).json({ error: "Formato id incorrecto." });
    }
    return res.status(500).json({ error: "Error de servidor." });
  }
};
