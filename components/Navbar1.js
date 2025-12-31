import Link from "next/link";
import { FaSignOutAlt,FaSignInAlt } from 'react-icons/fa';
import React, { useState, useRef } from 'react';
import { ImMenu } from 'react-icons/im';
import { AiFillCloseCircle } from 'react-icons/ai';
import { RiAccountCircleFill } from 'react-icons/ri';
import { useRouter } from 'next/router';

function Navbar({ logout, user, cart, addToCart, removeFromCart, clearCart, subTotal, classname }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const [menubar, setMenubar] = useState(false);
  const router = useRouter();

  const menuCart = () => {
    setMenubar(!menubar);
  };

  const handleMouseEnter = () => {
    setDropdown(true);
  };

  const handleMouseLeave = () => {
    setDropdown(false);
  };

  const ref = useRef();

  return (
    <>
      <header className={classname}>
        <nav>
          <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto py-8">
            <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
              <img src="/logo.png" className="h-14" alt="Logo" />
              <span className="self-center text-gray-900 text-1xl md:text-3xl font-army whitespace-nowrap">
                39-Gorkha Training Centre
              </span>
            </a>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-collapse-toggle="navbar-default"
              type="button"
              className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-white rounded-lg md:hidden hover:bg-gray-100 hover:text-dark-green focus:outline-none focus:ring-2 focus:ring-gray-200"
              aria-controls="navbar-default"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 17 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 1h15M1 7h15M1 13h15"
                />
              </svg>
            </button>
            <div
              className={`${mobileMenuOpen ? "bg-white" : "hidden"} w-full md:block md:w-auto `}
              id="navbar-default"
            >
              <ul className="font-medium flex flex-col items-center p-4 md:p-0 mt-4 border rounded-lg md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 ">
                <li>
                  <Link
                    href="/phase1"
                    className="block py-2 px-3 text-gray-900 font-bold rounded hover:bg-green md:hover:bg-transparent md:border-0
                    md:hover:text-light-green active:text-dark-green md:p-0"
                  >
                    HOME
                  </Link>
                </li>
                <li>
                  <Link
                    href="/phase1/courses"
                    className="block py-2 px-3 text-gray-900 font-bold rounded hover:bg-green md:hover:bg-transparent md:border-0
                    md:hover:text-light-green active:text-dark-green md:p-0"
                  >
                    COURSE
                  </Link>
                </li>
                <li>
                  <Link
                    href="/aboutus"
                    className="block py-2 px-3 text- rounded text-gray-900 font-bold hover:bg-green md:hover:bg-transparent md:border-0 md:hover:text-light-green active:text-dark-green md:p-0"
                  >
                    ABOUT US
                  </Link>
                </li>
                {/* <li className="relative" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                  {user.value ? (
                    <>
                      <RiAccountCircleFill className="text-xl md:text-2xl mx-6 cursor-pointer" />
                      {dropdown && (
                        <div className="absolute top-full mt-0 w-32 bg-white border rounded shadow-lg">
                          <button
                            onClick={logout}
                            className="block w-full text-left px-4 py-2 bg-green text-white hover:bg-dark-green"
                          >
                            Log out
                            <FaSignOutAlt className="inline ml-2" />
                          </button>
                        </div>
                      )}
                    </>
                  ) : (
                    <a href='/phase1/login'>
                      <button className='block w-full border rounded shadow-lg w-32 text-left px-4 py-2 bg-green text-white hover:bg-dark-green'>Login
                      <FaSignInAlt className="inline ml-2" />
                      </button>
                      
                    </a>
                  )}
                </li> */}
              </ul>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
}

export default Navbar;
