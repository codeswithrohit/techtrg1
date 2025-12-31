import React, { useState,useEffect } from 'react';

const LMC = ({ students,selectedCourses,selectedMaintitles,selectedYears }) => {
    const [filteredStudentsdata, setFilteredStudentsdata] = useState([]);
    useEffect(() => {
        const secCdrStudents = students.filter(student => student.course === "LMC");
        setFilteredStudentsdata(secCdrStudents); // Update the filteredStudents state
    }, [students]);
    const [showModal, setShowModal] = useState(false);
    const [selectedUnit, setSelectedUnit] = useState(null);
    const [filteredStudents, setFilteredStudents] = useState([]);



    // Filtered data based on selections
    const filteredData = filteredStudentsdata.filter(student => {
        const matchesCourse = selectedCourses.length > 0 ? selectedCourses.includes(student.course) : true;
        const matchesMaintitle = selectedMaintitles.length > 0 ? selectedMaintitles.includes(student.maincourse) : true;
        const matchesYear = selectedYears.length > 0 ? selectedYears.includes(student.year) : true;
        return matchesCourse && matchesMaintitle && matchesYear;
    });

    // Get unique years and unit numbers
    const uniqueYears = [...new Set(filteredData.map(student => student.year))];
    const uniqueUnitnos = [
        ...new Set(
            filteredData.flatMap(courseData =>
                courseData.students.map(student => student.unitno)
            )
        )
    ];

    // Group data by unit number
    const groupedData = uniqueUnitnos.map(unitno => {
        const unitData = {
            unitno,
            performance: {},
            totals: { AI: 0,A: 0, B: 0,C: 0,E: 0 },
            goodGrading: { STR: 0, UNIT: 0 },
            poorGrading: { STR: 0, UNIT: 0 }
        };

        let cumulativeTotalGrading = 0;
        let cumulativeGoodGradingCount = 0;
        let cumulativePoorGradingCount = 0;

        uniqueYears.forEach(year => {
            const yearData = filteredData.filter(
                data =>
                    data.year === year &&
                    data.students.some(student => student.unitno === unitno)
            );

            const yearPerformance = {
                STR: yearData.reduce(
                    (acc, data) =>
                        acc +
                        data.students.filter(student => student.unitno === unitno)
                            .length,
                    0
                ),
                AI: yearData.reduce(
                    (acc, data) =>
                        acc +
                        data.students.filter(
                            student =>
                                student.unitno === unitno &&
                                student.grading === 'AI'
                        ).length,
                    0
                ),
                A: yearData.reduce(
                    (acc, data) =>
                        acc +
                        data.students.filter(
                            student => student.unitno === unitno && student.grading === 'A'
                        ).length,
                    0
                ),
                B: yearData.reduce(
                    (acc, data) =>
                        acc +
                        data.students.filter(
                            student => student.unitno === unitno && student.grading === 'B'
                        ).length,
                    0
                ),
                C: yearData.reduce(
                    (acc, data) =>
                        acc +
                        data.students.filter(
                            student => student.unitno === unitno && student.grading === 'C'
                        ).length,
                    0
                ),
                E: yearData.reduce(
                    (acc, data) =>
                        acc +
                        data.students.filter(
                            student => student.unitno === unitno && student.grading === 'E'
                        ).length,
                    0
                ),
            };

            unitData.performance[year] = yearPerformance;

            unitData.totals.AI += yearPerformance.AI;
            unitData.totals.A += yearPerformance.A;
            unitData.totals.B += yearPerformance.B;
            unitData.totals.C += yearPerformance.C;
            unitData.totals.E += yearPerformance.E;

            const totalGrading =
                yearPerformance.AI +
                yearPerformance.A +
                yearPerformance.B +
                yearPerformance.C +
                yearPerformance.E;
            cumulativeTotalGrading += totalGrading;
            cumulativeGoodGradingCount += yearPerformance.AI + yearPerformance.A;
            cumulativePoorGradingCount += yearPerformance.B + yearPerformance.C + yearPerformance.E ;
        });

        unitData.goodGrading.STR = cumulativeGoodGradingCount;
        unitData.goodGrading.UNIT = cumulativeTotalGrading
            ? (cumulativeGoodGradingCount / cumulativeTotalGrading) * 100
            : 0;

        unitData.poorGrading.STR = cumulativePoorGradingCount;
        unitData.poorGrading.UNIT = cumulativeTotalGrading
            ? (cumulativePoorGradingCount / cumulativeTotalGrading) * 100
            : 0;

        return unitData;
    });

    // Calculate totals
    const totalGoodGrading = groupedData.reduce(
        (acc, unit) => {
            acc.STR += unit.goodGrading.STR;
            acc.UNIT += parseFloat(unit.goodGrading.UNIT);
            return acc;
        },
        { STR: 0, UNIT: 0 }
    );

    const totalPoorGrading = groupedData.reduce(
        (acc, unit) => {
            acc.STR += unit.poorGrading.STR;
            acc.UNIT += parseFloat(unit.poorGrading.UNIT);
            return acc;
        },
        { STR: 0, UNIT: 0 }
    );


    const handleUnitClick = (unitData) => {
        setSelectedUnit(unitData.unitno);  // Updated to set only the unit number
        const studentsInUnit = filteredData
          .flatMap(data => data.students)
          .filter(student => student.unitno === unitData.unitno)
          .map(student => student);  // Map all student data, not just the name
        setFilteredStudents(studentsInUnit);
        console.log("filteredStudents", studentsInUnit);  // Log the updated students list
        setShowModal(true);
      };
      
    
      const closeModal = () => {
        setShowModal(false);
        setSelectedUnit(null);
        setFilteredStudents([]);
      };
  
  
      const handlePrint = () => {
        const printContent = document.getElementById("print-section").innerHTML;
        const originalContent = document.body.innerHTML;
        document.body.innerHTML = printContent;
        window.print();
        document.body.innerHTML = originalContent;
        window.location.reload();
      }

//   console.log('Grouped Data:', groupedData);
  // console.log('Total Good Grading:', totalGoodGrading);
  // console.log('Total Poor Grading:', totalPoorGrading);
  return (
    <div>
    <div className=' flex justify-end my-4' >
      <button onClick={handlePrint}
      className='px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition' >
        Print Table
      </button>
    </div>

  <div id='print-section' >
  <h1 className='font-bold text-white bg-red-800 p-4 font-mono underline text-center text-4xl' >LMC COURSE UNIT & YR WISE COURSE GRADING</h1>
          
          <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse border border-gray-300 shadow-lg">
          <thead className="bg-gray-200">
            <tr>
              <th className="border border-gray-300 px-4 py-2">UNIT</th>
              {/* Dynamically print years from filtered data */}
              {uniqueYears.map((year, index) => (
                <th key={index} className="border border-gray-300 px-4 py-2" colSpan="3">
                  {year}
                </th>
              ))}
              <th className="border border-gray-300 px-4 py-2" colSpan="2">TOTAL</th>
              <th className="border border-gray-300 px-4 py-2" colSpan="3">DESIRED GRADING</th>
              <th className="border border-gray-300 px-4 py-2" colSpan="3">POOR GRADING</th>
            </tr>
            <tr>
              <th className="border border-gray-300 px-4 py-2"></th>
              {/* Sub-columns STR, AX(I), AX for each year */}
              {uniqueYears.map((year, index) => (
                <React.Fragment key={index}>
                  <th className="border border-gray-300 px-4 py-2">STR</th>
                  <th className="border border-gray-300 px-4 py-2">AI</th>
                  <th className="border border-gray-300 px-4 py-2">A</th>
                </React.Fragment>
              ))}
              <th className="border border-gray-300 px-4 py-2">AI</th>
              <th className="border border-gray-300 px-4 py-2">A</th>
              <th className="border border-gray-300 px-4 py-2">STR</th>
              <th className="border border-gray-300 px-4 py-2">UNIT</th>
              <th className="border border-gray-300 px-4 py-2">CONT</th>
              <th className="border border-gray-300 px-4 py-2">STR</th>
              <th className="border border-gray-300 px-4 py-2">UNIT</th>
              <th className="border border-gray-300 px-4 py-2">CONT</th>
            </tr>
          </thead>
          <tbody>
            {/* Loop through groupedData to display unitno performance */}
            {groupedData.map((unitData, unitnoIndex) => (
              <tr key={unitnoIndex}>
                {/* Unit number */}
                <td 
                 onClick={() => handleUnitClick(unitData)} className="border border-gray-300 px-4 py-2">{unitData.unitno}</td>
                
                {/* Year-wise performance */}
                {uniqueYears.map((year, yearIndex) => {
                  const yearPerformance = unitData.performance[year] || {};
                  return (
                    <React.Fragment key={yearIndex}>
                      <td className="border border-gray-300 px-4 py-2">{yearPerformance.STR || '-'}</td>
                      <td className="border border-gray-300 px-4 py-2">{yearPerformance.AI || '-'}</td>
                      <td className="border border-gray-300 px-4 py-2">{yearPerformance.A || '-'}</td>
                    </React.Fragment>
                  );
                })}
                {/* Totals */}
                <td className="border border-gray-300 px-4 py-2">{unitData.totals.AI}</td>
                <td className="border border-gray-300 px-4 py-2">{unitData.totals.A}</td>

                <td className="border border-gray-300 px-4 py-2 text-center">{unitData.goodGrading.STR}</td>
                <td className="border border-gray-300 px-4 py-2 text-center">{Number(unitData.goodGrading.UNIT).toFixed(2)}%</td>
                <td className="border border-gray-300 px-4 py-2 text-center">
  {totalGoodGrading.STR > 0 ? ((unitData.goodGrading.STR * 100) / totalGoodGrading.STR).toFixed(2) : '-'}%
</td>


                <td className="border border-gray-300 px-4 py-2 text-center">{unitData.poorGrading.STR}</td>
                <td className="border border-gray-300 px-4 py-2 text-center">  {Number(unitData.poorGrading.UNIT).toFixed(2)}%</td>
                <td className="border border-gray-300 px-4 py-2 text-center">
  {totalPoorGrading.STR > 0 ? ((unitData.poorGrading.STR * 100) / totalPoorGrading.STR).toFixed(2) : '0'}%
</td>
              </tr>
            ))}
          </tbody>
          <tr>
              <td className="border border-gray-300 px-4 py-2">G TOTAL</td>
              {uniqueYears.map((year) => (
                <React.Fragment key={year}>
                  <td className="border border-gray-300 px-4 py-2">
                    {groupedData.reduce((total, unitData) => total + (unitData.performance[year]?.STR || 0), 0)}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {groupedData.reduce((total, unitData) => total + (unitData.performance[year]?.AI || 0), 0)}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {groupedData.reduce((total, unitData) => total + (unitData.performance[year]?.A || 0), 0)}
                  </td>
               
                </React.Fragment>
              ))}
            
              <td className="border border-gray-300 px-4 py-2">
                {groupedData.reduce((total, unitData) => total + unitData.totals.AI, 0)}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {groupedData.reduce((total, unitData) => total + unitData.totals.A, 0)}
              </td>
          
              <td className="border border-gray-300 px-4 py-2 text-center">
                {groupedData.reduce((total, unitData) => total + unitData.goodGrading.STR, 0)}
              </td>
              <td className="border border-gray-300 px-4 py-2 text-center">
             -
              </td>
              <td className="border border-gray-300 px-4 py-2 text-center">
             -
              </td>
              <td className="border border-gray-300 px-4 py-2 text-center">
                {groupedData.reduce((total, unitData) => total + unitData.poorGrading.STR, 0)}
              </td>
              <td className="border border-gray-300 px-4 py-2 text-center">
             -
              </td>
              <td className="border border-gray-300 px-4 py-2 text-center">
             -
              </td>
            </tr>
        </table>
      </div>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg  w-full">
            <h2 className="text-xl font-semibold mb-4">Students in Unit {selectedUnit}</h2>
            <ul className="list-disc pl-5">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student, idx) => <li key={idx}>{student.armyno} - {student.name} - {student.rankno} - {student.grading}</li>)
              ) : (
                <li>No students found</li>
              )}
            </ul>
            <button
              onClick={closeModal}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
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