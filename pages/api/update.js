// pages/api/update.js
import multer from 'multer';
import mongoose from 'mongoose'; // Import mongoose
import clientPromise from '../../lib/mongodb';

// Multer configuration for file storage
const storage = multer.diskStorage({
  destination: './public/uploads',
  filename: (req, file, cb) => cb(null, file.originalname),
});

// Initialize Multer with custom storage and file filtering
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.fieldname.startsWith('file-')) cb(null, true);
    else cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', file.fieldname));
  },
}).any();

// Disable Next.js built-in body parser to use Multer
export const config = { api: { bodyParser: false } };

// Helper function to run middleware
async function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => (result instanceof Error ? reject(result) : resolve(result)));
  });
}

export default async function handler(req, res) {
  if (req.method !== 'PUT') return res.status(405).json({ error: `Method '${req.method}' Not Allowed` });

  await runMiddleware(req, res, upload); // Run multer middleware to handle file uploads

  const client = await clientPromise;
  const db = client.db();
  
  // Extract the 'id' from the query parameters to identify which document to update
  const { id } = req.query; 
  const {mainname, name, subname, topics } = req.body; // Extract form data from the request body
  console.log('Request body data:', {mainname, name, subname, topics }); // Log the body data

  try {
    // Parse topics array (received as JSON string) to a JavaScript object
    const parsedTopics = JSON.parse(topics);
    const files = req.files;

    // Ensure the provided ID is a valid MongoDB ObjectID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid ID format.' });
    }

    // Find the existing record by ID
    const existingRecord = await db.collection('files').findOne({ _id: new mongoose.Types.ObjectId(id) });
    if (!existingRecord) {
      console.log('Record not found with ID:', id); // Log if record is not found
      return res.status(404).json({ error: 'Record not found.' });
    }

    console.log('Record found, proceeding with update...'); // Log if record is found

    // Map through topics and update lectures with file paths
    const updatedTopics = parsedTopics.map((topic, topicIndex) => ({
      ...topic,
      lectures: topic.lectures.map((lecture, lectureIndex) => {
        const fileMatch = files.find(f => f.fieldname === `file-${topicIndex}-${lectureIndex}`);
        return {
          ...lecture,
          filePath: fileMatch ? `/uploads/${fileMatch.originalname}` : lecture.filePath, // Update file path if new file is provided
        };
      }),
    }));

    console.log('Updated topics with files:', updatedTopics); // Log the updated topics data

    // Update the record in the MongoDB collection
    const result = await db.collection('files').updateOne(
      { _id: new mongoose.Types.ObjectId(id) },
      { 
        $set: { 
          mainname: mainname || existingRecord.mainname, 
          name: name || existingRecord.name, 
          subname: subname || existingRecord.subname, 
          topics: updatedTopics,
          updatedAt: new Date() // Update the timestamp
        } 
      }
    );

    console.log('Update result:', result); // Log the update result
    res.status(200).json({ message: 'Record updated successfully!' });

  } catch (error) {
    console.error('Error updating record:', error); // Log any errors during the update
    res.status(500).json({ error: 'An error occurred while updating the record.' });
  }
}
