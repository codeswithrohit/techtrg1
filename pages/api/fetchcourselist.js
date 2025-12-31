import connectDb from '../../middleware/mongoose';
import Course from '../../models/Courselist';

const handler = async (req, res) => {
  if (req.method === 'GET') {
    try {
      const courses = await Course.find();
      return res.status(200).json({ success: true, data: courses });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Server error', error });
    }
  } else {
    res.status(400).json({ success: false, message: 'Invalid request' });
  }
};

export default connectDb(handler);
