// pages/api/miscellaneous.js
import connectDb from '../../middleware/mongoose';
import Miscellaneous from '../../models/Miscellaneous';

const handler = async (req, res) => {
  if (req.method === 'POST') {
    try {
      const { course, location, startDate, endDate, students } = req.body;
      const newMiscellaneous = new Miscellaneous({
        course,
        location,
        startDate,
        endDate,
        students,
      });

      await newMiscellaneous.save();
      return res.status(201).json({ message: 'Data saved successfully' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Failed to save data' });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
};

export default connectDb(handler);
