import connectDb from '../../middleware/mongoose';
import Student from '../../models/StudentPerformance';

const handler = async (req, res) => {
  if (req.method === 'PUT') {
    try {
      const { id } = req.query;
      const updatedData = req.body;

      const result = await Student.findByIdAndUpdate(id, updatedData, { new: true });

      if (result) {
        return res.status(200).json({ success: true, message: 'Student updated successfully', data: result });
      } else {
        return res.status(404).json({ success: false, message: 'Student not found' });
      }
    } catch (error) {
      console.error('Error updating student:', error);
      return res.status(500).json({ success: false, message: 'Server error', error });
    }
  } else {
    res.status(400).json({ success: false, message: 'Invalid request method' });
  }
};

export default connectDb(handler);
