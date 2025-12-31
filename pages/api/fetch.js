// pages/api/fetch.js
import clientPromise from '../../lib/mongodb';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: `Method '${req.method}' Not Allowed` });

  const client = await clientPromise;
  const db = client.db();
  const files = await db.collection('files').find().toArray();

  res.status(200).json(files);
}
