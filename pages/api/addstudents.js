import connectDb from '../../middleware/mongoose';
import StudentRegistration from '../../models/StudentPerformance';

const handler = async (req, res) => {
  if (req.method === 'POST') {
    try {
      const { selectedTitle, newStudents } = req.body;

      if (!selectedTitle || !newStudents || newStudents.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Please provide all required fields.',
        });
      }

      // Log selectedTitle and newStudents
      console.log('Selected Title:', selectedTitle);
      console.log('New Students:', JSON.stringify(newStudents, null, 2)); // Pretty-print the students data

      // Fetch the course from the database using the selectedTitle
      const course = await StudentRegistration.findOne({
        'selectedTitle': selectedTitle,
      });

      // Log the fetched course
      console.log('Fetched Course from Database:', JSON.stringify(course, null, 2)); // Pretty-print the course data

      if (!course) {
        return res.status(404).json({
          success: false,
          message: 'Course not found.',
        });
      }

      // Add new students to the course
      const updatedStudents = newStudents.map((student) => ({
        armyno: student.armyno,
        rankno: student.rankno,
        name: student.name,
        unitno: student.unitno,
        phase: student.phase,
        scores: student.scores || {}, // Add scores if available
      }));

      // Log the students that will be added
      console.log('Updated Students to be Added:', JSON.stringify(updatedStudents, null, 2));

      // Push the new students into the course
      course.students.push(...updatedStudents);
      await course.save();

      // Log the updated course data after saving
      console.log('Updated Course after Saving:', JSON.stringify(course, null, 2));

      return res.status(200).json({
        success: true,
        message: 'Students added successfully.',
        data: updatedStudents,
      });
    } catch (error) {
      // Log the error
      console.error('Error:', error.message);

      return res.status(500).json({
        success: false,
        message: 'Internal server error.',
        error: error.message,
      });
    }
  } else {
    return res.status(400).json({
      success: false,
      message: 'Invalid request method.',
    });
  }
};

export default connectDb(handler);
