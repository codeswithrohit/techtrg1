import connectDB from '../../middleware/mongoose';
import Courses from "../../models/Files";
import Courselist from "../../models/Courselist";
import MainCourse from "../../models/MainCourse";
import StudentRegistration from "../../models/StudentPerformance";

export default async function handler(req, res) {
  await connectDB(); // Ensure database connection

  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    const { type, data } = req.body;

    if (!type || !data) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    let model;
    switch (type) {
      case "Courses":
        model = Courses;
        break;
      case "Courses List":
        model = Courselist;
        break;
      case "Main-Course Students":
        model = MainCourse;
        break;
      case "Pre-Course Students":
        model = StudentRegistration;
        break;
      default:
        return res.status(400).json({ success: false, message: "Invalid type" });
    }

    // Insert or update matching records
    for (const item of data) {
      await model.findOneAndUpdate({ _id: item._id }, item, { upsert: true });
    }

    return res.status(200).json({ success: true, message: `${type} restored successfully` });
  } catch (error) {
    console.error("Restore error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}