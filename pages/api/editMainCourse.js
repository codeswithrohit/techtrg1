import connectDb from '../../middleware/mongoose';
import MainCourse from '../../models/MainCourse';

const handler = async (req, res) => {
  if (req.method === 'PUT') {
    const { updates } = req.body; // Destructure updates from request body
    console.log("Received updates:", updates); // Debugging point

    // Ensure updates is an array
    if (!Array.isArray(updates)) {
      return res.status(400).json({ success: false, message: 'Updates must be an array' });
    }

    try {
      const updatePromises = updates.map(update =>
        MainCourse.findOneAndUpdate(
          { 'students._id': update._id }, // Use _id to find the student
          {
            $set: {
              'students.$.grading': update.grading,
              'students.$.remarks': update.remarks,
            },
          },
          { new: true } // Return the updated document
        )
      );

      const results = await Promise.all(updatePromises);
      console.log("Update results:", results); // Debugging point

      return res.status(200).json({ success: true, results });
    } catch (error) {
      console.error('Error updating records:', error);
      return res.status(500).json({ success: false, message: 'Failed to update grading' });
    }
  } else {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }
};

export default connectDb(handler);
