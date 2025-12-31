import clientPromise from '../../lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const client = await clientPromise;
      const db = client.db();
      const courses = await db.collection('courses').find().toArray();

      // Fetch lectures and file details for each course
      const coursesWithDetails = await Promise.all(courses.map(async (course) => {
        const lectures = course.lectures || [];
        const lectureDetails = await Promise.all(lectures.map(async (lecture) => {
          const file = await db.collection('files').findOne({ _id: new ObjectId(lecture.fileId) });
          return {
            ...lecture,
            file,
          };
        }));
        return {
          ...course,
          lectures: lectureDetails,
        };
      }));

      res.status(200).json(coursesWithDetails);
    } catch (error) {
      res.status(500).json({ error: `Sorry something went wrong! ${error.message}` });
    }
  } else {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  }
}
