import dbConnect from '../../middleware/mongoose'; // Ensure you have a utility for DB connection
import MainCourseStudent from '../../models/MainCourse';

export default async function handler(req, res) {
  await dbConnect(); // Ensure MongoDB is connected

  if (req.method === 'PUT') {
    try {
      const { _id, ...updateData } = req.body;

      if (!_id) {
        return res.status(400).json({ success: false, message: 'Missing _id field' });
      }

      const updatedRecord = await MainCourseStudent.findByIdAndUpdate(_id, updateData, { new: true });

      if (!updatedRecord) {
        return res.status(404).json({ success: false, message: 'Record not found' });
      }

      return res.status(200).json({ success: true, data: updatedRecord });

    } catch (error) {
      console.error('Error updating main course student:', error);
      return res.status(500).json({ success: false, message: 'Server error' });
    }
  } else {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }
}
