import { useEffect, useState } from 'react';

const Files = () => {
  const [files, setFiles] = useState([]);
  const [editingFile, setEditingFile] = useState(null);
  const [name, setName] = useState('');
  const [subname, setSubname] = useState('');
  const [topics, setTopics] = useState([]);
  const [filterName, setFilterName] = useState('');
  const [filterSubname, setFilterSubname] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchFiles = async () => {
      const res = await fetch('/api/upload');
      const data = await res.json();
      setFiles(data);
    };

    fetchFiles();
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

  const deleteFile = async (id) => {
    await fetch(`/api/upload?id=${id}`, { method: 'DELETE' });
    setFiles(files.filter(file => file._id !== id));
  };

  const editFile = (file) => {
    setEditingFile(file);
    setName(file.name);
    setSubname(file.subname);
    setTopics(file.topics);
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleSubnameChange = (e) => {
    setSubname(e.target.value);
  };

  const handleTopicChange = (topicIndex, field, value) => {
    const updatedTopics = [...topics];
    updatedTopics[topicIndex][field] = value;
    setTopics(updatedTopics);
  };

  const handleLectureChange = (topicIndex, lectureIndex, field, value) => {
    const updatedTopics = [...topics];
    updatedTopics[topicIndex].lectures[lectureIndex][field] = value;
    setTopics(updatedTopics);
  };

  const handleFileChange = (topicIndex, lectureIndex, file) => {
    const updatedTopics = [...topics];
    updatedTopics[topicIndex].lectures[lectureIndex].file = file;
    setTopics(updatedTopics);
  };

  const handleAddLecture = (topicIndex) => {
    const updatedTopics = [...topics];
    updatedTopics[topicIndex].lectures.push({ title: '', type: '', file: null });
    setTopics(updatedTopics);
  };

  const handleAddTopic = () => {
    setTopics([...topics, { title: '', lectures: [{ title: '', type: '', file: null }] }]);
  };

  const saveEdit = async (e) => {
    e.preventDefault();
    await fetch(`/api/upload?id=${editingFile._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, subname, topics }),
    });
    setFiles(files.map(file => file._id === editingFile._id ? { ...file, name, subname, topics } : file));
    setEditingFile(null);
  };

  const filteredFiles = files.filter(file => {
    const matchesName = filterName ? file.name.toLowerCase().includes(filterName.toLowerCase()) : true;
    const matchesSubname = filterSubname ? file.subname.toLowerCase() === filterSubname.toLowerCase() : true;
    const matchesSearch = searchTerm ? `${file.name} ${file.subname}`.toLowerCase().includes(searchTerm.toLowerCase()) : true;
    return matchesName && matchesSubname && matchesSearch;
  });

  return (
    <div className="bg-white">
      <h1 className="text-3xl font-bold mb-6 text-center">Courses</h1>
      <div className="flex justify-center space-x-4 mb-4">
        <div>
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
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Search by Name or Subname</label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search..."
            className="mt-1 block w-full p-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Subname</th>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Topics</th>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredFiles.map((file) => (
              <tr key={file._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{file.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{file.subname}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {file.topics.map((topic, topicIndex) => (
                    <div key={topicIndex} className="mb-2 flex">
                      <div className="font-bold">{topic.title}</div>
                      {topic.lectures.map((lecture, lectureIndex) => (
                        <div key={lectureIndex} className="pl-4 ">
                          <div className="font-semibold">{lecture.title} ({lecture.type})</div>
                          {lecture.type === 'ppt' || lecture.type === 'pptx' || lecture.type === 'doc' ? (
                            <button onClick={() => openPptOrDoc(lecture.filePath, lecture.type)} className="text-blue-600 hover:underline">
                              View {lecture.type.toUpperCase()}
                            </button>
                          ) : (
                            <a href={lecture.filePath} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                              View {lecture.type.charAt(0).toUpperCase() + lecture.type.slice(1)}
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  ))}
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
      {editingFile && (
     <div className="fixed inset-0 bg-gray-600 mb-50 bg-opacity-50 flex items-center justify-center">
  <div className="bg-white p-6 rounded-md shadow-md w-full max-w-lg overflow-y-auto max-h-[80vh]">
            <h2 className="text-xl font-bold mb-4">Edit File</h2>
            <form onSubmit={saveEdit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={handleNameChange}
                  className="mt-1 block w-full p-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Subname</label>
                <input
                  type="text"
                  value={subname}
                  onChange={handleSubnameChange}
                  className="mt-1 block w-full p-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              {topics.map((topic, topicIndex) => (
                <div key={topicIndex} className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Topic Title</label>
                  <input
                    type="text"
                    value={topic.title}
                    onChange={(e) => handleTopicChange(topicIndex, 'title', e.target.value)}
                    className="mt-1 block w-full p-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                  {topic.lectures.map((lecture, lectureIndex) => (
                    <div key={lectureIndex} className="mt-4">
                      <label className="block text-sm font-medium text-gray-700">Lecture Title</label>
                      <input
                        type="text"
                        value={lecture.title}
                        onChange={(e) => handleLectureChange(topicIndex, lectureIndex, 'title', e.target.value)}
                        className="mt-1 block w-full p-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                      <label className="block text-sm font-medium text-gray-700 mt-2">Lecture Type</label>
                      <select
                        value={lecture.type}
                        onChange={(e) => handleLectureChange(topicIndex, lectureIndex, 'type', e.target.value)}
                        className="mt-1 block w-full p-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      >
                        <option value="video">Video</option>
                        <option value="ppt">PPT</option>
                        <option value="pptx">PPTX</option>
                        <option value="doc">DOC</option>
                        <option value="image">Image</option>
                      </select>
                      <label className="block text-sm font-medium text-gray-700 mt-2">Lecture File</label>
                      <input
                        type="file"
                        onChange={(e) => handleFileChange(topicIndex, lectureIndex, e.target.files[0])}
                        className="mt-1 block w-full p-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                  ))}
                  <button type="button" onClick={() => handleAddLecture(topicIndex)} className="mt-2 text-blue-600 hover:underline">
                    Add Lecture
                  </button>
                </div>
              ))}
              <button type="button" onClick={handleAddTopic} className="mt-2 text-blue-600 hover:underline">
                Add Topic
              </button>
              <div className="mt-6 flex justify-end space-x-4">
                <button type="button" onClick={() => setEditingFile(null)} className="bg-gray-600 text-white px-4 py-2 rounded-md shadow-sm hover:bg-gray-700">
                  Cancel
                </button>
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-700">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Files;
