import connectDb from '../../../middleware/mongoose';
import Student from '../../../models/MainCourse';

const handler = async (req, res) => {
  const { id } = req.query; // Get student ID from query parameter

  if (req.method === 'DELETE') {
    try {
      const student = await Student.findByIdAndDelete(id); // Delete student by ID
      if (!student) {
        return res.status(404).json({ success: false, message: 'Student not found' });
      }
      return res.status(200).json({ success: true, message: 'Student deleted successfully' });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Server error', error });
    }
  } else {
    res.status(400).json({ success: false, message: 'Invalid request' });
  }
};

export default connectDb(handler);
