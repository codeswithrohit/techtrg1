import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrashAlt, FaStar } from 'react-icons/fa';
import { useRouter } from 'next/router';
const Students = ({userData}) => {
  const [students, setStudents] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedTitle, setSelectedTitle] = useState('');
  const [courses, setCourses] = useState([]);
  const [titles, setTitles] = useState([]);
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

  const fetchStudents = async () => {
    try {
      const res = await fetch('/api/fetchstudents');
      const result = await res.json();
      if (result.success) {
        setStudents(result.data);

        // Extract unique courses and titles
        const uniqueCourses = [...new Set(result.data.map(student => student.selectedCourse))];
        const uniqueTitles = [...new Set(result.data.map(student => student.selectedTitle))];
        setCourses(uniqueCourses);
        setTitles(uniqueTitles);

        // Set default course and title based on the first student
        if (result.data.length > 0) {
          setSelectedCourse(result.data[0].selectedCourse);
          setSelectedTitle(result.data[0].selectedTitle);
        }
      } else {
        console.error('Failed to fetch students');
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  console.log("student",students)

  const handleEdit = (id) => {
    console.log(`Edit student with id: ${id}`);
  };

  const handleDelete = async (id) => {
    // Show confirmation dialog
    const confirmed = window.confirm('Are you sure you want to delete this student?');
    
    if (confirmed) {
      try {
        const res = await fetch(`/api/deletestudent/${id}`, {
          method: 'DELETE',
        });
        const result = await res.json();
        
        if (result.success) {
          // Refetch the students list after successful deletion
          fetchStudents();
          // Show success alert
          alert('Student deleted successfully');
        } else {
          console.error('Failed to delete student');
          // Optionally show an error alert
          alert('Failed to delete student');
        }
      } catch (error) {
        console.error('Error deleting student:', error);
        // Show error alert
        alert('Error deleting student');
      }
    }
  };
  
  

  const handleGrade = (id) => {
    console.log(`Grade student with id: ${id}`);
  };

  // Filter and sort students based on selected course and title
  const filteredStudents = students
    .filter(student =>
      student.selectedCourse === selectedCourse && student.selectedTitle === selectedTitle
    )
    .sort((a, b) => b.result - a.result); // Sort by result in descending order
    if (loading) {
      return <div className="flex justify-center items-center h-screen text-xl">Checking access...</div>;
    }
  return (
    <div className='min-h-screen bg-white py-36 relative px-8'>
      <h1 className='text-2xl uppercase font-bold mb-4'>Students</h1>

      <div className='mb-4 flex gap-4'>
        <label className='block text-sm font-medium text-gray-700'>
          Select Course:
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className='mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
          >
            {courses.map(course => (
              <option key={course} value={course}>
                {course}
              </option>
            ))}
          </select>
        </label>
        <label className='block text-sm font-medium text-gray-700'>
          Select Title:
          <select
            value={selectedTitle}
            onChange={(e) => setSelectedTitle(e.target.value)}
            className='mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
          >
            {titles.map(title => (
              <option key={title} value={title}>
                {title}
              </option>
            ))}
          </select>
        </label>
      </div>

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
                    <input type="checkbox" className="mr-2" />
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
                    <button
                      onClick={() => handleGrade(student._id)}
                      className='text-yellow-600 hover:text-yellow-900'
                    >
                      <FaStar />
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
    </div>
  );
};

export default Students;
