import React, { useState, useEffect, useRef } from "react";
import { FiEye, FiX } from "react-icons/fi";
import axios from "axios";
import { FaRegNewspaper } from "react-icons/fa";

const Aboutus = () => {
  const [prestudents, setPreStudents] = useState([]);
  const [maincoursestudents, setMaincourseStudents] = useState([]);
  const [preselectedStudent, setPreSelectedStudent] = useState(null);
  const [mainselectedStudent, setMainSelectedStudent] = useState(null);
  const [coursesData, setCoursesData] = useState([]);
  const [selectedMisStudents, setSelectedMisStudents] = useState(null);
  const [newsList, setNewsList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef(null);
  const preTableRef = useRef(null);
  const mainTableRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const [scrollDirection, setScrollDirection] = useState("down");

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const scrollStep = 1; // Pixels per step
    const scrollInterval = 50; // Time interval in ms

    const scroll = () => {
      if (scrollDirection === "down") {
        scrollContainer.scrollTop += scrollStep;
        if (scrollContainer.scrollTop + scrollContainer.clientHeight >= scrollContainer.scrollHeight) {
          setScrollDirection("up");
        }
      } else {
        scrollContainer.scrollTop -= scrollStep;
        if (scrollContainer.scrollTop <= 0) {
          setScrollDirection("down");
        }
      }
    };

    const intervalId = setInterval(scroll, scrollInterval);
    return () => clearInterval(intervalId);
  }, [scrollDirection]);
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
  return (
    <div className="min-h-screen">
                <section className="relative overflow-hidden">
            <div className="absolute -z-10 w-full mx-auto">
               {/* <video autoPlay muted loop className="h-full w-full object-cover" >
                    <source src="about-vid.mp4" type="video/mp4" />
                </video>  */}
                <img className='object-contain' src='/Trg Collage copy.jpg'/>
            </div>
            <div className="flex flex-col items-center w-full mt-48 px-4">
      <div className="bg-transparent p-6 rounded-xl shadow-xl w-full overflow-hidden relative">
        
      <div ref={scrollContainerRef} className="h-[20rem] overflow-y-auto border rounded-lg shadow-sm bg-white bg-opacity-70">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-blue-600 text-white text-left">
            <th className="p-3">Pre Course</th>
            <th className="p-3">Main Course</th>
            <th className="p-3">Course</th>
            <th className="p-3">Duration</th>
            <th className="p-3 text-center">Action</th>
          </tr>
        </thead>
        <tbody className="text-gray-800">
          <tr className="bg-gray-100 text-center">
            <td colSpan={5} className="p-3 text-md underline font-semibold">Pre Course Student Data</td>
          </tr>
          {prestudents.map((student, index) => (
            <tr key={student._id} className="border-b hover:bg-gray-50">
              <td className="p-3">{index + 1}. {student.selectedTitle || "N/A"}</td>
              <td className="p-3">{student.selectedMaintitle || "N/A"}</td>
              <td className="p-3">{student.selectedCourse || "N/A"}</td>
              <td className="p-3">{student.targetYearPreCourse || "N/A"}</td>
              <td className="p-3 text-center">
                <button
                  onClick={() => setPreSelectedStudent(student)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  View
                </button>
              </td>
            </tr>
          ))}
          <tr className="bg-gray-100 text-center">
            <td colSpan={5} className="p-3 text-md underline font-semibold">Main Course Student Data</td>
          </tr>
          {maincoursestudents.map((student, index) => (
            <tr key={student._id} className="border-b hover:bg-gray-50">
              <td className="p-3">{prestudents.length + index + 1}. {student.precourse || "N/A"}</td>
              <td className="p-3">{student.maincourse || "N/A"}</td>
              <td className="p-3">{student.course || "N/A"}</td>
              <td className="p-3">{student.targetYearMainCourse || "N/A"}</td>
              <td className="p-3 text-center">
                <button
                  onClick={() => setMainSelectedStudent(student)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
      </div>
    </div>


     <div className="flex mt-12 mb-12 px-8 flex-row justify-center gap-8 w-full max-w-7xl">
      <div className="max-w-6xl mx-auto bg-transparent backdrop-blur-md shadow-md rounded-xl p-6 border border-gray-300">
        <h2 className="text-md underline font-semibold text-white mb-6">Miscellaneous Courses Data</h2>
        <div className="overflow-x-auto rounded-lg border border-gray-300">
          <table className="w-full text-sm text-white">
            <thead className="bg-gray-700 text-white">
              <tr>
                <th className="p-3 text-left">Course</th>
                <th className="p-3 text-left">Location</th>
                <th className="p-3 text-left">Start Date</th>
                <th className="p-3 text-left">End Date</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {coursesData.map((course, index) => (
                <tr key={course._id} className={`${index % 2 === 0 ? "bg-gray-800" : "bg-gray-700"} hover:bg-gray-600 transition text-white`}>
                  <td className="p-3">{course.course}</td>
                  <td className="p-3">{course.location}</td>
                  <td className="p-3">{new Date(course.startDate).toLocaleDateString()}</td>
                  <td className="p-3">{new Date(course.endDate).toLocaleDateString()}</td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => setSelectedMisStudents(course.students)}
                      className="bg-blue-500 text-white px-3 py-1 rounded-lg flex items-center gap-2 hover:bg-blue-600 transition"
                    >
                      <FiEye /> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="w-full max-w-4xl bg-transparent backdrop-blur-md shadow-xl rounded-lg p-6 border border-gray-300">
        <div className="flex items-center gap-3 mb-4">
          <FaRegNewspaper className="text-blue-500 text-3xl" />
          <h2 className="text-md underline font-bold text-white">Latest News</h2>
        </div>
        <div className="overflow-hidden rounded-lg shadow-md h-40">
          <table className="w-full border-collapse bg-transparent text-left text-sm text-white">
            <thead className="bg-blue-500 text-white uppercase text-xs font-semibold">
              <tr>
                <th className="px-6 py-3">Title</th>
                <th className="px-6 py-3">Start Date</th>
                <th className="px-6 py-3">End Date</th>
              </tr>
            </thead>
            <tbody>
              {newsList.length > 0 ? (
                newsList.map((news, index) => (
                  <tr
                    key={news._id}
                    className={`border-b hover:bg-gray-600 transition-opacity duration-500 ${
                      index === currentIndex ? "opacity-100" : "opacity-50"
                    }`}
                  >
                    <td className="px-6 py-4 text-white font-medium uppercase">{news.title}</td>
                    <td className="px-6 py-4 text-gray-300">{new Date(news.startDate).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-gray-300">{new Date(news.endDate).toLocaleDateString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center py-6 text-gray-400">
                    No news available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
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
        </section>
    </div>
  )
}

export default Aboutus