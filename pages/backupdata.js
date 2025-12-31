import React, { useState, useEffect } from "react";
import { FaDatabase, FaClipboardList, FaUserGraduate, FaBook, FaFileAlt, FaUpload } from "react-icons/fa";
import { useRouter } from "next/router";

const Backupdata = ({ userData }) => {
  const router = useRouter();
  const [coursesList, setCoursesList] = useState([]);
  const [preStudents, setPreStudents] = useState([]);
  const [maincourseStudents, setMaincourseStudents] = useState([]);
  const [backupMessage, setBackupMessage] = useState("");
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
    fetchStudents();
    fetchMainStudents();
  }, []);

  useEffect(() => {
    if (!userData) return;
    if (userData?.selectedCourse !== "MASTER ADMIN") {
      router.push("/");
    } else {
      setLoading(false);
    }
  }, [userData, router]);

  useEffect(() => {
    const fetchFiles = async () => {
      const res = await fetch('../api/fetch');
      const data = await res.json();
      setFiles(data);
    };
    fetchFiles();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await fetch("/api/fetchcourselist");
      const result = await res.json();
      if (result.success) setCoursesList(result.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const fetchStudents = async () => {
    try {
      const res = await fetch("/api/fetchstudents");
      const result = await res.json();
      if (result.success) setPreStudents(result.data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const fetchMainStudents = async () => {
    try {
      const res = await fetch("/api/maincourse");
      const result = await res.json();
      if (result.success) setMaincourseStudents(result.data);
    } catch (error) {
      console.error("Error fetching main course students:", error);
    }
  };

  const handleBackup = async (data, type) => {
    const currentDate = new Date().toISOString().split("T")[0];
    const fileName = `${type}-backup-${currentDate}.json`;
    const fileContent = JSON.stringify(data, null, 2);

    if (window.showSaveFilePicker) {
      try {
        const fileHandle = await window.showSaveFilePicker({
          suggestedName: fileName,
          types: [{ description: "JSON Files", accept: { "application/json": [".json"] } }],
        });
        const writable = await fileHandle.createWritable();
        await writable.write(fileContent);
        await writable.close();
      } catch (error) {
        console.error("Error saving file:", error);
      }
    } else {
      const file = new Blob([fileContent], { type: "application/json" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(file);
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    setBackupMessage(`${type} backup successfully downloaded!`);
    setTimeout(() => {
      setBackupMessage("");
    }, 3000);
  };

  const handleRestore = async (event, type) => {
    const file = event.target.files[0];
    if (!file) {
      console.error("No file selected.");
      return;
    }
  
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        const text = e.target.result.trim(); // Remove extra spaces or newlines
        if (!text) {
          throw new Error("File is empty or not valid JSON.");
        }
  
        const data = JSON.parse(text); // Attempt to parse JSON
  
        // Ensure the parsed data is an array
        if (!Array.isArray(data)) {
          throw new Error("Invalid data format. Expected an array.");
        }
  
        const response = await fetch("/api/restore", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type, data }),
        });
  
        const result = await response.json();
  
        if (result.success) {
          setBackupMessage(`${type} restored successfully!`);
          setTimeout(() => setBackupMessage(""), 3000);
        } else {
          console.error("Restore failed:", result.message);
        }
      } catch (error) {
        console.error("Error restoring data:", error.message);
      }
    };
  
    reader.readAsText(file);
  };
  
  

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-xl">Checking access...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray p-6">
      <div className="bg-gray shadow-xl rounded-2xl p-8 w-full max-w-md text-center border border-gray-200">
        <h2 className="text-2xl font-bold uppercase text-gray-800 flex items-center justify-center gap-2 mb-6">
          <FaDatabase className="text-blue-600" /> Backup & Restore Data
        </h2>

        {backupMessage && (
          <div className="bg-green-100 text-green-800 px-4 py-3 rounded-md mb-4 flex items-center gap-2 shadow-sm">
            ✅ {backupMessage}
          </div>
        )}

        <div className="flex flex-col space-y-4">
          {[
            { type: "Courses List", data: coursesList, icon: <FaClipboardList /> },
            { type: "Pre-Course Students", data: preStudents, icon: <FaUserGraduate /> },
            { type: "Main-Course Students", data: maincourseStudents, icon: <FaBook /> },
            { type: "Courses", data: files, icon: <FaFileAlt /> },
          ].map(({ type, data, icon }) => (
            <div key={type} className="flex flex-col items-center space-y-2">
              <button
                onClick={() => handleBackup(data, type)}
                className="flex items-center uppercase justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-5 rounded-lg shadow-md transition duration-300"
              >
                {icon} Backup {type}
              </button>
              <label className="flex items-center justify-center gap-2 bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg shadow-md transition duration-300 cursor-pointer">
                <FaUpload /> Restore {type}
                <input type="file" accept=".json" className="hidden" onChange={(e) => handleRestore(e, type)} />
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Backupdata;
