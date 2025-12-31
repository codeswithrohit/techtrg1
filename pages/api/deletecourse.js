import Course from "../../models/Course";
import connectDb from "../../middleware/mongoose";

const handler = async (req, res) => {
    if (req.method === 'DELETE') {
        try {
            const { id } = req.query; // Get the course ID from the query parameters

            // Check if ID is provided
            if (!id) {
                return res.status(400).json({ success: false, error: 'Course ID is required' });
            }

            // Find and delete the course by ID
            const deletedCourse = await Course.findByIdAndDelete(id);

            // Check if the course was found and deleted
            if (!deletedCourse) {
                return res.status(404).json({ success: false, error: 'Course not found' });
            }

            // Respond with success message
            return res.status(200).json({ success: true, message: 'Course deleted successfully' });
        } catch (error) {
            console.error('Error deleting course:', error);
            return res.status(500).json({ success: false, error: 'Internal Server Error' });
        }
    } else {
        // Method not allowed
        res.setHeader('Allow', ['DELETE']);
        return res.status(405).json({ success: false, error: `Method ${req.method} Not Allowed` });
    }
};

export default connectDb(handler);
