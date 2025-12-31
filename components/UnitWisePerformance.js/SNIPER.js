import React, { useState,useEffect } from 'react';

const SNIPER = ({ students,selectedCourses,selectedMaintitles,selectedYears }) => {
    const [filteredStudentsdata, setFilteredStudentsdata] = useState([]);
    useEffect(() => {
        // Filter students for course "SEC CDR"
        const secCdrStudents = students.filter(student => student.course === "SNIPER");
        setFilteredStudentsdata(secCdrStudents); // Update the filteredStudents state
        console.log("Filtered Students", secCdrStudents); // Log the filtered data
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
            totals: { AX_I: 0, AX: 0, AY: 0, BX: 0,BY: 0, CX:0,CY:0,E:0 },
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
                AX_I: yearData.reduce(
                    (acc, data) =>
                        acc +
                        data.students.filter(
                            student =>
                                student.unitno === unitno &&
                                student.grading === 'AX(I)'
                        ).length,
                    0
                ),
                AX: yearData.reduce(
                    (acc, data) =>
                        acc +
                        data.students.filter(
                            student => student.unitno === unitno && student.grading === 'AX'
                        ).length,
                    0
                ),
                AY: yearData.reduce(
                    (acc, data) =>
                        acc +
                        data.students.filter(
                            student => student.unitno === unitno && student.grading === 'AY'
                        ).length,
                    0
                ),
                BX: yearData.reduce(
                    (acc, data) =>
                        acc +
                        data.students.filter(
                            student => student.unitno === unitno && student.grading === 'BX'
                        ).length,
                    0
                ),
                BY: yearData.reduce(
                    (acc, data) =>
                        acc +
                        data.students.filter(
                            student => student.unitno === unitno && student.grading === 'BY'
                        ).length,
                    0
                ),
                CX: yearData.reduce(
                    (acc, data) =>
                        acc +
                        data.students.filter(
                            student => student.unitno === unitno && student.grading === 'CX'
                        ).length,
                    0
                ),
                CY: yearData.reduce(
                    (acc, data) =>
                        acc +
                        data.students.filter(
                            student => student.unitno === unitno && student.grading === 'CY'
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
                )
            };

            unitData.performance[year] = yearPerformance;

            unitData.totals.AX_I += yearPerformance.AX_I;
            unitData.totals.AX += yearPerformance.AX;
            unitData.totals.AY += yearPerformance.AY;
            unitData.totals.BX += yearPerformance.BX;
            unitData.totals.BY += yearPerformance.BY;
            unitData.totals.CX += yearPerformance.CX;
            unitData.totals.CY += yearPerformance.CY;
            unitData.totals.E += yearPerformance.E;

            const totalGrading =
                yearPerformance.AX_I +
                yearPerformance.AX +
                yearPerformance.AY +
                yearPerformance.BX +
                yearPerformance.BY +
                yearPerformance.CX +
                yearPerformance.CY +
                yearPerformance.E ;

            cumulativeTotalGrading += totalGrading;
            cumulativeGoodGradingCount += yearPerformance.AX_I + yearPerformance.AX;
            cumulativePoorGradingCount += yearPerformance.AY + yearPerformance.BX +yearPerformance.CX +yearPerformance.CY +yearPerformance.E  ;
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
  <h1 className='font-bold text-white bg-red-800 p-4 font-mono underline text-center text-4xl' >SNIPER COURSE UNIT & YR WISE COURSE GRADING</h1>
          
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
                  <th className="border border-gray-300 px-4 py-2">AX(I)</th>
                  <th className="border border-gray-300 px-4 py-2">AX</th>
                </React.Fragment>
              ))}
              <th className="border border-gray-300 px-4 py-2">AX(I)</th>
              <th className="border border-gray-300 px-4 py-2">AX</th>
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
                      <td className="border border-gray-300 px-4 py-2">{yearPerformance.AX_I || '-'}</td>
                      <td className="border border-gray-300 px-4 py-2">{yearPerformance.AX || '-'}</td>
                    </React.Fragment>
                  );
                })}
                {/* Totals */}
                <td className="border border-gray-300 px-4 py-2">{unitData.totals.AX_I}</td>
                <td className="border border-gray-300 px-4 py-2">{unitData.totals.AX}</td>

                <td className="border border-gray-300 px-4 py-2 text-center">{unitData.goodGrading.STR}</td>
                <td className="border border-gray-300 px-4 py-2 text-center">{Number(unitData.goodGrading.UNIT).toFixed(2)}%</td>
                <td className="border border-gray-300 px-4 py-2 text-center">
  {totalGoodGrading.STR > 0 ? ((unitData.goodGrading.STR * 100) / totalGoodGrading.STR).toFixed(2) : 'N/A'}%
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
                    {groupedData.reduce((total, unitData) => total + (unitData.performance[year]?.AX_I || 0), 0)}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {groupedData.reduce((total, unitData) => total + (unitData.performance[year]?.AX || 0), 0)}
                  </td>
                </React.Fragment>
              ))}
            
              <td className="border border-gray-300 px-4 py-2">
                {groupedData.reduce((total, unitData) => total + unitData.totals.AX_I, 0)}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {groupedData.reduce((total, unitData) => total + unitData.totals.AX, 0)}
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

export default SNIPER