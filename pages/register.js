/* eslint-disable react-hooks/rules-of-hooks */

/* eslint-disable @next/next/no-img-element */
import React from 'react'
import { useRouter } from 'next/router';
import { useState } from 'react'
import { useEffect } from 'react'
import Link from 'next/link';
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import Head from 'next/head'
import { FaEye,FaEyeSlash } from 'react-icons/fa';

const Signup = ({userData}) => {
  const router = useRouter()
  const [loading, setLoading] = useState(true);
  const [passwordVisible, setPasswordVisible] = useState(false);
  useEffect(() => {
    if (!userData) return; // Wait until userData is available

    if (userData?.selectedCourse !== "MASTER ADMIN") {
      router.push("/");
    } else {
      setLoading(false); // Stay on the page if the user is MASTER ADMIN
    }
  }, [userData, router]);
  const backgroundStyle = {
    backgroundImage: 'url(https://readymadeui.com/background-image.webp)',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
  };

  useEffect(() => {
    if (localStorage.getItem('token')) {
      router.push('/')
    }
  }, [])

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [selectedCourse, setSelectedCourse] = useState('')
  const [coursesList, setCoursesList] = useState([]);

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

  const handleChange = (e) => {
    if (e.target.name === 'name') {
      setName(e.target.value)
    }
    else if (e.target.name === 'email') {
      setEmail(e.target.value)
    }
    else if (e.target.name === 'password') {
      setPassword(e.target.value)
    }
    else if (e.target.name === 'course') {
      setSelectedCourse(e.target.value)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const data = { name, email, password, selectedCourse, }

    let res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    let response = await res.json()
    console.log(response)
    router.push('/login')
    setEmail('')
    setName('')
    setPassword('')
    toast.success('Your account has been created!', {
      position: "top-left",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  }
  if (loading) {
    return <div className="flex justify-center items-center h-screen text-xl">Checking access...</div>;
  }
  return (
    <div>
      <Head>
        <title>39-GTC Signup</title>
        <meta name="viewport" content="width=device-width, height=device-height, initial-scale=1.0, maximum-scale=1.0" />
        <link rel="icon" href="/rk1.ico" />
      </Head>
      <ToastContainer
        position="top-left"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div
        className="flex justify-center items-center font-[sans-serif] text-[#333] h-full min-h-screen p-4"
        style={backgroundStyle}
      >
        <div className="max-w-md w-full mx-auto">
          <form onSubmit={handleSubmit} method="POST" className="bg-opacity-70 bg-white rounded-2xl p-6 shadow-[0_2px_16px_-3px_rgba(6,81,237,0.3)]">
            <div className="mb-10">
              <h3 className="text-3xl font-extrabold">Sign Up</h3>
            </div>
            <div>
              <div className="relative flex items-center">
                <input name="name" onChange={handleChange}
                  type="text"
                  value={name} required
                  className="bg-transparent w-full text-sm border-b border-[#333] px-2 py-3 outline-none placeholder:text-[#333]"
                  placeholder="Enter Name" />
              </div>
            </div>
            <div>
              <div className="relative flex items-center mt-8">
                <input name="email" onChange={handleChange}
                  type="email"
                  value={email} required
                  className="bg-transparent w-full text-sm border-b border-[#333] px-2 py-3 outline-none placeholder:text-[#333]"
                  placeholder="Enter email" />
              </div>
            </div>
            <div className="mt-8">
              <select
                name="course"
                value={selectedCourse}
                onChange={handleChange}
                required
                className="bg-transparent w-full text-sm border-b border-[#333] px-2 py-3 outline-none placeholder:text-[#333]"
              >
                <option value="">Select Course</option>
                {coursesList.map((course, index) => (
                  <option key={index} value={course.courseName}>{course.courseName}</option>
                ))}
                <option value="MASTER ADMIN">MASTER ADMIN</option> {/* Added option for Master Admin */}
              </select>
            </div>
            <div className="mt-8">
              <div className="relative flex items-center">
                <input name="password" onChange={handleChange}
                  type={passwordVisible ? 'text' : 'password'}
                  value={password} required
                  className="bg-transparent w-full text-sm border-b border-[#333] px-2 py-3 outline-none placeholder:text-[#333]"
                  placeholder="Enter password" />
                  <div className='absolute right-2 cursor-pointer'
                  onClick={() => setPasswordVisible(!passwordVisible) }
                  >
                    {passwordVisible? <FaEyeSlash/> : <FaEye/> }
                  </div>
              </div>
            </div>

          

            <div className="mt-10">
              <button
                type="Submit"
                className="w-full py-2.5 px-4 text-sm font-semibold rounded-full text-white bg-[#333] hover:bg-[#222] focus:outline-none"
              >
                Sign Up
              </button>
              <p className="text-sm text-center mt-6">Don't have an account <a href='/login'
                className="font-semibold hover:underline ml-1 whitespace-nowrap">Register here</a></p>
            </div>
            <hr className="my-6 border-gray-500" />
          </form>
        </div>
      </div>
    </div>
  )
}

export default Signup
