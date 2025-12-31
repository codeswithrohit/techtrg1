import React, { useState, useEffect } from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

// Register required components for Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const PT = ({maincoursestudents,coursesList,selectedCourse}) => {
  
    const Data = maincoursestudents.filter(courseData => courseData.course === selectedCourse);

    // Merge data by year
    const mergeDataByYear = () => {
        const mergedData = {};

        Data.forEach(courseData => {
            const year = courseData.year;
            if (!mergedData[year]) {
                mergedData[year] = { ...courseData, students: [] };
            }
            mergedData[year].students.push(...courseData.students);
        });

        return Object.values(mergedData);
    };

    // Prepare data for the bar chart (showing vacancies allocated and utilized for each year)
    const prepareChartData = () => {
        const filteredData = mergeDataByYear().filter(courseData => courseData.course === selectedCourse);

        const years = filteredData.map(courseData => courseData.year);
        const vacAllocated = filteredData.map(courseData => courseData.vacAllotted);
        const vacUtilized = filteredData.map(courseData => courseData.vacUtilised);

        return {
            labels: years,
            datasets: [
                {
                    label: 'Vacancies Allocated',
                    data: vacAllocated,
                    backgroundColor: 'rgba(15, 10, 222)',
                    borderColor: 'rgba(15, 10, 222)',
                    borderWidth: 1
                },
                {
                    label: 'Vacancies Utilized',
                    data: vacUtilized,
                    backgroundColor: 'rgba(60, 179, 113)',
                    borderColor: 'rgba(60, 179, 113)',
                    borderWidth: 1
                }
            ]
        };
    };

    // Prepare year-wise grading data for Doughnut charts
    const prepareGradingDataYearWise = () => {
        const filteredData = mergeDataByYear().filter(courseData => courseData.course === selectedCourse);

        const gradingData = filteredData.map(courseData => {
            const students = courseData.students || [];
            const axIStudentsCount = students.filter(student => student.grading === "AX(I)").length;
            const axStudentsCount = students.filter(student => student.grading === "AX").length;
            const axrStudentsCount = students.filter(student => student.grading === "AXR").length;
            const totalUtilised = courseData.vacUtilised || 0;
            const otherStudentsCount = totalUtilised - axIStudentsCount - axStudentsCount - axrStudentsCount;

            const totalStudents = axIStudentsCount + axStudentsCount + otherStudentsCount + axrStudentsCount;
            const axIPercentage = (axIStudentsCount / totalStudents * 100).toFixed(2);
            const axPercentage = (axStudentsCount / totalStudents * 100).toFixed(2);
            const axrPercentage = (axrStudentsCount / totalStudents * 100).toFixed(2);
            const totalaxiaxPercentage = totalStudents > 0 ? (((axIStudentsCount + axStudentsCount + axrStudentsCount ) / totalStudents) * 100).toFixed(2) : '0.00';

            return {
                year: courseData.year,
                axIStudentsCount,
                axStudentsCount,
                axrStudentsCount,
                otherStudentsCount,
                axIPercentage,
                axPercentage,
                axrPercentage,
                totalaxiaxPercentage
            };
        });

        return gradingData;
    };

    // Render year-wise grading charts in a single row
    const renderYearWiseGradingCharts = () => {
        const gradingDataYearWise = prepareGradingDataYearWise();

        return (
            <div className="flex flex-wrap gap-4">
                {gradingDataYearWise.map((data, index) => (
                    <div key={index} className="min-w-[200px] max-w-[300px]">
                        <Doughnut
                            data={{
                                labels: ['AX(I)', 'AX', 'AXR', 'Other Graded'],
                                datasets: [
                                    {
                                        label: `Grading Distribution for ${data.year}`,
                                        data: [data.axIStudentsCount, data.axStudentsCount,data.axIStudentsCount, data.otherStudentsCount],
                                        backgroundColor: ['rgba(15, 10, 222)', 'rgba(60, 179, 113)', 'rgba(255, 165, 0)'],
                                        borderColor: ['rgba(15, 10, 222)', 'rgba(60, 179, 113)', 'rgba(255, 165, 0)'],
                                        borderWidth: 1
                                    }
                                ]
                            }}
                            options={{
                                responsive: true,
                                plugins: {
                                    legend: {
                                        position: 'bottom',
                                    },
                                    title: {
                                        display: true,
                                        text: `Grading Distribution for ${data.year} (AX(I): ${data.axIPercentage}%, AX: ${data.axPercentage}%,AXR: ${data.axrPercentage}%, Total: ${data.totalaxiaxPercentage}%)`,
                                    },
                                },
                            }}
                            style={{ height: '250px', width: '250px' }} // Set the size of each chart
                        />
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="container mx-auto">
       

            {selectedCourse ? (
                Data.length > 0 ? (
                    <>
                        {/* Render the bar chart */}
                        <div className="my-6" style={{ width: '100%', height: '400px' }}> {/* Set width and height of the bar chart container */}
                            <Bar
                                data={prepareChartData()}
                                options={{
                                    responsive: true,
                                    plugins: {
                                        legend: {
                                            position: 'top',
                                        },
                                        title: {
                                            display: true,
                                            text: `Vacancies Allocated vs Utilized for ${selectedCourse}`,
                                        },
                                    },
                                    scales: {
                                        x: {
                                            title: {
                                                display: true,
                                                text: 'Year'
                                            }
                                        },
                                        y: {
                                            title: {
                                                display: true,
                                                text: 'Number of Vacancies'
                                            }
                                        }
                                    }
                                }}
                                style={{ height: '100%', width: '100%' }} // Ensure the Bar chart fills the container
                            />
                        </div>

                        {/* Render the year-wise grading charts */}
                        {renderYearWiseGradingCharts()}
                    </>
                ) : <p>Loading data...</p>
            ) : (
                <p>Please select a course to view data.</p>
            )}
        </div>
    );
};

export default PT;
