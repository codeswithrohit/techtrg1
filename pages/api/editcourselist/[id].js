import connectDb from '../../../middleware/mongoose';
import Courselist from '../../../models/Courselist';

const handler = async (req, res) => {
  const { method } = req;

  if (method === 'PUT') {
    const { id } = req.query;
    const { courseName, titles, maintitles, aside, xside,asideTotal,xsideTotal } = req.body;

    // Validate required fields
    if (!id || !courseName || !titles || titles.length === 0 || !maintitles || maintitles.length === 0) {
      return res.status(400).json({ success: false, message: 'Invalid input data' });
    }

    try {
    

      // Prepare data to update, including asideTotal and xsideTotal
      const updateData = {
        courseName,
        titles: titles.map(title => ({ name: title })),
        maintitles: maintitles.map(maintitle => ({ name: maintitle })),
        aside: aside ? aside.map(({ test, mark }) => ({ test, mark })) : [],
        xside: xside ? xside.map(({ test, mark }) => ({ test, mark })) : [],
        asideTotal,  // Include calculated asideTotal
        xsideTotal   // Include calculated xsideTotal
      };

      // console.log("updatedData", updateData);

      // Update course details
      const updatedCourse = await Courselist.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );

      // Check if course exists
      if (!updatedCourse) {
        return res.status(404).json({ success: false, message: 'Course not found' });
      }

      res.status(200).json({ success: true, data: updatedCourse });
    } catch (error) {
      console.error('Error updating course:', error); 
      res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
  } else {
    res.status(400).json({ success: false, message: 'Invalid request method' });
  }
};

export default connectDb(handler);
