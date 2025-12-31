import React, { useState } from "react";
import { FiLoader } from "react-icons/fi";
import { useRouter } from "next/router";

const SECCDR = ({ courses, isLoading }) => {
  const SECCDRCourses = courses.filter(course => course.name === "SEC-CDR");

  console.log("coursesseccdr", SECCDRCourses);

  return (
    <div className="min-h-screen bg-white mx-auto">
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <FiLoader className="animate-spin h-10 w-10 text-gray-500" />
        </div>
      ) : (
        <div className="flex w-full gap-2">
          <div className="flex-1">
            {SECCDRCourses.map((course, index) => (
              <Accordion
                key={course._id}
                title={course.subname}
                items={course.topics}
                isTopic={true}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Accordion component
const Accordion = ({ title, items, isTopic }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const router = useRouter();

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  const openVideoInModal = (videoLink) => {
    setModalContent(videoLink);
    setModalOpen(true);
  };

  const openPpt = async (filePath) => {
    const res = await fetch(filePath);
    const blob = await res.blob();
    const reader = new FileReader();

    reader.onloadend = () => {
      const base64data = reader.result;
      const byteCharacters = atob(base64data.split(',')[1]);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const pptBlob = new Blob([byteArray], { type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' });
      const blobUrl = URL.createObjectURL(pptBlob);

      const newWindow = window.open(blobUrl, '_blank');
      newWindow.onload = () => {
        newWindow.document.title = 'Open PPT';
      };
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
            className={`w-4 h-4 mr-2 transition-transform ${
              isOpen ? "transform rotate-180" : ""
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
          <p className="font-semibold text-lg text-gray-900">{title}</p>
        </div>
      </div>
      {isOpen && (
        <div className="p-4">
          {items.map((item, index) => (
            <div key={index} className="mb-2">
              {isTopic ? (
                <Accordion title={item.title} items={item.lectures} />
              ) : (
                <>
                  <p className="text-gray-800 font-bold">⮞ {item.title}</p>
                  {item.type === "video" ? (
                    <button
                      onClick={() => openVideoInModal(item.filePath)}
                      className="text-[#739072] hover:underline"
                    >
                      ⦿ {item.title}
                    </button>
                  ) : item.type === "ppt" ? (
                    <button
                      onClick={() => openPpt(item.filePath)}
                      className="text-[#739072]  hover:underline"
                    >
                      ⦿ {item.title}
                    </button>
                  ) : (
                    <a
                      href={item.filePath}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#739072] hover:underline"
                    >
                      ⦾ {item.title}
                    </a>
                  )}
                </>
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
