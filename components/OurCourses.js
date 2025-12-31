import React, { useState } from "react";
import { FiLoader } from "react-icons/fi";

// Grouping function (included here for completeness)
const groupCoursesByName = (courses) => {
  const grouped = courses.reduce((acc, course) => {
    if (!acc[course.name]) {
      acc[course.name] = [];
    }
    acc[course.name].push(course);
    return acc;
  }, {});

  return Object.entries(grouped).map(([name, courses]) => ({
    name,
    courses,
  }));
};

const OURCOURSES = ({ courses, isLoading }) => {
  const groupedCourses = groupCoursesByName(courses);

  return (
    <div className="min-h-screen bg-white mx-auto">
      <div className="max-w-screen-lg mx-auto grid grid-cols-2 gap-4">
        {groupedCourses.map((group) => (
          <div key={group.name} className="flex flex-col gap-4 mb-8">
            <h1 className="text-center font-bold text-green-600 text-4xl">
              {group.name}
            </h1>
            {group.courses.map((course) => (
              <div key={course._id} className="flex-1">
                {!isLoading && (
                  <Accordion subname={course.subname} topics={course.topics} />
                )}
              </div>
            ))}
          </div>
        ))}
      </div>

      {isLoading && (
        <div className="flex justify-center items-center h-screen">
          <FiLoader className="animate-spin h-10 w-10 text-gray-500" />
        </div>
      )}
    </div>
  );
};

// Accordion component (no changes needed here)
const Accordion = ({ subname, topics }) => {
  const [isSubOpen, setIsSubOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");

  const toggleSubAccordion = () => {
    setIsSubOpen(!isSubOpen);
  };

  const openVideoInModal = (videoLink) => {
    setModalContent(videoLink);
    setModalOpen(true);
  };

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
        if (newWindow) {
          newWindow.onload = () => {
            newWindow.document.title = 'Open PPT';
          };
        } else {
          alert("Popup was blocked. Please allow popups for this site.");
        }
      } else if (fileType === 'doc') {
        const blobUrl = URL.createObjectURL(blob);
  
        const newWindow = window.open(blobUrl, '_blank');
        if (newWindow) {
          newWindow.onload = () => {
            newWindow.document.title = 'Open DOC';
          };
        } else {
          alert("Popup was blocked. Please allow popups for this site.");
        }
      }
    };
  
    reader.readAsDataURL(blob);
  };
  

  const closeModal = () => {
    setModalOpen(false);
    setModalContent("");
  };

  return (
    <div className="border border-gray-300 rounded-lg mb-4">
      <div
        className="flex justify-between items-center p-4 cursor-pointer bg-gray-100"
        onClick={toggleSubAccordion}
      >
        <div className="flex items-center">
          <svg
            className={`w-4 h-4 mr-2 transition-transform ${
              isSubOpen ? "transform rotate-180" : ""
            }`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
          <p className="font-semibold text-lg text-gray-900">{subname}</p>
        </div>
      </div>
      {isSubOpen && (
        <div className="p-4">
          {topics.map((topic, index) => (
            <div key={index} className="mb-4">
              <div className="text-gray-800 font-bold text-lg">{topic.title}</div>
              {topic.lectures.map((lecture, idx) => (
                 <div key={idx} className="mb-1">
                 {lecture.type === "video" ? (
                   <button
                     onClick={() => openVideoInModal(lecture.filePath)}
                     className="text-blue-600 hover:underline"
                   >
                     ⦿ {lecture.title}
                   </button>
                 ) : (lecture.type === "ppt" || lecture.type === "pptx" || lecture.type === "doc") ? (
                   <button
                     onClick={() => openPptOrDoc(lecture.filePath, lecture.type)}
                     className="text-blue-600 hover:underline"
                   >
                     ⦿ {lecture.title}
                   </button>
                 ) : (
                   <a
                     href={lecture.filePath}
                     target="_blank"
                     rel="noopener noreferrer"
                     className="text-blue-600 hover:underline"
                   >
                     ⦾ {lecture.title}
                   </a>
                 )}
               </div>
              ))}
            </div>
          ))}
        </div>
      )}
      {modalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
          onClick={closeModal}
        >
          <div className="bg-white p-8 rounded-lg">
            <iframe
              src={modalContent}
              className="w-full h-64"
              title="Modal Content"
            ></iframe>
            <button
              className="mt-4 bg-red-500 text-white py-2 px-4 rounded"
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OURCOURSES;
