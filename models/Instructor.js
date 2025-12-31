import mongoose from 'mongoose';

const instructorSchema = new mongoose.Schema({
  course: {
    type: String,
    required: true,
  },
  mainCourse: {
    type: String, // New field for the main course
    required: true,
  },
  fromDate: {
    type: Date,
    required: true,
  },
  toDate: {
    type: Date,
    required: true,
  },
  remarks: {
    type: String,
  },
  selectedStudents: [
    {
      name: { type: String, required: true },
      unitno: { type: String, required: true },
      grading: { type: String, required: false },
    },
  ],
});

const Instructor = mongoose.models.Instructor || mongoose.model('Instructor', instructorSchema);

export default Instructor;
