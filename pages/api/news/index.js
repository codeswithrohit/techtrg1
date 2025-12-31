import connectDb from "../../../middleware/mongoose";
import News from "../../../models/News";

const handler = async (req, res) => {
  if (req.method === "POST") {
    try {
      const { title, startDate, endDate } = req.body;
      const news = new News({ title, startDate, endDate });
      await news.save();
      res.status(201).json({ success: true, news });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  } else if (req.method === "GET") {
    try {
      const news = await News.find().sort({ createdAt: -1 });
      res.status(200).json({ success: true, news });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  } else {
    res.status(405).json({ success: false, message: "Method Not Allowed" });
  }
};

export default connectDb(handler);
