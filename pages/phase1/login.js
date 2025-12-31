/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @next/next/no-img-element */
import { Router } from 'next/router';
import React, { useEffect } from 'react'
import { useState } from 'react'
import { useRouter } from 'next/router';
import Link from 'next/link';
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import Head from 'next/head'

const Login = () => {
  const backgroundStyle = {
    backgroundImage: 'url(https://readymadeui.com/background-image.webp)',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
  };
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

 useEffect(() => {
  if(localStorage.getItem('myuser')){
    router.push('/')
  } 
 // eslint-disable-next-line react-hooks/exhaustive-deps
 }, [])

  const handleChange = (e) => {
    if (e.target.name == 'email') {
      setEmail(e.target.value)
    }
    else if (e.target.name == 'password') {
      setPassword(e.target.value)
    }

  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    const data = { email, password }

    let res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/login`, {
      method: 'POST', // or 'PUT
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    let response = await res.json()
    console.log(response)
    setEmail('')
    setPassword('')
    if (response.success) {
      localStorage.setItem('myuser', JSON.stringify({token:response.token, email:response.email}))
      toast.success('Your are successfully logged in', {
        position: "top-left",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setTimeout(() => {
        router.push(process.env.NEXT_PUBLIC_HOST)

      }, 1000);

    }
    else {
      toast.error(response.error, {
        position: "top-left",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

    }
  }
  return (
    <div>
       <Head>
      <title>39-GTC Login</title>
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
  <div class="max-w-md w-full mx-auto">
    <form onSubmit={handleSubmit} method="POST" class="bg-opacity-70 bg-white rounded-2xl p-6 shadow-[0_2px_16px_-3px_rgba(6,81,237,0.3)]">
      <div class="mb-10">
        <h3 class="text-3xl font-extrabold">Sign in</h3>
      </div>
      <div>
        <div class="relative flex items-center">
          <input name="email" onChange={handleChange}
                    type="email"
                    value={email} required
            class="bg-transparent w-full text-sm border-b border-[#333] px-2 py-3 outline-none placeholder:text-[#333]"
            placeholder="Enter email" />
          <svg xmlns="http://www.w3.org/2000/svg" fill="#333" stroke="#333" class="w-[18px] h-[18px] absolute right-2"
            viewBox="0 0 682.667 682.667">
            <defs>
              <clipPath id="a" clipPathUnits="userSpaceOnUse">
                <path d="M0 512h512V0H0Z" data-original="#000000"></path>
              </clipPath>
            </defs>
            <g clip-path="url(#a)" transform="matrix(1.33 0 0 -1.33 0 682.667)">
              <path fill="none" stroke-miterlimit="10" stroke-width="40"
                d="M452 444H60c-22.091 0-40-17.909-40-40v-39.446l212.127-157.782c14.17-10.54 33.576-10.54 47.746 0L492 364.554V404c0 22.091-17.909 40-40 40Z"
                data-original="#000000"></path>
              <path
                d="M472 274.9V107.999c0-11.027-8.972-20-20-20H60c-11.028 0-20 8.973-20 20V274.9L0 304.652V107.999c0-33.084 26.916-60 60-60h392c33.084 0 60 26.916 60 60v196.653Z"
                data-original="#000000"></path>
            </g>
          </svg>
        </div>
      </div>
      <div class="mt-8">
        <div class="relative flex items-center">
          <input name="password" onChange={handleChange}
                    type="password"
                    value={password} required
            class="bg-transparent w-full text-sm border-b border-[#333] px-2 py-3 outline-none placeholder:text-[#333]"
            placeholder="Enter password" />
          <svg xmlns="http://www.w3.org/2000/svg" fill="#333" stroke="#333"
            class="w-[18px] h-[18px] absolute right-2 cursor-pointer" viewBox="0 0 128 128">
            <path
              d="M64 104C22.127 104 1.367 67.496.504 65.943a4 4 0 0 1 0-3.887C1.367 60.504 22.127 24 64 24s62.633 36.504 63.496 38.057a4 4 0 0 1 0 3.887C126.633 67.496 105.873 104 64 104zM8.707 63.994C13.465 71.205 32.146 96 64 96c31.955 0 50.553-24.775 55.293-31.994C114.535 56.795 95.854 32 64 32 32.045 32 13.447 56.775 8.707 63.994zM64 88c-13.234 0-24-10.766-24-24s10.766-24 24-24 24 10.766 24 24-10.766 24-24 24zm0-40c-8.822 0-16 7.178-16 16s7.178 16 16 16 16-7.178 16-16-7.178-16-16-16z"
              data-original="#000000"></path>
          </svg>
        </div>
      </div>
      
      <div class="mt-10">
        <button    type="Submit"
          class="w-full py-2.5 px-4 text-sm font-semibold rounded-full text-white bg-[#333] hover:bg-[#222] focus:outline-none">
          Sign in
        </button>
        <p class="text-sm text-center mt-6">Don't have an account <a href='/phase1/signup'
            class="font-semibold hover:underline ml-1 whitespace-nowrap">Register here</a></p>
      </div>
      <hr class="my-6 border-gray-500" />
     
    </form>
  </div>
</div>
    </div>
  )
}

export default Login