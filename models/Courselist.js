import mongoose from 'mongoose';

const CourselistSchema = new mongoose.Schema({
  courseName: { type: String, required: true },
  titles: [{ name: String }],
  maintitles: [{ name: String }],
  aside: [{ test: String, mark: Number }],  // Add `aside` array with name and mark
  xside: [{ test: String, mark: Number }],  // Add `xside` array with name and mark
  asideTotal: { type: Number},  // Add `asidetotal` field
  xsideTotal: { type: Number },  // Add `xsidetotal` field
});

let Courselist;

if (mongoose.models.Courselist) {
  Courselist = mongoose.models.Courselist;
} else {
  Courselist = mongoose.model('Courselist', CourselistSchema);
}

export default Courselist;
