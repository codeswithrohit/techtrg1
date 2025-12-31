import mongoose from 'mongoose';

const LectureSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, required: true },
  filePath: { type: String, required: true },
}, { timestamps: true }); // Includes createdAt & updatedAt

const TopicSchema = new mongoose.Schema({
  title: { type: String, required: true }, // Added title for topic
  lectures: [LectureSchema], // List of lectures inside topics
});

const FileSchema = new mongoose.Schema({
  mainname: { type: String, required: true },
  name: { type: String, required: true },
  subname: { type: String, required: true },
  topics: [TopicSchema], // Topics contain lectures
}, { timestamps: true });

export default mongoose.models.File || mongoose.model('File', FileSchema);
