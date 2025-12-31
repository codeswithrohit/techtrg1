import React, { useState,useEffect } from "react";
import { useRouter } from "next/router";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaChevronUp, FaChevronDown } from 'react-icons/fa';
import axios from "axios";
const FileUploadForm = ({userData}) => {
  const router = useRouter();
  const [mainname, setMainName] = useState('');
  const [name, setName] = useState('');
  const [subname, setSubname] = useState('');
  const [topics, setTopics] = useState([{ title: '', lectures: [{ title: '', type: '', file: null }] }]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [files, setFiles] = useState([]);
  const [editingFile, setEditingFile] = useState(null); 
  const [filterName, setFilterName] = useState('');
  const [filterSubname, setFilterSubname] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const [expandedTopics, setExpandedTopics] = useState({});
  const [expandedLectures, setExpandedLectures] = useState({});

  const toggleTopics = (fileId) => {
    setExpandedTopics((prev) => ({
      ...prev,
      [fileId]: !prev[fileId],
    }));
  };
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userData) return; // Wait until userData is available

    if (userData?.selectedCourse !== "MASTER ADMIN") {
      router.push("/");
    } else {
      setLoading(false); // Stay on the page if the user is MASTER ADMIN
    }
  }, [userData, router]);
  const toggleLectures = (fileId, topicIndex) => {
    setExpandedLectures((prev) => ({
      ...prev,
      [`${fileId}-${topicIndex}`]: !prev[`${fileId}-${topicIndex}`],
    }));
  };
  useEffect(() => {
    const fetchFiles = async () => {
      const res = await fetch('../api/fetch');
      const data = await res.json();
      setFiles(data);
    };

    fetchFiles();
  }, []);
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const fetchPassword = async () => {
    try {
      const res = await axios.get("/api/password");
      setPassword(res.data?.password || "No password found");
      setMessage("");
    } catch (error) {
      setMessage("Error fetching password");
    }
  };
  useEffect(() => {
    fetchPassword();
  }, []);
  const openPptOrDoc = async (filePath, fileType) => {
    const res = await fetch(filePath);
    const blob = await res.blob();
    const reader = new FileReader();

    reader.onloadend = () => {
      const base64data = reader.result;
      if (fileType === 'ppt' || fileType === 'pptx') {
        const byteCharacters = atob(base64data.split(',')[1]);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' });
        const blobUrl = URL.createObjectURL(blob);

        const newWindow = window.open(blobUrl, '_blank');
        newWindow.onload = () => {
          newWindow.document.title = 'Open PPT';
        };
      } else if (fileType === 'doc') {
        const blobUrl = URL.createObjectURL(blob);

        const newWindow = window.open(blobUrl, '_blank');
        newWindow.onload = () => {
          newWindow.document.title = 'Open DOC';
        };
      }
    };

    reader.readAsDataURL(blob);
  };

  const handleMainnameChange = (e) => {
    setMainName(e.target.value);
    setName('');
    setSubname('');
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
    setSubname('');
  };

  const handleSubnameChange = (e) => {
    setSubname(e.target.value);
  };

  const handleTopicChange = (index, field, value) => {
    const newTopics = [...topics];
    newTopics[index][field] = value;
    setTopics(newTopics);
  };

  const handleLectureChange = (topicIndex, lectureIndex, field, value) => {
    const newTopics = [...topics];
    newTopics[topicIndex].lectures[lectureIndex][field] = value;
    setTopics(newTopics);
  };

  const handleAddTopic = () => {
    setTopics([...topics, { title: '', lectures: [{ title: '', type: '', file: null }] }]);
  };

  const handleAddLecture = (topicIndex) => {
    const newTopics = [...topics];
    newTopics[topicIndex].lectures.push({ title: '', type: '', file: null });
    setTopics(newTopics);
  };

  const handleRemoveTopic = (topicIndex) => {
    const newTopics = topics.filter((_, index) => index !== topicIndex);
    setTopics(newTopics);
  };

  const handleRemoveLecture = (topicIndex, lectureIndex) => {
    const newTopics = [...topics];
    newTopics[topicIndex].lectures = newTopics[topicIndex].lectures.filter((_, index) => index !== lectureIndex);
    setTopics(newTopics);
  };

  const handleFileChange = (topicIndex, lectureIndex, event) => {
    const file = event.target.files[0];
    const newTopics = [...topics];
    newTopics[topicIndex].lectures[lectureIndex].file = file;
    setTopics(newTopics);
  };
  

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Collect form data
    const formData = new FormData();
    formData.append('mainname', mainname);
    formData.append('name', name);
    formData.append('subname', subname);
    formData.append(
      'topics',
      JSON.stringify(
        topics.map(({ title, lectures }) => ({
          title,
          lectures: lectures.map(({ title, type, filePath }) => ({ title, type, filePath })),
        }))
      )
    );
    
    // Add files to FormData, including only files that are new or changed
    topics.forEach((topic, topicIndex) => {
      topic.lectures.forEach((lecture, lectureIndex) => {
        // Only append file if it's new or changed
        if (lecture.file && (!editingFile || !editingFile.lectures || !editingFile.lectures[lectureIndex] || lecture.file !== editingFile.lectures[lectureIndex].file)) {
          formData.append(`file-${topicIndex}-${lectureIndex}`, lecture.file);
        }
      });
    });
    
    // Determine URL and method for the request
    const url = editingFile ? `/api/update?id=${editingFile._id}` : '/api/upload';
    const method = editingFile ? 'PUT' : 'POST';
    
    try {
      const res = await fetch(url, {
        method,
        body: formData,
      });
    
      const responseData = await res.json();
      console.log('Response Data:', responseData);
    
      if (res.ok) {
        alert(`File ${editingFile ? 'updated' : 'uploaded'} successfully!`);
        // Reset form
        setMainName('');
        setName('');
        setSubname('');
        setTopics([{ title: '', lectures: [{ title: '', type: '', file: null, filePath: '' }] }]);
        setShowAddForm(false);
        setEditingFile(null);
        window.location.reload();
      } else {
        alert('Operation failed!');
      }
    } catch (error) {
      console.error('Error during submission:', error);
      alert('Failed to submit the form. See console for details.');
    }
  };
  
  
  
  
  
  

  const editFile = (file) => {
    setMainName(file.mainname);
    setName(file.name);
    setSubname(file.subname);
    setTopics(file.topics.map(topic => ({
      ...topic,
      lectures: topic.lectures.map(lecture => ({
        ...lecture,
        filePath: lecture.filePath || '' // Ensure filePath is preserved
      }))
    })));
    setEditingFile(file);
    setShowAddForm(true);
  };
  console.log("topics",topics)
  const deleteFile = async (fileId) => {
    console.log("Attempting to delete file with ID:", fileId); // Log file ID
  
    const confirmDelete = window.confirm("Are you sure you want to delete this file?");
    if (!confirmDelete) return;
  
    const enteredPassword = window.prompt("Enter delete password:");
    if (!enteredPassword) {
      toast.error("Password is required to delete the file.");
      return;
    }
  
    if (enteredPassword !== password) { // Ensure correctPassword is defined
      toast.error("Incorrect password. File deletion failed.");
      return;
    }
  
    try {
      const res = await fetch(`/api/delete?id=${fileId}`, {
        method: "DELETE",
      });
  
      console.log("Response status:", res.status); // Log the status code
  
      if (!res.ok) {
        const responseData = await res.json();
        throw new Error(responseData.message || "Failed to delete the file.");
      }
  
      const responseData = await res.json();
      console.log("Response data:", responseData); // Log the response data
  
      // Remove the deleted file from state
      setFiles((prevFiles) => prevFiles.filter((file) => file._id !== fileId));
  
      toast.success("File deleted successfully!");
    } catch (error) {
      console.error("Error deleting file:", error);
      toast.error(error.message || "An error occurred while deleting the file.");
    }
  };
  
  
  const [subjectsData, setSubjectsData] = useState([]);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
        const response = await fetch('../api/fetchSubjects'); // Correct API route
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

  console.log("subjectdata",subjectsData)

  const subnameOptions = {
    BMT: ['WT', 'CQB'],
    AMT: ['WT', 'CQB'],
    'AE-I': ['WT', 'CQB'],
    'AE-II': ['WT', 'CQB'],
    'SEC-CDR': ['Weapon', 'Tactics'],
  };

  const toggleAddForm = () => {
    setShowAddForm(!showAddForm);
    setEditingFile(null); // Reset editing state when closing the form
  };

  const filteredFiles = files.filter(file => {
    const matchesName = filterName ? file.name.toLowerCase().includes(filterName.toLowerCase()) : true;
    const matchesSubname = filterSubname ? file.subname.toLowerCase() === filterSubname.toLowerCase() : true;
    const matchesSearch = searchTerm ? `${file.name} ${file.subname}`.toLowerCase().includes(searchTerm.toLowerCase()) : true;
    return matchesName && matchesSubname && matchesSearch;
  });
  if (loading) {
    return <div className="flex justify-center items-center h-screen text-xl">Checking access...</div>;
  }
  return (
    <div className="min-h-screen items-center justify-center bg-white py-2 px-4 sm:px-6 lg:px-8">
      <div className="w-full  bg-white ">
      <div className="flex justify-end mr-16 mt-12">
          <a href="/Admin/manageseleteoption"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Add Courses Options
          </a>
        </div>
        <div className="flex mt-4 justify-end mr-16">
          <button
            onClick={toggleAddForm}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {showAddForm ? 'Close Form' : 'Add Course'}
          </button>
        </div>
     
        <h1 className="text-3xl font-bold mb-6 text-center underline font-mono ">Courses</h1>
      <div className="max-w-md px-4 mx-auto mb-2">
        {/* <div>
          <label className="block text-sm font-medium text-gray-700">Filter by Name</label>
          <select
            value={filterName}
            onChange={(e) => setFilterName(e.target.value)}
            className="mt-1 block w-full p-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">All Names</option>
            {files.map((file) => (
              <option key={file._id} value={file.name}>
                {file.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Filter by Subname</label>
          <select
            value={filterSubname}
            onChange={(e) => setFilterSubname(e.target.value)}
            className="mt-1 block w-full p-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">All Subnames</option>
            {files.map((file) => (
              <option key={file._id} value={file.subname}>
                {file.subname}
              </option>
            ))}
          </select>
        </div> */}
       <div className="relative">
                <svg xmlns="http://www.w3.org/2000/svg" className="absolute top-0 bottom-0 w-6 h-6 my-auto text-gray-400 left-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Name or Subname"
            className="w-full py-3 pl-12 pr-4 text-gray-500 border rounded-md outline-none bg-gray-50 focus:bg-white focus:border-indigo-600"
          />
        </div>
      </div>
      <div className="overflow-x-auto mb-20 ">
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Subname
            </th>
            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              View Topics
            </th>
            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredFiles.map((file) => (
            <tr key={file._id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {file.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {file.subname}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  onClick={() => toggleTopics(file._id)}
                  className="text-blue-600 font-mono uppercase hover:underline flex items-center"
                >
                  View Topics
                  {expandedTopics[file._id] ? <FaChevronUp className="ml-2" /> : <FaChevronDown className="ml-2" />}
                </button>
                {expandedTopics[file._id] && (
                  <div className="mt-2 ml-4">
                    {(file.topics || []).map((topic, topicIndex) => (
                      <div key={topicIndex} className="mb-2">
                        <div
                          className="cursor-pointer font-mono uppercase font-bold flex items-center"
                          onClick={() => toggleLectures(file._id, topicIndex)}
                        >
                          {`${topicIndex + 1}. ${topic.title}`}
                          {expandedLectures[`${file._id}-${topicIndex}`] ? (
                            <FaChevronUp className="ml-2" />
                          ) : (
                            <FaChevronDown className="ml-2" />
                          )}
                        </div>
                        {expandedLectures[`${file._id}-${topicIndex}`] && (
                          <div className="pl-4">
                            {(topic.lectures || []).map((lecture, lectureIndex) => (
                              <div key={lectureIndex} className="pl-4 flex gap-4">
                                <div className="font-semibold font-mono uppercase">
                                {`${lectureIndex + 1}. ${lecture.title}`}  -
                                </div>
                                {lecture.type === 'ppt' ||
                                lecture.type === 'pptx' ||
                                lecture.type === 'doc' ? (
                                  <button
                                    onClick={() => openPptOrDoc(lecture.filePath, lecture.type)}
                                    className="text-blue-600 font-mono uppercase hover:underline"
                                  >
                                    View {lecture.type.toUpperCase()}
                                  </button>
                                ) : (
                                  <a
                                    href={lecture.filePath}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline"
                                  >
                                    View {lecture.type.charAt(0).toUpperCase() + lecture.type.slice(1)}
                                  </a>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button onClick={() => editFile(file)} className="text-yellow-600 hover:underline mr-2">
                  Edit
                </button>
                <button onClick={() => deleteFile(file._id)} className="text-red-600 hover:underline">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
        {showAddForm && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-white bg-opacity-90 flex items-center justify-center ">
    <div className=" w-full bg-white rounded-lg shadow-lg overflow-y-auto h-full p-8">
    <div className="flex justify-end">
  <button
    onClick={toggleAddForm}
    className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${showAddForm ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500' : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'} focus:outline-none focus:ring-2 focus:ring-offset-2`}
  >
    {showAddForm ? 'Close Form' : 'Add Course'}
  </button>
</div>

          <form onSubmit={handleSubmit} className="space-y-8 p-8">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
          <label htmlFor="mainname" className="block text-sm font-medium text-gray-700">Select Subject</label>
          <select id="mainname" value={mainname} onChange={handleMainnameChange} className="mt-1 block w-full p-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
            <option value="">Select Subject</option>
            {subjectsData.map((subject, index) => (
              <option key={index} value={subject.subject}>{subject.subject}</option>
            ))}
          </select>
        </div>
        <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Select Chapter</label>
            <select id="name" value={name} onChange={handleNameChange} className="mt-1 block w-full p-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
              <option value="">Select Chapter</option>
              {subjectsData
                .find((subject) => subject.subject === mainname)?.chapters.map((chapter, index) => (
                  <option key={index} value={chapter.name}>{chapter.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="subname" className="block text-sm font-medium text-gray-700">Select Lecture</label>
            <select id="subname" value={subname} onChange={handleSubnameChange} className="mt-1 block w-full p-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
              <option value="">Select Lecture</option>
              {subjectsData
                .find((subject) => subject.subject === mainname)?.chapters
                .find((chapter) => chapter.name === name)?.lectures.map((lecture, index) => (
                  <option key={index} value={lecture}>{lecture}</option>
              ))}
            </select>
          </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Topics</label>
              {topics.map((topic, topicIndex) => (
                <div key={topicIndex} className="space-y-4 border p-4 rounded-md bg-gray-50">
                   <div className="flex justify-between">
                  <h3 className="text-lg font-medium text-gray-900">Topic {topicIndex + 1}</h3>
                  <button
                    type="button"
                    onClick={() => handleRemoveTopic(topicIndex)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove Topic
                  </button>
                </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Topic Title"
                      value={topic.title}
                      id={`topic-${topicIndex}`}
                      onChange={(e) => handleTopicChange(topicIndex, 'title', e.target.value)}
                      className="mt-1 block w-full rounded-md p-2 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                  {topic.lectures.map((lecture, lectureIndex) => (
                    <div key={lectureIndex} className="space-y-4">
                       <div className="flex justify-between">
                      <h4 className="text-lg font-medium text-gray-800">Lecture {lectureIndex + 1}</h4>
                      <button
                        type="button"
                        onClick={() => handleRemoveLecture(topicIndex, lectureIndex)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove Lecture
                      </button>
                    </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <input
                          type="text"
                          placeholder="Lecture Title"
                          id={`lecture-title-${topicIndex}-${lectureIndex}`}
                          value={lecture.title}
                          onChange={(e) => handleLectureChange(topicIndex, lectureIndex, 'title', e.target.value)}
                          className="mt-1 block w-full rounded-md p-2 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                        <select
                          value={lecture.type}
                          id={`lecture-type-${topicIndex}-${lectureIndex}`}
                          onChange={(e) => handleLectureChange(topicIndex, lectureIndex, 'type', e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        >
                          <option value="">Select Type</option>
                          <option value="video">Video</option>
                          <option value="ppt">PPT</option>
                          <option value="image">Image</option>
                          <option value="doc">Doc</option>
                          <option value="pdf">PDF</option>
                        </select>
                        <div className="col-span-1">
                        <label htmlFor={`lecture-file-${topicIndex}-${lectureIndex}`} className="block text-sm font-medium text-gray-700">
                          Upload File
                        </label>
                        <input
                          type="file"
                          id={`lecture-file-${topicIndex}-${lectureIndex}`}
                          onChange={(e) => handleFileChange(topicIndex, lectureIndex, e)}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 sm:text-sm"
                        />
                      </div>
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => handleAddLecture(topicIndex)}
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Add Lecture
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddTopic}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Add Topic
              </button>
            </div>
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Submit
            </button>
          </form>
          </div>
          </div>
        )}
      </div>
      <ToastContainer/>
     
    </div>
  );
};

export default FileUploadForm;
