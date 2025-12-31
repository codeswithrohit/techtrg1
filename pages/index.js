import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Head from 'next/head';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Login = ({ user }) => {
  // Indie Army color palette
  const indieArmyColors = {
    primary: '#4a5d23',     // Dark olive green
    secondary: '#d4b483',   // Sand/tan
    dark: '#1a1a1a',        // Near black
    light: '#f5f1e6',       // Cream/off-white
    accent: '#8b7355',      // Brownish tan
    hover: '#3a4a1b',       // Darker olive green
  };

  const backgroundStyle = {
    backgroundImage: 'url(https://readymadeui.com/background-image.webp)',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
  };

  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [passwordVisible, setPasswordVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'email') setEmail(value);
    if (name === 'password') setPassword(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { email, password };

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const response = await res.json();
      console.log(response);

      if (response.success) {
        localStorage.setItem(
          'myuser',
          JSON.stringify({ token: response.token, email: response.email })
        );
        toast.success('You are successfully logged in', {
          position: 'top-left',
          autoClose: 2000,
        });

        setTimeout(() => {
          router.push('/phase2');
        }, 500);
      } else {
        toast.error(response.error, {
          position: 'top-left',
          autoClose: 2000,
        });
      }
    } catch (err) {
      console.error('Error during login:', err);
      toast.error('Something went wrong. Please try again.', {
        position: 'top-left',
        autoClose: 2000,
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen" style={{ backgroundColor: indieArmyColors.dark }}>
        <div 
          className="w-16 h-16 border-4 border-dashed rounded-full animate-spin"
          style={{ 
            borderColor: indieArmyColors.primary,
            borderTopColor: indieArmyColors.secondary 
          }}
        ></div>
      </div>
    );
  }

  return (
    <div>
      <Head>
        <title>39-GTC Login</title>
        <meta
          name="viewport"
          content="width=device-width, height=device-height, initial-scale=1.0, maximum-scale=1.0"
        />
        <link rel="icon" href="/rk1.ico" />
      </Head>
      <ToastContainer position="top-left" autoClose={2000} />
      <div
        className="flex justify-center items-center font-[sans-serif] h-full min-h-screen p-4"
        style={backgroundStyle}
      >
        <div className="max-w-md w-full mx-auto">
          <form
            onSubmit={handleSubmit}
            method="POST"
            className="rounded-2xl p-8 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.3)]"
            style={{ 
              backgroundColor: indieArmyColors.light,
              border: `2px solid ${indieArmyColors.accent}`,
              boxShadow: `0 10px 30px -5px ${indieArmyColors.dark}33`
            }}
          >
            <div className="mb-12 text-center">
              <h3 className="text-4xl font-bold tracking-tight" style={{ color: indieArmyColors.dark }}>
                SIGN IN
              </h3>
              <p className="text-sm mt-2" style={{ color: indieArmyColors.accent }}>
                39-GTC Access Training Portal
              </p>
            </div>
            
            <div className="mb-8">
              <div className="relative flex items-center">
                <input
                  name="email"
                  onChange={handleChange}
                  type="email"
                  value={email}
                  required
                  className="w-full text-sm px-4 py-4 rounded-lg outline-none transition-all duration-300 focus:ring-2 focus:ring-offset-2"
                  placeholder="Enter email address"
                  style={{ 
                    backgroundColor: '#ffffff',
                    color: indieArmyColors.dark,
                    border: `1px solid ${indieArmyColors.accent}`,
                    boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)'
                  }}
                />
              </div>
            </div>
            
            <div className="mb-10">
              <div className="relative flex items-center">
                <input
                  name="password"
                  onChange={handleChange}
                  type={passwordVisible ? 'text' : 'password'}
                  value={password}
                  required
                  className="w-full text-sm px-4 py-4 rounded-lg outline-none transition-all duration-300 focus:ring-2 focus:ring-offset-2"
                  placeholder="Enter password"
                  style={{ 
                    backgroundColor: '#ffffff',
                    color: indieArmyColors.dark,
                    border: `1px solid ${indieArmyColors.accent}`,
                    boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)'
                  }}
                />
                <div 
                  className="absolute right-4 cursor-pointer transition-transform duration-300 hover:scale-110"
                  onClick={() => setPasswordVisible(!passwordVisible)}
                  style={{ color: indieArmyColors.primary }}
                >
                  {passwordVisible ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                </div>
              </div>
            </div>
            
            <div className="mt-12">
              <button
                type="submit"
                className="w-full py-3.5 px-4 text-base font-bold rounded-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
                style={{ 
                  backgroundColor: indieArmyColors.primary,
                  color: indieArmyColors.light,
                  border: `2px solid ${indieArmyColors.dark}`
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = indieArmyColors.hover;
                  e.currentTarget.style.boxShadow = `0 8px 20px ${indieArmyColors.dark}40`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = indieArmyColors.primary;
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
                }}
              >
              Login
              </button>
            </div>
            
            <div className="mt-8 pt-6 text-center border-t"
              style={{ borderColor: indieArmyColors.accent }}
            >
              <p className="text-sm" style={{ color: indieArmyColors.accent }}>
                Secure military-grade authentication required
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;