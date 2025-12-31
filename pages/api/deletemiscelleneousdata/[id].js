// pages/api/deleteinstructor/[id].js
import Instructor from "../../../models/Miscellaneous";
import connectDb from "../../../middleware/mongoose";

const handler = async (req, res) => {
  if (req.method === 'DELETE') {
    const { id } = req.query;  // Get ID from URL parameter
    console.log("Received ID:", id);  // Log ID for debugging

    if (!id) {
      return res.status(400).json({ success: false, error: 'data ID is required' });
    }

    try {
      const deletedInstructor = await Instructor.findByIdAndDelete(id);

      if (!deletedInstructor) {
        console.error(`data with ID ${id} not found`);
        return res.status(404).json({ success: false, error: 'data not found' });
      }

      return res.status(200).json({ success: true, message: 'data deleted successfully' });
    } catch (error) {
      console.error("Error during deletion:", error);
      return res.status(500).json({ success: false, error: 'Server error during deletion' });
    }
  } else {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }
};

export default connectDb(handler);
