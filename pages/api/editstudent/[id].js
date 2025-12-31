import dbConnect from '../../../middleware/mongoose'; // adjust the path based on your project structure
import StudentRegistration from '../../../models/StudentPerformance';

export default async function handler(req, res) {
  const { method } = req;
  const { id } = req.query;

  await dbConnect();

  if (method === 'PUT') {
    try {
      const { armyno, rankno, name, unitno } = req.body;
      const updatedStudent = await StudentRegistration.findOneAndUpdate(
        { 'students._id': id },
        { $set: { 'students.$.armyno': armyno, 'students.$.rankno': rankno, 'students.$.name': name, 'students.$.unitno': unitno } },
        { new: true }
      );

      if (!updatedStudent) {
        return res.status(404).json({ success: false, message: 'Student not found' });
      }

      res.status(200).json({ success: true, data: updatedStudent });
    } catch (error) {
      console.error('Error updating student:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  } else {
    res.setHeader('Allow', ['PUT']);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}
