import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ManageSelectOption = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [subject, setSubject] = useState('');
  const [chapters, setChapters] = useState([{ name: '', lectures: [''] }]);
  const [subjectsData, setSubjectsData] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null); // State for editing

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const response = await fetch('/api/fetchSubjects'); // Correct API route
      if (!response.ok) {
        throw new Error('Failed to fetch subjects.');
      }
      const data = await response.json();
      setSubjectsData(data);
    } catch (error) {
      toast.error('Error fetching subjects');
      console.error('Error fetching subjects:', error);
    }
  };

  const handleSave = async () => {
    try {
      const url = selectedSubject ? '/api/editSubject' : '/api/uploadSubject';
      const method = selectedSubject ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: selectedSubject?._id, subject, chapters }),
      });

      if (response.ok) {
        toast.success('Subject, chapters, and lectures saved successfully!');
        setIsPopupOpen(false);
        setSubject('');
        setChapters([{ name: '', lectures: [''] }]);
        setSelectedSubject(null);
        fetchSubjects(); // Refresh the data after saving
      } else {
        toast.error('Failed to save data.');
        console.error('Failed to save data.');
      }
    } catch (error) {
      toast.error('Error saving data.');
      console.error('Error:', error);
    }
  };

  const handleDelete = async (subjectId) => {
    try {
      const response = await fetch(`/api/deleteSubject?id=${subjectId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Subject deleted successfully!');
        fetchSubjects(); // Refresh the data after deleting
      } else {
        toast.error('Failed to delete data.');
        console.error('Failed to delete data.');
      }
    } catch (error) {
      toast.error('Error deleting subject.');
      console.error('Error deleting subject:', error);
    }
  };

  const handleAddChapter = () => {
    setChapters([...chapters, { name: '', lectures: [''] }]);
  };

  const handleRemoveChapter = (index) => {
    const updatedChapters = chapters.filter((_, chapterIndex) => chapterIndex !== index);
    setChapters(updatedChapters);
  };

  const handleAddLecture = (chapterIndex) => {
    const updatedChapters = [...chapters];
    updatedChapters[chapterIndex].lectures.push('');
    setChapters(updatedChapters);
  };

  const handleRemoveLecture = (chapterIndex, lectureIndex) => {
    const updatedChapters = [...chapters];
    updatedChapters[chapterIndex].lectures = updatedChapters[chapterIndex].lectures.filter(
      (_, index) => index !== lectureIndex
    );
    setChapters(updatedChapters);
  };

  const handleChapterChange = (index, value) => {
    const updatedChapters = [...chapters];
    updatedChapters[index].name = value;
    setChapters(updatedChapters);
  };

  const handleLectureChange = (chapterIndex, lectureIndex, value) => {
    const updatedChapters = [...chapters];
    updatedChapters[chapterIndex].lectures[lectureIndex] = value;
    setChapters(updatedChapters);
  };

  const handleEdit = (subject) => {
    setSelectedSubject(subject);
    setSubject(subject.subject);
    setChapters(subject.chapters);
    setIsPopupOpen(true);
  };

  const handleViewLectures = (chapter) => {
    alert(`Lectures for Chapter "${chapter.name}":\n${chapter.lectures.join(', ')}`);
  };

  return (
    <div className='min-h-screen bg-white' >
    <div className="p-4 max-w-5xl mx-auto">
      <ToastContainer />

      <div className="flex justify-end mb-6">
        <button
          onClick={() => {
            setIsPopupOpen(true);
            setSelectedSubject(null); // Reset selected subject for adding new
            setSubject('');
            setChapters([{ name: '', lectures: [''] }]);
          }}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition-all"
        >
          Add Options
        </button>
      </div>

      {/* Display Subjects in a Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded-lg shadow-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 border-b">Subject</th>
              <th className="py-3 px-4 border-b">Chapters</th>
              <th className="py-3 px-4 border-b">Lectures</th>
              <th className="py-3 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {subjectsData.map((subject, index) => (
              <tr key={index} className="hover:bg-gray-50 transition-colors">
                <td className="py-3 px-4 border-b text-center " >{subject.subject}</td>
                <td className="py-3 px-4 border-b text-center">
                  {subject.chapters.map((chapter, idx) => (
                    <div key={idx} className="flex items-center justify-between mb-2">
                      {chapter.name}
                     
                    </div>
                  ))}
                </td>
                <td className="py-3 px-4 border-b text-center">
                  {subject.chapters.map((chapter, idx) => (
                    <div key={idx} className="flex items-center justify-between mb-2">
                   <button
                        onClick={() => handleViewLectures(chapter)}
                        className="bg-indigo-500 text-white px-3 py-1 rounded-lg shadow hover:bg-indigo-600 transition-all ml-2"
                      >
                        View Lectures
                      </button>
                     
                    </div>
                  ))}
                </td>
                <td className="py-3 px-4 border-b flex space-x-2">
                  <button
                    onClick={() => handleEdit(subject)}
                    className="bg-yellow-500 text-white px-4 py-2 rounded-lg shadow hover:bg-yellow-600 transition-all"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(subject._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600 transition-all"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isPopupOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-70 backdrop-blur-sm flex justify-center overflow-y-auto items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-2xl overflow-y-auto w-full h-full">
          <div className="flex justify-end mb-6">
        <button
          onClick={() => {
            setIsPopupOpen(false);
          }}
          className="bg-red-600 text-white px-6 py-2 rounded-lg shadow hover:bg-red-700 transition-all"
        >
        Close
        </button>
      </div>
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Enter Details</h2>
            <select
  value={subject}
  onChange={(e) => setSubject(e.target.value)}
  className="border p-3 rounded-lg mb-6 w-full focus:outline-none focus:border-blue-500"
>
  <option value="">Select Subject</option>
  <option value="SEC CDR">SEC CDR</option>
  <option value="PC">PC</option>
  <option value="AIBC">AIBC</option>
  <option value="ADC">ADC</option>
  <option value="MTCADRE">MTCADRE</option>
  <option value="CLC">CLC</option>
  <option value="LMC">LMC</option>
  <option value="ATGM">ATGM</option>
  <option value="SNIPER">SNIPER</option>
</select>


            {chapters.map((chapter, chapterIndex) => (
              <div key={chapterIndex} className="mb-4">
                <div className="flex items-center mb-2">
                  <input
                    type="text"
                    placeholder="Enter Chapter Name"
                    value={chapter.name}
                    onChange={(e) => handleChapterChange(chapterIndex, e.target.value)}
                    className="border p-3 rounded-lg w-full focus:outline-none focus:border-blue-500 mr-2"
                  />
                  <button
                    onClick={() => handleRemoveChapter(chapterIndex)}
                    className="bg-red-500 text-white px-3 py-1 rounded-lg shadow hover:bg-red-600 transition-all"
                  >
                    Remove
                  </button>
                </div>

                {chapter.lectures.map((lecture, lectureIndex) => (
                  <div key={lectureIndex} className="flex items-center mb-2">
                    <input
                      type="text"
                      placeholder="Enter Lecture Name"
                      value={lecture}
                      onChange={(e) =>
                        handleLectureChange(chapterIndex, lectureIndex, e.target.value)
                      }
                      className="border p-3 rounded-lg w-full focus:outline-none focus:border-blue-500 mr-2"
                    />
                    <button
                      onClick={() => handleRemoveLecture(chapterIndex, lectureIndex)}
                      className="bg-red-500 text-white px-3 py-1 rounded-lg shadow hover:bg-red-600 transition-all"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => handleAddLecture(chapterIndex)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition-all"
                >
                  Add Lecture
                </button>
              </div>
            ))}

            <button
              onClick={handleAddChapter}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg shadow hover:bg-green-600 transition-all w-full mb-4"
            >
              Add Chapter
            </button>
            <button
              onClick={handleSave}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition-all w-full"
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default ManageSelectOption;
