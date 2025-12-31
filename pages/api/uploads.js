// api/uploads.js

import { MongoClient, ObjectId } from 'mongodb';

const handler = async (req, res) => {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const client = await MongoClient.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const db = client.db(process.env.MONGODB_DB);
  const uploads = await db.collection('uploads').find({}).toArray();

  client.close();

  // Mapping uploads to include download links for video, file, and ppt
  const uploadsWithLinks = uploads.map(upload => ({
    ...upload,
    videoUrl: upload.videoId ? `/api/video?id=${upload.videoId}` : null,
    fileUrl: upload.fileId ? `/api/file?id=${upload.fileId}` : null,
    pptUrl: upload.pptId ? `/api/ppt?id=${upload.pptId}` : null,
  }));

  res.status(200).json(uploadsWithLinks);
};

export default handler;
