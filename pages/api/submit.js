// pages/api/submit.js

import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// Multer setup for handling file uploads
const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            const uploadDir = path.join(process.cwd(), 'public', 'uploads');
            fs.mkdirSync(uploadDir, { recursive: true });
            cb(null, uploadDir);
        },
        filename: function (req, file, cb) {
            const fileName = uuidv4() + path.extname(file.originalname);
            cb(null, fileName);
        }
    }),
    limits: {
        fileSize: 50 * 1024 * 1024, // 50 MB limit (adjust as necessary)
    },
});

export default function handler(req, res) {
    if (req.method === 'POST') {
        upload.single('video')(req, res, async function (err) {
            if (err instanceof multer.MulterError) {
                console.error('Multer error:', err);
                return res.status(400).json({ message: 'Error uploading file' });
            } else if (err) {
                console.error('Upload error:', err);
                return res.status(500).json({ message: 'Server error' });
            }

            const { name, mobile } = req.body;
            const videoFile = req.file;

            // Validate data if needed

            const newContact = {
                id: Date.now(),
                name,
                mobile,
                videoPath: videoFile ? `/uploads/${videoFile.filename}` : null, // Store the path to the uploaded video
            };

            const dataFilePath = path.join(process.cwd(), 'data.json');

            // Read current data from data.json
            let data = [];
            try {
                const jsonData = fs.readFileSync(dataFilePath, 'utf-8');
                data = JSON.parse(jsonData);
            } catch (error) {
                console.error('Error reading data.json', error);
            }

            // Add new contact to data array
            data.push(newContact);

            // Write updated data back to data.json
            try {
                fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
                console.log('Data written to data.json');
            } catch (error) {
                console.error('Error writing data.json', error);
            }

            // Respond with success message or updated data
            res.status(200).json({ message: 'Contact added successfully', contact: newContact });
        });
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
