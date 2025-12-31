import React, { useState, useEffect, useRef } from "react";
import { FiEye, FiX } from "react-icons/fi";
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
  const preTableRef = useRef(null);
  const mainTableRef = useRef(null);

  const fetchPreStudents = async () => {
    try {
      const res = await fetch("/api/fetchstudents");
      const result = await res.json();
      if (result.success) {
        const currentDate = new Date();
        const filteredPreStudents = result.data.filter((student) => {
          if (!student.targetYearPreCourse) return false;
          const [startDateStr, endDateStr] = student.targetYearPreCourse.split(" to ");
          const startDate = new Date(startDateStr);
          const endDate = new Date(endDateStr);
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
        const filteredMainStudents = result.data.filter((student) => {
          if (!student.targetYearMainCourse) return false;
          const [startDateStr, endDateStr] = student.targetYearMainCourse.split(" to ");
          const startDate = new Date(startDateStr);
          const endDate = new Date(endDateStr);
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
    <div className="relative h-screen w-full bg-cover bg-center flex flex-col items-center justify-center p-4" style={{ backgroundImage: "url('/hero-img2.jpg')" }}>
      <div className="flex flex-row justify-center gap-8 w-full max-w-7xl">
      <div className="bg-white p-4 rounded-lg shadow-lg w-full md:w-1/2 h-96 overflow-hidden relative">
          <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">Pre Course Student Data</h2>
          <div className="h-full overflow-y-scroll">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border p-2">Index</th>
                  <th className="border p-2">Pre Course</th>
                  <th className="border p-2">Main Course</th>
                  <th className="border p-2">Course</th>
                  <th className="border p-2">Duration</th>
                  <th className="border p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {prestudents.map((student, index) => (
                  <tr key={student._id} className="text-center border-t">
                    <td className="border p-2">{index + 1}</td>
                    <td className="border p-2">{student.selectedTitle || "N/A"}</td>
                    <td className="border p-2">{student.selectedMaintitle || "N/A"}</td>
                    <td className="border p-2">{student.selectedCourse || "N/A"}</td>
                    <td className="border p-2">{student.targetYearPreCourse || "N/A"}</td>
                    <td className="border p-2">
                      <button onClick={() => setPreSelectedStudent(student)} className="bg-blue-500 text-white px-3 py-1 rounded">
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {/* Main Course Students Table */}
        <div className="bg-white p-4 rounded-lg shadow-lg w-full md:w-1/2 h-96 overflow-hidden relative">
          <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">Main Course Student Data</h2>
          <div ref={mainTableRef} className="h-full overflow-y-scroll">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border p-2">Index</th>
                  <th className="border p-2">Main Course</th>
                  <th className="border p-2">Course</th>
                  <th className="border p-2">Main Course Duration</th>
                  <th className="border p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {maincoursestudents.map((student, index) => (
                  <tr key={student._id} className="text-center border-t">
                    <td className="border p-2">{index + 1}</td>
                    <td className="border p-2">{student.maincourse || "N/A"}</td>
                    <td className="border p-2">{student.course || "N/A"}</td>
                    <td className="border p-2">{student.targetYearMainCourse || "N/A"}</td>
                    <td className="border p-2">
                      <button
                        className="bg-blue-500 text-white px-3 py-1 rounded"
                        onClick={() => setMainSelectedStudent(student)}
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
      <div className="flex mt-12 flex-row justify-center gap-8 w-full max-w-7xl">
      <div className="max-w-6xl mx-auto bg-white shadow-md rounded-xl p-6">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">Miscellaneous Courses Data</h2>
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full text-sm text-gray-700">
            <thead className="bg-gray-200 text-gray-900">
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
                <tr key={course._id} className={`${index % 2 === 0 ? "bg-gray-100" : "bg-white"} hover:bg-gray-200 transition` }>
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
      <div className="w-full max-w-4xl bg-white shadow-xl rounded-lg p-6 border border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <FaRegNewspaper className="text-blue-500 text-3xl" />
          <h2 className="text-2xl font-bold text-gray-800">Latest News</h2>
        </div>
        <div className="overflow-hidden rounded-lg shadow-md h-40">
          <table className="w-full border-collapse bg-white text-left text-sm text-gray-700">
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
                    className={`border-b hover:bg-gray-100 transition-opacity duration-500 ${
                      index === currentIndex ? "opacity-100" : "opacity-50"
                    }`}
                  >
                    <td className="px-6 py-4 text-gray-800 font-medium">{news.title}</td>
                    <td className="px-6 py-4 text-gray-600">{new Date(news.startDate).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-gray-600">{new Date(news.endDate).toLocaleDateString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center py-6 text-gray-500">
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
    </div>
  );
};

export default Test2;