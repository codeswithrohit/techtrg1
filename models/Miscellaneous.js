// models/Miscellaneous.js
import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  unit: { type: String, required: true },
  rank: { type: String, required: true },
  armyNo: { type: String, required: true },
});

const miscellaneousSchema = new mongoose.Schema({
  course: { type: String, required: true },
  location: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  students: [studentSchema],
});

const Miscellaneous = mongoose.models.Miscellaneous || mongoose.model('Miscellaneous', miscellaneousSchema);

export default Miscellaneous;
