// models/MainCourse.js
import mongoose from 'mongoose';

const MainCourseSchema = new mongoose.Schema({
  vacAllotted: { type: Number, required: true },
  vacUtilised: { type: Number, required: true },
  totalArmyStrength: { type: Number, required: false },
  axI: { type: Number, required: false },
  aI: { type: Number, required: false },
  bi: { type: Number, required: false },
  axR: { type: Number, required: false },
  totalStrengthAX: { type: Number, required: false },
  totalStrengthA: { type: Number, required: false },
  popupRemarks: { type: String, required: false },
  year: { type: String, required: true },
  course: { type: String, required: true },
  maincourse: { type: String, required: true },
  precourse: { type: String, required: true },
  targetYearPreCourse: { type: String, required: true },
  targetYearMainCourse: { type: String, required: true },
  students: [
    {
      armyno: { type: String, required: true },
      rankno: { type: String, required: true },
      name: { type: String, required: true },
      grading: { type: String, required: false },
      remarks: { type: String, required: false },
      unitno: { type: String, required: true },
      phase: { type: String, required: true },
      scores: {
        type: Map,
        of: Number, // This allows dynamic keys with number values
      }
    },
  ],
  instructors: [{ 
    _id: { type: mongoose.Schema.Types.ObjectId, ref: 'Instructor' },
    course: { type: String, required: false },
    instructorName: { type: String, required: false },
    unit: { type: String, required: false },
    fromDate: { type: Date, required: false },
    toDate: { type: Date, required: false },
    remarks: { type: String, required: false }
  }],
  allstudentlength: { type: Number, required: true },
});


let MainCourseSelection;
try {
  MainCourseSelection = mongoose.models.MainCourse || mongoose.model('MainCourse', MainCourseSchema);
} catch (error) {
  console.error('Error defining MainCourse model:', error);
}

export default MainCourseSelection;