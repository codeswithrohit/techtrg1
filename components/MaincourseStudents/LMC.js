import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { FaTrash } from 'react-icons/fa';
const LMC = ({filteredStudents,handleDeleteStudent,maincoursestudents,filteredInstructors}) => {
    const router = useRouter();
    const [showModal, setShowModal] = useState(false);
    const [modalStudents, setModalStudents] = useState([]);
    const [modalData, setModalData] = useState({ targetYear: '', mainCourse: '', year: '' });
    const [gradingRemarks, setGradingRemarks] = useState({});
    const [selectedArmyTitle, setSelectedArmyTitle] = useState('');
    const [showArmyPopup, setShowArmyPopup] = useState(false);
    const [totalArmyStrength, setTotalArmyStrength] = useState('');
    const [aI, setAI] = useState('');
    const [bi, setBi] = useState('');
    const [totalStrengthA, setTotalStrengthA] = useState('');
    const [popupRemarks, setPopupRemarks] = useState('');
    const [showscoreModal, setShowScoreModal] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null); 
    const [instructordata, setInstructordata] = useState('');
  const handleCourseClick = (maincourse,mainid) => {
    const filteredIstudentsmy = filteredStudents.filter(instructor => instructor.maincourse === maincourse);
    const filteredInstructorsByStudentDate = filteredInstructors.filter((instructor) => {
   console.log("🔍 Checking instructor", instructor);
 
   return filteredIstudentsmy.some((student) => {
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
 setInstructordata(filteredInstructorsByStudentDate)
    const studentsInCourse = maincoursestudents.find(student => student.maincourse === maincourse && student._id === mainid)?.students || [];
    setModalStudents(studentsInCourse);
    setModalData({
      targetYear: filteredStudents.find(student => student.maincourse === maincourse)?.targetYear,
      Course: filteredStudents.find(student => student.maincourse === maincourse)?.course,
      mainCourse: maincourse,
      year: filteredStudents.find(student => student.maincourse === maincourse)?.year,
    });
    setShowModal(true);
  };


  console.log("filteredstudents",filteredStudents)
  const handleGradingChange = (studentId, grading) => {
    setGradingRemarks(prev => ({ ...prev, [studentId]: { ...prev[studentId], grading } }));
  };

  const handleRemarksChange = (studentId, remarks) => {
    setGradingRemarks(prev => ({ ...prev, [studentId]: { ...prev[studentId], remarks } }));
  };

  const handleGradingSubmit = async () => {
    const updates = modalStudents.map((student) => ({
      _id:student._id,
      armyno: student.armyno,
      grading: gradingRemarks[student.armyno]?.grading || student.grading,
      remarks: gradingRemarks[student.armyno]?.remarks || student.remarks,
    }));
console.log("updates",updates)
    try {
      const res = await fetch('/api/editMainCourse', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          course: modalData.mainCourse,
          year: modalData.year,
          updates,
        }),
      });

      const result = await res.json();
      if (result.success) {
        alert('Student data updated successfully');
        router.reload();
        setShowModal(false);
      } else {
        alert('Failed to update student data');
      }
    } catch (error) {
      console.error('Error updating student data:', error);
      alert('Error updating student data');
    }
  }

  const handleArmyDetailClick = (selectedTitle) => {
    setSelectedArmyTitle(selectedTitle); // Set selected title
    setShowArmyPopup(true);
  };

const handleArmySubmit = async () => {
  console.log("Selected Army Title:", selectedArmyTitle);
  const student = filteredStudents.find(student => student.maincourse === selectedArmyTitle);
  
  const armyDetails = {
    id: student ? student._id : null, // Set to null if not found
    totalArmyStrength,
    aI,
    bi,
    totalStrengthA,
    popupRemarks,
  };

  console.log("Army Details:", armyDetails);

  // Proceed with the API call only if id is valid
  if (!armyDetails.id) {
    alert('Error: No valid ID found for the selected army title.');
    return;
  }

  try {
    const res = await fetch('/api/submitArmyDetailsAPI', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(armyDetails),
    });

    const result = await res.json();
    if (res.ok) {
      if (result.success) {
        window.alert('Army details successfully updated!');
        setShowArmyPopup(false);
        router.reload();
      } else {
        console.error('Update error:', result.message);
        window.alert('Failed to update army details: ' + result.message);
      }
    } else {
      console.error('Response error:', result.message);
      window.alert('Failed to update army details: ' + result.message);
    }
  } catch (error) {
    console.error('Error submitting army details:', error);
    window.alert('An error occurred. Please try again.');
  }
};


const [gradingSummary, setGradingSummary] = useState({
  AI: 0,
  A: 0,
  B: 0,
  C: 0,
  E: 0,
});

// Function to calculate the grading summary
const calculateGradingSummary = () => {
  const summary = {
    AI: 0,
    A: 0,
    B: 0,
    C: 0,
    E: 0,
  };

  modalStudents.forEach((student) => {
    const grade = student.grading || ''; // Use the grading from student data
    if (grade === 'AI') {
      summary.AI += 1;
    } else if (grade === 'A') {
      summary.A += 1;
  
    } else if (grade === 'B') {
      summary.B += 1;
    } else if (grade === 'C') {
      summary.C += 1;
    } else if (grade === 'E') {
      summary.E += 1;
    }
    
  });

  setGradingSummary(summary); // Update state with the new summary
};

// Use useEffect to calculate the grading summary whenever modalStudents changes
useEffect(() => {
  if (modalStudents && modalStudents.length > 0) {
    calculateGradingSummary();
  }
}, [modalStudents]);
const handleNameClick = (studentId) => {
  const student = modalStudents.find(s => s._id === studentId);
  setSelectedStudent(student);
  setShowScoreModal(true);
};
const handlePrint = () => {
  const printContent = document.getElementById("print-section").innerHTML;
  const originalContent = document.body.innerHTML;
  document.body.innerHTML = printContent;
  window.print();
  document.body.innerHTML = originalContent;
  window.location.reload();
}
  return (
    <div>
    <div className=' flex justify-end my-4' >
      <button onClick={handlePrint}
      className='px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition' >
        Print Table
      </button>
    </div>
    <div id='print-section'>
            <h1 className='font-bold text-white bg-red-800 p-4 font-mono underline text-center text-4xl' >SUMMARY OF {filteredStudents[0]?.year} YR RESULT OF {filteredStudents[0]?.course}   MAIN COURSE</h1>
      <div className="overflow-x-auto py-4">
      <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
      <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-1 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-300">S.NO.</th>
            <th className="px-4 py-1 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-300">COURSE SER NO.</th>
            <th className="px-4 py-1 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-300">39GTC PRE</th>
            <th colSpan="2" className="px-4 py-1 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-300">
              MAIN COURSE
            </th>
            <th colSpan="2" className="px-4 py-1 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-300">
              39 GTC <br /> AI
            </th>
            <th colSpan="2" className="px-4 py-1 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-300">
              39 GTC <br /> A
            </th>
            
            <th colSpan="2" className="px-4 py-1 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-300">
              39 GTC % 
            </th>
            <th className="px-4 py-1 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-300">
              39 GTC <br /> TOTAL
            </th>
            <th colSpan="3" className="px-4 py-1 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-300">
              ALL ARMY 
            </th>
            <th colSpan="2" className="px-4 py-1 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-300">
              ALL ARMY % 
            </th>
            <th className="px-4 py-1 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-300">
              ALL ARMY <br /> TOTAL
            </th>
            <th className="px-4 py-1 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-300">
              REMARKS
            </th>
            <th className="px-4 py-1 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-300">
              ACTIONS
            </th>
          </tr>
          <tr>
            <th className="px-4 py-1 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-300"></th>
            <th className="px-4 py-1 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-300"></th>
            <th className="px-4 py-1 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-300"></th>
            <th className="px-4 py-1 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-300">
              1ST
            </th>
            <th className="px-4 py-1 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-300">
              2ND
            </th>
            <th className="px-4 py-1 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-300">
              1ST
            </th>
            <th className="px-4 py-1 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-300">
              2ND
            </th>
          
            <th className="px-4 py-1 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-300">
              1ST
            </th>
            <th className="px-4 py-1 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-300">
              2ND
            </th>
            <th className="px-4 py-1 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-300">
              AI
            </th>
            <th className="px-4 py-1 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-300">
              A
            </th>
           
            <th className="px-4 py-1 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-300"></th>
            <th className="px-4 py-1 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-300"> TOTAL STR</th>
            <th className="px-4 py-1 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-300">
              AI
            </th>
            <th className="px-4 py-1 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-300">
              A
            </th>
           
            <th className="px-4 py-1 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-300">
              AI
            </th>
            <th className="px-4 py-1 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-300">
              A
            </th>
          
            <th className="px-4 py-1 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-300">
             
            </th>
            <th className="px-4 py-1 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-300">
             
            </th>
            <th className="px-4 py-1 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-300">
             
             </th>
             
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-800">
        {filteredStudents
    .slice() // Create a shallow copy to avoid mutating the original array
    .sort((a, b) => {
      const numA = parseInt(a.maincourse.replace(/\D/g, ""), 10) || 0;
      const numB = parseInt(b.maincourse.replace(/\D/g, ""), 10) || 0;
      return numA - numB;
    }).map((student, index) => {
    const pre1st = student.students.filter(s => s.phase === 'pre1st' ).length;
    const pre2nd = student.students.filter(s => s.phase === 'pre2nd').length;
    const pre1stAI = student.students.filter(s => s.phase === 'pre1st' && s.grading === 'AI').length;
    const pre2ndAI = student.students.filter(s => s.phase === 'pre2nd' && s.grading === 'AI').length;
    const pre1stA = student.students.filter(s => s.phase === 'pre1st' && s.grading === 'A').length;
    const pre2ndA = student.students.filter(s => s.phase === 'pre2nd' && s.grading === 'A').length;

    const totalAI = pre1stAI + pre2ndAI;
    const totalA = pre1stA + pre2ndA;
    const allStudentLength = student.allstudentlength;
    const totalstudents = pre1st+pre2nd

    const percentageAI = allStudentLength > 0 ? (totalAI / (totalstudents)) * 100 : 0;
    const percentageA = allStudentLength > 0 ? (totalA / (totalstudents)) * 100 : 0;

    const combinedTotal = totalAI + totalA ;
            const combinedPercentage = totalstudents > 0 ? ((totalAI + totalA  ) / totalstudents) * 100 : 0;



    return (
      <tr className='cursor-pointer'  key={student._id}>
        <td onClick={() => handleCourseClick(student.maincourse,student._id)} className="px-4 py-1 text-center text-sm text-gray-500 border-r border-gray-300">{index + 1}</td>
        <td onClick={() => handleCourseClick(student.maincourse,student._id)} className="px-4 py-1 text-center text-sm text-gray-500 border-r border-gray-300">{student.maincourse}</td>
        <td onClick={() => handleCourseClick(student.maincourse,student._id)} className="px-4 py-1 text-center text-sm text-gray-500 border-r border-gray-300">{allStudentLength}</td>
        <td className="px-4 py-1 text-center text-sm text-gray-500 border-r border-gray-300">{student.students.filter(s => s.phase === 'pre1st').length}</td>
        <td className="px-4 py-1 text-center text-sm text-gray-500 border-r border-gray-300">{student.students.filter(s => s.phase === 'pre2nd').length}</td>
        <td className="px-4 py-1 text-center text-sm text-gray-500 border-r border-gray-300">{pre1stAI}</td>
        <td className="px-4 py-1 text-center text-sm text-gray-500 border-r border-gray-300">{pre2ndAI}</td>
        <td className="px-4 py-1 text-center text-sm text-gray-500 border-r border-gray-300">{pre1stA}</td>
        <td className="px-4 py-1 text-center text-sm text-gray-500 border-r border-gray-300">{pre2ndA}</td>
        <td className="px-4 py-1 text-center text-sm text-gray-500 border-r border-gray-300">{percentageAI.toFixed(2)}%</td>
        <td className="px-4 py-1 text-center text-sm text-gray-500 border-r border-gray-300">{percentageA.toFixed(2)}%</td>
        <td className="px-4 py-1 text-center text-sm text-gray-500 border-r border-gray-300">{combinedPercentage.toFixed(2)}%</td>
        <td className="px-4 py-1 text-center text-sm text-gray-500 border-r border-gray-300">
  {student.totalArmyStrength ? student.totalArmyStrength : '-'}
</td>
<td className="px-4 py-1 text-center text-sm text-gray-500 border-r border-gray-300">
  {student.aI ? student.aI : '-'}
</td>
<td className="px-4 py-1 text-center text-sm text-gray-500 border-r border-gray-300">

  {student.totalStrengthA ? student.totalStrengthA : '-'}
</td>


        <td className="px-4 py-1 text-center text-sm text-gray-500 border-r border-gray-300">      {student.totalArmyStrength > 0 ? ((student.aI) / student.totalArmyStrength * 100).toFixed(2) + '%' : '0%'}</td>
        <td className="px-4 py-1 text-center text-sm text-gray-500 border-r border-gray-300">      {student.totalArmyStrength > 0 ? ((student.totalStrengthA) / student.totalArmyStrength * 100).toFixed(2) + '%' : '0%'}</td>
        <td className="px-4 py-1 text-center text-sm text-gray-500 border-r border-gray-300"> {student.totalArmyStrength > 0 ? ((student.aI + student.totalStrengthA) / student.totalArmyStrength * 100).toFixed(2) + '%' : '0%'}</td>
        <td className="px-4 py-1 text-center text-sm text-gray-500 border-r border-gray-300">{student.popupRemarks}</td>
        <td className="px-4 py-1 text-center text-sm text-gray-500 border-r border-gray-300">
      <button
        className="text-red-500 hover:text-red-700"
        onClick={() => handleDeleteStudent(student._id)} // Call handleDeleteStudent when clicked
      >
        <FaTrash />
      </button>
    </td>
        {/* Render other data as needed */}
      </tr>
    );
  })}
</tbody>

      </table>
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-30">
  <div className="bg-white p-6 rounded-lg shadow-lg w-full h-full overflow-y-auto">

            <h2 className="font-bold text-white bg-red-800 p-4 font-mono underline text-center text-4xl mb-2">RESULT SHEET OF {modalData.Course} COURSE {modalData.mainCourse}  AT INF SCHOOL,MHOW WEF {modalData.targetYear} </h2>
            <div className="flex flex-col">
            <button     onClick={() => handleArmyDetailClick(modalData.mainCourse)}
      className="bg-blue-500 text-white mb-2 px-2 py-1 rounded"
    >
      Submit All Army Detail
    </button>
  <table className="w-full border border-gray-300">
    <thead className="bg-gray-100">
      <tr>
        <th className="px-4 py-2 text-center border-r border-gray-800">S/NO.</th>
        <th className="px-4 py-2 text-center border-r border-gray-800">ARMY NO.</th>
        <th className="px-4 py-2 text-center border-r border-gray-800">RANK</th>
        <th className="px-4 py-2 text-center border-r border-gray-800">NAME</th>
        <th className="px-4 py-2 text-center border-r border-gray-800">UNIT</th>
        <th className="px-4 py-2 text-center border-r border-gray-800">GRADING</th>
        <th className="px-4 py-2 text-center border-r border-gray-800">REMARKS</th>
      </tr>
    </thead>
    <tbody className='divide-y divide-gray-800'>
      {modalStudents.map((student, index) => (
        <tr key={student._id}>
          <td className="px-4 py-2 text-center border-r border-gray-800">{index + 1}</td>
          <td className="px-4 py-2 text-center border-r border-gray-800">{student.armyno}</td>
          <td className="px-4 py-2 text-center border-r border-gray-800">{student.rankno}</td>
          <td onClick={() => handleNameClick(student._id)} className="px-4 cursor-pointer py-2 text-center border-r border-gray-800">{student.name}</td>
          <td className="px-4 py-2 text-center border-r border-gray-800">{student.unitno}</td>
          <td className="px-4 py-2 text-center border-r border-gray-800">
          
                        <select
  value={gradingRemarks[student.armyno]?.grading || student.grading || ''}
  onChange={(e) => handleGradingChange(student.armyno, e.target.value)}
>
<option value="">Select Grade</option>
                          <option value="AI">AI</option>
                          <option value="A">A</option>
                          <option value="B">B</option>
                          <option value="C">C</option>
                          <option value="E">E</option>
</select>

          </td>
          <td className="px-4 py-2 text-center border-r border-gray-800">
          <input
                      type="text"
                      value={gradingRemarks[student.armyno]?.remarks || student.remarks || ''}
                      onChange={(e) => handleRemarksChange(student.armyno, e.target.value)}
                        className="border-2 border-blue-500 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
          </td>
        </tr>
      ))}
    </tbody>
  </table>
  {selectedStudent && showscoreModal && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg">
                        <h2 className="text-xl font-bold">Scores for {selectedStudent.name}</h2>
                        <div className="mt-4">
                            {Object.entries(selectedStudent.scores).map(([scoreType, score], index) => (
                                <p key={index} className="text-lg">
                                    {scoreType}: {score}
                                </p>
                            ))}
                        </div>
                        <button onClick={() => setShowScoreModal(false)} className="mt-4 bg-blue-500 text-white py-2 px-4 rounded">
                            Close
                        </button>
                    </div>
                </div>
            )}
  <div className="mt-4 p-4 bg-gray-200 rounded-lg">
        <h3 className="font-bold text-lg text-center mb-4">Grading Summary</h3>
        <table className="w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-center border-r border-gray-800">Grading</th>
              <th className="px-4 py-2 text-center border-r border-gray-800">Total Count</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            <tr>
              <td className="px-4 py-2 text-center border-r border-gray-800">AI</td>
              <td className="px-4 py-2 text-center">{gradingSummary.AI}</td>
            </tr>
            <tr>
              <td className="px-4 py-2 text-center border-r border-gray-800">A</td>
              <td className="px-4 py-2 text-center">{gradingSummary.A}</td>
            </tr>
          
            <tr>
              <td className="px-4 py-2 text-center border-r border-gray-800">B</td>
              <td className="px-4 py-2 text-center">{gradingSummary.B}</td>
            </tr>
            <tr>
              <td className="px-4 py-2 text-center border-r border-gray-800">C</td>
              <td className="px-4 py-2 text-center">{gradingSummary.C}</td>
            </tr>
            <tr>
              <td className="px-4 py-2 text-center border-r border-gray-800">E</td>
              <td className="px-4 py-2 text-center">{gradingSummary.E}</td>
            </tr>
          </tbody>
        </table>
      </div>
  <div className="flex justify-end mt-4">
    <button  onClick={handleGradingSubmit} className="bg-blue-500 text-white px-4 py-2 rounded">Submit</button>
  </div>
</div>
<h1 className='text-xl font-bold mb-4'>Instructor Details</h1>
{instructordata && (
  <div className="mt-6 p-4 bg-gray-100 rounded-lg shadow-md">
   
    <table className="min-w-full border-collapse border border-gray-300 text-gray-800">
      <thead>
        <tr className="bg-gray-200">
          {/* <th className="border border-gray-300 px-4 py-2 text-left">Select</th> */}
          <th className="border border-gray-300 px-4 py-2 text-left">Name</th>
          <th className="border border-gray-300 px-4 py-2 text-left">Availability</th>
        </tr>
      </thead>
      <tbody>
      {instructordata.map((instructor) => (
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
            
            <button className="mt-4 bg-red-500 text-white px-4 py-2 rounded" onClick={() => setShowModal(false)}>
              Close
            </button>
          </div>
        </div>
      )}


{showArmyPopup && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-40">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full h-full">
            <h2 className="text-xl font-bold mb-4">Army Details</h2>
            <label className="block mb-2">
              Total Army Strength
              <input
                type="text"
                value={totalArmyStrength}
                onChange={(e) => setTotalArmyStrength(e.target.value)}
                className="mt-1 block w-full border border-gray-300 p-2 rounded"
              />
            </label>
            <label className="block mb-2">
            Total Strength of  AI
              <input
                type="text"
                value={aI}
                onChange={(e) => setAI(e.target.value)}
                className="mt-1 block w-full border border-gray-300 p-2 rounded"
              />
            </label>
            <label className="block mb-2">
              Total Strength of A
              <input
                type="text"
                value={totalStrengthA}
                onChange={(e) => setTotalStrengthA(e.target.value)}
                className="mt-1 block w-full border border-gray-300 p-2 rounded"
              />
            </label>
            {/* <label className="block mb-2">
            Total Strength of BI
              <input
                type="text"
                value={bi}
                onChange={(e) => setBi(e.target.value)}
                className="mt-1 block w-full border border-gray-300 p-2 rounded"
              />
            </label> */}
       
            <label className="block mb-4">
              Remarks
              <textarea
                value={popupRemarks}
                onChange={(e) => setPopupRemarks(e.target.value)}
                className="mt-1 block w-full border border-gray-300 p-2 rounded"
              />
            </label>
            <button
              onClick={handleArmySubmit}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Submit
            </button>
            <button
              onClick={() => setShowArmyPopup(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded ml-2"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
    </div>
  )
}

export default LMC