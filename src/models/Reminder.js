import mongoose from "mongoose";
const { Schema, model } = mongoose;

const reminderSchema = new Schema({
  description: {
    type: String,
    require: true,
    trim: true,
  },
  date: {
    type: Date,
    require: true,
    trim: true,
  },
  when: {
    type: Date,
    require: true,
    trim: true,
  },
  other: {
    type: String,
    trim: true,
  },
  yesterday: {
    type: Boolean,
  },
  week: {
    type: Boolean,
  },
  uid: {
    type: Schema.Types.ObjectId,
    ref: "User",
    require: true,
  },

});


export const Reminder = model('Reminder', reminderSchema);