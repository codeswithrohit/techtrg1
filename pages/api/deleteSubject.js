// pages/api/subjects/deleteSubject.js
import clientPromise from '../../lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const client = await clientPromise;
  const db = client.db('mydatabase'); // Replace with your database name
  const collection = db.collection('subjects');

  try {
    const { id } = req.query; // Assuming ID is passed as a query parameter
    if (!id) {
      return res.status(400).json({ message: 'ID is required.' });
    }

    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    res.status(200).json({ message: 'Data deleted successfully!', result });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete data.', error });
  }
}
