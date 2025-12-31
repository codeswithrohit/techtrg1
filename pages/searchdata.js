import React, { useState, useEffect } from 'react';
import { FaSearch, FaFilter, FaSync, FaSort, FaSortUp, FaSortDown, FaStar, FaChartBar, FaCalendar, FaUser, FaIdCard, FaShieldAlt, FaGraduationCap, FaTimes, FaEye, FaChevronDown, FaChevronUp, FaAngleLeft, FaAngleRight, FaAngleDoubleLeft, FaAngleDoubleRight } from 'react-icons/fa';

const SearchData = () => {
  const [students, setStudents] = useState([]);
  const [maincoursestudents, setMaincourseStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCourseType, setFilterCourseType] = useState('all');
  const [filterCourseName, setFilterCourseName] = useState('all');
  const [filterYear, setFilterYear] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'armyno', direction: 'asc' });
  const [showFilters, setShowFilters] = useState(false);
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [activeTab, setActiveTab] = useState('preCourses');
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(10);

  // Toggle row expansion
  const toggleRowExpansion = (armyno) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(armyno)) {
      newExpandedRows.delete(armyno);
    } else {
      newExpandedRows.add(armyno);
    }
    setExpandedRows(newExpandedRows);
  };

  // Combine and process data with detailed course information
  const processedData = React.useMemo(() => {
    const armyNoMap = new Map();

    // Process pre-course students with scores
    students.forEach(course => {
      course.students?.forEach(student => {
        const existing = armyNoMap.get(student.armyno);
        if (!existing) {
          armyNoMap.set(student.armyno, {
            ...student,
            preCourses: [{
              courseType: 'Pre Course',
              courseName: course.selectedCourse,
              courseYear: course.year,
              preCourseScores: student.scores || {},
              preCourseDetails: {
                title: course.selectedTitle,
                mainTitle: course.selectedMaintitle,
                year: course.year,
                targetYearPreCourse: course.targetYearPreCourse
              }
            }],
            mainCourses: []
          });
        } else {
          // Add additional pre-course if same army number exists
          const updatedPreCourses = [
            ...existing.preCourses,
            {
              courseType: 'Pre Course',
              courseName: course.selectedCourse,
              courseYear: course.year,
              preCourseScores: student.scores || {},
              preCourseDetails: {
                title: course.selectedTitle,
                mainTitle: course.selectedMaintitle,
                year: course.year,
                targetYearPreCourse: course.targetYearPreCourse
              }
            }
          ];
          armyNoMap.set(student.armyno, {
            ...existing,
            preCourses: updatedPreCourses
          });
        }
      });
    });

    // Process main course students with grading
    maincoursestudents.forEach(course => {
      course.students?.forEach(student => {
        const existing = armyNoMap.get(student.armyno);
        if (!existing) {
          armyNoMap.set(student.armyno, {
            ...student,
            preCourses: [],
            mainCourses: [{
              courseType: 'Main Course',
              courseName: course.course,
              Maincourse: course.maincourse,
              courseYear: course.year,
              mainCourseGrading: student.grading,
              mainCourseDetails: {
                course: course.course,
                year: course.year,
                totalStrength: course.totalStrengthA,
                totalArmyStrength: course.totalArmyStrength,
                targetYearMainCourse: course.targetYearMainCourse
              }
            }]
          });
        } else {
          // Add additional main course if same army number exists
          const updatedMainCourses = [
            ...existing.mainCourses,
            {
              courseType: 'Main Course',
              courseName: course.course,
              Maincourse: course.maincourse,
              courseYear: course.year,
              mainCourseGrading: student.grading,
              mainCourseDetails: {
                course: course.course,
                year: course.year,
                totalStrength: course.totalStrengthA,
                totalArmyStrength: course.totalArmyStrength,
                targetYearMainCourse: course.targetYearMainCourse
              }
            }
          ];
          armyNoMap.set(student.armyno, {
            ...existing,
            mainCourses: updatedMainCourses
          });
        }
      });
    });

    return Array.from(armyNoMap.values());
  }, [students, maincoursestudents]);

  // Get course type for filtering
  const getCourseType = (student) => {
    if (student.preCourses.length > 0 && student.mainCourses.length > 0) return 'Both Courses';
    if (student.preCourses.length > 0) return 'Pre Course';
    if (student.mainCourses.length > 0) return 'Main Course';
    return 'No Courses';
  };

  // Get all course names for filtering
  const getAllCourseNames = (student) => {
    const preCourseNames = student.preCourses.map(course => course.courseName);
    const mainCourseNames = student.mainCourses.map(course => course.courseName);
    return [...preCourseNames, ...mainCourseNames];
  };

  // Get all years for filtering
  const getAllYears = (student) => {
    const preCourseYears = student.preCourses.map(course => course.courseYear);
    const mainCourseYears = student.mainCourses.map(course => course.courseYear);
    return [...preCourseYears, ...mainCourseYears];
  };

  // Get unique values for filters
  const filterOptions = React.useMemo(() => {
    const courseTypes = ['Pre Course', 'Main Course', 'Both Courses'];
    const courseNames = [...new Set(processedData.flatMap(student => getAllCourseNames(student)).filter(Boolean))];
    const years = [...new Set(processedData.flatMap(student => getAllYears(student)).filter(Boolean))].sort().reverse();
    
    return { courseTypes, courseNames, years };
  }, [processedData]);

  // Filter and sort data
  const filteredAndSortedData = React.useMemo(() => {
    let filtered = processedData.filter(student => {
      const matchesSearch = 
        student.armyno?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.unitno?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.rankno?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCourseType = filterCourseType === 'all' || 
        getCourseType(student).toLowerCase().includes(filterCourseType.toLowerCase());

      const matchesCourseName = filterCourseName === 'all' || 
        getAllCourseNames(student).includes(filterCourseName);

      const matchesYear = filterYear === 'all' || 
        getAllYears(student).includes(filterYear);

      return matchesSearch && matchesCourseType && matchesCourseName && matchesYear;
    });

    // Sorting
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aVal = a[sortConfig.key];
        let bVal = b[sortConfig.key];
        
        if (sortConfig.key === 'courseType') {
          aVal = getCourseType(a);
          bVal = getCourseType(b);
        }

        aVal = aVal || '';
        bVal = bVal || '';
        
        if (aVal < bVal) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aVal > bVal) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [processedData, searchTerm, filterCourseType, filterCourseName, filterYear, sortConfig]);

  // Pagination calculations
  const totalRecords = filteredAndSortedData.length;
  const totalPages = Math.ceil(totalRecords / recordsPerPage);
  
  // Get current records for the page
  const currentRecords = React.useMemo(() => {
    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    return filteredAndSortedData.slice(indexOfFirstRecord, indexOfLastRecord);
  }, [filteredAndSortedData, currentPage, recordsPerPage]);

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterCourseType, filterCourseName, filterYear]);

  const handleSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Pagination handlers
  const goToPage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const goToFirstPage = () => goToPage(1);
  const goToLastPage = () => goToPage(totalPages);
  const goToPreviousPage = () => goToPage(currentPage - 1);
  const goToNextPage = () => goToPage(currentPage + 1);

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <FaSort className="text-gray-400" />;
    return sortConfig.direction === 'asc' ? 
      <FaSortUp className="text-blue-600" /> : 
      <FaSortDown className="text-blue-600" />;
  };

  const getGradingColor = (grading) => {
    if (!grading) return 'bg-gray-100 text-gray-800 border-gray-300';
    
    const grade = grading.toUpperCase();
    switch (grade) {
      case 'A+':
      case 'A':
      case 'AI':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'B+':
      case 'B':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'C':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'D':
        return 'bg-orange-50 text-orange-800 border-orange-200';
      case 'E':
      case 'F':
        return 'bg-red-50 text-red-800 border-red-200';
      default:
        return 'bg-gray-50 text-gray-800 border-gray-300';
    }
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    if (score >= 80) return 'bg-blue-100 text-blue-800 border-blue-300';
    if (score >= 70) return 'bg-amber-100 text-amber-800 border-amber-300';
    if (score >= 60) return 'bg-orange-100 text-orange-800 border-orange-300';
    return 'bg-red-100 text-red-800 border-red-300';
  };

  const getCourseTypeColor = (courseType) => {
    switch (courseType) {
      case 'Pre Course':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Main Course':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'Both Courses':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterCourseType('all');
    setFilterCourseName('all');
    setFilterYear('all');
    setCurrentPage(1);
  };

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/fetchstudents');
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

  const fetchMainStudents = async () => {
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
    const fetchData = async () => {
      await Promise.all([fetchStudents(), fetchMainStudents()]);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="relative">
            <FaSync className="animate-spin text-4xl text-blue-600 mb-4" />
            <div className="absolute inset-0 bg-blue-600/10 rounded-full animate-ping"></div>
          </div>
          <p className="text-gray-600 text-lg font-medium">Loading student data...</p>
          <p className="text-gray-500 text-sm mt-2">Please wait while we fetch the records</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Individual Courses Records
              </h1>
              <p className="text-gray-600 text-lg">
                Comprehensive management system for courses records and performance tracking
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="bg-white rounded-lg shadow-sm px-4 py-2 border border-gray-200">
                <div className="text-sm text-gray-500">Total Records</div>
                <div className="text-2xl font-bold text-gray-900">{processedData.length}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
            {/* Search Input */}
            <div className="flex-1 max-w-2xl">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Search by Army No, Name, Unit, or Rank..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`inline-flex items-center px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                  showFilters 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25' 
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                <FaFilter className="mr-2" />
                Filters
                {(filterCourseType !== 'all' || filterCourseName !== 'all' || filterYear !== 'all') && (
                  <span className="ml-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                    !
                  </span>
                )}
              </button>
              
              <button
                onClick={() => {
                  setLoading(true);
                  Promise.all([fetchStudents(), fetchMainStudents()]).then(() => setLoading(false));
                }}
                className="inline-flex items-center px-4 py-3 border border-gray-300 rounded-xl shadow-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
              >
                <FaSync className="mr-2" />
                Refresh
              </button>
            </div>
          </div>

          {/* Expandable Filters */}
          {showFilters && (
            <div className="border-t border-gray-200 pt-6 mt-6 animate-fadeIn">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Course Type Filter */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    <FaGraduationCap className="inline mr-2 text-blue-500" />
                    Course Type
                  </label>
                  <select
                    className="block w-full pl-4 pr-10 py-3 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent rounded-xl transition-all duration-200 bg-white"
                    value={filterCourseType}
                    onChange={(e) => setFilterCourseType(e.target.value)}
                  >
                    <option value="all">All Course Types</option>
                    {filterOptions.courseTypes.map(course => (
                      <option key={course} value={course}>{course}</option>
                    ))}
                  </select>
                </div>

                {/* Course Name Filter */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    <FaShieldAlt className="inline mr-2 text-green-500" />
                    Course Name
                  </label>
                  <select
                    className="block w-full pl-4 pr-10 py-3 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent rounded-xl transition-all duration-200 bg-white"
                    value={filterCourseName}
                    onChange={(e) => setFilterCourseName(e.target.value)}
                  >
                    <option value="all">All Courses</option>
                    {filterOptions.courseNames.map(course => (
                      <option key={course} value={course}>{course}</option>
                    ))}
                  </select>
                </div>

                {/* Year Filter */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    <FaCalendar className="inline mr-2 text-purple-500" />
                    Year
                  </label>
                  <select
                    className="block w-full pl-4 pr-10 py-3 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent rounded-xl transition-all duration-200 bg-white"
                    value={filterYear}
                    onChange={(e) => setFilterYear(e.target.value)}
                  >
                    <option value="all">All Years</option>
                    {filterOptions.years.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Active Filters */}
              <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap gap-2">
                  {filterCourseType !== 'all' && (
                    <span className="inline-flex items-center px-3 py-1.5 bg-blue-100 text-blue-800 rounded-full text-sm font-medium border border-blue-200">
                      Type: {filterCourseType}
                      <button onClick={() => setFilterCourseType('all')} className="ml-2 hover:text-blue-900">
                        <FaTimes className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {filterCourseName !== 'all' && (
                    <span className="inline-flex items-center px-3 py-1.5 bg-green-100 text-green-800 rounded-full text-sm font-medium border border-green-200">
                      Course: {filterCourseName}
                      <button onClick={() => setFilterCourseName('all')} className="ml-2 hover:text-green-900">
                        <FaTimes className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {filterYear !== 'all' && (
                    <span className="inline-flex items-center px-3 py-1.5 bg-purple-100 text-purple-800 rounded-full text-sm font-medium border border-purple-200">
                      Year: {filterYear}
                      <button onClick={() => setFilterYear('all')} className="ml-2 hover:text-purple-900">
                        <FaTimes className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {(filterCourseType === 'all' && filterCourseName === 'all' && filterYear === 'all') && (
                    <span className="text-gray-500 text-sm">No active filters</span>
                  )}
                </div>
                
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                >
                  Clear All
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Records Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-blue-800 font-medium">
              Showing {((currentPage - 1) * recordsPerPage) + 1} to {Math.min(currentPage * recordsPerPage, totalRecords)} of {totalRecords} records
            </div>
            <div className="text-sm text-blue-600 mt-2 sm:mt-0">
              Page {currentPage} of {totalPages}
            </div>
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  {[
                    { key: 'armyno', label: 'Army No', icon: FaIdCard },
                    { key: 'name', label: 'Name', icon: FaUser },
                    { key: 'rankno', label: 'Rank', icon: FaShieldAlt },
                    { key: 'unitno', label: 'Unit', icon: FaUser },
                    { key: 'action', label: 'View Details', icon: FaEye }
                  ].map(({ key, label, icon: Icon }) => (
                    <th 
                      key={key}
                      className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-200/50 transition-colors duration-150"
                      onClick={() => key !== 'action' && handleSort(key)}
                    >
                      <div className="flex items-center space-x-2">
                        <Icon className="text-gray-500 text-sm" />
                        <span>{label}</span>
                        {key !== 'action' && getSortIcon(key)}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentRecords.map((student, index) => (
                  <React.Fragment key={`${student.armyno}-${index}`}>
                    <tr className="hover:bg-blue-50/30 transition-all duration-150 group">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors duration-150">
                            <FaIdCard className="text-blue-600 text-sm" />
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-mono font-bold text-gray-900">
                              {student.armyno}
                            </div>
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">
                          {student.name}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 font-medium">
                          {student.rankno}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {student.unitno}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => toggleRowExpansion(student.armyno)}
                          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
                        >
                          <FaEye className="mr-2" />
                          {expandedRows.has(student.armyno) ? 'Hide Details' : 'View Details'}
                          {expandedRows.has(student.armyno) ? 
                            <FaChevronUp className="ml-2" /> : 
                            <FaChevronDown className="ml-2" />
                          }
                        </button>
                      </td>
                    </tr>
                    
                    {/* Expanded Details Row */}
                    {expandedRows.has(student.armyno) && (
  <tr className="bg-white border-b border-gray-100 shadow-inner">
    {/* Use a single column for better flow and use tabs */}
    <td colSpan={6} className="px-6 py-4">
      <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
        {/* --- Tab Navigation --- */}
        <div className="flex border-b border-gray-300 mb-4">
          <button
            onClick={() => setActiveTab('preCourses')} // Assumes setActiveTab state hook is defined
            className={`px-6 py-3 text-sm font-medium transition-all duration-200 ease-in-out ${
              activeTab === 'preCourses'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            }`}
          >
            <FaGraduationCap className="inline mr-2" />
            Pre-Courses ({student.preCourses.length})
          </button>
          <button
            onClick={() => setActiveTab('mainCourses')} // Assumes setActiveTab state hook is defined
            className={`px-6 py-3 text-sm font-medium transition-all duration-200 ease-in-out ${
              activeTab === 'mainCourses'
                ? 'text-green-600 border-b-2 border-green-600 bg-white'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            }`}
          >
            <FaStar className="inline mr-2" />
            Main Courses ({student.mainCourses.length})
          </button>
        </div>

        {/* --- Tab Content --- */}
        {/* Pre Courses Content (Active) */}
        {activeTab === 'preCourses' && (
          <div className="p-2">
            {student.preCourses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {student.preCourses.map((course, courseIndex) => (
                  <div key={courseIndex} className="border border-blue-200 rounded-lg p-3 bg-white shadow-sm hover:shadow-md transition">
                    <h4 className="font-bold text-base text-gray-800 mb-1 truncate">
                      {course.courseName} - {course.courseYear}
                    </h4>
                    <p className="text-xs text-blue-600 mb-3">
                      {course.preCourseDetails?.title || 'Pre Course Details'}
                    </p>

                    <div className="space-y-1 text-sm text-gray-600">
                      {course.preCourseDetails?.mainTitle && (
                        <p>
                          <span className="font-semibold">Main Course:</span> {course.preCourseDetails.mainTitle}
                        </p>
                      )}
                      {course.preCourseDetails?.targetYearPreCourse && (
                        <p>
                          <span className="font-semibold">Duration:</span> {course.preCourseDetails.targetYearPreCourse}
                        </p>
                      )}
                    </div>

                    <h5 className="font-semibold text-xs text-gray-700 mt-3 mb-2 uppercase tracking-wider border-t pt-2">
                      Scores:
                    </h5>
                    {course.preCourseScores && Object.keys(course.preCourseScores).length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(course.preCourseScores).map(([subject, score]) => (
                          <div 
                            key={subject} 
                            // Use a more compact chip-style display
                            className={`inline-flex items-center px-2 py-0.5 text-xs rounded-full font-medium border ${getScoreColor(score)}`}
                          >
                            {subject}: **{score}**
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-gray-500 italic">No scores available</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic py-4">No pre-courses found for this student.</p>
            )}
          </div>
        )}

        {/* Main Courses Content (Active) */}
        {activeTab === 'mainCourses' && (
          <div className="p-2">
            {student.mainCourses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {student.mainCourses.map((course, courseIndex) => (
                  <div key={courseIndex} className="border border-green-200 rounded-lg p-3 bg-white shadow-sm hover:shadow-md transition">
                    <h4 className="font-bold text-base text-gray-800 mb-1 truncate">
                      {course.courseName} - {course.courseYear}
                    </h4>
                    <p className="text-sm text-gray-600 mb-3">{course.Maincourse}</p>
                    
                    {course.mainCourseDetails?.targetYearMainCourse && (
                      <p className="text-sm text-gray-600 mb-3">
                        <span className="font-semibold">Duration:</span> {course.mainCourseDetails.targetYearMainCourse}
                      </p>
                    )}
                    
                    <h5 className="font-semibold text-xs text-gray-700 mt-4 mb-2 uppercase tracking-wider border-t pt-2">
                      Grading:
                    </h5>
                    {course.mainCourseGrading ? (
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold ${getGradingColor(course.mainCourseGrading)}`}>
                        <FaStar className="mr-2 text-yellow-500" />
                        {course.mainCourseGrading}
                      </span>
                    ) : (
                      <p className="text-sm text-gray-500 italic">No grading available</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic py-4">No main courses found for this student.</p>
            )}
          </div>
        )}
      </div>
    </td>
  </tr>
)}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {filteredAndSortedData.length === 0 && (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FaSearch className="text-3xl text-blue-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No records found</h3>
                <p className="text-gray-600 mb-6">
                  We couldn't find any records matching your search criteria. Try adjusting your filters or search term.
                </p>
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-lg shadow-blue-500/25"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Page Info */}
              <div className="text-sm text-gray-700">
                Showing <span className="font-semibold">{((currentPage - 1) * recordsPerPage) + 1}</span> to{" "}
                <span className="font-semibold">{Math.min(currentPage * recordsPerPage, totalRecords)}</span> of{" "}
                <span className="font-semibold">{totalRecords}</span> results
              </div>

              {/* Pagination Controls */}
              <div className="flex items-center space-x-2">
                {/* First Page Button */}
                <button
                  onClick={goToFirstPage}
                  disabled={currentPage === 1}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  <FaAngleDoubleLeft className="w-4 h-4" />
                </button>

                {/* Previous Page Button */}
                <button
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  <FaAngleLeft className="w-4 h-4" />
                </button>

                {/* Page Numbers */}
                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNumber;
                    if (totalPages <= 5) {
                      pageNumber = i + 1;
                    } else if (currentPage <= 3) {
                      pageNumber = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNumber = totalPages - 4 + i;
                    } else {
                      pageNumber = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNumber}
                        onClick={() => goToPage(pageNumber)}
                        className={`inline-flex items-center px-4 py-2 border text-sm font-medium rounded-lg transition-all duration-200 ${
                          currentPage === pageNumber
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  })}
                </div>

                {/* Next Page Button */}
                <button
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  <FaAngleRight className="w-4 h-4" />
                </button>

                {/* Last Page Button */}
                <button
                  onClick={goToLastPage}
                  disabled={currentPage === totalPages}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  <FaAngleDoubleRight className="w-4 h-4" />
                </button>
              </div>

              {/* Page Size Info */}
              <div className="text-sm text-gray-500">
                {recordsPerPage} per page
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchData;