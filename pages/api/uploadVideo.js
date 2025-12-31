import multer from 'multer';
import fs from 'fs';
import path from 'path';

const upload = multer({ dest: './public/uploads/' });

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  try {
    upload.any()(req, res, async (err) => {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: 'Multer error', error: err.message });
      } else if (err) {
        return res.status(500).json({ message: 'Unknown error', error: err.message });
      }

      const { title, subtitle, lectures } = req.body;

      lectures.forEach((lecture, index) => {
        lecture.lectureTitle = lecture.lectureTitle || ''; // Ensure lectureTitle exists or set default
        lecture.videoPath = `/uploads/${req.files[index].filename}`;
        lecture.filetype = lecture.filetype || ''; // Ensure filetype exists or set default
      });

      const data = {
        id: Date.now(),
        title,
        subtitle,
        lectures,
      };

      const filePath = path.join(process.cwd(), 'data.json');
      const currentData = fs.readFileSync(filePath, 'utf8');
      let videos = JSON.parse(currentData);
      videos.push(data);

      fs.writeFileSync(filePath, JSON.stringify(videos, null, 2));

      res.status(200).json({ message: 'Video uploaded successfully', data });
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
