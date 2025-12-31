// pages/api/submitmaincourse.js
import dbConnect from '../../middleware/mongoose'; // Ensure you have a utility for DB connection
import MainCourse from '../../models/MainCourse';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    await dbConnect(); // Connect to the database

    try {
      const { vacAllotted, vacUtilised, year, course,maincourse,precourse, targetYearPreCourse, targetYearMainCourse, students,instructors, allstudentlength } = req.body;

      const newMainCourse = new MainCourse({
        vacAllotted,
        vacUtilised,
        year,
        course,
        maincourse,
        precourse,
        targetYearPreCourse,
        targetYearMainCourse,
        students,
        instructors,
        allstudentlength,
      });

      await newMainCourse.save();
      return res.status(201).json({ success: true, message: 'Data submitted successfully' });
    } catch (error) {
      console.error('Error saving data:', error);
      return res.status(500).json({ success: false, message: 'Error saving data' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
