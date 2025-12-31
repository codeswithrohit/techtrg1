import React, { useState } from "react";
import { FiLoader } from "react-icons/fi";

const SECCDR = ({ courses, isLoading }) => {
  console.log("courses rect", courses);

  // Filter courses based on their name
  const aeiCourses = courses.filter(course => course.name === "AE-I");
  const aeiiCourses = courses.filter(course => course.name === "AE-II");

  return (
    <div className="min-h-screen bg-white mx-auto">
      <div className="max-w-screen-lg mx-auto">
        <div className="flex w-full gap-4">
          <div className="flex-1">
            <h1 className="text-center font-bold text-green-600 text-4xl">AE-I</h1>
            {!isLoading && aeiCourses.map((course) => (
              <Accordion key={course._id} title={course.subname} items={course.topics} />
            ))}
          </div>
          <div className="flex-1">
            <h1 className="text-center font-bold text-green-600 text-4xl">AE-II</h1>
            {!isLoading && aeiiCourses.map((course) => (
              <Accordion key={course._id} title={course.subname} items={course.topics} />
            ))}
          </div>
        </div>
      </div>
      {isLoading && (
        <div className="flex justify-center items-center h-screen">
          <FiLoader className="animate-spin h-10 w-10 text-gray-500" />
        </div>
      )}
    </div>
  );
};

// Accordion component
const Accordion = ({ title, items }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
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


  const closeModal = () => {
    setModalOpen(false);
    setModalContent("");
  };

  return (
    <div className="border border-gray-300 rounded-lg mb-4">
      <div
        className="flex justify-between items-center p-4 cursor-pointer bg-gray-100"
        onClick={toggleAccordion}
      >
        <div className="flex items-center">
          <svg
            className={`w-4 h-4 mr-2 transition-transform ${isOpen ? "transform rotate-180" : ""}`}
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
          <p className="font-semibold text-lg text-gray-900">{title}</p>
        </div>
      </div>
      {isOpen && (
        <div className="p-4">
          {items.map((item, index) => (
            <div key={index} className="mb-2">
              <p className="text-gray-800 font-bold">⮞ {item.title}</p>
              {item.lectures && (
  <div className="ml-4">
    {item.lectures.map((lecture, idx) => (
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
)}
            </div>
          ))}
        </div>
      )}
      {modalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
          onClick={closeModal}
        >
          <div className="bg-white p-4 rounded-md shadow-lg">
            <button className="text-gray-500 hover:text-gray-800" onClick={closeModal}>
              Close Modal
            </button>
            <video controls src={modalContent} className="w-full h-full max-h-screen"></video>
          </div>
        </div>
      )}
    </div>
  );
};

export default SECCDR;
