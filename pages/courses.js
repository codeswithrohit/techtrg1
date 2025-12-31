import React, { useState, useEffect } from "react";
import { FiLoader } from "react-icons/fi";
import { useRouter } from "next/router";
import OURCOURSES from '@/components/OurCourses';

const Courses = ({ files,userData }) => {
  const [activeTab, setActiveTab] = useState("");
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
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

  useEffect(() => {
    const fetchCourses = async () => {
      // Simulate fetch operation, replace with your logic
      setCourses(files);
      
      // Set the initial active tab to the first unique mainname
      const uniqueMainnames = Array.from(new Set(files.map(course => course.mainname)));
      setActiveTab(uniqueMainnames[0] || ""); // Ensure we have a valid initial tab
    };

    fetchCourses();
  }, [files]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  // Get unique mainnames for tabs
  const uniqueMainnames = Array.from(new Set(courses.map(course => course.mainname)));
  
  // Filter courses based on the active tab
  const filteredCourses = courses.filter(course => course.mainname === activeTab);
  if (loading) {
    return <div className="flex justify-center items-center h-screen text-xl">Checking access...</div>;
  }
  return (
    <div className='min-h-screen bg-white'>
      <div className="flex justify-center items-center h-96" style={{
        backgroundImage: `url('course-head-img.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        width: '1400px',
        height: '300px',
        position: 'relative',
      }}>
    <div className="w-full  mx-auto">
  <ul className="flex justify-center mt-24 overflow-x-auto font-sans">
    {uniqueMainnames.map((mainname) => (
      <li
        key={mainname}
        onClick={() => handleTabClick(mainname)}
        className={`h-[80px] flex flex-col justify-center text-center font-army px-10 cursor-pointer whitespace-nowrap ${
          activeTab === mainname ? 'text-white bg-[#739072]' : 'text-[#739072] bg-white'
        } hover:bg-[#739072] hover:text-white`}
      >
        {mainname}
      </li>
    ))}
  </ul>
</div>


      </div>

      <div className="max-w-6xl mx-auto p-8">
        {/* Display OURCOURSES component with filtered courses data */}
        <OURCOURSES courses={filteredCourses} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default Courses;
