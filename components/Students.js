import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [coursesList, setCoursesList] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedTitle, setSelectedTitle] = useState('All');
  const [selectedYear, setSelectedYear] = useState('');
  const [courses, setCourses] = useState([]);
  const [titles, setTitles] = useState([]);
  const [year, setYears] = useState([]);
  const [editingStudent, setEditingStudent] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [vacAllotted, setVacAllotted] = useState(0);
  const [vacUtilised, setVacUtilised] = useState(0);
  const [vacUtilisedPhase1, setVacUtilisedPhase1] = useState(0);
  const [vacUtilisedPhase2, setVacUtilisedPhase2] = useState(0);
  const [selectedPhases, setSelectedPhases] = useState({ phase1: [], phase2: [] });
  const fetchStudents = async () => {
    try {
      const res = await fetch('/api/fetchstudents');
      const result = await res.json();
      if (result.success) {
        setStudents(result.data);

        // Extract unique courses and titles
        const uniqueCourses = [...new Set(result.data.map(student => student.selectedCourse))];
        const uniqueTitles = [...new Set(result.data.map(student => student.selectedTitle))];
        const uniqueYears = [...new Set(result.data.map(student => student.year))];
        
        setCourses(uniqueCourses);
        setYears(uniqueYears);
        setTitles(['All', ...uniqueTitles]);
     
        console.log('Students Data:', result.data);
      } else {
        console.error('Failed to fetch students');
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

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
  const handleCourseChange = (e) => {
    const selected = e.target.value;
    setSelectedCourse(selected);

    const selectedCourseData = coursesList.find(
      (course) => course.courseName === selected
    );
    if (selectedCourseData) {
      setTitles(selectedCourseData.titles);
    } else {
      setTitles([]);
    }
  };
  const handleTitleChange = (e) => {
    setSelectedTitle(e.target.value);
  };

  // Handle checkbox change
  
  const handlePhaseChange = (phase, studentId) => {
    setSelectedPhases(prev => {
      const updatedPhases = {
        ...prev,
        [phase]: prev[phase].includes(studentId)
          ? prev[phase].filter(id => id !== studentId)
          : [...prev[phase], studentId]
      };
      setVacUtilisedPhase1(updatedPhases.phase1.length);
      setVacUtilisedPhase2(updatedPhases.phase2.length);
      setVacUtilised(updatedPhases.phase1.length + updatedPhases.phase2.length);
      return updatedPhases;
    });
  };
  const handleSubmit = async () => {
    const selectedStudents = [...selectedPhases.phase1, ...selectedPhases.phase2];
    const studentData = students.filter(student => selectedStudents.includes(student._id))
      .map(student => ({
        selectedCourse: student.selectedCourse,
        selectedTitle: student.selectedTitle,
        year: student.year,
        targetYear: student.targetYear,
        armyno: student.armyno,
        rankno: student.rankno,
        name: student.name,
        unitno: student.unitno,
        result: student.result,
        selectedPhase: selectedPhases.phase1.includes(student._id) ? 'Phase 1' : 'Phase 2'
      }));
  
    // Filter and sort students based on selected course and title
    const filteredStudents = students
      .filter(student => 
        (selectedCourse === '' || student.selectedCourse === selectedCourse) &&
        (selectedTitle === '' || student.year === selectedYear) &&
        (selectedTitle === 'All' || student.selectedTitle === selectedTitle)
      )
      .sort((a, b) => b.result - a.result); // Sort by result in descending order
  
    // Count unique titles after filtering
    const titleCountsAfterFilter = filteredStudents.reduce((acc, student) => {
      acc[student.selectedTitle] = (acc[student.selectedTitle] || 0) + 1;
      return acc;
    }, {});
  
    // Transform to match MongoDB schema
    const titleCountsArray = Object.keys(titleCountsAfterFilter).map(title => ({
      title,
      count: titleCountsAfterFilter[title],
    }));
  
    console.log('Unique Titles and Counts After Filter:', titleCountsArray);
  
    // Ensure `titlecounts` is included in the data object
    const data = {
      vacAllotted,
      vacUtilised,
      year: selectedYear || '', 
      course: selectedCourse || '',
      students: studentData,
      titlecounts: titleCountsArray // Ensure this matches the API field name
    };
  
    console.log('Data to Submit:', data);
  
    try {
      const res = await fetch('/api/submitmaincourse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      if (res.ok) {
        const result = await res.json();
        if (result.success) {
          alert('Data submitted successfully!');
          setIsPopupOpen(false); // Close the popup on successful submission
        } else {
          alert('Failed to submit data.');
        }
      } else {
        console.error('Server response error:', res.status, res.statusText);
        alert('An error occurred while submitting data.');
      }
    } catch (error) {
      console.error('Error submitting data:', error);
      alert('An error occurred while submitting data.');
    }
  };
  
  
  
  
  
  
  // Toggle popup
  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  const handleEdit = (id) => {
    const student = students.find(student => student._id === id);
    setEditingStudent(student);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
  
    if (!editingStudent?._id) {
      alert('Student ID is missing');
      return;
    }
  
    try {
      const res = await fetch(`/api/updateStudent?id=${editingStudent._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingStudent),
      });
  
      // Check if response is valid JSON
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const result = await res.json();
        console.log('Update Result:', result);
  
        if (result.success) {
          alert('Student updated successfully!');
          fetchStudents(); // Refresh the list of students
          setEditingStudent(null); // Close the form
        } else {
          alert('Failed to update student.');
        }
      } else {
        const text = await res.text();
        console.error('Unexpected response:', text);
        alert('Unexpected response from server.');
      }
    } catch (error) {
      console.error('Error updating student:', error);
      alert('Error updating student.');
    }
  };
  
  


  const handleDelete = async (id) => {
    // Show a confirmation dialog
    const isConfirmed = window.confirm('Are you sure you want to delete this student?');
  
    // Proceed only if the user confirms
    if (isConfirmed) {
      try {
        const res = await fetch(`/api/deletestudent/${id}`, {
          method: 'DELETE',
        });
  
        const result = await res.json();
        if (result.success) {
          alert('Student deleted successfully!');
          fetchStudents();
        } else {
          alert('Failed to delete student.');
        }
      } catch (error) {
        console.error('Error deleting student:', error);
        alert('Error deleting student.');
      }
    }
  };
  

  // Filter and sort students based on selected course and title
  const filteredStudents = students
    .filter(student => 
      (selectedCourse === '' || student.selectedCourse === selectedCourse)
      && 
      (selectedTitle === '' || student.year === selectedYear) && 
      (selectedTitle === 'All' || student.selectedTitle === selectedTitle)
    )
    .sort((a, b) => b.result - a.result); // Sort by result in descending order


  return (
    <div className='bg-white py-8 relative px-8'>
      <h1 className='text-2xl font-bold mb-4'>Students</h1>

      <div className='mb-4 flex gap-4'>
      <label className='block text-sm font-medium text-gray-700'>
          Select Year:
          <select
            onChange={(e) => setSelectedYear(e.target.value)}
            className='mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
          >
          <option value="">Select Year</option>
    <option value="2019-20">2019-20</option>
    <option value="2020-21">2020-21</option>
    <option value="2021-22">2021-22</option>
    <option value="2022-23">2022-23</option>
    <option value="2023-24">2023-24</option>
    <option value="2024-25">2024-25</option>
    <option value="2025-26">2025-26</option>
    <option value="2026-27">2026-27</option>
    <option value="2027-28">2027-28</option>
    <option value="2028-29">2028-29</option>
    <option value="2029-30">2029-30</option>
          </select>
        </label>
        <label className='block text-sm font-medium text-gray-700'>
          Select Course:
          <select
          value={selectedCourse}
          onChange={handleCourseChange}
            className='mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
          >
             <option value="">Select Course</option>
            {coursesList.map((course) => (
                        <option key={course._id} value={course.courseName}>
                          {course.courseName}
                        </option>
                      ))}
          </select>
        </label>
        <label className='block text-sm font-medium text-gray-700'>
          Select Title:
          <select
            value={selectedTitle}
            disabled={!titles.length}
            onChange={handleTitleChange}
            className='mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
          >
             <option value="">Select Course Title</option>
              {titles.map((title) => (
                        <option key={title._id} value={title.name}>
                          {title.name}
                        </option>
                      ))}
          </select>
        </label>
      </div>

      {/* Button to open popup */}
      <button 
        onClick={togglePopup} 
        className="bg-indigo-600 text-white px-4 py-2 rounded mb-4"
      >
        Select for Main Course
      </button>

      <div className='overflow-x-auto'>
        <table className='min-w-full divide-y divide-gray-200'>
          <thead className='bg-gray-50'>
            <tr>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>S.no</th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>ARMY No</th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Rank</th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Name</th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Unit</th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Result</th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Actions</th>
            </tr>
          </thead>
          <tbody className='bg-white divide-y divide-gray-200'>
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student, index) => (
                <tr key={student._id}>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                    {index + 1}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>{student.armyno}</td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>{student.rankno}</td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>{student.name}</td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>{student.unitno}</td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>{student.result}</td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                    <button
                      onClick={() => handleEdit(student._id)}
                      className='text-indigo-600 hover:text-indigo-900 mr-2'
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(student._id)}
                      className='text-red-600 hover:text-red-900 mr-2'
                    >
                      <FaTrashAlt />
                    </button>
                  
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className='px-6 py-4 text-center text-sm text-gray-500'>No students found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>




   
      {editingStudent && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
          <div className="relative w-full  bg-white rounded-lg shadow-lg overflow-y-scroll h-[100vh] p-8">
            <button
              onClick={() => setEditingStudent(null)}
              className="absolute top-4 right-4 text-red-500 hover:text-red-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <h2 className="text-center text-gray-900 text-4xl font-bold">Edit Student</h2>
            <form onSubmit={handleUpdate} className="w-full lg:p-11 md:p-8 p-7 bg-white rounded-3xl shadow-[0px_15px_60px_-4px_rgba(16,_24,_40,_0.08)] flex-col justify-start items-start flex">
              <h3 className="text-3xl font-bold text-black underline font-mono mb-4">Basic Details</h3>

              <div className="w-full flex-col justify-start items-start gap-8 flex">
               
                <div className="w-full justify-start items-start gap-8 flex sm:flex-row flex-col">
               
                  <div className="w-full flex-col justify-start items-start gap-1.5 flex">
                    <input
                       value={editingStudent.armyno}
                       onChange={(e) => setEditingStudent({ ...editingStudent, armyno: e.target.value })}
                      type="text"
                      name="armyno"
                      className="w-full focus:outline-none text-gray-900 placeholder-gray-400 text-lg font-normal leading-relaxed px-5 py-3 rounded-lg shadow-[0px_1px_2px_0px_rgba(16,_24,_40,_0.05)] border border-gray-200 justify-start items-center gap-2 inline-flex"
                      placeholder="Army No."
                    />
                  </div>
                  <div className="w-full flex-col justify-start items-start gap-1.5 flex">
                    <input
                      value={editingStudent.rankno}
                      onChange={(e) => setEditingStudent({ ...editingStudent, rankno: e.target.value })}
                      type="text"
                      name="rankno"
                      className="w-full focus:outline-none text-gray-900 placeholder-gray-400 text-lg font-normal leading-relaxed px-5 py-3 rounded-lg shadow-[0px_1px_2px_0px_rgba(16,_24,_40,_0.05)] border border-gray-200 justify-start items-center gap-2 inline-flex"
                      placeholder="Enter Rank No"
                    />
                  </div>
                </div>
                <div className="w-full justify-start items-start gap-8 flex sm:flex-row flex-col">
                  <div className="w-full flex-col justify-start items-start gap-1.5 flex">
                    <input
                      value={editingStudent.name}
                      onChange={(e) => setEditingStudent({ ...editingStudent, name: e.target.value })}
                      type="text"
                      name="name"
                      className="w-full focus:outline-none text-gray-900 placeholder-gray-400 text-lg font-normal leading-relaxed px-5 py-3 rounded-lg shadow-[0px_1px_2px_0px_rgba(16,_24,_40,_0.05)] border border-gray-200 justify-start items-center gap-2 inline-flex"
                      placeholder="Name"
                    />
                  </div>
                  <div className="w-full flex-col justify-start items-start gap-1.5 flex">
                    <input
                    value={editingStudent.unitno}
                    onChange={(e) => setEditingStudent({ ...editingStudent, unitno: e.target.value })}
                      type="text"
                      name="unitno"
                      className="w-full focus:outline-none text-gray-900 placeholder-gray-400 text-lg font-normal leading-relaxed px-5 py-3 rounded-lg shadow-[0px_1px_2px_0px_rgba(16,_24,_40,_0.05)] border border-gray-200 justify-start items-center gap-2 inline-flex"
                      placeholder="Unit No."
                    />
                  </div>
                </div>
                <div className="w-full justify-start items-start gap-8 flex sm:flex-row flex-col">
                
                  <div class="w-full flex-col justify-start items-start gap-1.5 flex">
  
    <select     value={editingStudent.phase}
                onChange={(e) => setEditingStudent({ ...editingStudent, phase: e.target.value })} id="phase" name="phase" class="w-full focus:outline-none text-gray-900 text-lg font-normal leading-relaxed px-5 py-3 rounded-lg shadow-[0px_1px_2px_0px_rgba(16,_24,_40,_0.05)] border border-gray-200">
        <option value="">Select Phase</option>
        <option value="1st Phase">1st Phase</option>
        <option value="2nd Phase">2nd Phase</option>
    </select>
</div>
                  <div className="w-full flex-col justify-start items-start gap-1.5 flex">
                    <input
                      value={editingStudent.entranceTest}
                      onChange={(e) => setEditingStudent({ ...editingStudent, entranceTest: e.target.value })}
                      type="text"
                      name="entranceTest"
                      className="w-full focus:outline-none text-gray-900 placeholder-gray-400 text-lg font-normal leading-relaxed px-5 py-3 rounded-lg shadow-[0px_1px_2px_0px_rgba(16,_24,_40,_0.05)] border border-gray-200 justify-start items-center gap-2 inline-flex"
                      placeholder="Entrance Test"
                    />
                  </div>
                </div>
                <div className="w-full justify-start items-start gap-8 flex sm:flex-row flex-col">
                  <div className="w-full flex-col justify-start items-start gap-1.5 flex">
                    <input
                      value={editingStudent.quizTest}
                      onChange={(e) => setEditingStudent({ ...editingStudent, quizTest: e.target.value })}
                      type="text"
                      name="quizTest"
                      className="w-full focus:outline-none text-gray-900 placeholder-gray-400 text-lg font-normal leading-relaxed px-5 py-3 rounded-lg shadow-[0px_1px_2px_0px_rgba(16,_24,_40,_0.05)] border border-gray-200 justify-start items-center gap-2 inline-flex"
                      placeholder="Quiz Test"
                    />
                  </div>
                  <div className="w-full flex-col justify-start items-start gap-1.5 flex">
                    <input
                      value={editingStudent.midTermTest}
                      onChange={(e) => setEditingStudent({ ...editingStudent, midTermTest: e.target.value })}
                      type="text"
                      name="midTermTest"
                      className="w-full focus:outline-none text-gray-900 placeholder-gray-400 text-lg font-normal leading-relaxed px-5 py-3 rounded-lg shadow-[0px_1px_2px_0px_rgba(16,_24,_40,_0.05)] border border-gray-200 justify-start items-center gap-2 inline-flex"
                      placeholder="Mid Term Test"
                    />
                  </div>
                </div>
                <div className="w-full justify-start items-start gap-8 flex sm:flex-row flex-col">
                  <div className="w-full flex-col justify-start items-start gap-1.5 flex">
                    <input
                      value={editingStudent.fgtest}
                      onChange={(e) => setEditingStudent({ ...editingStudent, fgtest: e.target.value })}
                      type="text"
                      name="fgtest"
                      className="w-full focus:outline-none text-gray-900 placeholder-gray-400 text-lg font-normal leading-relaxed px-5 py-3 rounded-lg shadow-[0px_1px_2px_0px_rgba(16,_24,_40,_0.05)] border border-gray-200 justify-start items-center gap-2 inline-flex"
                      placeholder="FG Test"
                    />
                  </div>
                  <div className="w-full flex-col justify-start items-start gap-1.5 flex">
                    <input
                      value={editingStudent.faultTest}
                      onChange={(e) => setEditingStudent({ ...editingStudent, faultTest: e.target.value })}
                      type="text"
                      name="faultTest"
                      className="w-full focus:outline-none text-gray-900 placeholder-gray-400 text-lg font-normal leading-relaxed px-5 py-3 rounded-lg shadow-[0px_1px_2px_0px_rgba(16,_24,_40,_0.05)] border border-gray-200 justify-start items-center gap-2 inline-flex"
                      placeholder="Fault Test"
                    />
                  </div>
                </div>
                <div className="w-full flex-col justify-start items-start gap-1.5 flex">
                  <input
                    value={editingStudent.result}
                    onChange={(e) => setEditingStudent({ ...editingStudent, result: e.target.value })}
                    type="text"
                    name="result"
                    className="w-full focus:outline-none text-gray-900 placeholder-gray-400 text-lg font-normal leading-relaxed px-5 py-3 rounded-lg shadow-[0px_1px_2px_0px_rgba(16,_24,_40,_0.05)] border border-gray-200 justify-start items-center gap-2 inline-flex"
                    placeholder="Result"
                  />
                </div>
                <div className="w-full flex-col justify-start items-start gap-1.5 flex">
                  <button
                    type="submit"
                    className="w-full text-center text-white bg-blue-500 hover:bg-blue-600 focus:outline-none font-medium rounded-lg text-lg px-5 py-3"
                  >
                 Update
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Popup Modal */}
      {isPopupOpen && (
     <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
          <div className="relative w-full  bg-white rounded-lg shadow-lg overflow-y-scroll h-[100vh] p-8">
            <h2 className="text-lg font-bold mb-4">Selection For Main Course</h2>

          

            {/* Input fields for Vac Allotted and Vac Utilised */}
            <div className='flex gap-4 mb-2 ' >
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">Vac Allotted:</label>
              <input 
                type="number" 
                value={vacAllotted} 
                onChange={(e) => setVacAllotted(e.target.value)} 
                className="mt-1 block w-full border p-2 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">Vac Utilised:</label>
              <input 
             type="number"
             value={vacUtilised}
             readOnly
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            </div>

            <div className='overflow-x-auto'>
        <table className='min-w-full divide-y divide-gray-200'>
          <thead className='bg-gray-50'>
            <tr>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Select Phase</th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>ARMY No</th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Rank</th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Name</th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Unit</th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Result</th>
            </tr>
          </thead>
          <tbody className='bg-white divide-y divide-gray-200'>
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student, index) => (
                <tr key={student._id}>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                          <input 
                            type="checkbox" 
                            checked={selectedPhases.phase1.includes(student._id)} 
                            onChange={() => handlePhaseChange('phase1', student._id)} 
                          /> Phase 1
                          <input 
                            type="checkbox" 
                            checked={selectedPhases.phase2.includes(student._id)} 
                            onChange={() => handlePhaseChange('phase2', student._id)} 
                            className='ml-4' 
                          /> Phase 2
                        </td>

                   
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>{student.armyno}</td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>{student.rankno}</td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>{student.name}</td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>{student.unitno}</td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>{student.result}</td>
              
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className='px-6 py-4 text-center text-sm text-gray-500'>No students found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
<div className='flex gap-4' >
            <button 
             onClick={handleSubmit}
              className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded"
            >
              Submit
            </button>
            <button 
              onClick={togglePopup} 
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded"
            >
              Close
            </button>
</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Students;
