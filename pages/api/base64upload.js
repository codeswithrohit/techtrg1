import { MongoClient } from 'mongodb';

const handler = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  const { name, email, file } = req.body;

  if (!file || !name || !email) {
    return res.status(400).json({ error: 'Invalid request' });
  }

  let client;

  try {
    client = await MongoClient.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const db = client.db(process.env.MONGODB_DB);

    await db.collection('base64users').insertOne({
      name,
      email,
      file, // This is the base64 string of the file
    });

    client.close();
    return res.status(201).json({ message: 'Form submitted successfully!' });

  } catch (error) {
    if (client) {
      client.close();
    }
    console.error('Error inserting document', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export default handler;

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '50mb', // Increase the limit to allow for larger files
    },
  },
};
