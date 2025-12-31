import connectDb from "../../../middleware/mongoose";
import News from "../../../models/News";

const handler = async (req, res) => {
  const { id } = req.query;

  if (req.method === "PUT") {
    try {
      const { title, startDate, endDate } = req.body;
      const updatedNews = await News.findByIdAndUpdate(
        id,
        { title, startDate, endDate },
        { new: true }
      );
      res.status(200).json({ success: true, news: updatedNews });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  } else if (req.method === "DELETE") {
    try {
      await News.findByIdAndDelete(id);
      res.status(200).json({ success: true, message: "News deleted" });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  } else {
    res.status(405).json({ success: false, message: "Method Not Allowed" });
  }
};

export default connectDb(handler);
