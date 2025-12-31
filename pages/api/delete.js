// pages/api/delete.js
import clientPromise from '../../lib/mongodb';
import { ObjectId } from 'mongodb';
import { promises as fs } from 'fs';
import path from 'path';

export default async function handler(req, res) {
  console.log('Received DELETE request for file'); // Log the request received
  if (req.method !== 'DELETE') return res.status(405).json({ error: `Method '${req.method}' Not Allowed` });

  const { id } = req.query;
  console.log('File ID to delete:', id); // Log the ID received from the query

  const client = await clientPromise;
  const db = client.db();

  try {
    const file = await db.collection('files').findOne({ _id: new ObjectId(id) });
    console.log('File found:', file); // Log the file found in the database

    if (!file) {
      console.log('File not found in the database');
      return res.status(404).json({ message: 'File not found' });
    }

    const filePaths = file.topics.flatMap((topic) =>
      topic.lectures.map((lecture) => path.join(process.cwd(), 'public', lecture.filePath))
    );
    console.log('File paths to delete:', filePaths); // Log the file paths to be deleted

    await Promise.all(filePaths.map((filePath) => fs.unlink(filePath).catch(err => console.error(`Error deleting file at ${filePath}:`, err)))); // Catch file deletion errors

    await db.collection('files').deleteOne({ _id: new ObjectId(id) });
    console.log('File record deleted from database'); // Log successful database deletion

    res.status(200).json({ message: 'File deleted successfully!' });
  } catch (error) {
    console.error('Error deleting file:', error); // Log any other errors
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
