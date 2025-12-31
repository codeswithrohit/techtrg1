// pages/api/upload.js
import multer from 'multer';
import clientPromise from '../../lib/mongodb';

const storage = multer.diskStorage({
  destination: './public/uploads',
  filename: (req, file, cb) => cb(null, file.originalname),
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.fieldname.startsWith('file-')) cb(null, true);
    else cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', file.fieldname));
  },
}).any();

export const config = { api: { bodyParser: false } };

async function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => (result instanceof Error ? reject(result) : resolve(result)));
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: `Method '${req.method}' Not Allowed` });

  await runMiddleware(req, res, upload);

  const client = await clientPromise;
  const db = client.db();
  const {mainname, name, subname, topics } = req.body;
  const parsedTopics = JSON.parse(topics);
  const files = req.files;

  const topicsWithFiles = parsedTopics.map((topic, topicIndex) => ({
    ...topic,
    lectures: topic.lectures.map((lecture, lectureIndex) => ({
      ...lecture,
      filePath: `/uploads/${files.find(f => f.fieldname === `file-${topicIndex}-${lectureIndex}`).originalname}`,
    })),
  }));

  await db.collection('files').insertOne({mainname, name, subname, topics: topicsWithFiles, createdAt: new Date() });

  res.status(200).json({ data: 'File uploaded successfully!' });
}
