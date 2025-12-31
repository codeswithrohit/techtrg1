import clientPromise from '../../lib/mongodb';

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db();
  const files = await db.collection('files').find({}).toArray();
  res.json(files);
}
