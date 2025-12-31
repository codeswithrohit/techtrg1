import clientPromise from '../../lib/mongodb';
import { ObjectId } from 'mongodb';  // Correct import

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db('mydatabase'); // Replace with your database name
  const collection = db.collection('subjects');

  if (req.method === 'POST') {
    // Create a new subject
    try {
      const { subject, chapters } = req.body;
      if (!subject || !chapters) {
        return res.status(400).json({ message: 'Subject and chapters are required.' });
      }

      const result = await collection.insertOne({
        subject,
        chapters,
      });

      res.status(200).json({ message: 'Data saved successfully!', result });
    } catch (error) {
      res.status(500).json({ message: 'Failed to save data.', error });
    }
  } else if (req.method === 'GET') {
    // Fetch all subjects
    try {
      const subjects = await collection.find({}).toArray();
      res.status(200).json(subjects);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch data.', error });
    }
  } else if (req.method === 'PUT') {
    // Edit a subject
    try {
      const { id, subject, chapters } = req.body;
      if (!id || !subject || !chapters) {
        return res.status(400).json({ message: 'ID, subject, and chapters are required.' });
      }

      const result = await collection.updateOne(
        { _id: new ObjectId(id) },  // Corrected this line
        { $set: { subject, chapters } }
      );

      res.status(200).json({ message: 'Data updated successfully!', result });
    } catch (error) {
      res.status(500).json({ message: 'Failed to update data.', error });
    }
  } else if (req.method === 'DELETE') {
    // Delete a subject
    try {
      const { id } = req.query; // Assuming ID is passed as a query parameter
      if (!id) {
        return res.status(400).json({ message: 'ID is required.' });
      }

      const result = await collection.deleteOne({ _id: new ObjectId(id) });  // Corrected this line

      res.status(200).json({ message: 'Data deleted successfully!', result });
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete data.', error });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
