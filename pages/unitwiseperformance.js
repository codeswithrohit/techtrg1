import ADC from '@/components/UnitWisePerformance.js/ADC';
import AIBC from '@/components/UnitWisePerformance.js/AIBC';
import ATGM from '@/components/UnitWisePerformance.js/ATGM';
import CLC from '@/components/UnitWisePerformance.js/CLC';
import LMC from '@/components/UnitWisePerformance.js/LMC';
import MTCADRE from '@/components/UnitWisePerformance.js/MTCADRE';
import PC from '@/components/UnitWisePerformance.js/PC';
import SECCDR from '@/components/UnitWisePerformance.js/SECCDR';
import SNIPER from '@/components/UnitWisePerformance.js/SNIPER';
import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { useRouter } from 'next/router';
const UnitWisePerformance = ({userData}) => {
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
  const [selectedCourses, setSelectedCourses] = useState(null);
  const [selectedMaintitles, setSelectedMaintitles] = useState([]);
  const [selectedYears, setSelectedYears] = useState([]);
  const [maintitles, setMaintitles] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await fetch('/api/maincourse');
        const result = await res.json();
        if (result.success) {
          setStudents(result.data);
        } else {
          console.error('Failed to fetch students');
        }
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };
    fetchStudents();
  }, []);

  useEffect(() => {
    if (selectedCourses && selectedYears.length > 0) {
      const filteredMaintitles = students
        .filter(student => selectedYears.includes(student.year) && student.course === selectedCourses)
        .map(student => student.maincourse);
      
      // Sorting the maintitles in ascending order based on the serial number
      const sortedMaintitles = [...new Set(filteredMaintitles)].sort((a, b) => {
        const numA = parseInt(a.replace(/\D/g, '')); // Extracting numeric part from "SER NO"
        const numB = parseInt(b.replace(/\D/g, ''));
        return numA - numB;
      });

      setMaintitles(sortedMaintitles);
    } else {
      setMaintitles([]);
    }
  }, [selectedCourses, selectedYears, students]);
  const handleYearChange = (selectedOptions) => {
    const selectedYearValues = selectedOptions.map(option => option.value);
    setSelectedYears(selectedYearValues);
    setSelectedCourses(null);
    setSelectedMaintitles([]);
  };

  const handleCourseChange = (selectedOption) => {
    setSelectedCourses(selectedOption?.value || null);
    setSelectedMaintitles([]);
  };

  const handleMaintitleChange = (selectedOptions) => {
    setSelectedMaintitles(selectedOptions.map(option => option.value));
  };

  const availableCourses = students
    .filter(student => selectedYears.includes(student.year))
    .map(student => student.course);

  const uniqueCourseOptions = [...new Set(availableCourses)].map(course => ({
    value: course,
    label: course,
  }));

  const yearOptions = [...new Set(students.map(data => data.year))]
    .sort((a, b) => a.localeCompare(b))
    .map(year => ({
      value: year,
      label: year,
    }));

  const maintitleOptions = maintitles.map(title => ({
    value: title,
    label: title,
  }));

  const renderCourseComponent = () => {
    switch (selectedCourses) {
      case 'SEC CDR': return <SECCDR selectedCourses={selectedCourses} selectedMaintitles={selectedMaintitles} selectedYears={selectedYears} students={students} />;
      case 'PC': return <PC selectedCourses={selectedCourses} selectedMaintitles={selectedMaintitles} selectedYears={selectedYears} students={students} />;
      case 'ADC': return <ADC selectedCourses={selectedCourses} selectedMaintitles={selectedMaintitles} selectedYears={selectedYears} students={students} />;
      case 'AIBC': return <AIBC selectedCourses={selectedCourses} selectedMaintitles={selectedMaintitles} selectedYears={selectedYears} students={students} />;
      case 'MTCADRE': return <MTCADRE selectedCourses={selectedCourses} selectedMaintitles={selectedMaintitles} selectedYears={selectedYears} students={students} />;
      case 'CLC': return <CLC selectedCourses={selectedCourses} selectedMaintitles={selectedMaintitles} selectedYears={selectedYears} students={students} />;
      case 'LMC': return <LMC selectedCourses={selectedCourses} selectedMaintitles={selectedMaintitles} selectedYears={selectedYears} students={students} />;
      case 'ATGM': return <ATGM selectedCourses={selectedCourses} selectedMaintitles={selectedMaintitles} selectedYears={selectedYears} students={students} />;
      case 'SNIPER': return <SNIPER selectedCourses={selectedCourses} selectedMaintitles={selectedMaintitles} selectedYears={selectedYears} students={students} />;
      default: return <div>Please select a course to view details.</div>;
    }
  };
  if (loading) {
    return <div className="flex justify-center items-center h-screen text-xl">Checking access...</div>;
  }
  return (
    <div className="min-h-screen py-36 px-8">
      {/* <h1 className="font-bold uppercase mt-4 text-white bg-red-800 p-4 font-mono underline text-center text-4xl">
        {selectedCourses} COURSE UNIT & YR WISE COURSE GRADING
      </h1> */}
      <div className='mb-4 flex gap-4'>
        <label className="block text-sm font-medium text-gray-700">
          Select Years:
          <Select isMulti options={yearOptions} onChange={handleYearChange} className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm" />
        </label>
        <label className="block text-sm font-medium text-gray-700">
          Select Course:
          <Select options={uniqueCourseOptions} onChange={handleCourseChange} className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm" />
        </label>
        {selectedCourses && (
        <div className='mb-4'>
          <label className="block text-sm font-medium text-gray-700">
            Select Maincourse:
            <Select isMulti options={maintitleOptions} onChange={handleMaintitleChange} className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm" />
          </label>
        </div>
      )}
      </div>
    
      <div className="mt-8">{renderCourseComponent()}</div>
    </div>
  );
};

export default UnitWisePerformance;
