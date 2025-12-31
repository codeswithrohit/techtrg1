import Instructor from '../../models/Instructor'; // Import the Instructor model
import connectDb from '../../middleware/mongoose'; // Import the middleware for connecting to the database

const handler = async (req, res) => {
  if (req.method === 'GET') {
    try {
      // Fetch the list of instructors from the database
      const instructors = await Instructor.find();
      res.status(200).json({ instructors });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to fetch instructors' });
    }
  } else if (req.method === 'POST') {
    try {
      // Destructure the incoming request body
      const { course, mainCourse, fromDate, toDate, remarks, selectedStudents } = req.body;

      // Create a new instructor document with the provided data
      const newInstructor = new Instructor({
        course,
        mainCourse,
        fromDate,
        toDate,
        remarks: remarks.toUpperCase(),
        selectedStudents: selectedStudents.map(student => ({
          name: student.name,
          unitno: student.unitno,
          grading: student.grading,
        })),
      });

      // Save the new instructor to the database
      await newInstructor.save();

      res.status(201).json({ message: 'Instructor added successfully!' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    // Handle unsupported HTTP methods
    res.status(405).json({ error: 'Method Not Allowed' });
  }
};

// Export the handler wrapped with the connectDb middleware
export default connectDb(handler);
