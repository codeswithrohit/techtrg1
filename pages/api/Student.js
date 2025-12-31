import connectDb from '../../middleware/mongoose';
import StudentRegistration from '../../models/StudentPerformance';

const handler = async (req, res) => {
  if (req.method === 'POST') {
    const {
      selectedCourse,
      selectedTitle,
      selectedMaintitle,
      year,
      targetYearPreCourse,
      targetYearMainCourse,
      students,
      instructors
    } = req.body;
console.log("instructor",instructors)
    try {
      const newRegistration = new StudentRegistration({
        selectedCourse,
        selectedTitle,
        selectedMaintitle,
        year,
        targetYearPreCourse,
        targetYearMainCourse,
        students,
        instructors
      });
      await newRegistration.save();

      return res.status(200).json({ success: true, message: 'Data saved' });
    } catch (error) {
      console.error('Error saving data:', error);
      return res.status(500).json({ success: false, message: 'Error saving data' });
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
};

export default connectDb(handler);
