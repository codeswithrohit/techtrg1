// pages/api/subjects/editSubject.js
import clientPromise from '../../lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const client = await clientPromise;
  const db = client.db('mydatabase'); // Replace with your database name
  const collection = db.collection('subjects');

  try {
    const { id, subject, chapters } = req.body;
    if (!id || !subject || !chapters) {
      return res.status(400).json({ message: 'ID, subject, and chapters are required.' });
    }

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { subject, chapters } }
    );

    res.status(200).json({ message: 'Data updated successfully!', result });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update data.', error });
  }
}
