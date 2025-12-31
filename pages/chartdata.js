import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { useRouter } from "next/router";
import SECCDR from '../components/Graph/SECCDR';
import PC from '../components/Graph/PC';
import PT from '../components/Graph/PT';
import ADC from '../components/Graph/ADC';
import AIBC from '@/components/Graph/AIBC';
import MTCADRE from '@/components/Graph/MTCADRE';
import CLC from '@/components/Graph/CLC';
import LMC from '@/components/Graph/LMC';
import ATGM from '@/components/Graph/ATGM';
import SNIPER from '@/components/Graph/SNIPER';

const Graph = ({ userData }) => {
    const router = useRouter();
    const [maincoursestudents, setMaincourseStudents] = useState([]);
    const [yearsList, setYearsList] = useState([]);
    const [coursesList, setCoursesList] = useState([]);
    const [mainCoursesList, setMainCoursesList] = useState([]);
    const [selectedYears, setSelectedYears] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [selectedMainCourse, setSelectedMainCourse] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userData) return;
        if (userData?.selectedCourse !== "MASTER ADMIN") {
            router.push("/");
        } else {
            setLoading(false);
        }
    }, [userData, router]);

    const fetchStudents = async () => {
        try {
            const res = await fetch('/api/maincourse');
            const result = await res.json();
            if (result.success) {
                setMaincourseStudents(result.data);
                extractUniqueFilters(result.data);
            } else {
                console.error('Failed to fetch students');
            }
        } catch (error) {
            console.error('Error fetching students:', error);
        }
    };

    const extractUniqueFilters = (data) => {
        const uniqueYears = [...new Set(data.map(item => item.year))];
        setYearsList(uniqueYears.map(year => ({ label: year, value: year })));
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    const handleYearChange = (selectedOptions) => {
        setSelectedYears(selectedOptions);
        const selectedYearValues = selectedOptions.map(option => option.value);
        const filteredCourses = [...new Set(maincoursestudents
            .filter(item => selectedYearValues.includes(item.year))
            .map(item => item.course))
        ];

        setCoursesList(filteredCourses.map(course => ({ label: course, value: course })));
        setSelectedCourse('');
        setMainCoursesList([]);
        setSelectedMainCourse([]);
    };

    const handleCourseChange = (selectedOption) => {
        setSelectedCourse(selectedOption.value);
        const selectedYearValues = selectedYears.map(option => option.value);
        const filteredMainCourses = [...new Set(maincoursestudents
            .filter(item => selectedYearValues.includes(item.year) && item.course === selectedOption.value)
            .map(item => item.maincourse))
        ];

        setMainCoursesList(filteredMainCourses.map(maincourse => ({ label: maincourse, value: maincourse })));
        setSelectedMainCourse([]);
    };

    const handleMainCourseChange = (selectedOptions) => {
        setSelectedMainCourse(selectedOptions);
    };

    const renderCourseComponent = () => {
        switch (selectedCourse) {
            case 'SEC CDR':
                return <SECCDR maincoursestudents={maincoursestudents} selectedCourse={selectedCourse} selectedYears={selectedYears} selectedMainCourse={selectedMainCourse} />;
            case 'PC':
                return <PC maincoursestudents={maincoursestudents} selectedCourse={selectedCourse} selectedYears={selectedYears} selectedMainCourse={selectedMainCourse}  />;
            case 'AIBC':
                return <AIBC maincoursestudents={maincoursestudents} selectedCourse={selectedCourse} selectedYears={selectedYears} selectedMainCourse={selectedMainCourse} />;
            case 'ADC':
                return <ADC maincoursestudents={maincoursestudents} selectedCourse={selectedCourse} selectedYears={selectedYears} selectedMainCourse={selectedMainCourse}  />;
            case 'MTCADRE':
                return <MTCADRE maincoursestudents={maincoursestudents} selectedCourse={selectedCourse} selectedYears={selectedYears} selectedMainCourse={selectedMainCourse}  />;
            case 'CLC':
                return <CLC maincoursestudents={maincoursestudents} selectedCourse={selectedCourse} selectedYears={selectedYears} selectedMainCourse={selectedMainCourse} />;
            case 'LMC':
                return <LMC maincoursestudents={maincoursestudents} selectedCourse={selectedCourse} selectedYears={selectedYears} selectedMainCourse={selectedMainCourse}  />;
            case 'ATGM':
                return <ATGM maincoursestudents={maincoursestudents} selectedCourse={selectedCourse} selectedYears={selectedYears} selectedMainCourse={selectedMainCourse}  />;
            case 'SNIPER':
                return <SNIPER maincoursestudents={maincoursestudents} selectedCourse={selectedCourse} selectedYears={selectedYears} selectedMainCourse={selectedMainCourse}  />;
            default:
                return null;
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen text-xl">Checking access...</div>;
    }

    return (
        <div className="container mx-auto min-h-screen py-24">
            <h1 className='font-bold mt-4 text-white bg-red-800 p-4 font-mono underline text-center text-4xl'>
                {selectedCourse ? `${selectedCourse} COURSE ANALYSIS` : 'Select Year(s), Course & Main Course'}
            </h1>

            <div className='mb-4 flex gap-4'>
                <label className='block text-sm font-medium text-gray-700'>
                    Select Year(s):
                    <Select isMulti options={yearsList} value={selectedYears} onChange={handleYearChange} className='w-64' />
                </label>

                <label className='block text-sm font-medium text-gray-700'>
                    Select Course:
                    <Select options={coursesList} value={coursesList.find(c => c.value === selectedCourse)} onChange={handleCourseChange} className='w-48' isDisabled={selectedYears.length === 0} />
                </label>

                <label className='block text-sm font-medium text-gray-700'>
                    Select Main Course:
                    <Select isMulti options={mainCoursesList} value={selectedMainCourse} onChange={handleMainCourseChange} className='w-48' isDisabled={!selectedCourse} />
                </label>
            </div>

            <div className='px-4'>
                {renderCourseComponent()}
            </div>
        </div>
    );
};

export default Graph;