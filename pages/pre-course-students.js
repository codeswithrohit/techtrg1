import React, { useState, useEffect,useRef } from 'react';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router';
import axios from "axios";
const Students = ({userData}) => {
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
  const [students, setStudents] = useState([]);
  const [coursesList, setCoursesList] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedTitle, setSelectedTitle] = useState('All');
  const [selectedMaintitle, setSelectedMaintitle] = useState(''); 
  const [selectedYear, setSelectedYear] = useState('');
  const [titles, setTitles] = useState([]);
  const [years, setYears] = useState([]);
  const [maintitles, setMaintitles] = useState([]);
  const [courses, setCourses] = useState([]);
  const [editingStudent, setEditingStudent] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [formData, setFormData] = useState({ armyno: '', rankno: '', name: '', unitno: '' });
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [newStudents, setNewStudents] = useState([]);
  const [filteredInstructor, setFilteredInstructor] = useState(null);
  const [selectedData, setSelectedData] = useState([]);
  const tableRef = useRef();
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
  

  const printTable = () => {
    const printContent = tableRef.current.cloneNode(true);
  
    // Hide the "Actions" column when printing
    const actionRows = printContent.querySelectorAll('.action-row');
    actionRows.forEach((row) => row.style.display = 'none');
  
    const printWindow = window.open('', '', 'height=600,width=800');
    printWindow.document.write('<html><head><title>Print Table</title>');
    printWindow.document.write('<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.16/dist/tailwind.min.css">');
    printWindow.document.write('</head><body>');
    printWindow.document.write(printContent.innerHTML);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
  };
  


  
 const fetchStudents = async () => {
    try {
      const res = await fetch('/api/fetchstudents');
      const result = await res.json();
      if (result.success) {
        setStudents(result.data);

        // Extract unique years from students
        const uniqueYears = [...new Set(result.data.map(student => student.year))];
        setYears(uniqueYears);
      } else {
        console.error('Failed to fetch students');
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };
console.log("students",students)
  useEffect(() => {
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

    fetchInstructors();
  }, []);
  

  const fetchCourses = async () => {
    try {
      const res = await fetch('/api/fetchcourselist');
      const result = await res.json();
      if (result.success) {
        setCoursesList(result.data);
      } else {
        console.error('Failed to fetch courses');
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  useEffect(() => {
    fetchStudents();
    fetchCourses();
  }, []);

 
  const handleNewStudentChange = (index, e, field) => {
    const { name, value } = e.target;
    setNewStudents((prev) => {
      const updatedStudents = [...prev];
      updatedStudents[index][field] = name === 'armyno' || name === 'name' ? value.toUpperCase() : value; // Convert to uppercase for specified fields
      return updatedStudents;
    });
  };
  

  // Add another student input set
  const addAnotherStudentField = () => {
    setNewStudents([...newStudents, {}]);
  };
  const removeAnotherStudentField = (index) => {
    setNewStudents(newStudents.filter((_, idx) => idx !== index));
  };
  const handleYearChange = (e) => {
    const selected = e.target.value;
    setSelectedYear(selected);

    // Filter courses based on the selected year
    const availableCourses = [
        ...new Set(students.filter(student => student.year === selected).map(student => student.selectedCourse))
    ];
    setCourses(availableCourses);
    setSelectedCourse('');
    setSelectedTitle('');
    setSelectedMaintitle('');
    setTitles([]);
    setMaintitles([]);
    setSelectedData([]); // Reset data on year change
};

const handleCourseChange = (e) => {
    const selected = e.target.value;
    setSelectedCourse(selected);

    // Filter titles based on the selected year and course
    const availableTitles = [
        ...new Set(students.filter(student => student.year === selectedYear && student.selectedCourse === selected).map(student => student.selectedTitle))
    ];
    setTitles(availableTitles);
    setSelectedTitle('');
    setSelectedMaintitle('');
    setMaintitles([]);
    setSelectedData([]); // Reset data on course change
};

const handleTitleChange = (e) => {
    const selected = e.target.value;
    setSelectedTitle(selected);

    // Get corresponding main course based on selected title
    const availableMaintitles = [
        ...new Set(students.filter(student => student.year === selectedYear && student.selectedCourse === selectedCourse && student.selectedTitle === selected).map(student => student.selectedMaintitle))
    ];
    setMaintitles(availableMaintitles);
    setSelectedMaintitle(availableMaintitles[0] || ''); // Auto-select first main title

    // Filter student data based on the selected title
    const filteredData = students.filter(student => 
        student.year === selectedYear && 
        student.selectedCourse === selectedCourse && 
        student.selectedTitle === selected
    );
    setSelectedData(filteredData); // Store filtered data for display
};


  
  // Use this filter when displaying instructors


  const openEditPopup = (student) => {
    setEditingStudent(student);
    setFormData({ armyno: student.armyno, rankno: student.rankno, name: student.name, unitno: student.unitno });
    setIsPopupOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value.toUpperCase() }); // Convert to uppercase
  };
  const confirmDeleteStudent = (student) => {
    setStudentToDelete(student);
    setIsDeleteConfirmOpen(true);
  };
  const updateStudent = async () => {
    try {
      const res = await fetch(`/api/editstudent/${editingStudent._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const result = await res.json();
      if (result.success) {
        fetchStudents(); // Refresh students list after update
        setIsPopupOpen(false);
      } else {
        console.error('Failed to update student');
      }
    } catch (error) {
      console.error('Error updating student:', error);
    }
  };

  const deleteStudent = async () => {
    const enteredPassword = window.prompt("Enter delete password:");
  
    if (!enteredPassword) {
      toast.error("Password is required to delete the student.");
      return;
    }
  
    if (enteredPassword !== password) {
      toast.error("Incorrect password. Student deletion failed.");
      return;
    }
  
    try {
      const res = await fetch(`/api/deletestudent/${studentToDelete._id}`, {
        method: 'DELETE',
      });
  
      const result = await res.json();
  
      if (res.ok && result.success) {
        toast.success("Student deleted successfully!");
        fetchStudents(); // Refresh student list
        setIsDeleteConfirmOpen(false);
      } else {
        throw new Error(result.message || "Failed to delete student.");
      }
    } catch (error) {
      console.error("Error deleting student:", error);
      toast.error(error.message || "Failed to delete student.");
    }
  };
  

  const filteredStudents = students.filter(course => {
    const matchesCourse = selectedCourse ? course.selectedCourse === selectedCourse : true;
    const matchesTitle = selectedTitle ? course.selectedTitle === selectedTitle : true;
    const matchesYear = selectedYear ? course.year === selectedYear : true;
    return matchesCourse && matchesTitle && matchesYear;
  });
// Filter instructors by selectedCourse
// Step 1: Filter instructors by selectedCourse
const filteredInstructors = instructors.filter(
  (instructor) => instructor.course === selectedCourse
);
console.log("🔍 Step 1: Filtered Instructors", filteredInstructors);

// Step 2: Check if filteredInstructors has valid data
if (filteredInstructors.length === 0) {
  console.warn("⚠️ No instructors found matching the selectedCourse");
}

// Filter instructors whose dates overlap with any student's targetYearPreCourse
const filteredInstructorsByStudentDate = filteredInstructors.filter((instructor) => {
  console.log("🔍 Checking instructor", instructor);

  return filteredStudents.some((student) => {
    console.log("📝 Student targetYearPreCourse:", student.targetYearPreCourse);
    console.log("📝 Instructor fromDate:", instructor.fromDate);
    console.log("📝 Instructor toDate:", instructor.toDate);

    // Parse dates into Date objects for comparison
    const instructorFromDate = new Date(instructor.fromDate);
    const instructorToDate = new Date(instructor.toDate);

    const [preStart, preEnd] = student.targetYearPreCourse.split(' to ').map(date => new Date(date.trim()));

    console.log("✅ Comparing Date Ranges:");
    console.log("➡️ Instructor From:", instructorFromDate);
    console.log("➡️ Instructor To:", instructorToDate);
    console.log("➡️ Student PreStart:", preStart);
    console.log("➡️ Student PreEnd:", preEnd);

    // Check if the instructor's date range overlaps with the student's date range
    const isWithinRange = (preStart >= instructorFromDate && preStart <= instructorToDate) ||
                          (preEnd >= instructorFromDate && preEnd <= instructorToDate) ||
                          (preStart <= instructorFromDate && preEnd >= instructorToDate);

    console.log("🔄 Date Range Match Result:", isWithinRange);

    return isWithinRange;
  });
});

// Display filtered instructors by student date
console.log("✅ Final Filtered Instructors By Student Date:", filteredInstructorsByStudentDate);

// Step 5: Check if any students were filtered
if (filteredInstructorsByStudentDate.length === 0) {
  console.warn("⚠️ No students matched the instructor's date range.");
}

const deleteCourse = async (courseId) => {
  // First, confirm deletion
  const isConfirmed = window.confirm("Are you sure you want to delete this course?");
  if (!isConfirmed) return;

  // Ask for the delete password after confirmation
  const enteredPassword = window.prompt("Enter delete password:");
  
  if (!enteredPassword) {
    toast.error("Password is required to delete the course.");
    return;
  }

  if (enteredPassword !== password) {
    toast.error("Incorrect password. Course deletion failed.");
    return;
  }

  // Proceed with deletion if password is correct
  try {
    const res = await fetch(`/api/deleteprecourse/${courseId}`, {
      method: 'DELETE',
    });

    const result = await res.json();

    if (res.ok && result.success) {
      setCoursesList((prevCourses) => prevCourses.filter(course => course._id !== courseId));
      toast.success("Course deleted successfully!");
    } else {
      throw new Error(result.message || "Failed to delete course.");
    }
  } catch (error) {
    console.error("Error deleting course:", error);
    toast.error(error.message || "Failed to delete course.");
  }
};


  const addStudentsApi = async () => {
    if (newStudents.length === 0 || !selectedTitle) {
      toast.error('Please fill in all details and select a course.');
      return;
    }
  
    try {
      const res = await fetch('/api/addstudents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ selectedTitle, newStudents }),
      });
      const result = await res.json();
      if (result.success) {
        // Update students list with newly added students
        setStudents((prevStudents) => [
          ...prevStudents,
          ...result.data, // Add new students from the response
        ]);
        setNewStudents([]); // Reset the new student form
        toast.success('Students added successfully!');
      } else {
        toast.error(result.message || 'Failed to add students.');
      }
    } catch (error) {
      console.error('Error adding students:', error);
      toast.error('Error adding students.');
    }
  };
  if (loading) {
    return <div className="flex justify-center items-center h-screen text-xl">Checking access...</div>;
  }
  return (
    <div className='bg-gray py-36 min-h-screen relative px-8'>
      
      <div className="p-6 mb-8 bg-white shadow-lg rounded-lg">
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
    {/* Select Year */}
    <div>
  <label className="block font-semibold text-gray-700 mb-1">Select Year:</label>
  <select
    value={selectedYear}
    onChange={handleYearChange}
    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
  >
    <option value="">Select Year</option>
    {years
      .sort((a, b) => parseInt(a.split("-")[0]) - parseInt(b.split("-")[0]))
      .map((year) => (
        <option key={year} value={year}>{year}</option>
      ))}
  </select>
</div>


    {/* Select Course (Filtered by Year) */}
    {selectedYear && (
      <div>
        <label className="block font-semibold text-gray-700 mb-1">Select Course:</label>
        <select
          value={selectedCourse}
          onChange={handleCourseChange}
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Select Course</option>
          {courses.map((course) => (
            <option key={course} value={course}>{course}</option>
          ))}
        </select>
      </div>
    )}

    {/* Select Pre-Course (Filtered by Course) */}
    {selectedCourse && (
  <div>
    <label className="block font-semibold text-gray-700 mb-1">Select Pre-Course:</label>
    <select
      value={selectedTitle}
      onChange={handleTitleChange}
      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    >
      <option value="">Select Pre-Course</option>
      {titles
        .sort((a, b) => {
          const numA = parseInt(a.match(/\d+$/)?.[0] || "0", 10);
          const numB = parseInt(b.match(/\d+$/)?.[0] || "0", 10);
          return numA - numB;
        })
        .map((title) => (
          <option key={title} value={title}>{title}</option>
        ))}
    </select>
  </div>
)}



    {/* Main Course (Auto-filled based on Pre-Course) */}
    {/* {selectedCourse && (
      <div>
        <label className="block font-semibold text-gray-700 mb-1">Main Course:</label>
        <input
          type="text"
          value={selectedMaintitle}
          readOnly
          className="w-full p-3 h-12 border border-gray-300 bg-gray-100 rounded-md"
        />
      </div>
    )} */}


{selectedCourse && (
      <div>
        <label className="block font-semibold text-gray-700 mb-1">Select Main-Course:</label>
        <select
        value={selectedMaintitle}
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Select Pre-Course</option>
          {maintitles.map((title) => (
            <option key={title} value={title}>{title}</option>
          ))}
        </select>
      </div>
    )}
  </div>
</div>


      {selectedData.length > 0 && (
      <div>

<button onClick={printTable} className='mb-4 bg-blue-500 text-white px-4 py-2 rounded'>Print Now</button>
      <div ref={tableRef} className='overflow-x-auto'>
      <h1 className='text-xl text-center uppercase underline font-bold mb-4'>Students of {selectedYear} - {selectedCourse} - {selectedTitle} - {selectedMaintitle} </h1>
        <table className='min-w-full divide-y divide-gray-200'>
          <thead className='bg-gray-50'>
            <tr>
              <th className='px-6 py-3 text-left text-xs  text-gray-900 font-bold uppercase tracking-wider'>S.no</th>
              <th className='px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider'>ARMY No</th>
              <th className='px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider'>Rank</th>
              <th className='px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider'>Name</th>
              <th className='px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider'>Unit</th>
              <th  className='action-row px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider'>Actions</th>
            </tr>
          </thead>
          <tbody className='bg-white divide-y divide-gray-200'>
            {selectedData.map((course, courseIndex) => (
              course.students.map((student, studentIndex) => (
                <tr key={`${course._id}-${studentIndex}`}>
                  <td className='px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900'>{studentIndex + 1}</td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900'>{student.armyno}</td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900'>{student.rankno}</td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900'>{student.name}</td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900'>{student.unitno}</td>
                  
                  <td className='action-row px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900'>
                    <button onClick={() => openEditPopup(student)}>
                      <FaEdit className='text-xl text-blue-500' />
                    </button>
                    <button onClick={() => confirmDeleteStudent(student)}>
                      <FaTrashAlt className='text-xl ml-4 text-red-500' />
                    </button>
                  </td>
                </tr>
              ))
            ))}
          </tbody>
        </table>
        {isDeleteConfirmOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded shadow-lg">
              <h2 className="text-lg font-bold mb-4">Confirm Deletion</h2>
              <p>Are you sure you want to delete this student?</p>
              <div className="flex justify-end mt-4">
                <button onClick={deleteStudent} className="bg-red-500 text-white px-4 py-2 rounded mr-2">Delete</button>
                <button onClick={() => setIsDeleteConfirmOpen(false)} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
              </div>
            </div>
          </div>
        )}
        {isPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded shadow-lg">
            <h2 className="text-xl font-bold mb-4">Edit Student</h2>
            <div  className="flex gap-8 w-full mt-4 mb-4">
                      <input
                       
                        type="text" 
                        name="armyno" 
                        value={formData.armyno} 
                        onChange={handleInputChange} 
                        placeholder="Army No"
                        className="w-full text-lg px-5 py-3 rounded-lg border border-gray-200"
                      />
                     <select
  value={formData.rankno}
  onChange={handleInputChange} 
  name="rankno"
  className="w-full text-lg px-5 py-3 rounded-lg border border-gray-200"
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

                      <input
                        value={formData.name}
                        onChange={handleInputChange} 
                        type="text"
                        name="name"
                        placeholder="Name"
                        className="w-full text-lg px-5 py-3 rounded-lg border border-gray-200"
                      />
                       <select
  value={formData.unitno}
  onChange={handleInputChange} 
  name="unitno"
  className="w-full text-lg px-5 py-3 rounded-lg border border-gray-200"
>
  <option value="" disabled>Select Unit</option>
  <option value="1/3 GR">1/3 GR</option>
  <option value="2/ GR">2/3 GR</option>
  <option value="3/3 GR">3/3 GR</option>
  <option value="4/3 GR">4/3 GR</option>
  <option value="5/3 GR">5/3 GR</option>
  <option value="1/9 GR">1/9 GR</option>
  <option value="2/9 GR">2/9 GR</option>
  <option value="3/9 GR">3/9 GR</option>
  <option value="4/9 GR">4/9 GR</option>
  <option value="5/9 GR">5/9 GR</option>
  <option value="32 GR">32 GR</option>
  <option value="137 CETF">137 CETF</option>
</select>
  <select
    value={formData.phase}
    onChange={handleInputChange} 
    name="phase"
    className="w-full text-lg px-5 py-3 rounded-lg border border-gray-200"
  >
    <option value="" disabled>Select Pre</option>
    <option value="pre1st">Pre 1st</option>
    <option value="pre2nd">Pre 2nd</option>
  </select>


                    </div>
            
            <div className="flex justify-end">
              <button onClick={updateStudent} className="bg-blue-500 text-white px-4 py-2 rounded mr-2">Update</button>
              <button onClick={() => setIsPopupOpen(false)} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
            </div>
          </div>
        </div>
      )}
      </div>
      <div>
    <div className="mt-4">
      {newStudents.map((student, index) => (
        <div key={index} className="flex gap-4 w-full mb-4">
          <input
            value={student.armyno || ''}
            onChange={(e) => handleNewStudentChange(index, e, 'armyno')}
            type="text"
            name="armyno"
            placeholder="Army No."
            className="w-full text-lg px-5 py-3 rounded-lg border border-gray-200"
          />
          
          <select
            value={student.rankno}
            onChange={(e) => handleNewStudentChange(index, e, 'rankno')}
            name="rankno"
            className="w-full text-lg px-5 py-3 rounded-lg border border-gray-200"
          >
            <option value="">Select Rank</option>
            <option value="RFN">RFN</option>
            <option value="LNK">LNK</option>
            <option value="LHAV">LHAV</option>
            <option value="NK">NK</option>
            <option value="HAV">HAV</option>
            <option value="NB SUB">NB SUB</option>
            <option value="SUB">SUB</option>
            <option value="SUB MAJ">SUB MAJ</option>
          </select>

          <input
            value={student.name || ''}
            onChange={(e) => handleNewStudentChange(index, e, 'name')}
            type="text"
            name="name"
            placeholder="Name"
            className="w-full text-lg px-5 py-3 rounded-lg border border-gray-200"
          />

          <select
            value={student.unitno}
            onChange={(e) => handleNewStudentChange(index, e, 'unitno')}
            name="unitno"
            className="w-full text-lg px-5 py-3 rounded-lg border border-gray-200"
          >
            <option value="">Select Unit</option>
            <option value="1/3 GR">1/3 GR</option>
            <option value="2/3 GR">2/3 GR</option>
            <option value="3/3 GR">3/3 GR</option>
            <option value="4/3 GR">4/3 GR</option>
            <option value="5/3 GR">5/3 GR</option>
            <option value="1/9 GR">1/9 GR</option>
            <option value="2/9 GR">2/9 GR</option>
            <option value="3/9 GR">3/9 GR</option>
            <option value="4/9 GR">4/9 GR</option>
            <option value="5/9 GR">5/9 GR</option>
            <option value="32 GR">32 GR</option>
            <option value="137 CETF">137 CETF</option>
          </select>

          <select
  value={student.phase}  // Make sure the value is controlled from the state
  onChange={(e) => handleNewStudentChange(index, e, 'phase')}  // Handle changes to phase
  name="phase"
  className="w-full text-lg px-5 py-3 rounded-lg border border-gray-200"
>
  <option value="">Select Pre</option>
  <option value="pre1st">Pre 1st</option>
  <option value="pre2nd">Pre 2nd</option>
</select>
<button
              onClick={() => removeAnotherStudentField(index)}
              className="text-red-500"
            >
              Remove
            </button>

        </div>
      ))}
    </div>

    {/* Buttons to add fields or submit */}
    <div className="mt-4">
      <button
        onClick={addAnotherStudentField}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg mr-4"
      >
        Add Another Student
      </button>
      {newStudents.length > 0 && (
      <button
        onClick={addStudentsApi}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg"
      >
        Submit Students
      </button>
      )}
    </div>
  </div>

  {selectedData.map((course) => (
  <tr key={course._id} className="bg-white border-b hover:bg-gray-100">
    <td colSpan={6} className="py-4 px-6 text-sm text-gray-900">
      <div className="flex justify-between items-center">
        <span className="font-semibold text-gray-800">{course.selectedCourse} - {course.selectedTitle} Course</span>
        <button
          onClick={() => deleteCourse(course._id)}
          className="text-red-600 hover:text-red-800 font-medium flex items-center space-x-2 p-2 rounded-lg hover:bg-red-100 transition duration-200 ease-in-out"
        >
          <FaTrashAlt className="text-xl" />
          <span>Delete</span>
        </button>
      </div>
    </td>
  </tr>
))}

  {filteredInstructorsByStudentDate && (
  <div className="mt-6 p-4 bg-gray-100 rounded-lg shadow-md">
    <h3 className="text-xl font-semibold text-gray-800 mb-4">
      Instructor Availability
    </h3>
    <table className="min-w-full border-collapse border border-gray-300 text-gray-800">
      <thead>
        <tr className="bg-gray-200">
          {/* <th className="border border-gray-300 px-4 py-2 text-left">Select</th> */}
          <th className="border border-gray-300 px-4 py-2 text-left">Name</th>
          <th className="border border-gray-300 px-4 py-2 text-left">Availability</th>
        </tr>
      </thead>
      <tbody>
      {filteredInstructorsByStudentDate.map((instructor) => (
        <tr key={instructor._id} >
          {/* <td className="border border-gray-300 px-4 py-2">
          <input
                type="checkbox"
                id={`instructor-${instructor._id}`}
                value={instructor.instructorName}
                checked={selectedInstructors.some((inst) => inst._id === instructor._id)} // Check if the instructor is selected
                onChange={() => handleInstructorCheckbox(instructor)} // Pass the entire instructor object
              />
          </td> */}
          <td className="border border-gray-300 px-4 py-2">
          <ul>
              {instructor.selectedStudents.map((student) => (
                <li key={student._id}>
                  {student.name} - {student.unitno} - {student.grading}
                </li>
              ))}
            </ul>
          </td>
          <td className="border border-gray-300 px-4 py-2">
            {new Date(instructor.fromDate).toLocaleDateString()} to{' '}
            {new Date(instructor.toDate).toLocaleDateString()}
          </td>
        </tr>
      ))}
      </tbody>
    </table>
  </div>
)}
      <ToastContainer/>
    </div>
      )}
    </div>
  );
};

export default Students;
