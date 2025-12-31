import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { FaTrash } from 'react-icons/fa';
import PC from '@/components/MaincourseStudents/PC';
import SEC_CDR from '@/components/MaincourseStudents/SECCDR';
import PT from '@/components/MaincourseStudents/PT';
import ADC from '@/components/MaincourseStudents/ADC';
import MTCADRE from '@/components/MaincourseStudents/MTCADRE';
import AIBC from '@/components/MaincourseStudents/AIBC';
import CLC from '@/components/MaincourseStudents/CLC';
import LMC from '@/components/MaincourseStudents/LMC';
import ATGM from '@/components/MaincourseStudents/ATGM';
import SNIPER from '@/components/MaincourseStudents/SNIPER';
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const MainCourseStudent = ({userData}) => {
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


  const [maincoursestudents, setMaincourseStudents] = useState([]);
  const [coursesList, setCoursesList] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [instructors, setInstructors] = useState([]);
  const [filteredInstructor, setFilteredInstructor] = useState(null);
  const [uniqueYears, setUniqueYears] = useState([]);
  const [uniqueCoursesSet, setUniqueCoursesSet] = useState([]);
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
  const fetchStudents = async () => {
    try {
      const res = await fetch('/api/maincourse');
      const result = await res.json();
      if (result.success) {
        setMaincourseStudents(result.data);
        const years = [...new Set(result.data.map(student => student.year))];
        setUniqueYears(years);
                  setSelectedCourse(result.data[0].course);

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
  const filteredStudents = maincoursestudents
  .filter(student => selectedYear === '' || student.year === selectedYear)
  .filter(student => selectedCourse === '' || student.course === selectedCourse);

  const handleYearChange = (e) => {
    const year = e.target.value;
    setSelectedYear(year);
    // Filter students based on the selected year
    const filteredStudents = maincoursestudents.filter(student => student.year === year);

    // Extract the unique courses selected by students for that year
    const uniqueCourses = [...new Set(filteredStudents.flatMap(student => student.course))];
    setUniqueCoursesSet(uniqueCourses);
   
  };

  const handleCourseChange = (e) => {
    const selected = e.target.value;
    setSelectedCourse(selected);
  

  };
  
console.log("maincoursestudent",maincoursestudents)

const handleDeleteStudent = async (studentId) => {
  const confirmDelete = window.confirm("Are you sure you want to delete this student?");
  if (!confirmDelete) return;

  const enteredPassword = window.prompt("Enter delete password:");
  if (!enteredPassword) {
    toast.error("Password is required to delete the student.");
    return;
  }

  if (enteredPassword !== password) { // Ensure correctPassword is defined
    toast.error("Incorrect password. Student deletion failed.");
    return;
  }

  try {
    const res = await fetch(`/api/deleteMainCourse/${studentId}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      throw new Error("Failed to delete student.");
    }

    const result = await res.json();
    if (result.success) {
      toast.success("Student deleted successfully!");
      fetchStudents(); // Refresh the students list
    } else {
      throw new Error(result.message || "Failed to delete student.");
    }
  } catch (error) {
    console.error("Error deleting student:", error);
    toast.error(error.message || "An error occurred while deleting the student.");
  }
};


const filteredInstructors = instructors.filter(
  (instructor) =>
    instructor.course === selectedCourse
);
if (loading) {
  return <div className="flex justify-center items-center h-screen text-xl">Checking access...</div>;
}
// console.log("instructors",instructors)
// console.log("selectedcourse",selectedCourse)
// console.log("filteredinstructors",filteredInstructors)
  return (
    <div className="p-6 py-36 min-h-screen">
      <div className='mb-4 flex gap-4 mt-4'>
        <label className='block text-sm font-medium text-gray-700'>
          Select Year:
          <select
            className=' block w-48 py-3 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
            value={selectedYear}
            onChange={handleYearChange}
          >
                <option value="">Select Year</option>
              {uniqueYears
      .sort((a, b) => parseInt(a.split("-")[0]) - parseInt(b.split("-")[0]))
      .map((year, index) => (
        <option key={index} value={year}>
          {year}
        </option>
      ))}
          </select>
        </label>
        <label className='block text-sm font-medium text-gray-700'>
          Select Course:
          <select
          value={selectedCourse}
          onChange={handleCourseChange}
            className=' block w-48 py-3 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
          >
          <option value="">Select Course</option>
              {uniqueCoursesSet.map((course, index) => (
                <option key={index} value={course}>
                  {course}
                </option>
              ))}
          </select>
        </label>
      </div>

      <div>
        {selectedCourse === 'PC' && <PC filteredInstructors={filteredInstructors} filteredStudents={filteredStudents} maincoursestudents={maincoursestudents} handleDeleteStudent={handleDeleteStudent} />}
        {selectedCourse === 'SEC CDR' && <SEC_CDR filteredInstructors={filteredInstructors} filteredStudents={filteredStudents} maincoursestudents={maincoursestudents} handleDeleteStudent={handleDeleteStudent} />}
        {selectedCourse === 'ADC' && <ADC filteredInstructors={filteredInstructors} filteredStudents={filteredStudents} maincoursestudents={maincoursestudents} handleDeleteStudent={handleDeleteStudent} />}
        {selectedCourse === 'AIBC' && <AIBC filteredInstructors={filteredInstructors} filteredStudents={filteredStudents} maincoursestudents={maincoursestudents} handleDeleteStudent={handleDeleteStudent} />}
        {selectedCourse === 'MTCADRE' && <MTCADRE filteredInstructors={filteredInstructors} filteredStudents={filteredStudents} maincoursestudents={maincoursestudents} handleDeleteStudent={handleDeleteStudent} />}
        {selectedCourse === 'CLC' && <CLC filteredInstructors={filteredInstructors} filteredStudents={filteredStudents} maincoursestudents={maincoursestudents} handleDeleteStudent={handleDeleteStudent} />}
        {selectedCourse === 'LMC' && <LMC filteredInstructors={filteredInstructors} filteredStudents={filteredStudents} maincoursestudents={maincoursestudents} handleDeleteStudent={handleDeleteStudent} />}
        {selectedCourse === 'ATGM' && <ATGM filteredInstructors={filteredInstructors} filteredStudents={filteredStudents} maincoursestudents={maincoursestudents} handleDeleteStudent={handleDeleteStudent} />}
        {selectedCourse === 'SNIPER' && <SNIPER filteredInstructors={filteredInstructors} filteredStudents={filteredStudents} maincoursestudents={maincoursestudents} handleDeleteStudent={handleDeleteStudent} />}
        {selectedCourse && !['PC', 'SEC CDR', 'ADC', 'AIBC','MTCADRE','CLC','LMC','ATGM','SNIPER'].includes(selectedCourse) && (
          <div>Unknown Course: {selectedCourse}</div>
        )}
      </div>
      <ToastContainer/>
    </div>
  );
};

export default MainCourseStudent;
