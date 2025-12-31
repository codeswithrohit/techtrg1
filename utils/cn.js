import React, { useState, useEffect } from "react";
import { FiPlusCircle, FiX, FiEdit, FiTrash, FiEye } from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";
import { firebase } from "@/Firebase/config";
import AdminNavbar from "../../components/AdminNavbar";

const Addcourses = () => {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  
  const [courseData, setCourseData] = useState({
    title: "",
    lectures: [],
  });

  const [uploading, setUploading] = useState({});
  const [uploadProgress, setUploadProgress] = useState({});

  const handleTopicChange = (e, index) => {
    const { value } = e.target;
    setCourseData((prevCourseData) => {
      const updatedLectures = prevCourseData.lectures.map((topic, i) => {
        if (i === index) {
          return { ...topic, title: value };
        }
        return topic;
      });
      return { ...prevCourseData, lectures: updatedLectures };
    });
  };

  const handleLecturesChange = (e, topicIndex, lecturesIndex, field) => {
    const { value } = e.target;
    setCourseData((prevCourseData) => {
      const updatedLectures = [...prevCourseData.lectures];
      updatedLectures[topicIndex].lectures = updatedLectures[topicIndex].lectures.map(
        (lecture, idx) => {
          if (idx === lecturesIndex) {
            return { ...lecture, [field]: value };
          }
          return lecture;
        }
      );
      return { ...prevCourseData, lectures: updatedLectures };
    });
  };

  const handleAddTopic = () => {
    setCourseData((prevCourseData) => ({
      ...prevCourseData,
      lectures: [...prevCourseData.lectures, { title: "", lectures: [] }],
    }));
  };

  const handleAddLecture = (topicIndex) => {
    setCourseData((prevCourseData) => {
      const updatedLectures = [...prevCourseData.lectures];
      const topic = updatedLectures[topicIndex];
      if (!topic.lectures || topic.lectures.length === 0) {
        topic.lectures = [{ title: "", videoLink: "" }];
      } else {
        const lastLecture = topic.lectures[topic.lectures.length - 1];
        if (!lastLecture.title && !lastLecture.videoLink) return prevCourseData;
        topic.lectures.push({ title: "", videoLink: "" });
      }
      return { ...prevCourseData, lectures: updatedLectures };
    });
  };

  const handleRemoveTopic = (index) => {
    setCourseData((prevCourseData) => {
      const updatedLectures = [...prevCourseData.lectures];
      updatedLectures.splice(index, 1);
      return { ...prevCourseData, lectures: updatedLectures };
    });
  };

  const handleRemoveLecture = (topicIndex, lectureIndex) => {
    setCourseData((prevCourseData) => {
      const updatedLectures = [...prevCourseData.lectures];
      updatedLectures[topicIndex].lectures.splice(lectureIndex, 1);
      setUploading((prevUploading) => {
        const updatedUploading = { ...prevUploading };
        delete updatedUploading[`${topicIndex}-${lectureIndex}`];
        return updatedUploading;
      });
      setUploadProgress((prevProgress) => {
        const updatedProgress = { ...prevProgress };
        delete updatedProgress[`${topicIndex}-${lectureIndex}`];
        return updatedProgress;
      });
      return { ...prevCourseData, lectures: updatedLectures };
    });
  };

  const handleFileChange = (event, topicIndex, lectureIndex) => {
    const file = event.target.files[0];
    if (!file) return;

    const uploadKey = `${topicIndex}-${lectureIndex}`;

    setUploading((prevUploading) => ({
      ...prevUploading,
      [uploadKey]: true,
    }));

    setUploadProgress((prevProgress) => ({
      ...prevProgress,
      [uploadKey]: 0,
    }));

    const storageRef = firebase.storage().ref();
    const fileRef = storageRef.child(`lectureVideos/${file.name}`);
    const uploadTask = fileRef.put(file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress((prevProgress) => ({
          ...prevProgress,
          [uploadKey]: progress,
        }));
      },
      (error) => {
        console.error("Error uploading file:", error);
        setUploading((prevUploading) => ({
          ...prevUploading,
          [uploadKey]: false,
        }));
      },
      () => {
        uploadTask.snapshot.ref.getDownloadURL().then((url) => {
          console.log("Download URL:", url);
          updateVideoLink(url, topicIndex, lectureIndex);
          setUploading((prevUploading) => ({
            ...prevUploading,
            [uploadKey]: false,
          }));
          toast.success("File uploaded successfully!");
        });
      }
    );
  };

  const updateVideoLink = (url, topicIndex, lectureIndex) => {
    setCourseData((prevCourseData) => {
      const updatedLectures = [...prevCourseData.lectures];
      updatedLectures[topicIndex].lectures[lectureIndex] = {
        ...updatedLectures[topicIndex].lectures[lectureIndex],
        videoLink: url,
      };
      return { ...prevCourseData, lectures: updatedLectures };
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourseData({ ...courseData, [name]: value });
  };

  const validateForm = () => {
    if (!courseData.title || courseData.lectures.length === 0) {
      toast.error("Title and at least one lecture are required.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (selectedCourse) {
      await updateCourseInMongoDB();
    } else {
      await addCourseToMongoDB();
    }
  };

  const addCourseToMongoDB = async () => {
    let oid = Math.floor(Math.random() * Date.now());
    try {
      const orderData = {
        courses: courseData,
        orderId: oid,
      };

      const response = await fetch("/api/addcourses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log("Order Id:", responseData);
        toast.success("Course added successfully!");
        setCourseData({ title: "", lectures: [] });
        fetchCourses();
      } else {
        const errorMessage = await response.text();
        console.error("Failed to submit order:", errorMessage);
        toast.error("Failed to submit order. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting order to MongoDB:", error);
      toast.error("Failed to submit order. Please try again.");
    }
  };

  const updateCourseInMongoDB = async () => {
    try {
      const response = await fetch(`/api/updatecourse/${selectedCourse._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ courses: courseData }),
      });

      if (response.ok) {
        toast.success("Course updated successfully!");
        setCourseData({ title: "", lectures: [] });
        setSelectedCourse(null);
        setShowForm(false);
        fetchCourses();
      } else {
        const errorMessage = await response.text();
        console.error("Failed to update course:", errorMessage);
        toast.error("Failed to update course. Please try again.");
      }
    } catch (error) {
      console.error("Error updating course in MongoDB:", error);
      toast.error("Failed to update course. Please try again.");
    }
  };

  const handleDeleteCourse = async (courseId) => {
    try {
      const response = await fetch(`/api/deletecourse?id=${courseId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        toast.success("Course deleted successfully!");
        fetchCourses(); // Refresh the course list after deletion
      } else {
        const errorMessage = await response.text();
        console.error("Failed to delete course:", errorMessage);
        toast.error("Failed to delete course. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting course from MongoDB:", error);
      toast.error("Failed to delete course. Please try again.");
    }
  };

  const handleEditCourse = (course) => {
    setSelectedCourse(course);
    setCourseData(course.courses);
    setShowForm(true);
  };

  const handleViewCourse = (course) => {
    router.push(`/admin/viewcourse/${course._id}`);
  };

  const fetchCourses = async () => {
    try {
      const userToken = JSON.parse(localStorage.getItem("myuser")).token;

      const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/mycourses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: userToken }),
      });

      if (res.ok) {
        const data = await res.json();
        setCourses(data.orders);
      } else {
        console.error("Failed to fetch orders:", res.statusText);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("myuser")) {
      fetchCourses();
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-white" >
      <AdminNavbar/>
      <div className="lg:ml-64 container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Manage Courses</h1>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Cancel" : "Add Course"}
        </button>
        {showForm && (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">Course Title:</label>
              <input
                type="text"
                name="title"
                value={courseData.title}
                onChange={handleChange}
                className="border border-gray-300 rounded p-2 w-full"
                required
              />
            </div>
            {courseData.lectures.map((topic, topicIndex) => (
              <div key={topicIndex} className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">Topic Title:</label>
                <div className="flex items-center">
                  <input
                    type="text"
                    name="topicTitle"
                    value={topic.title}
                    onChange={(e) => handleTopicChange(e, topicIndex)}
                    className="border border-gray-300 rounded p-2 flex-grow"
                    required
                  />
                  <button
                    type="button"
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-2"
                    onClick={() => handleRemoveTopic(topicIndex)}
                  >
                    <FiX />
                  </button>
                </div>
                <div className="mt-2">
                  <label className="block text-gray-700 font-bold mb-2">Lectures:</label>
                  {topic.lectures.map((lecture, lectureIndex) => (
                    <div key={lectureIndex} className="mb-2">
                      <div className="flex items-center mb-2">
                        <input
                          type="text"
                          name="lectureTitle"
                          value={lecture.title}
                          onChange={(e) => handleLecturesChange(e, topicIndex, lectureIndex, "title")}
                          placeholder="Lecture Title"
                          className="border border-gray-300 rounded p-2 flex-grow mr-2"
                          required
                        />
                        <button
                          type="button"
                          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                          onClick={() => handleRemoveLecture(topicIndex, lectureIndex)}
                        >
                          <FiX />
                        </button>
                      </div>
                      <div className="flex items-center mb-2">
                        <input
                          type="file"
                          onChange={(e) => handleFileChange(e, topicIndex, lectureIndex)}
                          className="border border-gray-300 rounded p-2 flex-grow mr-2"
                        />
                        {uploading[`${topicIndex}-${lectureIndex}`] && (
                          <div className="flex items-center">
                            <div className="w-48 bg-gray-200 rounded-full h-2.5 mr-2">
                              <div
                                className="bg-blue-500 h-2.5 rounded-full"
                                style={{ width: `${uploadProgress[`${topicIndex}-${lectureIndex}`]}%` }}
                              ></div>
                            </div>
                            <span>{uploadProgress[`${topicIndex}-${lectureIndex}`].toFixed(2)}%</span>
                          </div>
                        )}
                      </div>
                      {lecture.videoLink && (
                        <div className="mb-2">
                          <label className="block text-gray-700 font-bold mb-2">Video Link:</label>
                          <input
                            type="text"
                            name="videoLink"
                            value={lecture.videoLink}
                            onChange={(e) => handleLecturesChange(e, topicIndex, lectureIndex, "videoLink")}
                            placeholder="Video Link"
                            className="border border-gray-300 rounded p-2 w-full"
                            required
                          />
                        </div>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => handleAddLecture(topicIndex)}
                  >
                    Add Lecture
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={handleAddTopic}
            >
              Add Topic
            </button>
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4"
            >
              {selectedCourse ? "Update Course" : "Submit Course"}
            </button>
          </form>
        )}
        <div className="mt-12 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course, idx) => (
              <div key={idx} className="bg-white rounded-lg shadow-lg overflow-hidden transition-shadow duration-300 hover:shadow-xl">
                <h3 className="text-xl font-bold mb-4 text-center text-gray-900">{course.courses.title}</h3>
                <div className="flex justify-between items-center bg-gray-100 p-4">
                  <button
                    onClick={() => handleEditCourse(course)}
                    className="flex items-center bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 focus:outline-none"
                  >
                    <FiEdit className="mr-2" />
                  </button>
                  <button
                    onClick={() => handleDeleteCourse(course._id)}
                    className="flex items-center bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 focus:outline-none"
                  >
                    <FiTrash className="mr-2" />
                  </button>
                </div>
                <div className="p-6">

                  {course.courses.lectures.map((topic, topicIdx) => (
                    <div key={topicIdx} className="mb-4">
                      <h4 className="font-semibold text-gray-800 mb-2">{topic.title}</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {topic.lectures.map((lecture, lectureIdx) => (
                          <li key={lectureIdx} className="text-gray-700 flex items-center justify-between">
                            <span className="font-medium">{lecture.title}</span>
                            <a href={lecture.videoLink} target="_blank" rel="noopener noreferrer" className="ml-2 text-blue-500 hover:underline flex items-center">
                              <FiEye className="inline-block mr-1" />
                              View
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

              </div>
            ))}
          </div>
        </div>

        <ToastContainer />
      </div>
    </div>
  );
};

export default Addcourses;
