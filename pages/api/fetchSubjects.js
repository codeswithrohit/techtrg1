// pages/api/subjects/fetchSubjects.js
import clientPromise from '../../lib/mongodb';  // Correct path to your MongoDB client setup file

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const client = await clientPromise;
    const db = client.db('mydatabase'); // Replace with your actual database name
    const collection = db.collection('subjects');

    const subjects = await collection.find({}).toArray();
    res.status(200).json(subjects);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch data.', error: error.message });
  }
}
