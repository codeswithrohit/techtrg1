import StudentRegistration from '../../models/StudentPerformance';
import dbConnect from '../../middleware/mongoose';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'POST') {
    const { selectedTest, scores } = req.body;

    try {
      // Prepare the update object
      const updates = Object.entries(scores).map(([studentId, score]) => {
        return {
          updateOne: {
            filter: {
              'students._id': studentId,
            },
            update: {
              $set: {
                [`students.$.scores.${selectedTest}`]: score,
              },
            },
          },
        };
      });

      // Perform the bulk update
      const updatedStudents = await StudentRegistration.bulkWrite(updates);

      res.status(200).json({ success: true, data: updatedStudents });
    } catch (error) {
      console.error('Error updating students:', error);
      res.status(500).json({ success: false, message: 'Failed to update students' });
    }
  } else {
    res.status(400).json({ success: false, message: 'Invalid request method' });
  }
}
