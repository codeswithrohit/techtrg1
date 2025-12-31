import mongoose from 'mongoose';

const StudentSchema = new mongoose.Schema({
  armyno: { type: String, required: true },
  rankno: { type: String, required: true },
  name: { type: String, required: true },
  unitno: { type: String, required: true },
  phase: { type: String, required: true },
  scores: {
    type: Map,
    of: Number, // This allows dynamic keys with number values
  }
});

const RegistrationSchema = new mongoose.Schema({
  selectedCourse: { type: String, required: true },
  selectedTitle: { type: String, required: true },
  selectedMaintitle: { type: String, required: true },
  year: { type: String, required: true },
  targetYearPreCourse: { type: String, required: true },
  targetYearMainCourse: { type: String, required: false },
  instructors: [{ 
    _id: { type: mongoose.Schema.Types.ObjectId, ref: 'Instructor' },
    course: { type: String, required: false },
    instructorName: { type: String, required: false },
    unit: { type: String, required: false },
    fromDate: { type: Date, required: false },
    toDate: { type: Date, required: false },
    remarks: { type: String, required: false }
  }],
  students: [StudentSchema], // Embed student information
});

const StudentRegistration =
  mongoose.models.StudentRegistration ||
  mongoose.model('StudentRegistration', RegistrationSchema);

export default StudentRegistration;
