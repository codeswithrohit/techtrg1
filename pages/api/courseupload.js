import nextConnect from 'next-connect';
import multer from 'multer';
import { MongoClient } from 'mongodb';

const upload = multer({
  storage: multer.diskStorage({
    destination: './public/uploads',
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
  }),
});

const handler = nextConnect();

handler.use(upload.array('lectures'));

const client = new MongoClient(process.env.MONGODB_URI);
await client.connect();
const db = client.db('your_database_name');
const collection = db.collection('your_collection_name');

handler.post(async (req, res) => {
  try {
    const courseData = JSON.parse(req.body.lectures);
    const files = req.files;

    courseData.lectures.forEach((topic, topicIndex) => {
      topic.lectures.forEach((lecture, lectureIndex) => {
        if (lecture.file) {
          const file = files.find(f => f.fieldname === `lectures[${topicIndex}][lectures][${lectureIndex}][file]`);
          lecture.fileUrl = `/uploads/${file.filename}`;
        }
      });
    });

    await collection.insertOne(courseData);

    res.status(200).json({ message: 'Course uploaded successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to upload course data' });
  }
});

handler.get(async (req, res) => {
  try {
    const courses = await collection.find({}).toArray();
    res.status(200).json(courses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch uploaded data' });
  }
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;
