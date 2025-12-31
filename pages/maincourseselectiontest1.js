import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
const MainCourseSelection = () => {
  const [students, setStudents] = useState([]);
  const [coursesList, setCoursesList] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedTitle, setSelectedTitle] = useState('All');
  const [selectedMaintitle, setSelectedMaintitle] = useState(''); 
  const [maincoursestudents, setMaincourseStudents] = useState([]);
  const [selectedYear, setSelectedYear] = useState('');
  const [titles, setTitles] = useState([]);
  const [maintitles, setMaintitles] = useState([]); 
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedStudents, setSelectedStudents] = useState({});
  const [vacAllotted, setVacAllotted] = useState(0);
  const [vacUtilised, setVacUtilised] = useState(0);
  const [ASIDE, setASIDE] = useState([]);
  const [XSIDE, setXSIDE] = useState([]);
  const [ASIDETOTAL, setASIDETOTAL] = useState([]);
  const [XSIDETOTAL, setXSIDETOTAL] = useState([]);
  const router = useRouter();
  const [uniqueYears, setUniqueYears] = useState([]);
  const [uniqueCoursesSet, setUniqueCoursesSet] = useState([]);

  const fetchStudents = async () => {
    try {
      const res = await fetch('/api/fetchstudents');
      const result = await res.json();
      if (result.success) {
        setStudents(result.data);
        const years = [...new Set(result.data.map(student => student.year))];
        setUniqueYears(years);
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
        const maintitles = result.data.map(course => course.maintitles).flat();
        setMaintitles(maintitles);
      } else {
        console.error('Failed to fetch courses');
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const fetchStudent = async () => {
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


  useEffect(() => {
    fetchStudents();
    fetchStudent();
    fetchCourses();
  }, []);
  
  const handleYearChange = (e) => {
    const year = e.target.value;
    setSelectedYear(year);
    // Filter students based on the selected year
    const filteredStudents = students.filter(student => student.year === year);

    // Extract the unique courses selected by students for that year
    const uniqueCourses = [...new Set(filteredStudents.flatMap(student => student.selectedCourse))];
    setUniqueCoursesSet(uniqueCourses);
   
  };

  const handleCourseChange = (e) => {
    const selected = e.target.value;
    setSelectedCourse(selected);
    setSelectedMaintitle("");
  
    if (selectedYear && selected) {
      const filteredStudents = students.filter(
        student => student.year === selectedYear && student.selectedCourse === selected
      );
  
      // Extract only the `name` property from objects
      const extractedTitles = [...new Set(filteredStudents.map(student => student.selectedTitle))].filter(Boolean);
      // const extractedMaintitles = [...new Set(filteredStudents.map(student => student.selectedMaintitle))].filter(Boolean);
  
      setTitles(extractedTitles);
      // setMaintitles(extractedMaintitles);
    } else {
      setTitles([]);
      setMaintitles([]);
    }
  
    const selectedCourseData = coursesList.find(course => course.courseName === selected);
    
    if (selectedCourseData) {
      setASIDE(selectedCourseData.aside || []);
      setXSIDE(selectedCourseData.xside || []);
      setASIDETOTAL(selectedCourseData.asideTotal || []);
      setXSIDETOTAL(selectedCourseData.xsideTotal || []);
    } else {
      setASIDE([]);
      setXSIDE([]);
      setASIDETOTAL([]);
      setXSIDETOTAL([]);
    }
  };
  

  const handleMaintitleChange = (e) => {
    setSelectedMaintitle(e.target.value);
  };

  const handleTitleChange = (e) => {
    const selectedPreCourse = e.target.value;
    setSelectedTitle(selectedPreCourse);
  
    // Find the corresponding maintitle from students based on year, course, and selected title
    const matchedStudent = students.find(
      student => student.year === selectedYear && 
                 student.selectedCourse === selectedCourse && 
                 student.selectedTitle === selectedPreCourse
    );
  console.log("matchedstudnets",matchedStudent)
    setSelectedMaintitle(matchedStudent ? matchedStudent.selectedMaintitle : "");
  };

  

  const filteredStudents = students.filter(student => {
    const matchesCourse = selectedCourse ? student.selectedCourse === selectedCourse : true;
    const matchesTitle = selectedTitle ? student.selectedTitle === selectedTitle : true;
    const matchesMaintitle = selectedMaintitle ? student.selectedMaintitle === selectedMaintitle : true;
    const matchesYear = selectedYear ? student.year === selectedYear : true;
    return matchesCourse && matchesTitle && matchesMaintitle && matchesYear;
  });

  

  // Filtering logic
  const filteredStudentsmain = maincoursestudents.filter(course => {
    const matchesCourse = selectedCourse ? course.course === selectedCourse : true;
    const matchesTitle = selectedTitle ? course.maincourse === selectedTitle : true;
    const matchesMaintitle = selectedMaintitle ? course.precourse === selectedMaintitle : true;
    const matchesYear = selectedYear ? course.year === selectedYear : true;
    
    return matchesCourse && matchesTitle && matchesMaintitle && matchesYear;
  });
  

  
  
 const calculateTotalScores = (studentScores) => {
  // Calculate the total scores for aside and xside tests
  const asideTotal = ASIDE.reduce((total, test) => {
    // Check for the correct key in studentScores, assuming studentScores contains test names as keys
    const score = studentScores[test.test] || 0; // Default to 0 if test score is not found
    return total + score;
  }, 0);

  const xsideTotal = XSIDE.reduce((total, test) => {
    // Check for the correct key in studentScores, assuming studentScores contains test names as keys
    const score = studentScores[test.test] || 0; // Default to 0 if test score is not found
    return total + score;
  }, 0);



  // Calculate percentages
  const asidePercentage = asideTotal > 0 ? (asideTotal * 100) / ASIDETOTAL : 0;
  const xsidePercentage = xsideTotal > 0 ? (xsideTotal * 100) / XSIDETOTAL : 0;

  return { asideTotal, xsideTotal, asidePercentage, xsidePercentage, ASIDE, XSIDE,ASIDETOTAL,XSIDETOTAL };
};




  const handleStudentClick = (student) => {
    setSelectedStudent(student);
  };

  const closeModal = () => {
    setSelectedStudent(null);
  };





  const handleSelectStudent = (student) => {
    setSelectedStudents(prevState => {
      const updatedSelectedStudents = { ...prevState };

      // Toggle selection
      if (updatedSelectedStudents[student.armyno]) {
        delete updatedSelectedStudents[student.armyno]; // Unselect
      } else {
        updatedSelectedStudents[student.armyno] = student; // Select
      }

      setVacUtilised(Object.values(updatedSelectedStudents).length);

      return updatedSelectedStudents;
    });
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  // Track the current state of data in the form
  const studentData = Object.values(selectedStudents); // Only include students that are checked

  // Prepare the data to be submitted
  const data = {
    vacAllotted,
    vacUtilised,
    year: selectedYear,
    course: selectedCourse,
    maincourse: selectedMaintitle,
    precourse: selectedTitle,
    targetYearPreCourse: filteredStudents.length > 0 ? filteredStudents[0].targetYearPreCourse : '',
    targetYearMainCourse: filteredStudents.length > 0 ? filteredStudents[0].targetYearMainCourse : '',
    students: studentData,
    instructors: filteredStudents.length > 0 ? filteredStudents[0].instructors : [],
    allstudentlength: filteredStudents.length > 0 ? filteredStudents[0].students.length : 0
  };

  try {
    let response;
    const existingRecord = maincoursestudents.find(student =>
      student.maincourse === selectedMaintitle &&
      student.precourse === selectedTitle &&
      student.year === selectedYear
    );

    // If there's an existing record, compare and update only the changed fields
    if (existingRecord && existingRecord._id) {
      const updatedData = {
        ...existingRecord, // Keep the existing data intact
        students: studentData, // Update selected students
        vacAllotted: vacAllotted !== existingRecord.vacAllotted ? vacAllotted : existingRecord.vacAllotted, // Only update if changed
        vacUtilised: vacUtilised !== existingRecord.vacUtilised ? vacUtilised : existingRecord.vacUtilised, // Only update if changed
      };

      response = await fetch('/api/updatemaincourse', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData), // Only send changed data
      });
    } else {
      // Submit new record if no existing record
      response = await fetch('/api/submitmaincourse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
    }

    const result = await response.json();

    if (result.success) {
      alert(existingRecord ? 'Data updated successfully' : 'Data submitted successfully');
      router.push('/maincoursestudent');
    } else {
      alert('Error:', result.message);
    }
  } catch (error) {
    console.error('Error:', error);
    alert('An error occurred while submitting the data.');
  }
};


  







const mycourseData = filteredStudentsmain.find(course => course.course === selectedCourse);
console.log("mycoursedata",mycourseData)
// Check if course data exists for the selected course
const myvacAllotted = mycourseData ? mycourseData.vacAllotted : 0;
const myvacUtilised = mycourseData ? mycourseData.vacUtilised : 0;
  return (
    <div className='bg-white py-36 relative px-8'>
      <h1 className='text-2xl font-bold mb-4 mt-8'>Students</h1>
<div className='min-h-screen' >
      <div className='mb-4 flex gap-4'>
        <label className='block text-sm font-medium text-gray-700'>
          Select Year:
          <select
       onChange={handleYearChange}
              className='mt-1 h-9 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
            >
              <option value="">Select Year</option>
              {uniqueYears.map((year, index) => (
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
              className='mt-1 h-9 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
            >
              <option value="">Select Course</option>
              {uniqueCoursesSet.map((course, index) => (
                <option key={index} value={course}>
                  {course}
                </option>
              ))}
            </select>
        </label>
        <label className='block text-sm font-medium text-gray-700'>
          Select Pre Course Serial No
          <select
            value={selectedTitle}
            disabled={!titles.length}
            onChange={handleTitleChange}
            className='mt-1 h-9 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
          >
               <option value="">Select Pre Course Serial No</option>
            {titles.map((title, index) => (
  <option key={index} value={title}>
    {title}
  </option>
))}
          </select>
        </label>
        <label className='block text-sm font-medium text-gray-700'>
  Select Main Course Serial No
  <div className='mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm bg-gray-100 sm:text-sm'>
    {selectedMaintitle || 'Select Main Course Serial No'}
  </div>
</label>

      

       
      </div>
      <div className='overflow-x-auto'>
      <div className='flex gap-4 mb-2 ' >
      <div className="mt-4">
  <label className="block text-sm font-medium text-gray-700">Vac Allotted:</label>
  <input
    type="number"
    value={myvacAllotted ? myvacAllotted : vacAllotted}
    onChange={(e) => setVacAllotted(e.target.value)}
    className="mt-1 block w-full text-black border p-2 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
  />
</div>
<div className="mt-4">
  <label className="block text-sm font-medium text-gray-700">Vac Utilised:</label>
  <input
    type="number"
    value={myvacUtilised ? myvacUtilised : vacUtilised}
    readOnly
    className="mt-1 block w-full text-black p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
  />
</div>

            </div>
        <table className='min-w-full divide-y divide-gray-200'>
          <thead className='bg-gray-50'>
            <tr>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>S.no</th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>ARMY No</th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Rank</th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Name</th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Unit</th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Select</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
  {filteredStudents.map((course, courseIndex) => (
    course.students.map((student, studentIndex) => {
      const { asideTotal, xsideTotal, asidePercentage, xsidePercentage } = calculateTotalScores(student.scores || {});

      // Check if the student is in maincoursestudents or selectedStudents
      const isStudentSelected = maincoursestudents.some(mStudent => 
        mStudent.students.some(s => s.armyno === student.armyno)
      ) || !!selectedStudents[student.armyno];

      // Determine if the student is in maincoursestudents (match found) or not
      const studentStatus = maincoursestudents.some(mStudent => 
        mStudent.students.some(s => s.armyno === student.armyno)
      ) ? student.armyno : "Elected";

      return (
        <tr key={`${course._id}-${studentIndex}`}>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{studentIndex + 1}</td>
          <td
            onClick={() => handleStudentClick(student)}
            className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 cursor-pointer"
          >
            {studentStatus}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.rankno}</td>
          <td
            onClick={() => handleStudentClick(student)}
            className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 cursor-pointer"
          >
            {student.name}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.unitno}</td>
   
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
            <button
              onClick={() => handleSelectStudent(student)}
              className={`px-4 py-2 text-white rounded-md ${selectedStudents[student.armyno] ? 'bg-blue-500' : 'bg-red-500'}`}
            >
              {selectedStudents[student.armyno] ? 'Unselect' : 'Select'}
            </button>
          </td>
        </tr>
      );
    })
  ))}
</tbody>



        </table>
        <div className="absolute  right-10 mt-10 flex justify-end">
    <button
    onClick={handleSubmit}
      className="w-auto text-left text-white bg-blue-500 hover:bg-blue-600 focus:outline-none font-medium rounded-lg text-lg px-5 py-1"
    >
      Submit
    </button>
  </div>
      </div>
    
      </div>
  






    </div>
  );
};

export default MainCourseSelection;
