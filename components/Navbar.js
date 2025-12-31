import Link from "next/link";
import { FaSignOutAlt, FaSignInAlt } from 'react-icons/fa';
import { ImMenu } from 'react-icons/im';
import { AiFillCloseCircle } from 'react-icons/ai';
import { RiAccountCircleFill, RiListSettingsFill } from 'react-icons/ri';
import { BsPersonPlus, BsCardChecklist } from 'react-icons/bs';
import { MdAssessment, MdInsertChart } from 'react-icons/md';
import React, { useState, useEffect } from 'react';

function Navbar({ logout, user, classname,selectedCourse }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
console.log("selectedcourse",selectedCourse)
  // Automatically open the sidebar on large screens (lg and above)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);

    // Initial check
    handleResize();

    // Cleanup on component unmount
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close the sidebar when a menu item is clicked
  const handleMenuClick = () => {
    setSidebarOpen(false);
  };

  return (
    <header className={classname}>
      <nav className="flex items-center justify-between p-4 bg-[#0f2812] text-white">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <img src="/logo.png" className="h-10" alt="Logo" />
          <span className="text-lg font-bold">39-Gorkha Training Centre</span>
        </div>

        {/* Menu Toggle */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="text-white text-2xl  focus:outline-none"
        >
          <ImMenu />
        </button>
      </nav>

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-96 bg-gray-800 text-white transition-transform ${
          sidebarOpen ? "translate-y-0" : "-translate-y-full"
        } z-50 overflow-y-auto`} 
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 bg-green-600">
          <h2 className="text-xl font-semibold">Menu</h2>
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-red-600 text-2xl focus:outline-none"
          >
            <AiFillCloseCircle />
          </button>
        </div>

        {/* Sidebar Links */}
        {selectedCourse === "MASTER ADMIN" ? (
        <ul className="mt-4 space-y-4 p-4">
        <li>
            <Link
              href="/phase2"
              onClick={handleMenuClick}
              className="flex items-center space-x-2 hover:bg-green-700 p-2 rounded"
            >
              <BsPersonPlus />
              <span>Home</span>
            </Link>
          </li>
          <li>
            <Link
              href="/aboutus"
              onClick={handleMenuClick}
              className="flex items-center space-x-2 hover:bg-green-700 p-2 rounded"
            >
              <BsPersonPlus />
              <span>About Us</span>
            </Link>
          </li>
          <li>
            <Link
              href="/searchdata"
              onClick={handleMenuClick}
              className="flex items-center space-x-2 hover:bg-green-700 p-2 rounded"
            >
              <BsPersonPlus />
              <span>Search Data</span>
            </Link>
          </li>
          <li>
            <Link
              href="/pre-course-registration"
              onClick={handleMenuClick}
              className="flex items-center space-x-2 hover:bg-green-700 p-2 rounded"
            >
              <BsPersonPlus />
              <span>Pre Course Registration</span>
            </Link>
          </li>
          <li>
            <Link
              href="/pre-course-students"
              onClick={handleMenuClick}
              className="flex items-center space-x-2 hover:bg-green-700 p-2 rounded"
            >
              <BsCardChecklist />
              <span>Pre Course Students</span>
            </Link>
          </li>
          <li>
            <Link
              href="/add-pre-course-performance"
              onClick={handleMenuClick}
              className="flex items-center space-x-2 hover:bg-green-700 p-2 rounded"
            >
              <MdAssessment />
              <span className="" >Add Pre Course Performance</span>
            </Link>
          </li>
          <li>
            <Link
              href="/compiled-result"
              onClick={handleMenuClick}
              className="flex items-center space-x-2 hover:bg-green-700 p-2 rounded"
            >
              <MdInsertChart />
              <span>Compiled Result</span>
            </Link>
          </li>
          <li>
            <Link
              href="/main-course-selection"
              onClick={handleMenuClick}
              className="flex items-center space-x-2 hover:bg-green-700 p-2 rounded"
            >
              <RiListSettingsFill />
              <span>Main Course Selection</span>
            </Link>
          </li>
          <li>
            <Link
              href="/maincoursestudent"
              onClick={handleMenuClick}
              className="flex items-center space-x-2 hover:bg-green-700 p-2 rounded"
            >
              <RiAccountCircleFill />
              <span>Main Course Students</span>
            </Link>
          </li>
          <li>
            <Link
              href="/unitwiseperformance"
              onClick={handleMenuClick}
              className="flex items-center space-x-2 hover:bg-green-700 p-2 rounded"
            >
              <MdAssessment />
              <span>Unit Wise Performance</span>
            </Link>
          </li>
          <li>
            <Link
              href="/viewcourses"
              onClick={handleMenuClick}
              className="flex items-center space-x-2 hover:bg-green-700 p-2 rounded"
            >
              <MdAssessment />
              <span>View Course</span>
            </Link>
          </li>
          <li>
            <Link
              href="/addcourses"
              onClick={handleMenuClick}
              className="flex items-center space-x-2 hover:bg-green-700 p-2 rounded"
            >
              <MdAssessment />
              <span>Add Course</span>
            </Link>
          </li>
          <li>
            <Link
              href="/chartdata"
              onClick={handleMenuClick}
              className="flex items-center space-x-2 hover:bg-green-700 p-2 rounded"
            >
              <MdAssessment />
              <span>View Course Analysis</span>
            </Link>
          </li>
          <li>
            <Link
              href="/miscellaneousdata"
              onClick={handleMenuClick}
              className="flex items-center space-x-2 hover:bg-green-700 p-2 rounded"
            >
              <RiListSettingsFill />
              <span>Miscellaneous Data</span>
            </Link>
          </li>
          <li>
            <Link
              href="/instructor-details"
              onClick={handleMenuClick}
              className="flex items-center space-x-2 hover:bg-green-700 p-2 rounded"
            >
              <MdAssessment />
              <span>Instructor Details</span>
            </Link>
          </li>
          <li>
            <Link
              href="/register"
              onClick={handleMenuClick}
              className="flex items-center space-x-2 hover:bg-green-700 p-2 rounded"
            >
              <MdAssessment />
              <span>Create User</span>
            </Link>
          </li>
          <li>
            <Link
              href="/managepassword"
              onClick={handleMenuClick}
              className="flex items-center space-x-2 hover:bg-green-700 p-2 rounded"
            >
              <MdAssessment />
              <span>Manage Password</span>
            </Link>
          </li>
          <li>
            <Link
              href="/backupdata"
              onClick={handleMenuClick}
              className="flex items-center space-x-2 hover:bg-green-700 p-2 rounded"
            >
              <MdAssessment />
              <span>Backup Data</span>
            </Link>
          </li>
          <li>
            <Link
              href="/password"
              onClick={handleMenuClick}
              className="flex items-center space-x-2 hover:bg-green-700 p-2 rounded"
            >
              <MdAssessment />
              <span>Delete Password</span>
            </Link>
          </li>
          <li>
            <Link
              href="/latestnews"
              onClick={handleMenuClick}
              className="flex items-center space-x-2 hover:bg-green-700 p-2 rounded"
            >
              <MdAssessment />
              <span>Latest News</span>
            </Link>
          </li>
        </ul>
          ) : (
            <ul className="mt-4 space-y-4 p-4">
            <li>
            <Link
  href={`/phase1/courses?selectedCourse=${selectedCourse}`} // Pass selectedCourse as query param
  onClick={handleMenuClick}
  className="flex items-center space-x-2 hover:bg-green-700 p-2 rounded"
>
  <MdAssessment />
  <span>View Course</span>
</Link>

<li>
            <Link
              href="/aboutus"
              onClick={handleMenuClick}
              className="flex items-center space-x-2 hover:bg-green-700 p-2 rounded"
            >
              <BsPersonPlus />
              <span>About Us</span>
            </Link>
          </li>

            </li>
            </ul>
          )}

        {/* Logout/Login */}
        <div className="mt-auto p-4">
          {user?.value ? (
            <button
              onClick={logout}
              className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white w-full py-2 px-4 rounded"
            >
              <FaSignOutAlt />
              <span>Logout</span>
            </button>
          ) : (
            <Link href="/login" className="block">
              <button className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white w-full py-2 px-4 rounded">
                <FaSignInAlt />
                <span>Login</span>
              </button>
            </Link>
          )}
        </div>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed top-0 left-0 w-full h-full bg-black opacity-50 z-40"
        ></div>
      )}
    </header>
  );
}

export default Navbar;
