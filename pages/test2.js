import React, { useState, useEffect, useRef } from "react";
import { FiEye, FiX } from "react-icons/fi";
import axios from "axios";
import { FaRegNewspaper } from "react-icons/fa";
const Test2 = () => {
  const [prestudents, setPreStudents] = useState([]);
  const [maincoursestudents, setMaincourseStudents] = useState([]);
  const [preselectedStudent, setPreSelectedStudent] = useState(null);
  const [mainselectedStudent, setMainSelectedStudent] = useState(null);
  const [coursesData, setCoursesData] = useState([]);
  const [selectedMisStudents, setSelectedMisStudents] = useState(null);
  const [newsList, setNewsList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef(null);


  const fetchPreStudents = async () => {
    try {
      const res = await fetch("/api/fetchstudents");
      const result = await res.json();
      if (result.success) {
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0); // Normalize time to midnight
  
        const filteredPreStudents = result.data.filter((student) => {
          if (!student.targetYearPreCourse) return false;
  
          const [startDateStr, endDateStr] = student.targetYearPreCourse.split(" to ");
          const startDate = new Date(startDateStr);
          const endDate = new Date(endDateStr);
  
          // Normalize start and end dates to midnight
          startDate.setHours(0, 0, 0, 0);
          endDate.setHours(23, 59, 59, 999); // Extend endDate to cover the entire day
  
          return currentDate >= startDate && currentDate <= endDate;
        });
  
        setPreStudents(filteredPreStudents);
      }
    } catch (error) {
      console.error("Error fetching Pre Course students:", error);
    }
  };
  

  const fetchMainStudents = async () => {
    try {
      const res = await fetch("/api/maincourse");
      const result = await res.json();
      if (result.success) {
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0); // Normalize time to midnight
  
        const filteredMainStudents = result.data.filter((student) => {
          if (!student.targetYearMainCourse) return false;
  
          const [startDateStr, endDateStr] = student.targetYearMainCourse.split(" to ");
          const startDate = new Date(startDateStr);
          const endDate = new Date(endDateStr);
  
          // Normalize start and end dates to midnight
          startDate.setHours(0, 0, 0, 0);
          endDate.setHours(23, 59, 59, 999); // Extend endDate to cover the entire day
  
          return currentDate >= startDate && currentDate <= endDate;
        });
        setMaincourseStudents(filteredMainStudents);
      }
    } catch (error) {
      console.error("Error fetching Main Course students:", error);
    }
  };
  useEffect(() => {
    const fetchCoursesData = async () => {
      try {
        const response = await fetch("/api/missleneousdata");
        const data = await response.json();
        if (response.ok) {
          if (Array.isArray(data.orders)) {
            const currentDate = new Date();
            const filteredCourses = data.orders.filter(course => {
              const startDate = new Date(course.startDate);
              const endDate = new Date(course.endDate);
              return currentDate >= startDate && currentDate <= endDate;
            });
            setCoursesData(filteredCourses);
          } else {
            console.error("Fetched data is not an array:", data);
          }
        } else {
          alert("Failed to fetch courses data");
        }
      } catch (error) {
        console.error("Error fetching courses data:", error);
        alert("Error fetching courses data");
      }
    };

    fetchCoursesData();
  }, []);

  const fetchNews = async () => {
    try {
      const { data } = await axios.get("/api/news");
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);

      const filteredNews = data.news.filter((news) => {
        const endDate = new Date(news.endDate);
        endDate.setHours(0, 0, 0, 0);
        return endDate >= currentDate;
      });

      setNewsList(filteredNews);
    } catch (error) {
      console.error("Error fetching news", error);
    }
  };

  useEffect(() => {
    fetchNews();
    const interval = setInterval(fetchNews, 60000); // Auto-fetch news every 60 seconds
    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    fetchPreStudents();
    fetchMainStudents();
  }, []);
  useEffect(() => {
    if (newsList.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % newsList.length);
      }, 3000); // Scroll every 3 seconds
    }
    return () => clearInterval(intervalRef.current);
  }, [newsList]);
  const scrollingList = [...newsList, ...newsList];
  const scrollRef = useRef(null);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    let scrollAmount = 0;

    const scrollInterval = setInterval(() => {
      if (scrollContainer) {
        scrollAmount += 1;
        if (scrollAmount >= scrollContainer.scrollHeight - scrollContainer.clientHeight) {
          scrollAmount = 0; // Reset scroll to top when reaching the end
        }
        scrollContainer.scrollTo({
          top: scrollAmount,
          behavior: "smooth",
        });
      }
    }, 100);

    return () => clearInterval(scrollInterval);
  }, []);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    let scrollAmount = 1;
    const scrollStep = 1;
    const scrollInterval = 50;

    const scroll = () => {
      if (scrollContainer.scrollTop + scrollContainer.clientHeight >= scrollContainer.scrollHeight) {
        scrollContainer.scrollTop = 0;
      } else {
        scrollContainer.scrollTop += scrollStep;
      }
    };

    const interval = setInterval(scroll, scrollInterval);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="relative min-h-screen w-full bg-cover bg-center flex flex-col items-center justify-center p-4" style={{ backgroundImage: "url('/hero-img2.jpg')" }}>
    <div className="flex flex-row items-start w-full gap-4 mt-12 px-4">
  <div className="w-full max-w-3xl bg-white/10 backdrop-blur-lg shadow-2xl rounded-xl p-6 border border-gray-300 flex flex-col min-h-[20rem]">
    <div ref={scrollContainerRef} className="h-[20rem] overflow-y-auto p-4">
      <h2 className="text-lg font-semibold text-white mb-3 underline">Pre Student Data</h2>
      <div className="grid grid-cols-1 gap-4">
        {prestudents.map((student, index) => (
          <div
            onClick={() => setPreSelectedStudent(student)}
            key={student._id}
            className="p-4 underline cursor-pointer border rounded-lg shadow-md bg-white flex items-center gap-x-4"
          >
            <p className="font-semibold">{index + 1}. {student.selectedCourse || "N/A"}</p>
            <p className="text-gray-600 font-semibold">{student.selectedTitle || "N/A"}</p>
            <p className="text-gray-600 font-semibold">{student.selectedMaintitle || "N/A"}</p>
            <p className="text-gray-600 font-semibold">{student.targetYearPreCourse || "N/A"}</p>
          </div>
        ))}
      </div>
      
      <h2 className="text-lg font-semibold text-white mt-6 mb-3 underline">Main Student Data</h2>
      <div className="grid grid-cols-1 gap-4">
        {maincoursestudents.map((student, index) => (
          <div
            onClick={() => setMainSelectedStudent(student)}
            key={student._id}
            className="p-4 underline cursor-pointer border rounded-lg shadow-md bg-white flex items-center gap-x-4"
          >
            <p className="font-semibold">{prestudents.length + index + 1}. {student.precourse || "N/A"}</p>
            <p className="text-gray-600 font-semibold">{student.maincourse || "N/A"}</p>
            <p className="text-gray-600 font-semibold">{student.course || "N/A"}</p>
            <p className="text-gray-600 font-semibold">{student.targetYearMainCourse || "N/A"}</p>
          </div>
        ))}
      </div>

      <h2 className="text-lg font-semibold text-white mt-6 mb-3 underline">Miscellaneous Student Data</h2>
      <div className="grid grid-cols-1 gap-4">
        {coursesData.map((student, index) => (
          <div
            onClick={() => setSelectedMisStudents(student.students)}
            key={student._id}
            className="p-4 underline cursor-pointer border rounded-lg shadow-md bg-white flex items-center gap-x-4"
          >
            <p className="font-semibold">{prestudents.length + index + 1}. {student.course || "N/A"}</p>
            <p className="text-gray-600 font-semibold">{student.location || "N/A"}</p>
            <p className="text-gray-600 font-semibold">{new Date(student.startDate).toLocaleDateString()}</p>
            <p className="text-gray-600 font-semibold">{new Date(student.endDate).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  </div>

  <div className="w-full max-w-3xl bg-white/10 backdrop-blur-lg shadow-2xl rounded-xl p-6 border border-gray-300 flex flex-col min-h-[23rem]">
    <div className="flex items-center gap-3">
      <FaRegNewspaper className="text-blue-500 text-3xl" />
      <h2 className="text-lg font-semibold text-white">Latest News</h2>
    </div>

    <div
      ref={scrollRef}
      className="max-h-64 overflow-y-hidden space-y-3 relative flex-grow"
      onMouseEnter={() => (scrollRef.current.style.overflowY = "auto")}
      onMouseLeave={() => (scrollRef.current.style.overflowY = "hidden")}
    >
      {scrollingList.map((news, index) => (
        <div
          key={index}
          className="flex items-start gap-4 bg-gray-800/60 p-4 rounded-lg shadow-md border border-gray-600 hover:bg-gray-700 transition-all"
        >
          <div className="w-10 h-10 flex items-center justify-center bg-blue-500 rounded-full text-white text-lg font-bold">
            {index + 1}
          </div>
          <div>
            <h3 className="text-md font-semibold text-white">{news.title}</h3>
            <p className="text-sm text-gray-300">
              {new Date(news.startDate).toLocaleDateString()} - {new Date(news.endDate).toLocaleDateString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  </div>
</div>



    
      {/* Student Details Modal */}
      {mainselectedStudent && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white px-6 py-16 rounded-lg shadow-lg w-full h-full">
            <h2 className="text-xl font-bold mb-4">Student Details</h2>
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border p-2">Name</th>
                  <th className="border p-2">Army No</th>
                  <th className="border p-2">Grading</th>
                  <th className="border p-2">Rank</th>
                  <th className="border p-2">Unit No</th>
                  <th className="border p-2">Phase</th>
                  <th className="border p-2">Scores</th>
                </tr>
              </thead>
              <tbody>
                {mainselectedStudent.students.map((s, idx) => (
                  <tr key={idx} className="text-center border-t">
                    <td className="border p-2">{s.name}</td>
                    <td className="border p-2">{s.armyno}</td>
                    <td className="border p-2">{s.grading}</td>
                    <td className="border p-2">{s.rankno}</td>
                    <td className="border p-2">{s.unitno}</td>
                    <td className="border p-2">{s.phase}</td>
                    <td className="border p-2">
                      {s.scores ? (
                        Object.entries(s.scores).map(([key, value]) => (
                          <div key={key}>{key}: {value}</div>
                        ))
                      ) : (
                        "N/A"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
              onClick={() => setMainSelectedStudent(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
      
      {preselectedStudent && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white px-6 py-16  rounded-lg shadow-lg w-full h-full">
            <h2 className="text-xl font-bold mb-4">Student Details</h2>
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border p-2">Army No</th>
                  <th className="border p-2">Rank No</th>
                  <th className="border p-2">Name</th>
                  <th className="border p-2">Unit No</th>
                  <th className="border p-2">Phase</th>
                  <th className="border p-2">Scores</th>
                </tr>
              </thead>
              <tbody>
                {preselectedStudent.students.map((stud, i) => (
                  <tr key={i} className="text-center border-t">
                    <td className="border p-2">{stud.armyno}</td>
                    <td className="border p-2">{stud.rankno}</td>
                    <td className="border p-2">{stud.name}</td>
                    <td className="border p-2">{stud.unitno}</td>
                    <td className="border p-2">{stud.phase}</td>
                    <td className="border p-2">
                      {stud.scores ? Object.entries(stud.scores).map(([key, value]) => (
                        <div key={key}>{key}: {value}</div>
                      )) : "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button onClick={() => setPreSelectedStudent(null)} className="mt-4 bg-red-500 text-white px-3 py-1 rounded">Close</button>
          </div>
        </div>
      )}
         {selectedMisStudents && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center py-12">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full h-full relative animate-fade-in">
            <button
              onClick={() => setSelectedMisStudents(null)}
              className="absolute top-3 right-3 text-red-500 hover:text-red-700"
            >
              <FiX size={20} />
            </button>
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Students</h3>
            <table className="min-w-full border border-gray-300 bg-white shadow-md rounded-md">
  <thead>
    <tr className="bg-gray-200 text-left">
      <th className="p-3 border border-gray-300">Name</th>
      <th className="p-3 border border-gray-300">Army No</th>
      <th className="p-3 border border-gray-300">Rank</th>
      <th className="p-3 border border-gray-300">Unit</th>
    </tr>
  </thead>
  <tbody>
    {selectedMisStudents.map((student,index) => (
      <tr key={student._id} className="border border-gray-300 hover:bg-gray-100">
        <td className="p-3 border border-gray-300">{index + 1}.{student.name}</td>
        <td className="p-3 border border-gray-300">{student.armyNo}</td>
        <td className="p-3 border border-gray-300">{student.rank}</td>
        <td className="p-3 border border-gray-300">{student.unit}</td>
      </tr>
    ))}
  </tbody>
</table>

            <button
              onClick={() => setSelectedMisStudents(null)}
              className="mt-5 w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Test2;