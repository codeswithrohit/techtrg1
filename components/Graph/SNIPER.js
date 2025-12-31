import React,{useState} from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const SNIPER = ({ maincoursestudents, selectedCourse, selectedYears,selectedMainCourse }) => {
    const [selectedGrading, setSelectedGrading] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [popupData, setPopupData] = useState([]);
    const handleDoughnutClick = (event, elements) => {
        if (elements.length === 0) return;
        
        const index = elements[0].index;
        let gradingType = ["AX(I)", "AX", "Other Graded"][index];
    
        const filteredStudents = maincoursestudents
            .filter(courseData =>
                courseData.course === selectedCourse &&
                (selectedYears.length === 0 || selectedYears.some(year => year.value === courseData.year)) &&
                (selectedMainCourse.length === 0 || selectedMainCourse.some(main => main.value === courseData.maincourse))
            )
            .flatMap(courseData => courseData.students)
            .filter(student => {
                if (gradingType === "AX(I)") return student.grading === "AX(I)";
                if (gradingType === "AX") return student.grading === "AX";
                return student.grading !== "AX(I)" && student.grading !== "AX";
            });
    
        setPopupData(filteredStudents);
        setSelectedGrading(gradingType);
        setShowPopup(true);
    };
    const Data = maincoursestudents.filter(courseData => 
        courseData.course === selectedCourse && 
        (selectedYears.length === 0 || selectedYears.some(year => year.value === courseData.year)) &&
        (selectedMainCourse.length === 0 || selectedMainCourse.some(main => main.value === courseData.maincourse))
    );

    const mergedData = Data.reduce((acc, courseData) => {
        acc.vacAllotted += courseData.vacAllotted || 0;
        acc.vacUtilised += courseData.vacUtilised || 0;

        courseData.students.forEach(student => {
            if (student.grading === "AX(I)") {
                acc.axIStudentsCount += 1;
            } else if (student.grading === "AX") {
                acc.axStudentsCount += 1;
            } else {
                acc.otherStudentsCount += 1;
            }
        });

        return acc;
    }, { vacAllotted: 0, vacUtilised: 0, axIStudentsCount: 0, axStudentsCount: 0, otherStudentsCount: 0 });

    const barChartData = {
        labels: ["Total Vacancies"],
        datasets: [
            {
                label: 'Vacancies Allocated',
                data: [mergedData.vacAllotted],
                backgroundColor: 'rgba(15, 10, 222, 0.7)',
                borderRadius: 8,
                borderWidth: 1,
            },
            {
                label: 'Vacancies Utilized',
                data: [mergedData.vacUtilised],
                backgroundColor: 'rgba(60, 179, 113, 0.7)',
                borderRadius: 8,
                borderWidth: 1,
            }
        ]
    };
    const totalStudents = mergedData.axIStudentsCount + mergedData.axStudentsCount + mergedData.otherStudentsCount;

    const getPercentage = (count) => (totalStudents > 0 ? ((count / totalStudents) * 100).toFixed(1) + '%' : '0%');
    
    const doughnutChartData = {
        labels: [
            `AX(I) (${getPercentage(mergedData.axIStudentsCount)})`,
            `AX (${getPercentage(mergedData.axStudentsCount)})`,
            `Other Graded (${getPercentage(mergedData.otherStudentsCount)})`
        ],
        datasets: [
            {
                label: 'Grading Distribution',
                data: [mergedData.axIStudentsCount, mergedData.axStudentsCount, mergedData.otherStudentsCount],
                backgroundColor: ['rgba(15, 10, 222, 0.7)', 'rgba(60, 179, 113, 0.7)', 'rgba(255, 165, 0, 0.7)'],
                borderWidth: 1,
            }
        ]
    };

    return (
        <div className="container mx-auto p-6">
            {selectedCourse ? (
                Data.length > 0 ? (
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Bar Chart */}
                        <div className="bg-white shadow-lg rounded-2xl p-6 ">
                            <h3 className="text-lg font-semibold mb-4 text-center text-gray-700">Total Vacancies</h3>
                            <Bar data={barChartData} options={{ 
                                responsive: true, 
                                plugins: { 
                                    legend: { position: 'top', labels: { font: { size: 14 } } } 
                                } 
                            }} />
                        </div>
                        
                        {/* Doughnut Chart */}
                        <div className="bg-white shadow-lg rounded-2xl p-6 flex flex-col items-center ">
                            <h3 className="text-lg font-semibold mb-4 text-center text-gray-700">Grading Distribution</h3>
                            <Doughnut data={doughnutChartData} options={{ 
                                responsive: true, 
                                plugins: { 
                                    legend: { position: 'bottom', labels: { font: { size: 14 } } } 
                                },
                                onClick: handleDoughnutClick     
                            }} />
                        </div>
                    </div>
                ) : (
                    <p className="text-center text-gray-500">Loading data...</p>
                )
            ) : (
                <p className="text-center text-gray-500">Please select a course to view data.</p>
            )}
                                                {showPopup && (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl">
            <h2 className="text-2xl font-semibold mb-4 text-center uppercase">{selectedGrading} Students</h2>
            
            <div className="overflow-x-auto max-h-80">
                <table className="w-full border-collapse border border-gray-200 shadow-md">
                    <thead className="bg-gray-100">
                        <tr className="text-left">
                            <th className="border border-gray-300 px-4 py-2">Name</th>
                            <th className="border border-gray-300 px-4 py-2">Army No</th>
                            <th className="border border-gray-300 px-4 py-2">Rank No</th>
                            <th className="border border-gray-300 px-4 py-2">Unit No</th>
                            <th className="border border-gray-300 px-4 py-2">Grading</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white">
                        {popupData.map((student, index) => (
                            <tr key={index} className="hover:bg-gray-50 transition">
                                <td className="border border-gray-300 px-4 py-2">{index+1}.{student.name}</td>
                                <td className="border border-gray-300 px-4 py-2">{student.armyno}</td>
                                <td className="border border-gray-300 px-4 py-2">{student.rankno}</td>
                                <td className="border border-gray-300 px-4 py-2">{student.unitno}</td>
                                <td className="border border-gray-300 px-4 py-2">{student.grading}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-end mt-4">
                <button 
                    onClick={() => setShowPopup(false)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
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

export default SNIPER;
