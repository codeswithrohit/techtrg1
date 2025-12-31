import React, { useState, useEffect, useRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Managecourselist from '@/components/Managecourselist';
import { useRouter } from 'next/router';
const Precourseregistration = ({userData}) => {
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
  const [coursesList, setCoursesList] = useState([]);
  const [studentsdata, setStudentsData] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [titles, setTitles] = useState([]);
  const [maintitles, setMaintitles] = useState([]); // New state for maintitles
  const [selectedTitle, setSelectedTitle] = useState('');
  const [selectedMaintitle, setSelectedMaintitle] = useState(''); // State for selected maintitle
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    year: '',
    targetYearPreCourse: [null, null], // New target year for pre course
    targetYearMainCourse: [null, null], // New target year for main course
  });
  const [errors, setErrors] = useState({});

  const [filteredInstructor, setFilteredInstructor] = useState(null);
  const [selectedInstructors, setSelectedInstructors] = useState([]);
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [students, setStudents] = useState([
    {
      armyno: '',
      rankno: '',
      name: '',
      unitno: '',
      phase: '',
    },
  ]);
  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const response = await fetch('/api/instructor');
        const data = await response.json();
        if (response.ok) {
          setInstructors(data.instructors); // Update state with fetched data
        } else {
          toast.error('Failed to fetch instructors');
        }
      } catch (error) {
        console.error(error);
        toast.error('An error occurred while fetching instructors');
      }
    };

    fetchInstructors();
  }, []);
  

  console.log("instructors",instructors)
  const datePickerRef = useRef(null);

  const fetchCourses = async () => {
    try {
      const res = await fetch('/api/fetchcourselist');
      const result = await res.json();
      if (result.success) {
        setCoursesList(result.data);
      } else {
        console.error('Failed to fetch courses');
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);


  const initializeDatePicker = () => {
    if (datePickerRef.current) {
      // Clear any existing flatpickr instance if it's already initialized
      if (datePickerRef.current._flatpickr) {
        datePickerRef.current._flatpickr.destroy();
      }

      flatpickr(datePickerRef.current, {
        mode: 'range',
        dateFormat: 'Y-m-d',
        defaultDate: formData.targetYear ? formData.targetYear.split(" to ") : [],
        onClose: function (selectedDates, dateStr) {
          setFormData((prev) => ({ ...prev, targetYear: dateStr }));
        },
      });
    }
  };

  useEffect(() => {
    initializeDatePicker();
  }, [datePickerRef, showModal]);
  
  const handleInstructorCheckbox = (instructor) => {
    setSelectedInstructors((prev) => {
      if (prev.some((inst) => inst._id === instructor._id)) {
        // If the instructor is already selected, remove them
        return prev.filter((inst) => inst._id !== instructor._id);
      }
      // Otherwise, add the entire instructor object
      return [...prev, instructor];
    });
  };
  
  
console.log("selectedinstructor",selectedInstructors)
  const handleCourseChange = (e) => {
    const selected = e.target.value;
    setSelectedCourse(selected);

    const selectedCourseData = coursesList.find(
      (course) => course.courseName === selected
    );

    if (selectedCourseData) {
      setTitles(selectedCourseData.titles);
      setMaintitles(selectedCourseData.maintitles); // Set maintitles from selected course
    } else {
      setTitles([]);
      setMaintitles([]); // Reset maintitles if no course is selected
    }
    setFilteredInstructor(null);
  };

  const handleTitleChange = (e) => {
    const selectedPreCourse = e.target.value;
    setSelectedTitle(selectedPreCourse);
  
    // Find the index of the selected pre-course
    const selectedIndex = titles.findIndex(title => title.name === selectedPreCourse);
  
    // Set the main course title based on the same index, if it exists
    if (selectedIndex !== -1 && maintitles[selectedIndex]) {
      setSelectedMaintitle(maintitles[selectedIndex].name);
    }
  };

  const handleMaintitleChange = (e) => {
    setSelectedMaintitle(e.target.value); // Handle maintitle change
  };
  const handlePreCourseDurationChange = (dates) => {
    console.log("Selected dates:", dates); // Log the selected dates
    setFormData((prev) => {
      const updatedFormData = { ...prev, targetYearPreCourse: dates };
      console.log("Updated formData:", updatedFormData); // Log the updated form data
      return updatedFormData;
    });
  
    if (selectedCourse && dates[0] && dates[1]) {
      console.log("Selected course:", selectedCourse); // Log the selected course
      console.log("Start date:", dates[0], "End date:", dates[1]); // Log the start and end dates
  
      // Filter instructors based on the selected course and date range
      const matchingInstructors = instructors.filter((instructor) => {
        const isCourseMatching = instructor.course === selectedCourse;
        const isStartDateValid = new Date(instructor.fromDate) <= dates[0];
        const isEndDateValid = new Date(instructor.toDate) >= dates[1];
  
        console.log(
          `Checking instructor: ${instructor.instructorName}, Course Match: ${isCourseMatching}, Start Date Valid: ${isStartDateValid}, End Date Valid: ${isEndDateValid}`
        );
  
        return isCourseMatching && isStartDateValid && isEndDateValid;
      });
  
      console.log("Matching instructors:", matchingInstructors); // Log the matching instructors
      setFilteredInstructor(matchingInstructors); // Store the array of matching instructors
    } else {
      console.log("Invalid input: Ensure selectedCourse and both dates are provided");
    }
  };
  
  
  
  const handleStudentChange = (index, e) => {
    const { name, value } = e.target;
    setStudents((prev) => {
      const newStudents = [...prev];
      newStudents[index][name] = name === 'armyno' || name === 'name' ? value.toUpperCase() : value; // Store in uppercase for specified fields
      return newStudents;
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const addAnotherStudent = () => {
    setStudents((prev) => [
      ...prev,
      {
        armyno: '',
        rankno: '',
        name: '',
        unitno: '',
        phase: '',
      },
    ]);
  };
  const removeStudent = (index) => {
    setStudents((prev) => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    let isValid = true;
    const errors = {};
  
    // Validate course selection
    if (!selectedCourse) {
      errors.selectedCourse = "Course selection is required.";
      isValid = false;
    }
  
    // Validate title selection
    if (!selectedTitle) {
      errors.selectedTitle = "Title selection is required.";
      isValid = false;
    }
  
    // Validate year field
    if (!formData.year) {
      errors.year = "Year is required.";
      isValid = false;
    }
  
    // Validate students
    const updatedStudents = students.map((student, index) => {
      const updatedStudent = { ...student };
      Object.keys(updatedStudent).forEach((key) => {
        if (!updatedStudent[key]) {
          errors[`student_${index}_${key}`] = `${key} is required.`;
          isValid = false;
        }
      });
      return updatedStudent;
    });
  
    setStudents(updatedStudents);
    setErrors(errors); // Update state to hold errors
    return isValid;
  };
  
  const fetchStudents = async () => {
    try {
      const res = await fetch('/api/fetchstudents');
      const result = await res.json();
      if (result.success) {
        setStudentsData(result.data);

      } else {
        console.error('Failed to fetch students');
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };
  useEffect(() => {
    fetchStudents();
  }, []);
// console.log("studentsdata",studentsdata)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({}); // Clear previous errors
  
    // Validate form and show error if not valid
    if (!validateForm()) {
      alert("Please fill in all required fields.");
      return;
    }
  
    // Check for duplicates in studentsdata
    const isDuplicate = studentsdata.some(
      (student) =>
        student.selectedCourse === selectedCourse &&
        student.selectedTitle === selectedTitle
    );
  
    if (isDuplicate) {
      alert("This Pre Course Data  has already been submitted.");
      return;
    }
  
    setConfirmationModal(true); // Show confirmation modal
    setShowModal(false)
  };
  
  const confirmSubmit = async () => {
    setConfirmationModal(false);
  
    const data = {
      selectedCourse,
      selectedTitle,
      selectedMaintitle,
      students,
      year: formData.year,
      targetYearPreCourse: formData.targetYearPreCourse
        ? `${formData.targetYearPreCourse[0]?.toISOString().slice(0, 10)} to ${
            formData.targetYearPreCourse[1]?.toISOString().slice(0, 10)
          }`
        : "",
      targetYearMainCourse: formData.targetYearMainCourse
        ? `${formData.targetYearMainCourse[0]?.toISOString().slice(0, 10)} to ${
            formData.targetYearMainCourse[1]?.toISOString().slice(0, 10)
          }`
        : "",
    };
  
    try {
      const res = await fetch("/api/Student", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
  
      const result = await res.json();
  
      if (result.success) {
        alert("Data submitted successfully!");
        setShowModal(false);
        router.push("/pre-course-students");
      } else {
        alert("Failed to submit data.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Error submitting form.");
    }
  };
  
  
  if (loading) {
    return <div className="flex justify-center items-center h-screen text-xl">Checking access...</div>;
  }

  return (
    <div className='min-h-screen' >
    
      <section className="py-36 px-8 relative">
        <Managecourselist />
        <button
          onClick={() => setShowModal(true)}
          className="w-56 uppercase text-center text-white bg-blue-500 hover:bg-blue-600 focus:outline-none font-medium rounded-lg text-lg px-5 py-3 mb-6 mt-4"
        >
          New Student Register
        </button>
        {showModal && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
            <div className="relative w-full  bg-white rounded-lg shadow-lg overflow-y-scroll h-[100vh] p-8">
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-red-500 hover:text-red-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <h2 className="w-full uppercase text-center text-gray-900 text-4xl font-bold font-manrope leading-normal">
                Student Registration
              </h2>
              <form onSubmit={handleSubmit} className="w-full lg:p-11 md:p-8 p-7 bg-white rounded-3xl shadow-lg flex-col">
                <div className="w-full flex-col gap-8">
                  <div className="w-full flex gap-8">
                    <div className="w-full">
                      <select
                        id="course"
                        name="course"
                        value={selectedCourse}
                        onChange={handleCourseChange}
                        className="w-full text-lg px-5 py-3 rounded-lg border border-gray-200"
                      >
                        <option value="">Select Course</option>
                        {coursesList.map((course) => (
                          <option key={course._id} value={course.courseName}>
                            {course.courseName}
                          </option>
                        ))}
                      </select>
                      {errors.selectedCourse && <p className="text-red-500">{errors.selectedCourse}</p>}
                    </div>
                    <div className="w-full">
                      <select
                        id="title"
                        name="title"
                        value={selectedTitle}
                        onChange={handleTitleChange}
                        className="w-full text-lg px-5 py-3 rounded-lg border border-gray-200"
                        disabled={!titles.length}
                      >
                        <option value="">Select Pre Course Serial No</option>
                        {titles.map((title) => (
                          <option key={title._id} value={title.name}>
                            {title.name}
                          </option>
                        ))}
                      </select>
                      {errors.selectedTitle && <p className="text-red-500">{errors.selectedTitle}</p>}
                    </div>
                    <div className="w-full">
                      <select
                        id="maintitle"
                        name="maintitle"
                        value={selectedMaintitle}
                        onChange={handleMaintitleChange}
                        className="w-full text-lg px-5 py-3 rounded-lg border border-gray-200"
                        disabled={!maintitles.length}
                      >
                        <option value="">Select Main Course Serial No</option>
                        {maintitles.map((maintitle) => (
                          <option key={maintitle._id} value={maintitle.name}>
                            {maintitle.name}
                          </option>
                        ))}
                      </select>
                      {errors.selectedMaintitle && <p className="text-red-500">{errors.selectedMaintitle}</p>}
                    </div>
                    <div className="w-full">
  <select
    value={formData.year}
    onChange={handleChange}
    id="year"
    name="year"
    className="w-full text-lg px-5 py-3 rounded-lg border border-gray-200"
  >
    <option value="">Select Year</option>
    {Array.from({ length: new Date().getFullYear() - 1979 }, (_, i) => {
      const startYear = 1980 + i;
      const endYear = startYear + 1;
      return `${startYear}-${endYear.toString().slice(-2)}`;
    }).map((year) => (
      <option key={year} value={year}>
        {year}
      </option>
    ))}
  </select>
  {errors.year && <p className="text-red-500">{errors.year}</p>}
</div>

                    <div className="w-full -mt-6">
                    <label htmlFor="preCourseDuration" className="text-xs  font-medium">Pre Course Duration</label>
                    <DatePicker
                      selected={formData.targetYearPreCourse[0]}
                      onChange={handlePreCourseDurationChange}
                      startDate={formData.targetYearPreCourse[0]}
                      endDate={formData.targetYearPreCourse[1]}
                      selectsRange
                      placeholderText="Select Course Duration (Pre Course)"
                      className="w-full text-lg px-5 py-1 rounded-lg border border-gray-200"
                      customInput={(
                        <input
                          className="w-full text-sm px-5 py-1 rounded-lg border border-gray-200"
                          style={{ fontSize: '0.675rem',fontWeight:'bold' }} // Tailwind's text-sm equivalent
                        />
                      )}
                    />
                      {errors.targetYearPreCourse && <p className="text-red-500">{errors.targetYearPreCourse}</p>}
                  </div>

                  <div className="w-full -mt-6">
  <label htmlFor="preCourseDuration" className="text-xs font-medium">Main Course Duration</label>
  <DatePicker
    selected={formData.targetYearMainCourse[0]}
    onChange={(dates) => setFormData({ ...formData, targetYearMainCourse: dates })}
    startDate={formData.targetYearMainCourse[0]}
    endDate={formData.targetYearMainCourse[1]}
    selectsRange
    placeholderText="Select Course Duration (Main Course)"
    className="w-full px-5 py-1 rounded-lg border border-gray-200"
    customInput={(
      <input
        className="w-full text-sm px-5 py-1 rounded-lg border border-gray-200"
        style={{ fontSize: '0.675rem',fontWeight:'bold' }} // Tailwind's text-sm equivalent
      />
    )}
  />
  {errors.targetYearMainCourse && <p className="text-red-500">{errors.targetYearMainCourse}</p>}
</div>

                  </div>

                  {students.map((student, index) => (
                    <div key={index} className="flex gap-8 w-full mt-4 mb-4">
                      <div className='flex flex-col w-full' >
                      <input
                        value={student.armyno}
                        onChange={(e) => handleStudentChange(index, e)}
                        type="text"
                        name="armyno"
                        placeholder="Army No."
                        className="w-full text-lg px-5 py-3 rounded-lg border border-gray-200"
                      />
                        {errors[`student_${index}_armyno`] && (
      <p className="text-red-500">{errors[`student_${index}_armyno`]}</p>
    )}
    </div>
    <div className='flex flex-col w-full' >
                     <select
  value={student.rankno}
  onChange={(e) => handleStudentChange(index, e)}
  name="rankno"
  className="w-full text-lg px-5 py-3 h-12 rounded-lg border border-gray-200"
>
  <option value="" disabled>Select Rank</option>
  <option value="RFN">RFN</option>
  <option value="LNK">LNK</option>
  <option value="LHAV">LHAV</option>
  <option value="NK">NK</option>
  <option value="HAV">HAV</option>
  <option value="NB SUB">NB SUB</option>
  <option value="SUB">SUB</option>
  <option value="SUB MAJ">SUB MAJ</option>
</select>
{errors[`student_${index}_rankno`] && (
      <p className="text-red-500">{errors[`student_${index}_rankno`]}</p>
    )}
</div>
<div className='flex flex-col w-full' >
                      <input
                        value={student.name}
                        onChange={(e) => handleStudentChange(index, e)}
                        type="text"
                        name="name"
                        placeholder="Name"
                        className="w-full text-lg px-5 py-3 rounded-lg border border-gray-200"
                      />
                        {errors[`student_${index}_name`] && (
      <p className="text-red-500">{errors[`student_${index}_name`]}</p>
    )}
    </div>
    <div className='flex flex-col w-full' >
                       <select
  value={student.unitno}
  onChange={(e) => handleStudentChange(index, e)}
  name="unitno"
  className="w-full text-lg px-5 py-3 h-12 rounded-lg border border-gray-200"
>
  <option value="" disabled>Select Unit</option>
  <option value="1/3 GR">1/3 GR</option>
  <option value="2/3 GR">2/3 GR</option>
  <option value="3/3 GR">3/3 GR</option>
  <option value="4/3 GR">4/3 GR</option>
  <option value="5/3 GR">5/3 GR</option>
  <option value="1/9 GR">1/9 GR</option>
  <option value="2/9 GR">2/9 GR</option>
  <option value="3/9 GR">3/9 GR</option>
  <option value="4/9 GR">4/9 GR</option>
  <option value="5/9 GR">5/9 GR</option>
  <option value="32 GR">32 GR</option>
  <option value="137 CETF">137 CETF</option>
</select>
{errors[`student_${index}_unitno`] && (
      <p className="text-red-500">{errors[`student_${index}_unitno`]}</p>
    )}
    </div>
    <div className='flex flex-col w-full ' >
  <select
    value={student.phase}
    onChange={(e) => handleStudentChange(index, e)}
    name="phase"
    className="w-full text-lg px-5 py-3 h-12 rounded-lg border border-gray-200"
  >
    <option value="" disabled>Select Pre</option>
    <option value="pre1st">Pre 1st</option>
    <option value="pre2nd">Pre 2nd</option>
  </select>
  {errors[`student_${index}_phase`] && (
      <p className="text-red-500">{errors[`student_${index}_phase`]}</p>
    )}
    </div>
  {students.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeStudent(index)}
                        className="text-red-500 text-sm"
                      >
                     ❌
                      </button>
                    )}
                    </div>
                    
                  ))}
                </div>
          


                <div className="w-full">
                  <button
                    type="button"
                    onClick={addAnotherStudent}
                    className="text-lg px-5 py-3 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
                  >
                    Add Another Student
                  </button>
                </div>
                {filteredInstructor && (
  <div className="mt-6 p-4 bg-gray-100 rounded-lg shadow-md">
    <h3 className="text-xl font-semibold text-gray-800 mb-4">
      Instructor Availability
    </h3>
    <table className="min-w-full border-collapse border border-gray-300 text-gray-800">
      <thead>
        <tr className="bg-gray-200">
          {/* <th className="border border-gray-300 px-4 py-2 text-left">Select</th> */}
          <th className="border border-gray-300 px-4 py-2 text-left">Name</th>
          <th className="border border-gray-300 px-4 py-2 text-left">Availability</th>
        </tr>
      </thead>
      <tbody>
      {filteredInstructor.map((instructor) => (
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
                <div className="w-full mt-4">
                  <button
                    type="submit"
                    className="w-full text-center text-white bg-blue-500 hover:bg-blue-600 focus:outline-none font-medium rounded-lg text-lg px-5 py-3"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
         {confirmationModal && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-96">
              <h3 className="text-lg font-bold mb-4">Confirm Submission</h3>
              <p>Are you sure you want to submit the form?</p>
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => setConfirmationModal(false)}
                  className="px-4 py-2 bg-gray-400 rounded mr-2"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmSubmit}
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
      <ToastContainer />
    </div>
  );
};

export default Precourseregistration;
