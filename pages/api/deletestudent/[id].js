import connectDb from '../../../middleware/mongoose';
// pages/api/deletestudent/[id].js
import StudentRegistration from '../../../models/StudentPerformance';

export default async function handler(req, res) {
  const { method } = req;
  const { id } = req.query;

  switch (method) {
    case 'DELETE':
      try {
        const updatedData = await StudentRegistration.updateOne(
          { "students._id": id },
          { $pull: { students: { _id: id } } }
        );

        if (updatedData.modifiedCount === 0) {
          return res.status(404).json({ success: false, message: 'Student not found' });
        }

        return res.status(200).json({ success: true, message: 'Student deleted successfully' });
      } catch (error) {
        console.error('Error deleting student:', error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
      }
    default:
      res.setHeader('Allow', ['DELETE']);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}

