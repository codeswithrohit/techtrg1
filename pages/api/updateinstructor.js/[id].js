import Instructor from '../../../models/Instructor'; // Import the Instructor model
import connectDb from '../../../middleware/mongoose'; // Middleware for DB connection

// API handler for updating instructor
const handler = async (req, res) => {
  if (req.method === 'PUT') {
    const { id } = req.query; // Get the instructor ID from the URL

    try {
      // Find the instructor by ID
      const instructor = await Instructor.findById(id);

      if (!instructor) {
        return res.status(404).json({ message: 'Instructor not found' });
      }

      // Update instructor fields with the data from the request body
      instructor.course = req.body.course || instructor.course;
      instructor.instructorName = req.body.instructorName || instructor.instructorName;
      instructor.unit = req.body.unit || instructor.unit;
      instructor.fromDate = req.body.fromDate || instructor.fromDate;
      instructor.toDate = req.body.toDate || instructor.toDate;
      instructor.remarks = req.body.remarks || instructor.remarks;

      // Save the updated instructor record
      const updatedInstructor = await instructor.save();

      res.status(200).json({ success: true, instructor: updatedInstructor });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  } else {
    // Method not allowed
    res.status(405).json({ message: 'Method Not Allowed' });
  }
};

export default connectDb(handler); // Wrap the handler with the DB connection middleware
