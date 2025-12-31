// pages/api/subjects/uploadSubject.js
import clientPromise from '../../lib/mongodb';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const client = await clientPromise;
  const db = client.db('mydatabase'); // Replace with your database name
  const collection = db.collection('subjects');

  try {
    const { subject, chapters } = req.body;
    if (!subject || !chapters) {
      return res.status(400).json({ message: 'Subject and chapters are required.' });
    }

    const result = await collection.insertOne({ subject, chapters });
    res.status(200).json({ message: 'Data saved successfully!', result });
  } catch (error) {
    res.status(500).json({ message: 'Failed to save data.', error });
  }
}
