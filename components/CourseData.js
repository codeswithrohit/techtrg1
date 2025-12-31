import React from 'react';
import fs from 'fs';
import path from 'path';

const CourseData = ({ videos }) => {
  const openPptInDefaultApp = (pptFilePath) => {
    if (typeof window !== 'undefined' && window.require) {
      const { shell } = window.require('electron');
      if (shell) {
        shell.openPath(pptFilePath);
      } else {
        console.error('Electron shell API not available');
      }
    } else {
      console.error('Electron API not available');
      // Handle alternative behavior for non-Electron environments (e.g., show an error message)
    }
  };
  
 
  

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Video List</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border-gray-200 shadow-md rounded-lg">
          <thead className="bg-gray-100 border-b border-gray-300">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subtitle</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lectures</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {videos.map((video) => (
              <tr key={video.id}>
                <td className="px-6 py-4 whitespace-nowrap">{video.title}</td>
                <td className="px-6 py-4 whitespace-nowrap">{video.subtitle}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <ul>
                    {video.lectures.map((lecture, index) => (
                      <li key={index} className="mt-2">
                        <p><strong>Lecture Title:</strong> {lecture.lectureTitle}</p>
                        {lecture.filetype === 'Video' ? (
                          <video src={lecture.videoPath} controls className="mt-2 w-full" />
                        ) : lecture.filetype === 'Ppt' ? (
                          <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            onClick={() => openPptInDefaultApp(lecture.videoPath)}
                          >
                            Open PowerPoint
                          </button>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export async function getServerSideProps() {
  const filePath = path.join(process.cwd(), 'data.json');
  const jsonData = fs.readFileSync(filePath, 'utf-8');
  const videos = JSON.parse(jsonData);

  console.log('Contents of data.json:');
  videos.forEach((video) => {
    console.log(`- Title: ${video.title}`);
    console.log(`  Subtitle: ${video.subtitle}`);
    console.log('  Lectures:');
    video.lectures.forEach((lecture, index) => {
      console.log(`    ${index + 1}. Lecture Title: ${lecture.lectureTitle}`);
      console.log(`       Video Path: ${lecture.videoPath}`);
      console.log(`       File type: ${lecture.filetype}`);
    });
  });

  return {
    props: {
      videos,
    },
  };
}

export default CourseData;
