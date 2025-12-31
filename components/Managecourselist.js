import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
const Managecourselist = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [courseName, setCourseName] = useState('');
  const [titles, setTitles] = useState(['']);
  const [maintitles, setMainTitles] = useState(['']);
  const [aside, setAside] = useState([{ test: '', mark: '' }]);
  const [xside, setXside] = useState([{ test: '', mark: '' }]);
  const [courseslist, setCourseslist] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editCourseId, setEditCourseId] = useState(null);
  const [showCourseList, setShowCourseList] = useState(false);
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const fetchPassword = async () => {
    try {
      const res = await axios.get("/api/password");
      setPassword(res.data?.password || "No password found");
      setMessage("");
    } catch (error) {
      setMessage("Error fetching password");
    }
  };
  useEffect(() => {
    fetchPassword();
  }, []);
  useEffect(() => {
    // Fetch courses when the component mounts or list changes
    if (showCourseList) fetchCourses();
  }, [showCourseList]);

  const fetchCourses = async () => {
    try {
      const res = await fetch('/api/fetchcourselist');
      const result = await res.json();
      if (result.success) {
        setCourseslist(result.data);
      } else {
        toast.error('Failed to fetch courses.');
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast.error('An error occurred. Please try again.');
    }
  };


  const addAnotherTitle = () => {
    setTitles([...titles, '']);
  };
  const addAnotherMainTitle = () => {
    setMainTitles([...maintitles, '']);
  };

  const removeTitle = (index) => {
    const updatedTitles = titles.filter((_, i) => i !== index);
    setTitles(updatedTitles);
  };
  const removeMainTitle = (index) => {
    const updatedMainTitles = maintitles.filter((_, i) => i !== index);
    setMainTitles(updatedMainTitles);
  };
  const handleTitleChange = (index, value) => {
    const updatedTitles = [...titles];
    updatedTitles[index] = value.toUpperCase(); // Convert to uppercase
    setTitles(updatedTitles);
  };
  const handleMainTitleChange = (index, value) => {
    const updatedMainTitles = [...maintitles];
    updatedMainTitles[index] = value.toUpperCase(); // Convert to uppercase
    setMainTitles(updatedMainTitles);
  };

  const addAnotherAside = () => {
    setAside([...aside, { test: '', mark: '' }]);
  };
  const addAnotherXside = () => {
    setXside([...xside, { test: '', mark: '' }]);
  };

  const handleAsideChange = (index, field, value) => {
    const updatedAside = [...aside];
    updatedAside[index][field] = field === 'test' ? value.toUpperCase() : value; // Convert test to uppercase
    setAside(updatedAside);
  };

  const handleXsideChange = (index, field, value) => {
    const updatedXside = [...xside];
    updatedXside[index][field] = field === 'test' ? value.toUpperCase() : value; // Convert test to uppercase
    setXside(updatedXside);
  };


  const removeAside = (index) => {
    setAside(aside.filter((_, i) => i !== index));
  };

  const removeXside = (index) => {
    setXside(xside.filter((_, i) => i !== index));
  };
  const calculateTotal = (section) => {
    return section.reduce((sum, item) => sum + (parseInt(item.mark) || 0), 0);
  };
  const openEditPopup = (course) => {
    setCourseName(course.courseName);
    setTitles(course.titles.map(titleObj => titleObj.name));
    setMainTitles(course.maintitles.map(titleObj => titleObj.name));
    setAside(course.aside || [{ test: '', mark: '' }]);
    setXside(course.xside || [{ test: '', mark: '' }]);
    setEditCourseId(course._id);
    setEditMode(true);
    setShowPopup(true);
  };

  

  const handleSubmit = async () => {
    const courseData = {
      courseName: courseName.toUpperCase(),
      titles: titles.map(title => title.trim().toUpperCase()).filter(Boolean),  // Ensure valid strings in uppercase
      maintitles: maintitles.map(maintitle => maintitle.trim().toUpperCase()).filter(Boolean),  // Ensure valid strings in uppercase
      aside: aside.map(item => ({
        test: item.test.toUpperCase(),
        mark: item.mark
      })),
      xside: xside.map(item => ({
        test: item.test.toUpperCase(),
        mark: item.mark
      })),
      asideTotal: calculateTotal(aside),
      xsideTotal: calculateTotal(xside),
    };
  
    try {
      const res = await fetch(editMode ? `/api/editcourselist/${editCourseId}` : '/api/courseslist', {
        method: editMode ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(courseData),
      });
  
      const result = await res.json();
      if (result.success) {
        toast.success(editMode ? 'Course updated successfully!' : 'Course submitted successfully!');
        setShowPopup(false); // Close the popup after successful submission
        fetchCourses(); // Fetch updated course list after adding/editing
        resetForm();
      } else {
        toast.error(editMode ? 'Failed to update course.' : 'Failed to submit course.');
        console.error("Failed response:", result);  // Log the error response
      }
    } catch (error) {
      console.error('Error submitting course:', error);
      toast.error('An error occurred. Please try again.');
    }
  };
  
  
  

  

  const deleteCourse = async (id) => {
    if (!window.confirm('Are you sure you want to delete this course?')) {
      return;
    }
    const enteredPassword = window.prompt("Enter delete password:");
    if (!enteredPassword) {
      toast.error("Password is required to delete the course.");
      return;
    }
  
    if (enteredPassword !== password) {
      toast.error("Incorrect password. Course deletion failed.");
      return;
    }
    try {
      const res = await fetch('/api/deletecourselist', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      const result = await res.json();
      if (result.success) {
        toast.success('Course deleted successfully!');
        setCourseslist(courseslist.filter((course) => course._id !== id));
      } else {
        toast.error('Failed to delete course.');
      }
    } catch (error) {
      console.error('Error deleting course:', error);
      toast.error('An error occurred. Please try again.');
    }
  };
  const resetForm = () => {
    setCourseName('');
    setTitles(['']);
    setMainTitles(['']);
    setAside([{ test: '', mark: '' }]);
    setXside([{ test: '', mark: '' }]);
    setEditCourseId(null);
    setEditMode(false);
  };

  return (
    <div className="relative w-full">
      <ToastContainer />
      <div className="flex justify-end space-x-4 mt-8 ">
      <button
        onClick={() => setShowPopup(true)}
          className="bg-gradient-to-r uppercase from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-lg shadow-md hover:from-blue-600 hover:to-indigo-700 transition-all duration-300"
      >
        Add New Pre Course
      </button>
      <button
          onClick={() => setShowCourseList(!showCourseList)}
          className="bg-gray-900 uppercase text-white px-4 py-2 rounded-lg shadow-md hover:bg-gray-900 transition-all duration-300"
        >
          {showCourseList ? 'Hide Pre Course List' : 'View Pre Course List'}
        </button>
        </div>

      {showPopup && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-60 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full h-full  overflow-y-auto max-h-screen">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">{editMode ? 'Edit Course' : 'Add Course'}</h2>

            <select
  value={courseName}
  onChange={(e) => setCourseName(e.target.value)}
  className="border border-gray-300 p-2 w-full mb-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
>
  <option value="" disabled>Select Course</option>
  <option value="SEC CDR">SEC CDR</option>
  <option value="PC">PC</option>
  <option value="AIBC">AIBC</option>
  <option value="ADC">ADC</option>
  <option value="MTCADRE">MTCADRE</option>
  <option value="CLC">CLC</option>
  <option value="LMC">LMC</option>
  <option value="ATGM">ATGM</option>
  <option value="SNIPER">SNIPER</option>
</select>


            {titles.map((title, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => handleTitleChange(index, e.target.value)}
                  placeholder={`Enter Pre course Serial No. ${index + 1}`}
                  className="border border-gray-300 p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  onClick={() => removeTitle(index)}
                  className="ml-2 text-red-500 text-2xl font-bold hover:text-red-700"
                >
                  x
                </button>
              </div>
            ))}

            <button
              onClick={addAnotherTitle}
              className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition-all duration-300 w-full mb-4"
            >
              Add Another Pre Course Serial No.
            </button>
            {maintitles.map((maintitle, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  type="text"
                  value={maintitle}
                  onChange={(e) => handleMainTitleChange(index, e.target.value)}
                  placeholder={`Enter Main course Serial No. ${index + 1}`}
                  className="border border-gray-300 p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  onClick={() => removeMainTitle(index)}
                  className="ml-2 text-red-500 text-2xl font-bold hover:text-red-700"
                >
                  x
                </button>
              </div>
            ))}

            <button
              onClick={addAnotherMainTitle}
              className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition-all duration-300 w-full mb-4"
            >
              Add Another Main Course Serial No.
            </button>

            
            {aside.map((item, index) => (
              <div key={index} className="flex items-center gap-4 mb-2">
                <input
                  type="text"
                  value={item.test}
                  onChange={(e) => handleAsideChange(index, 'test', e.target.value)}
                  placeholder={`Aside Test ${index + 1}`}
                  className="border border-gray-300 p-2 w-full  rounded-lg"
                />
                <input
                  type="number"
                  value={item.mark}
                  onChange={(e) => handleAsideChange(index, 'mark', e.target.value)}
                  placeholder="Marks"
                  className="border border-gray-300 p-2 w-full rounded-lg"
                />
                <button onClick={() => removeAside(index)} className="text-red-500 font-bold">x</button>
              </div>
            ))}
            <button onClick={addAnotherAside} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-all duration-300 w-full mb-4">Add Another Aside Test</button>
            <div className="text-right mb-4">
              <label>Total Aside Marks: {calculateTotal(aside)}</label>
            </div>

            {xside.map((item, index) => (
              <div key={index} className="flex gap-4 items-center mb-2">
                <input
                  type="text"
                  value={item.test}
                  onChange={(e) => handleXsideChange(index, 'test', e.target.value)}
                  placeholder={`Xside Test ${index + 1}`}
                  className="border border-gray-300 p-2 w-full  rounded-lg"
                />
                <input
                  type="number"
                  value={item.mark}
                  onChange={(e) => handleXsideChange(index, 'mark', e.target.value)}
                  placeholder="Marks"
                  className="border  border-gray-300 p-2 w-full rounded-lg"
                />
                <button onClick={() => removeXside(index)} className="text-red-500 font-bold">x</button>
              </div>
            ))}
            <button onClick={addAnotherXside} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-all duration-300 w-full mb-4">Add Another Xside Test</button>
            <div className="text-right mb-4">
              <label>Total Xside Marks: {calculateTotal(xside)}</label>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                onClick={handleSubmit}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all duration-300"
              >
                {editMode ? 'Update' : 'Submit'}
              </button>
              <button
                onClick={() => setShowPopup(false)}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all duration-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    {showCourseList && (
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Courses List</h2>
        <table className="min-w-full bg-white border border-gray-900">
          <thead>
            <tr>
              <th className="border-b border-gray-900 px-4 py-2 text-center">Course Name</th>
              <th className="border-b border-gray-900 px-4 py-2 text-center">Pre Course Serial No.</th>
              <th className="border-b border-gray-900 px-4 py-2 text-center">Main Course Serial No.</th>
              <th className="border-b border-gray-900 px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {courseslist.map((course, index) => (
              <tr key={course._id}>
                <td className="border-b border-gray-900 px-4 py-2 text-center">{course.courseName}</td>
                <td className="border-b border-gray-900 px-4 py-2 text-center">
                  <ul>
                  {course.titles.map((title, idx) => (
      <li key={idx}>{title.name}</li>  // Display the 'name' property
    ))}
                  </ul>
                </td>
                <td className="border-b border-gray-900 px-4 py-2 text-center">
                  <ul>
                  {course.maintitles.map((maintitle, idx) => (
      <li key={idx}>{maintitle.name}</li>  // Display the 'name' property
    ))}
                  </ul>
                </td>
                <td className="border-b border-gray-900 text-center px-4 py-2 space-x-2">
                  <button
                    onClick={() => openEditPopup(course)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 transition-all duration-300"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteCourse(course._id)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition-all duration-300"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
    </div>
  );
};

export default Managecourselist;
