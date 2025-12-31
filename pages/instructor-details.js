import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaTrash, FaEdit } from 'react-icons/fa';
import { useRouter } from 'next/router';
const Instructordetails = ({userData}) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [fromDate, setFromDate] = useState(null);
  const [students, setStudents] = useState([]);
  const [studentPopupOpen, setStudentPopupOpen] = useState(false);
  const [toDate, setToDate] = useState(null);
  const [course, setCourse] = useState('');
  const [instructorName, setInstructorName] = useState('');
  const [unit, setUnit] = useState('');
  const [remarks, setRemarks] = useState('');
  const [instructors, setInstructors] = useState([]); // State to store fetched instructors
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingInstructor, setEditingInstructor] = useState(null); // Store the instructor being edited
  const [selectedInstructorId, setSelectedInstructorId] = useState(null);
  const [maincoursestudents, setMaincourseStudents] = useState([]);
  const [filteredMainCourses, setFilteredMainCourses] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [mainCourse, setMainCourse] = useState('');
  const [selectedStudents, setSelectedStudents] = useState([]); 
  const [searchMainCourse, setSearchMainCourse] = useState(''); // New state for search filter
  const [searchQuery, setSearchQuery] = useState(''); // State for the search input
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userData) return; // Wait until userData is available

    if (userData?.selectedCourse !== "MASTER ADMIN") {
      router.push("/");
    } else {
      setLoading(false); // Stay on the page if the user is MASTER ADMIN
    }
  }, [userData, router]);


  // Fetch instructor data when the component mounts
  useEffect(() => {
    // Fetch Instructors
    const fetchInstructors = async () => {
      try {
        const response = await fetch('/api/instructor');
        const data = await response.json();
        if (response.ok) {
          setInstructors(data.instructors); // Update state with fetched data
        } else {
          toast.error('Failed to fetch instructors');
        }
      } catch (error) {
        console.error(error);
        toast.error('An error occurred while fetching instructors');
      }
    };

    // Fetch Students
    const fetchStudents = async () => {
      try {
        const res = await fetch('/api/fetchstudents');
        const result = await res.json();
        if (result.success) {
          setStudents(result.data); // Update students state with fetched data
        } else {
          console.error('Failed to fetch students');
        }
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };


    const fetchMyStudents = async () => {
      try {
        const res = await fetch('/api/maincourse');
        const result = await res.json();
        if (result.success) {
          setMaincourseStudents(result.data);
  
        } else {
          console.error('Failed to fetch students');
        }
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };


    // Call both fetch functions
    fetchInstructors();
    fetchStudents();
    fetchMyStudents();
  }, []);
  console.log("Instructor",instructors)
// console.log("Studnets",students)
  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
    // Reset form if it's closing and no editing is happening
    if (isPopupOpen) {
      setEditingInstructor(null);
      setCourse('');
      setInstructorName('');
      setUnit('');
      setFromDate(null);
      setToDate(null);
      setRemarks('');
    }
  };
  const handleStudentSelect = (student) => {
    // Toggle selection of student
    setSelectedStudents(prevSelected => {
      if (prevSelected.some(s => s.armyno === student.armyno)) {
        return prevSelected.filter(s => s.armyno !== student.armyno); // Remove if already selected
      } else {
        return [...prevSelected, student]; // Add to selected list
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    const instructorData = {
      course,
      mainCourse,
      fromDate,
      toDate,
      remarks: remarks.toUpperCase(),
      selectedStudents: selectedStudents.map(student => ({
        name: student.name,
        unitno: student.unitno,
        grading: student.grading,
      })),
    };


  
    try {
      const response = editingInstructor
        ? await fetch(`/api/updateinstructor/${editingInstructor._id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(instructorData),
          })
        : await fetch('/api/instructor', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(instructorData),
          });
  
      if (response.ok) {
        toast.success(editingInstructor ? 'Instructor updated successfully!' : 'Instructor added successfully!');
        togglePopup();
        const res = await fetch('/api/instructor');
        const data = await res.json();
        setInstructors(data.instructors);
      } else {
        toast.error('Failed to save instructor');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };
  

  const handleDelete = async (instructorId) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this instructor?");
    if (isConfirmed) {
      try {
        const res = await fetch(`/api/deleteinstructor/${instructorId}`, {
          method: 'DELETE',
        });

        const result = await res.json();
        if (result.success) {
          toast.success('Instructor deleted successfully!');
          setInstructors(instructors.filter((instructor) => instructor._id !== instructorId)); // Update local state
        } else {
          toast.error('Failed to delete instructor.');
        }
      } catch (error) {
        toast.error('Failed to delete instructor.');
      }
    }
  };


  const handleInstructorClick = (instructorId) => {
    setSelectedInstructorId(instructorId);
    setStudentPopupOpen(true);
  };

  const closeStudentPopup = () => {
    setStudentPopupOpen(false);
    setSelectedInstructorId(null);
  };


 // Handle main course selection
 const handleCourseChange = (e) => {
  const selectedCourse = e.target.value;
  setCourse(selectedCourse);

  // Filter main courses based on selected course
  const relatedMainCourses = maincoursestudents.filter(
    (student) => student.course === selectedCourse
  );
  setFilteredMainCourses(relatedMainCourses);
  setMainCourse(''); // Reset main course selection
  setFilteredStudents([]);
};

// Handle main course selection
const handleMainCourseChange = (e) => {
  const selectedMainCourse = e.target.value;
  setMainCourse(selectedMainCourse);

  const relatedStudents = filteredMainCourses.filter(
    (student) => student.maincourse === selectedMainCourse
  );
  setFilteredStudents(relatedStudents);
};
  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filter instructors based on search query
  const filteredInstructors = instructors.filter((instructor) =>
    instructor.mainCourse.toLowerCase().includes(searchQuery.toLowerCase())
  );
  if (loading) {
    return <div className="flex justify-center items-center h-screen text-xl">Checking access...</div>;
  }

  return (
    <div className="min-h-screen bg-gray py-36 px-8 relative">
      <div className="text-2xl uppercase font-semibold mb-6">Instructor Details</div>
      <div className="mb-6">
        <label className="block uppercase text-sm font-medium">Search by Main Course</label>
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full mt-2 mb-4 px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-600"
          placeholder="Enter Main Course"
        />
      </div>
      {/* Display list of instructors in a table */}
      <div className="mb-6">
  <h3 className="text-xl uppercase font-medium mb-4">Instructor List</h3>
  <table className="w-full table-auto border-collapse shadow-lg">
    <thead>
      <tr className="bg-blue-600 text-white">
        <th className="px-4 py-2 border">Ser. No.</th>
        <th className="px-4 py-2 border">Course</th>
        <th className="px-4 py-2 border">Main Course</th>
        <th className="px-4 py-2 border">Name</th>
        <th className="px-4 py-2 border">From</th>
        <th className="px-4 py-2 border">To</th>
        <th className="px-4 py-2 border">Remarks</th>
        <th className="px-4 py-2 border">Actions</th>
      </tr>
    </thead>
    <tbody>
      {filteredInstructors.map((instructor, index) => (
        <tr key={instructor._id} className="hover:bg-gray-100">
          <td className="px-4 py-2 border">{index + 1}</td>
          <td className="px-4 py-2 border">{instructor.course}</td>
          <td className="px-4 py-2 border">{instructor.mainCourse}</td>
          <td className="px-4 py-2 border">
            <ul>
              {instructor.selectedStudents.map((student) => (
                <li key={student._id}>
                  {student.name} - {student.unitno} - {student.grading}
                </li>
              ))}
            </ul>
          </td>
          <td className="px-4 py-2 border">{new Date(instructor.fromDate).toLocaleDateString()}</td>
          <td className="px-4 py-2 border">{new Date(instructor.toDate).toLocaleDateString()}</td>
          <td className="px-4 py-2 border">{instructor.remarks}</td>
          
          {/* Displaying selected students for each instructor */}
     

          <td className="px-4 py-2 border text-center">
            {/* <button
              onClick={() => handleEdit(instructor)} // Open edit popup with selected data
              className="text-blue-500 hover:text-blue-700 mr-2"
            >
              <FaEdit size={20} />
            </button> */}
            <button
              onClick={() => handleDelete(instructor._id)} // Use _id to pass the instructor's unique identifier
              className="text-red-500 hover:text-red-700"
            >
              <FaTrash size={20} />
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>


      <button
        onClick={togglePopup}
        className="fixed bottom-8 right-8 bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-700 transition duration-300"
      >
        Add Instructor
      </button>
      {studentPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg w-96 relative shadow-xl">
            <h2 className="text-2xl font-semibold mb-4">Students for Instructor</h2>
            <button onClick={closeStudentPopup} className="absolute top-2 right-2 text-red-500">
              X
            </button>
            <ul className="space-y-4">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <li key={student._id} className="border p-4">
                    <div>Name: {student.name}</div>
                    <div>Instructor: {student.instructor}</div>
                  </li>
                ))
              ) : (
                <li>No students found for this instructor</li>
              )}
            </ul>
          </div>
        </div>
      )}

{isPopupOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white p-8 rounded-lg w-full sm:w-96 max-h-[90vh] overflow-y-auto relative shadow-xl">
      <h2 className="text-2xl font-semibold mb-4">{editingInstructor ? 'Edit Instructor' : 'Add Instructor'}</h2>

      <form onSubmit={handleSubmit}>
        <label className="block text-sm font-medium">Select Course</label>
        <select
          value={course}
          onChange={handleCourseChange}
          className="w-full mt-2 mb-4 px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-600"
        >
          <option value="">Select Course</option>
          {[...new Set(maincoursestudents.map((item) => item.course))].map((course, index) => (
            <option key={index} value={course}>{course}</option>
          ))}
        </select>

        {/* Main Course Selection */}
        <label className="block text-sm font-medium">Select Main Course</label>
        <select
          value={mainCourse}
          onChange={handleMainCourseChange}
          className="w-full mt-2 mb-4 px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-600"
        >
          <option value="">Select Main Course</option>
          {filteredMainCourses.map((student, index) => (
            <option key={index} value={student.maincourse}>{student.maincourse}</option>
          ))}
        </select>

        {/* Students List */}
        {filteredStudents.length > 0 && (
          <div className="mt-4">
            <h3 className="text-lg font-medium">Students in {filteredStudents[0].course} - {filteredStudents[0].maincourse} </h3>
            <ul className="mt-2 border p-2 rounded-md max-h-40 overflow-y-auto">
              {filteredStudents[0].students.map((student) => (
                <li key={student.armyno} className="py-1 flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedStudents.some(s => s.armyno === student.armyno)}
                    onChange={() => handleStudentSelect(student)}
                    className="h-4 w-4 border rounded"
                  />
                  <span className="text-sm">{student.name} - {student.unitno} - {student.grading}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Date Range */}
        <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="fromDate" className="block text-sm font-medium text-gray-700">From</label>
            <DatePicker
              selected={fromDate}
              onChange={(date) => setFromDate(date)}
              dateFormat="yyyy/MM/dd"
              className="w-full mt-2 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholderText="Select From Date"
            />
          </div>
          <div>
            <label htmlFor="toDate" className="block text-sm font-medium text-gray-700">To</label>
            <DatePicker
              selected={toDate}
              onChange={(date) => setToDate(date)}
              dateFormat="yyyy/MM/dd"
              className="w-full mt-2 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholderText="Select To Date"
            />
          </div>
        </div>

        {/* Remarks */}
        <div className="mb-4">
          <label htmlFor="remarks" className="block text-sm font-medium text-gray-700">Remarks</label>
          <textarea
            id="remarks"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value.toUpperCase())}
            className="w-full mt-2 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
            placeholder="Enter Remarks"
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 text-white px-6 py-3 rounded-md disabled:bg-blue-300"
          >
            {isSubmitting ? 'Submitting...' : editingInstructor ? 'Update Instructor' : 'Add Instructor'}
          </button>
        </div>
      </form>

      {/* Close Button */}
      <button
        onClick={togglePopup}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  </div>
)}


      <ToastContainer />
    </div>
  );
};

export default Instructordetails;
