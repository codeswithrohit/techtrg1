import Order from "../../models/Course";
import connectDb from "../../middleware/mongoose";

const handler = async (req, res) => {
    try {
        let orders = await Order.find().lean();  // Using .lean() for faster query execution and plain JavaScript objects
        res.status(200).json({ orders });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
};

export default connectDb(handler);
