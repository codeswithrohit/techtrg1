import React, { useState, useEffect,useRef } from 'react';
import { useRouter } from 'next/router';
const MainCourseSelection = ({userData}) => {
  
  const tableRef = useRef();
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userData) return; // Wait until userData is available

    if (userData?.selectedCourse !== "MASTER ADMIN") {
      router.push("/");
    } else {
      setLoading(false); // Stay on the page if the user is MASTER ADMIN
    }
  }, [userData, router]);


  const printTable = () => {
    const printContent = tableRef.current.cloneNode(true);
    const printWindow = window.open('', '', 'height=600,width=800');
    printWindow.document.write('<html><head><title>Print Table</title>');
    printWindow.document.write('<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.16/dist/tailwind.min.css">');
    printWindow.document.write('</head><body>');
    printWindow.document.body.appendChild(printContent);
    printWindow.document.write('</body></html>');
    printWindow.document.close();

    // Wait before printing to allow styles to load
    setTimeout(() => {
        printWindow.print();
    }, 500);
};

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
    const matchesTitle = selectedTitle ? course.precourse === selectedTitle : true;
    const matchesMaintitle = selectedMaintitle ? course.maincourse === selectedMaintitle : true;
    const matchesYear = selectedYear ? course.year === selectedYear : true;
    
    return matchesCourse && matchesTitle && matchesMaintitle && matchesYear;
  });
  

  console.log("maincoursestudnets",maincoursestudents)
  
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





  const handleCheckboxChange = (student) => {
    setSelectedStudents(prevState => {
      const updatedSelectedStudents = {
        ...prevState,
        [student.armyno]: !prevState[student.armyno] ? student : null,
      };

      // Update vacUtilised based on the number of selected students
      setVacUtilised(Object.values(updatedSelectedStudents).filter(s => s !== null).length);

      return updatedSelectedStudents;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
      // Check if the selected main title is already submitted
      const isAlreadySubmitted = maincoursestudents.some(student => 
        student.maincourse === selectedMaintitle &&
        student.precourse === selectedTitle &&
        student.year === selectedYear
      );

  if (isAlreadySubmitted) {
    alert('This data is already submitted and will not be submitted again.');
    return;
  }

  
    const studentData = Object.values(selectedStudents).filter(student => typeof student === 'object' && student !== null);
    console.log("studentdata",studentData)
    const data = {
      vacAllotted,
      vacUtilised,
      year: filteredStudents.length > 0 ? filteredStudents[0].year : '',
      course: filteredStudents.length > 0 ? filteredStudents[0].selectedCourse : '',
      maincourse:filteredStudents.length > 0 ? filteredStudents[0].selectedMaintitle : '',
      precourse:filteredStudents.length > 0 ? filteredStudents[0].selectedTitle : '',
      targetYearPreCourse: filteredStudents.length > 0 ? filteredStudents[0].targetYearPreCourse : '',
      targetYearMainCourse: filteredStudents.length > 0 ? filteredStudents[0].targetYearMainCourse : '',
      students: studentData,
      instructors: filteredStudents.length > 0 ? filteredStudents[0].instructors : [],
      allstudentlength: filteredStudents.length > 0 ? filteredStudents[0].students.length : 0
    };
    
    

    try {
      const response = await fetch('/api/submitmaincourse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      
      if (result.success) {
        alert('Data submitted successfully:');
        router.push('/maincoursestudent');
        // Optionally, you can reset your form or show a success message
      } else {
        alert('Error submitting data:', result.message);
      }
    } catch (error) {
      console.error('Error submitting data:', error);
    }
};



const renderScores = (student) => {
  const { scores } = student;

  // Calculate total scores and percentages
  const { asideTotal, xsideTotal, asidePercentage, xsidePercentage } = calculateTotalScores(scores);

  const asideScores = ASIDE.map(test => (
    <div key={test.test} className='flex justify-between'>
      <span>{test.test}</span>
      <span>{scores[test.test] || 'N/A'}</span>
    </div>
  ));

  const xsideScores = XSIDE.map(test => (
    <div key={test.test} className='flex justify-between'>
      <span>{test.test}</span>
      <span>{scores[test.test] || 'N/A'}</span>
    </div>
  ));

  return (
    <div className="flex gap-8">
      <div className="w-1/2 p-4 border-r border-gray-300">
        <h3 className="font-semibold">ASIDE</h3>
        {asideScores}
        <div className="flex justify-between mt-4">
          <span>Total:</span>
          <span>{asideTotal}/{ASIDETOTAL} </span>
        </div>
        <div className="flex justify-between">
          <span>Percentage:</span>
          <span>{asidePercentage.toFixed(2)}%</span>
        </div>
      </div>
      <div className="w-1/2 p-4">
        <h3 className="font-semibold">XSIDE</h3>
        {xsideScores}
        <div className="flex justify-between mt-4">
          <span>Total:</span>
          <span>{xsideTotal}/{XSIDETOTAL} </span>
        </div>
        <div className="flex justify-between">
          <span>Percentage:</span>
          <span>{xsidePercentage.toFixed(2)}%</span>
        </div>
      </div>
    </div>
  );
};



const mycourseData = filteredStudentsmain.find(course => course.course === selectedCourse);
// console.log("filteredStudentsmain",filteredStudentsmain)
// console.log("mycoursedata",mycourseData)
// Check if course data exists for the selected course
const myvacAllotted = mycourseData ? mycourseData.vacAllotted : 0;
const myvacUtilised = mycourseData ? mycourseData.vacUtilised : 0;
if (loading) {
  return <div className="flex justify-center items-center h-screen text-xl">Checking access...</div>;
}
  return (
    <div className='bg-gray py-36 relative px-8'>
      <h1 className='text-2xl font-bold uppercase mb-4 mt-8'>Students</h1>
<div className='min-h-screen' >
      <div className='mb-4 flex gap-4'>
        <label className='block text-sm font-bold text-gray-700'>
          Select Year:
          <select
       onChange={handleYearChange}
              className='mt-1 h-9 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
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
        <label className='block text-sm font-bold text-gray-700'>
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
        <label className='block text-sm font-bold text-gray-700'>
  Select Pre Course Serial No
  <select
    value={selectedTitle}
    disabled={!titles.length}
    onChange={handleTitleChange}
    className='mt-1 block w-full h-10 py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
  >
    <option value="">Select Pre Course Serial No</option>
    {titles
      .sort((a, b) => {
        const numA = parseInt(a.match(/\d+$/)?.[0] || "0", 10);
        const numB = parseInt(b.match(/\d+$/)?.[0] || "0", 10);
        return numA - numB;
      })
      .map((title, index) => (
        <option key={index} value={title}>
          {title}
        </option>
      ))}
  </select>
</label>

        <label className='block text-sm font-bold text-gray-700'>
  Select Main Course Serial No
  <div className='mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm bg-gray-100 sm:text-sm'>
    {selectedMaintitle || 'Select Main Course Serial No'}
  </div>
</label>

      

       
      </div>
      <div className='overflow-x-auto'>
     
            <button onClick={printTable} className='mb-4 bg-blue-500 text-white px-4 py-2 rounded'>Print Now</button>
            <div ref={tableRef} className='overflow-x-auto'>
            <h1 className='text-xl text-center uppercase underline font-bold mb-4 uppercase'>Selection of of {selectedYear} - {selectedCourse} - {selectedTitle} - {selectedMaintitle} </h1>
            <div className='flex gap-4 mb-2 ' >
      <div className="mt-4">
  <label className="block text-sm font-bold text-gray-700">Vac Allotted:</label>
  <input
    type="number"
    value={myvacAllotted ? myvacAllotted : vacAllotted}
    onChange={(e) => setVacAllotted(e.target.value)}
    className="mt-1 block w-full text-black border p-2 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
  />
</div>
<div className="mt-4">
  <label className="block text-sm font-bold text-gray-700">Vac Utilised:</label>
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
      <th className='px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider'>S.no</th>
      <th className='px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider'>ARMY No</th>
      <th className='px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider'>Rank</th>
      <th className='px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider'>Name</th>
      <th className='px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider'>Unit</th>
      <th className='px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider'>ASIDE Total</th>
      <th className='px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider'>ASIDE %</th>
      <th className='px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider'>XSIDE Total</th>
      <th className='px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider'>XSIDE %</th>
      <th className='px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider'>Total Score</th>
      <th className='px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider'>Select</th>
    </tr>
  </thead>
  <tbody className='bg-white divide-y divide-gray-200'>
    {filteredStudents.map((course) => {
      const sortedStudents = course.students
        .map((student) => {
          const { asideTotal, xsideTotal, asidePercentage, xsidePercentage } = calculateTotalScores(student.scores || {});
          const totalScore = asideTotal + xsideTotal;
          return { ...student, asideTotal, xsideTotal, asidePercentage, xsidePercentage, totalScore };
        })
        .sort((a, b) => b.totalScore - a.totalScore);

      return sortedStudents.map((student, index) => {
        const isStudentChecked = maincoursestudents.some(mStudent => 
          mStudent.students.some(s => s.armyno === student.armyno && s._id === student._id)
        );
        
        return (
          <tr key={`${course._id}-${index}`}>
            <td className='px-6 py-4 whitespace-nowrap font-bold text-sm text-gray-900'>{index + 1}</td>
            <td onClick={() => handleStudentClick(student)} className='px-6 py-4 font-bold text-sm text-gray-900 cursor-pointer'>{student.armyno}</td>
            <td className='px-6 py-4 whitespace-nowrap font-bold text-sm text-gray-900'>{student.rankno}</td>
            <td onClick={() => handleStudentClick(student)} className='px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 cursor-pointer'>{student.name}</td>
            <td className='px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900'>{student.unitno}</td>
            <td className='px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900'>{student.asideTotal}</td>
            <td className='px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900'>{student.asidePercentage.toFixed(2)}%</td>
            <td className='px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900'>{student.xsideTotal}</td>
            <td className='px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900'>{student.xsidePercentage.toFixed(2)}%</td>
            <td className='px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900'>{student.totalScore}</td>
            <td className='px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900'>
              <input
                type='checkbox'
                checked={isStudentChecked || !!selectedStudents[student.armyno]}
                onChange={() => handleCheckboxChange(student)}
              />
            </td>
          </tr>
        );
      });
    })}
  </tbody>
</table>

</div>
        <div className="absolute  right-10 mt-10 flex justify-end">
    <button
    onClick={handleSubmit}
      className="w-auto text-left text-white bg-blue-500 hover:bg-blue-600 focus:outline-none font-bold rounded-lg text-lg px-5 py-1"
    >
      Submit
    </button>
  </div>
      </div>
    
      </div>
      {selectedStudent && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-h-full overflow-y-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">OVERALL ASSESSMENT</h2>

      {/* Student Information */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold">
          ARMY No: <span className="font-normal">{selectedStudent.armyno}</span>
        </h3>
        <h3 className="text-lg font-semibold">
          Name: <span className="font-normal">{selectedStudent.name}</span>
        </h3>
      </div>

      
      {selectedStudent && (
  <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white rounded-lg shadow-lg p-8 w-full max-h-full overflow-y-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">OVERALL ASSESSMENT</h2>

      {/* Student Information */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold">
          ARMY No: <span className="font-normal">{selectedStudent.armyno}</span>
        </h3>
        <h3 className="text-lg font-semibold">
          Name: <span className="font-normal">{selectedStudent.name}</span>
        </h3>
        {/* <h3 className="text-lg font-semibold">
          Phase: <span className="font-normal">{selectedStudent.phase}</span>
        </h3> */}
        <h3 className="text-lg font-semibold">
          Rank: <span className="font-normal">{selectedStudent.rankno}</span>
        </h3>
        <h3 className="text-lg font-semibold">
          Unit: <span className="font-normal">{selectedStudent.unitno}</span>
        </h3>
      </div>

      {renderScores(selectedStudent)}
      <div className="flex justify-end mt-4">
        <button
          className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded shadow"
          onClick={closeModal}
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}



      <div className="flex justify-end mt-4">
        <button
          className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded shadow"
          onClick={closeModal}
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

export default MainCourseSelection;
