// components/Miscellaneousdata.js
import React, { useState,useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FiLayers } from 'react-icons/fi';
import { FaTrash, FaEdit } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router';
import axios from "axios";
const Miscellaneousdata = ({userData}) => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [course, setCourse] = useState('');
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [students, setStudents] = useState([{ name: '', unit: '', rank: '', armyNo: '',remarks:''}]);
  const [coursesData, setCoursesData] = useState([]);
  const [searchCourse, setSearchCourse] = useState(''); // for search by course
  const [searchLocation, setSearchLocation] = useState(''); // for search by location


  const [loading, setLoading] = useState(true);
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
  useEffect(() => {
    if (!userData) return; // Wait until userData is available

    if (userData?.selectedCourse !== "MASTER ADMIN") {
      router.push("/");
    } else {
      setLoading(false); // Stay on the page if the user is MASTER ADMIN
    }
  }, [userData, router]);
  useEffect(() => {
    // Fetch course data from the API
    const fetchCoursesData = async () => {
      try {
        const response = await fetch('/api/missleneousdata');
        const data = await response.json();
        if (response.ok) {
          // Ensure data is an array
          if (Array.isArray(data.orders)) {
            setCoursesData(data.orders); // Set the fetched courses data
          } else {
            console.error('Fetched data is not an array:', data);
          }
        } else {
          alert('Failed to fetch courses data');
        }
      } catch (error) {
        console.error('Error fetching courses data:', error);
        alert('Error fetching courses data');
      }
    };

    fetchCoursesData(); // Fetch data when component mounts
  }, []);
  console.log("missleneous data",coursesData)
  const handleAddStudentClick = () => {
    setStudents([...students, { name: '', unit: '', rank: '', armyNo: '' }]);
  };

  const handleInputChange = (index, event) => {
    const updatedStudents = [...students];
    updatedStudents[index][event.target.name] = event.target.value.toUpperCase();  // Ensure all inputs are in uppercase
    setStudents(updatedStudents);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const data = {
      course,
      location,
      startDate,
      endDate,
      students,
    };

    try {
      const response = await fetch('/api/miscellaneous', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (response.ok) {
        alert(result.message);
        handleCloseModal();
      } else {
        alert(result.error);
      }
    } catch (error) {
      console.error(error);
      alert('Error submitting data');
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const filteredCoursesData = coursesData.filter(courseData =>
    courseData.course.toLowerCase().includes(searchCourse.toLowerCase()) &&
    courseData.location.toLowerCase().includes(searchLocation.toLowerCase())
  );
  const handleDelete = async (instructorId, correctPassword) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this data?");
    if (!isConfirmed) return;
  
    const enteredPassword = window.prompt("Enter delete password:");
    if (!enteredPassword) {
      toast.error("Password is required to delete the student.");
      return;
    }
  
    if (enteredPassword !== password) { // Ensure correctPassword is passed as an argument
      toast.error("Incorrect password. Student deletion failed.");
      return;
    }
  
    try {
      const res = await fetch(`/api/deletemiscelleneousdata/${instructorId}`, {
        method: 'DELETE',
      });
  
      if (!res.ok) {
        throw new Error("Failed to delete data.");
      }
  
      const result = await res.json();
      if (result.success) {
        toast.success("Data deleted successfully!");
      } else {
        toast.error(result.message || "Failed to delete data.");
      }
    } catch (error) {
      console.error("Error deleting data:", error);
      toast.error("An error occurred while deleting data.");
    }
  };
  
  if (loading) {
    return <div className="flex justify-center items-center h-screen text-xl">Checking access...</div>;
  }
  return (
    <div className='min-h-screen py-48 bg-gray px-8 relative'>
      <button
        onClick={() => setIsModalOpen(true)}
        className='absolute right-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'
      >
        ADD STUDENTS
      </button>

      <h1 className='text-2xl uppercase font-semibold mb-6'>Miscellaneous Data</h1>
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
      <div className="flex gap-4 mb-6 p-2">
        <input
          type="text"
          className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-1/3"
          placeholder="Search by Course"
          value={searchCourse}
          onChange={(e) => setSearchCourse(e.target.value)}
        />
        <input
          type="text"
          className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-1/3"
          placeholder="Search by Location"
          value={searchLocation}
          onChange={(e) => setSearchLocation(e.target.value)}
        />
      </div>
        <table className="table-auto w-full mt-8">
          <thead>
            <tr>
              <th className="py-2 px-4">Course</th>
              <th className="py-2 px-4">Location</th>
              <th className="py-2 px-4">Start Date</th>
              <th className="py-2 px-4">End Date</th>
              <th className="py-2 px-4">Students</th>
              <th className="py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* Check if coursesData is an array and map over it */}
            {Array.isArray(filteredCoursesData) && filteredCoursesData.length > 0 ? (
              filteredCoursesData.map((courseData, index) => (
                <tr key={index} className="border-t">
                  <td className="py-2 px-4">{courseData.course}</td>
                  <td className="py-2 px-4">{courseData.location}</td>
                  <td className="py-2 px-4">{new Date(courseData.startDate).toLocaleDateString()}</td>
                  <td className="py-2 px-4">{new Date(courseData.endDate).toLocaleDateString()}</td>
                  <td className="py-2 px-4">
                    <ul>
                      {courseData.students && courseData.students.map((student, idx) => (
                        <li key={idx}>{student.name} - {student.rank} - {student.unit} - {student.remarks} </li>
                      ))}
                    </ul>
                  </td>
                  <td className="px-4 py-2 border text-center">
            {/* <button
              onClick={() => handleEdit(instructor)} // Open edit popup with selected data
              className="text-blue-500 hover:text-blue-700 mr-2"
            >
              <FaEdit size={20} />
            </button> */}
            <button
              onClick={() => handleDelete(courseData._id)} // Use _id to pass the instructor's unique identifier
              className="text-red-500 hover:text-red-700"
            >
              <FaTrash size={20} />
            </button>
          </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="py-2 px-4 text-center text-gray-500">No course data available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {isModalOpen && (
       <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
         <div className="bg-white p-8 rounded-lg shadow-lg w-full overflow-y-auto max-h-[100vh]">
            <h2 className='text-2xl font-semibold mb-6 text-center text-gray-800'>Add Student</h2>
            <form onSubmit={handleFormSubmit} className='space-y-6'>
              <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
                <div className='flex flex-col'>
                  <label className='text-sm font-medium text-gray-600 mb-2'>
                    Course Name
                  </label>
                  <input
                    type='text'
                    className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                    value={course}
                    onChange={(e) => setCourse(e.target.value.toUpperCase())}
                    placeholder='Enter course name'
                    required
                  />
                </div>

                <div className='flex flex-col'>
                  <label className='text-sm font-medium text-gray-600 mb-2'>
                    Location
                  </label>
                  <input
                    type='text'
                    className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                    value={location}
                    onChange={(e) => setLocation(e.target.value.toUpperCase())}
                    placeholder='Enter location'
                    required
                  />
                </div>

                <div className='flex flex-col'>
                  <label className='text-sm font-medium text-gray-600 mb-2'>
                    Start Date
                  </label>
                  <DatePicker
                    selected={startDate}
                    onChange={setStartDate}
                    className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                    required
                  />
                </div>

                <div className='flex flex-col'>
                  <label className='text-sm font-medium text-gray-600 mb-2'>
                    End Date
                  </label>
                  <DatePicker
                    selected={endDate}
                    onChange={setEndDate}
                    className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                    required
                  />
                </div>
              </div>

              {/* Student Input Fields */}
              {students.map((student, index) => (
                <div key={index} className='grid grid-cols-1 md:grid-cols-4 gap-4'>
                  <div className='flex flex-col'>
                    <label className='text-sm font-medium text-gray-600 mb-2'>
                      Army No.
                    </label>
                    <input
                      type='text'
                      className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                      name='armyNo'
                      value={student.armyNo}
                      onChange={(e) => handleInputChange(index, e)}
                      placeholder='Enter army number'
                      required
                    />
                  </div>
                  <div className='flex flex-col'>
                    <label className='text-sm font-medium text-gray-600 mb-2'>
                      Student Name
                    </label>
                    <input
                      type='text'
                      className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                      name='name'
                      value={student.name}
                      onChange={(e) => handleInputChange(index, e)}
                      placeholder='Enter student name'
                      required
                    />
                  </div>

                  <div className='flex flex-col'>
                    <label className='text-sm font-medium text-gray-600 mb-2'>
                      Unit
                    </label>
                    <select
                      className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                      name='unit'
                      value={student.unit}
                      onChange={(e) => handleInputChange(index, e)}
                      required
                    >
                      <option value="" disabled>Select Unit</option>
                      <option value="1/3 GR">1/3 GR</option>
                      <option value="2/3 GR">2/3 GR</option>
                      <option value="3/3 GR">3/3 GR</option>
                      <option value="4/3 GR">4/3 GR</option>
                      <option value="5/3 GR">5/3 GR</option>
                      <option value="1/9 GR">1/9 GR</option>
                      <option value="2/9 GR">2/9 GR</option>
                      <option value="3/9 GR">3/9 GR</option>
                    </select>
                  </div>

                  <div className='flex flex-col'>
                    <label className='text-sm font-medium text-gray-600 mb-2'>
                      Rank
                    </label>
                    <select
                      className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                      name='rank'
                      value={student.rank}
                      onChange={(e) => handleInputChange(index, e)}
                      required
                    >
                        <option value="" disabled>Select Rank</option>
  <option value="RFN">RFN</option>
  <option value="LNK">LNK</option>
  <option value="LHAV">LHAV</option>
  <option value="NK">NK</option>
  <option value="HAV">HAV</option>
  <option value="NB SUB">NB SUB</option>
  <option value="SUB">SUB</option>
  <option value="SUB MAJ">SUB MAJ</option>
                    </select>
                  </div>
                  <div className='flex flex-col'>
                    <label className='text-sm font-medium text-gray-600 mb-2'>
                      Remarks
                    </label>
                    <input
                      type='text'
                      className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                      name='remarks'
                      value={student.remarks}
                      onChange={(e) => handleInputChange(index, e)}
                      placeholder='Enter student remarks'
                      required
                    />
                  </div>
                </div>

                
              ))}

              <div className='flex justify-between'>
                <button
                  type='button'
                  className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'
                  onClick={handleAddStudentClick}
                >
                  Add Student
                </button>
                <button
                  type='submit'
                  className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'
                >
                  Submit
                </button>
              </div>
            </form>
            <button
              onClick={handleCloseModal}
              className='absolute top-4 right-4 text-red-500 text-5xl'
            >
              &times;
            </button>
          </div>
        </div>
      )}
      <ToastContainer/>
    </div>
  );
};

export default Miscellaneousdata;
