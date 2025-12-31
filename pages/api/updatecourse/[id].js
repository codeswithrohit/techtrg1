import mongoose from "mongoose";
import Course from "../../../models/Course";
import connectDb from "../../../middleware/mongoose";

const handler = async (req, res) => {
  if (req.method === 'PUT') {
    try {
      const { id } = req.query; // Extract the course ID from the query parameters
      const { courses } = req.body;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, error: 'Invalid Course ID' });
      }

      const updatedCourse = await Course.findByIdAndUpdate(
        id,
        { courses },
        { new: true, runValidators: true }
      );

      if (!updatedCourse) {
        return res.status(404).json({ success: false, error: 'Course not found' });
      }

      return res.status(200).json({ success: true, course: updatedCourse });
    } catch (error) {
      console.error('Error updating course:', error);
      return res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default connectDb(handler);
