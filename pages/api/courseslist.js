import connectDb from '../../middleware/mongoose';
import Course from '../../models/Courselist';

const handler = async (req, res) => {
  if (req.method === 'POST') {
    const { courseName, titles, maintitles, aside, xside, asideTotal, xsideTotal } = req.body;

    if (
      !courseName ||
      !titles ||
      titles.length === 0 ||
      !maintitles ||
      maintitles.length === 0 ||
      !aside ||
      aside.length === 0 ||
      !xside ||
      xside.length === 0 ||
      asideTotal === undefined ||
      xsideTotal === undefined
    ) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    // Create a new course document
    const course = new Course({
      courseName,
      titles: titles.map((title) => ({ name: title })),
      maintitles: maintitles.map((maintitle) => ({ name: maintitle })),
      aside: aside.map((item) => ({ test: item.test, mark: item.mark })),
      xside: xside.map((item) => ({ test: item.test, mark: item.mark })),
      asideTotal,
      xsideTotal,
    });
    // console.log("course",course)
    try {
      // Save the course in MongoDB
      await course.save();
      return res.status(201).json({ success: true, data: course });
 
    } catch (error) {
      console.error('Error saving course:', error);
      return res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
  } else {
    res.status(400).json({ success: false, message: 'Invalid request' });
  }
};

export default connectDb(handler);
