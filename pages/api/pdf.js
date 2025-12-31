import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const { id } = req.query;
  const filePath = path.join(process.cwd(), 'public', 'pdfs', `${id}.pdf`);

  try {
    const data = fs.readFileSync(filePath);
    res.setHeader('Content-Type', 'application/pdf');
    res.send(data);
  } catch (error) {
    console.error('Error reading file:', error);
    res.status(404).end();
  }
}
