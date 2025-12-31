import { MongoClient, ObjectId, GridFSBucket } from 'mongodb';

const handler = async (req, res) => {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { id } = req.query;

  if (!id) {
    return res.status(400).send('Missing file ID');
  }

  const client = await MongoClient.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const db = client.db(process.env.MONGODB_DB);
  const bucket = new GridFSBucket(db, { bucketName: 'files' });

  const downloadStream = bucket.openDownloadStream(new ObjectId(id));

  downloadStream.on('data', (chunk) => {
    res.write(chunk);
  });

  downloadStream.on('error', () => {
    res.status(404).send('File not found');
  });

  downloadStream.on('end', () => {
    res.end();
  });

  client.close();
};

export default handler;
