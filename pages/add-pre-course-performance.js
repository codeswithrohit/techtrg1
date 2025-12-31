import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import { useRouter } from 'next/router';
const AddPreCOursePerformance = ({userData}) => {
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
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedTitle, setSelectedTitle] = useState('All');
  const [selectedMaintitle, setSelectedMaintitle] = useState(''); 
  const [selectedCourseData, setSelectedCourseData] = useState(''); 
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedSide, setSelectedSide] = useState('');
  const [selectedTest, setSelectedTests] = useState('');
  const [titles, setTitles] = useState([]);
  const [years, setYears] = useState([]);
  const [maintitles, setMaintitles] = useState([]); 
  const [testOptions, setTestOptions] = useState([]);
  const [testScores, setTestScores] = useState({});
  const [maxMarks, setMaxMarks] = useState('');
  const [uniqueYears, setUniqueYears] = useState([]);
  const [uniqueCoursesSet, setUniqueCoursesSet] = useState([]);
  const [errorMessages, setErrorMessages] = useState({});
  const [courses, setCourses] = useState([]);
  const [selectedData, setSelectedData] = useState([]);
  const fetchStudents = async () => {
    try {
      const res = await fetch('/api/fetchstudents');
      const result = await res.json();
      if (result.success) {
        setStudents(result.data);
        const uniqueYears = [...new Set(result.data.map(student => student.year))];
        setYears(uniqueYears);
      } else {
        console.error('Failed to fetch students');
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };
console.log("studnets",students)
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

  useEffect(() => {
    fetchStudents();
    fetchCourses();
  }, []);

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

  const handleMaintitleChange = (e) => {
    setSelectedMaintitle(e.target.value);
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
  // console.log("testoptions",testOptions)

  const filteredStudents = students.filter(student => {
    const matchesCourse = selectedCourse ? student.selectedCourse === selectedCourse : true;
    const matchesTitle = selectedTitle ? student.selectedTitle === selectedTitle : true;
    const matchesMaintitle = selectedMaintitle ? student.selectedMaintitle === selectedMaintitle : true;
    const matchesYear = selectedYear ? student.year === selectedYear : true;
    return matchesCourse && matchesTitle && matchesMaintitle && matchesYear;
  });

  const handleSideChange = (e) => {
    const selectedSide = e.target.value;
    setSelectedSide(selectedSide);
    
    const selectedCourseData = coursesList.find(course => course.courseName === selectedCourse);
    setSelectedCourseData(selectedCourseData)
    // console.log("courselist",coursesList)
    // console.log("selectedCourseData:", selectedCourseData);
    // console.log("selectedSide:", selectedSide);
    
    if (selectedCourseData && selectedSide) {
      // Check which side is selected and set test options accordingly
      if (selectedSide === "A SIDE") {
        const filteredTests = selectedCourseData.aside || [];
        setTestOptions(filteredTests.map(test => test.test));
      } else if (selectedSide === "X SIDE") {
        const filteredTests = selectedCourseData.xside || [];
        setTestOptions(filteredTests.map(test => test.test));
      } else {
        setTestOptions([]);
      }
    } else {
      setTestOptions([]);
    }
  };
  
 

  const handleTestChange = (e) => {
    const selectedTestValue = e.target.value;
    setSelectedTests(selectedTestValue);

    if (!selectedCourseData) {
        console.error("selectedCourseData is not set");
        return;
    }

    let testInfo;
    if (selectedSide === "A SIDE") {
        testInfo = selectedCourseData.aside?.find(test => test.test === selectedTestValue);
    } else if (selectedSide === "X SIDE") {
        testInfo = selectedCourseData.xside?.find(test => test.test === selectedTestValue);
    }

    if (testInfo) {
        setMaxMarks(testInfo.mark || '');
        console.log("Max Marks Updated:", testInfo.mark);
    } else {
        setMaxMarks('');
    }
};

  

const handleScoreChange = (studentId, score) => {
  console.log(`handleScoreChange called for studentId: ${studentId}, score: ${score}`);

  // If the field is cleared, remove the value from state
  if (score === "") {
    setTestScores((prev) => ({
      ...prev,
      [studentId]: "",
    }));
    setErrorMessages((prev) => ({
      ...prev,
      [studentId]: "", // Clear error
    }));
    return;
  }

  // Ensure only numeric input
  if (!/^\d+$/.test(score)) {
    console.error(`Invalid input: ${score}. Only numeric values are allowed.`);
    setErrorMessages((prev) => ({
      ...prev,
      [studentId]: "Score must be a number",
    }));
    return;
  }

  const numericScore = parseInt(score, 10);

  // Check if the score exceeds maxMarks
  if (numericScore > maxMarks) {
    console.error(`Score exceeds maxMarks. numericScore: ${numericScore}, maxMarks: ${maxMarks}`);
    setErrorMessages((prev) => ({
      ...prev,
      [studentId]: `Score cannot exceed ${maxMarks}`,
    }));
  } else {
    console.log(`Score is valid. Clearing error for studentId: ${studentId}`);
    setErrorMessages((prev) => ({
      ...prev,
      [studentId]: "", // Clear error
    }));
  }

  // Update testScores state
  setTestScores((prev) => ({
    ...prev,
    [studentId]: score,
  }));
};

  

  const handleSubmit = async () => {
    const hasErrors = Object.values(errorMessages).some((msg) => msg);
  
    if (hasErrors) {
      alert("Please resolve all errors before submitting.");
      return;
    }
  
    const updateData = {
      selectedTest,
      scores: testScores,
    };
  
    try {
      const res = await fetch("/api/updateperformance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });
      const result = await res.json();
      if (result.success) {
        setTestScores({});
        alert("Scores updated successfully");
        window.location.reload();
      } else {
        alert("Failed to update scores");
      }
    } catch (error) {
      console.error("Error updating performance:", error);
    }
  };
  

  
  const filteredCourses = coursesList.filter(course => 
    selectedYear ? course.year === selectedYear : true
  );


  if (loading) {
    return <div className="flex justify-center items-center h-screen text-xl">Checking access...</div>;
  }

  return (
    <div className='bg-gray py-36 relative px-8'>
      <h1 className='text-2xl font-bold mb-4'>Students</h1>
<div className='min-h-screen' >
      <div className='mb-4 flex gap-4'>
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
        <label className="block font-bold text-gray-700 mb-1">Select Main-Course:</label>
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
      
      {selectedCourse && (
        <label className='block text-sm font-bold text-gray-700'>
          Select Side:
          <select
            value={selectedSide}
            onChange={handleSideChange}
            className='mt-1 block w-full h-12 py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
          >
            <option value="">Select Side</option>
            <option value="A SIDE">A SIDE</option>
            <option value="X SIDE">X SIDE</option>
          </select>
        </label>
      )}
      {selectedCourse && (
        <label className='block text-sm font-bold text-gray-700'>
          Select Tests:
          <select
            value={selectedTest}
            onChange={handleTestChange}
            className='mt-1 block h-12 w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
          >
            <option value="">Select Test</option>
            {testOptions.map((test, index) => (
              <option key={index} value={test}>
                {test}
              </option>
            ))}
          </select>
        </label>
      )}
      </div>
      <div className='overflow-x-auto'>
        <table className='min-w-full divide-y divide-gray-200'>
          <thead className='bg-gray-50'>
            <tr>
              <th className='px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider'>S.no</th>
              <th className='px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider'>ARMY No</th>
              <th className='px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider'>Rank</th>
              <th className='px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider'>Name</th>
              <th className='px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider'>Unit</th>
              {selectedTest && <th className='px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider'>{selectedTest} Score</th>}
            </tr>
          </thead>
          <tbody className='bg-white divide-y divide-gray-200'>
            {selectedData.map((course, courseIndex) => (
              course.students.map((student, studentIndex) => (
                <tr key={`${course._id}-${studentIndex}`}>
                  <td className='px-6 py-4 whitespace-nowrap font-bold text-sm text-gray-900'>{studentIndex + 1}</td>
                  <td className='px-6 py-4 whitespace-nowrap font-bold text-sm text-gray-900'>{student.armyno}</td>
                  <td className='px-6 py-4 whitespace-nowrap font-bold text-sm text-gray-900'>{student.rankno}</td>
                  <td className='px-6 py-4 whitespace-nowrap font-bold text-sm text-gray-900'>{student.name}</td>
                  <td className='px-6 py-4 whitespace-nowrap font-bold text-sm text-gray-900'>{student.unitno}</td>
              
                  {selectedTest && (
  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
    <input
      type="text"
      placeholder={`Enter Score out of ${maxMarks}`}
      value={testScores[student._id] ?? student.scores?.[selectedTest] ?? ''}
      onChange={(e) => handleScoreChange(student._id, e.target.value)}
      className={`border ${
        errorMessages[student._id] ? "border-red-500" : "border-gray-300"
      } rounded px-2 py-1`}
    />
    {errorMessages[student._id] && (
      <p className="text-red-500 text-xs mt-1">{errorMessages[student._id]}</p>
    )}
  </td>
)}


                </tr>
              ))
            ))}
          </tbody>
        </table>
      </div>
      <div className="relative mt-4 w-full  ">
  <div className="absolute  right-0 flex justify-end">
    <button
       onClick={handleSubmit}
      className="w-auto text-left text-white bg-blue-500 hover:bg-blue-600 focus:outline-none font-medium rounded-lg text-lg px-5 py-3"
    >
      Submit
    </button>
  </div>
</div>
      </div>
    


    </div>
  );
};

export default AddPreCOursePerformance;
