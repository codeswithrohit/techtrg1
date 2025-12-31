import React, { useState, useEffect,useRef } from 'react';
import { useRouter } from "next/router";
const CompiledResult = ({userData}) => {
  const tableRef = useRef();
  const [students, setStudents] = useState([]);
  const [coursesList, setCoursesList] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedTitle, setSelectedTitle] = useState('All');
  const [selectedMaintitle, setSelectedMaintitle] = useState(''); 
  const [selectedYear, setSelectedYear] = useState('');
  const [titles, setTitles] = useState([]);
  const [maintitles, setMaintitles] = useState([]); 
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [ASIDE, setASIDE] = useState([]);
  const [XSIDE, setXSIDE] = useState([]);
  const [ASIDETOTAL, setASIDETOTAL] = useState([]);
  const [XSIDETOTAL, setXSIDETOTAL] = useState([]);
  const [uniqueYears, setUniqueYears] = useState([]);
  const [uniqueCoursesSet, setUniqueCoursesSet] = useState([]);
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
        // setMaintitles(maintitles);
      } else {
        console.error('Failed to fetch courses');
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };
console.log("courselist",coursesList)
  useEffect(() => {
    fetchStudents();
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
      const extractedMaintitles = [...new Set(filteredStudents.map(student => student.selectedMaintitle))].filter(Boolean);
  
      setTitles(extractedTitles);
      setMaintitles(extractedMaintitles);
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

// console.log("titles",titles)
//  console.log("filteredstudents",filteredStudents)

 const calculateTotalScores = (studentScores) => {
  if (!studentScores || typeof studentScores !== 'object') {
    console.error("Invalid studentScores:", studentScores);
    return { asideTotal: 0, xsideTotal: 0, asidePercentage: 0, xsidePercentage: 0, ASIDE, XSIDE };
  }

  const asideTotal = ASIDE.reduce((total, test) => {
    const score = studentScores?.[test?.test] || 0; 
    return total + score;
  }, 0);

  const xsideTotal = XSIDE.reduce((total, test) => {
    const score = studentScores?.[test?.test] || 0; 
    return total + score;
  }, 0);

  console.log("ASIDE", ASIDE);
  console.log("XSIDE", XSIDE);
  console.log("Student Scores:", studentScores);
  console.log("Aside Total student:", asideTotal);
  console.log("Xside Total student:", xsideTotal);
  console.log("Aside Total:", ASIDETOTAL);
  console.log("Xside Total:", XSIDETOTAL);

  const asidePercentage = asideTotal > 0 ? (asideTotal * 100) / ASIDETOTAL : 0;
  const xsidePercentage = xsideTotal > 0 ? (xsideTotal * 100) / XSIDETOTAL : 0;

  

console.log("asidepercentage",asidePercentage)
console.log("xsidepercentage",xsidePercentage)
  return { asideTotal, xsideTotal, asidePercentage, xsidePercentage, ASIDE, XSIDE,ASIDETOTAL,XSIDETOTAL };
};






  const handleStudentClick = (student) => {
    setSelectedStudent(student);
  };

  const closeModal = () => {
    setSelectedStudent(null);
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
  if (loading) {
    return <div className="flex justify-center items-center h-screen text-xl">Checking access...</div>;
  }

  return (
    <div className='bg-gray py-36 relative px-8'>
      <h1 className='text-2xl uppercase font-bold mb-4'>Students</h1>
<div className='min-h-screen' >
      <div className='mb-4 flex gap-4'>
      <label className='block text-sm font-bold text-gray-700'>
  Select Year:
  <select
    onChange={handleYearChange}
    className='mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
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
              className='mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
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
    className='mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
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
          <select
            value={selectedMaintitle}
            className='mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
          >
            <option value="">Select Main Course Serial No</option>
            {maintitles.map((maintitle, index) => (
  <option key={index} value={maintitle}>
    {maintitle}
  </option>
))}

          </select>
        </label>
      

       
      </div>
      <button onClick={printTable} className='mb-4 bg-blue-500 text-white px-4 py-2 rounded'>Print Now</button>
      <div ref={tableRef} className='overflow-x-auto'>
      <h1 className='text-xl text-center uppercase underline font-bold mb-4'>Compiled Result of {selectedYear} - {selectedCourse} - {selectedTitle} - {selectedMaintitle} </h1>
      <table  className='min-w-full divide-y divide-gray-200'>
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
      <th className='px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider'>Final Result</th>
    </tr>
  </thead>
  <tbody className='bg-white divide-y divide-gray-200'>
    {filteredStudents.map((course, courseIndex) => {
      // Flattening students and calculating total scores
      const sortedStudents = course.students
        .map((student, studentIndex) => {
          const { asideTotal, xsideTotal, asidePercentage, xsidePercentage } = calculateTotalScores(student.scores);
          const totalScore = asideTotal + xsideTotal;
          return { ...student, asideTotal, xsideTotal, asidePercentage, xsidePercentage, totalScore };
        })
        .sort((a, b) => b.totalScore - a.totalScore); // Sorting students by total score in descending order

      return sortedStudents.map((student, studentIndex) => {
        const { asideTotal, xsideTotal, asidePercentage, xsidePercentage, totalScore } = student;
        const averageScore = totalScore / 2;
        return (
          <tr key={`${course._id}-${studentIndex}`}>
            <td className='px-6 py-4 whitespace-nowrap font-bold text-sm text-gray-900'>{studentIndex + 1}</td>
            <td onClick={() => handleStudentClick(student)} className='px-6 font-bold py-4 whitespace-nowrap text-sm text-gray-900 cursor-pointer'>{student.armyno}</td>
            <td className='px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900'>{student.rankno}</td>
            <td onClick={() => handleStudentClick(student)} className='px-6 font-bold py-4 whitespace-nowrap text-sm text-gray-900 cursor-pointer'>{student.name}</td>
            <td className='px-6 py-4 whitespace-nowrap font-bold text-sm text-gray-900'>{student.unitno}</td>
            <td className='px-6 py-4 whitespace-nowrap font-bold text-sm text-gray-900'>{asideTotal}</td>
            <td className='px-6 py-4 whitespace-nowrap font-bold text-sm text-gray-900'>{asidePercentage.toFixed(2)}%</td>
            <td className='px-6 py-4 whitespace-nowrap font-bold text-sm text-gray-900'>{xsideTotal}</td>
            <td className='px-6 py-4 whitespace-nowrap font-bold text-sm text-gray-900'>{xsidePercentage.toFixed(2)}%</td>
            <td className='px-6 py-4 whitespace-nowrap font-bold text-sm text-gray-900'>{totalScore}</td>
          </tr>
        );
      });
    })}
  </tbody>
</table>

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

      {/* Scores Display */}
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






    </div>
  );
};

export default CompiledResult;
