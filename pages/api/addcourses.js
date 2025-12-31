const https = require('https');
import Order from "../../models/Course"
import connectDb from "../../middleware/mongoose"



const handler = async (req, res) => {
    let order;
    if (req.method === 'POST') {
        try {
           

            // Initiate an Order corresponding to this order id
            order = new Order({
                orderId: req.body.orderId,
                courses: req.body.courses,
            });

            await order.save();

            // Log the order ID
            console.log("Order ID:", order._id);

            // Send a JSON response with the redirect URL
            return res.status(200).json({ success: true, redirectUrl: `/Admin` });
        } catch (error) {
            console.error('Error submitting order to MongoDB:', error);
            return res.status(500).json({ success: false, error: 'Internal Server Error' });
        }
    }
};

export default connectDb(handler);
