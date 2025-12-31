import React, { useState } from 'react'
import { FaUser, FaBars, FaTimes, FaShoppingCart, FaSearch, FaCaretDown } from 'react-icons/fa'
import { GiHelmet, GiBulletImpacts } from 'react-icons/gi'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'About Us', href: '/aboutus' },
    { name: 'Shop', href: '#', submenu: ['Uniforms', 'Gear', 'Footwear', 'Accessories'] },
    { name: 'Contact Us', href: '/contactus' },
  ]

  return (
    <nav className="bg-gradient-to-b from-[#1a3c1d] to-[#0f2812] shadow-2xl sticky top-0 z-50 border-b-4 border-[#8B4513]">
      {/* Top Strip */}
      <div className="bg-gradient-to-r from-[#8B0000] via-[#B8860B] to-[#8B0000] py-1 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <p className="text-white text-xs md:text-sm font-medium tracking-wider">
          🎉 Limited Time Offer! Enjoy 20% OFF your first purchase – Shop Now!
          </p>
          <div className="flex items-center space-x-4">
            <span className="text-white text-xs hidden md:inline">Helpline: 1800-ARMY-IND</span>
            <div className="flex space-x-2">
              <div className="w-2 h-2 rounded-full bg-white"></div>
              <div className="w-2 h-2 rounded-full bg-[#FFD700]"></div>
              <div className="w-2 h-2 rounded-full bg-[#8B0000]"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24">
          {/* Logo Section - Enhanced */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#2d5a2f] to-[#0f2812] border-4 border-[#8B4513] shadow-lg">
             <img src='/logo.png' className='h-full w-full object-contain' />
              
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                <span className="text-white">39</span>
                <span className="text-[#FFD700] ml-2">GTC</span>
              </h1>
              <p className="text-sm text-[#C5B358] font-semibold tracking-wider border-t border-[#8B4513] pt-1">
                Printing Press
              </p>
            </div>
          </div>

        

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <div key={item.name} className="relative group">
                <a
                  href={item.href}
                  className="text-white hover:text-[#FFD700] px-4 py-3 rounded-md text-lg font-bold transition-all duration-300 hover:bg-[#1a3c1d]/50 relative group/item"
                >
                  <span className="flex items-center">
                    {item.name}
                    {item.submenu && <FaCaretDown className="ml-1 text-[#C5B358]" />}
                  </span>
                  <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 group-hover/item:w-4/5 h-0.5 bg-gradient-to-r from-transparent via-[#FFD700] to-transparent transition-all duration-300"></span>
                </a>
                
                {/* Dropdown for Shop */}
                {item.submenu && (
                  <div className="absolute left-0 mt-2 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform -translate-y-2 group-hover:translate-y-0">
                    <div className="bg-gradient-to-b from-[#1a3c1d] to-[#0f2812] border-2 border-[#8B4513] rounded-lg shadow-2xl p-2">
                      {item.submenu.map((subItem) => (
                        <a
                          key={subItem}
                          href="#"
                          className="block px-4 py-3 text-white hover:text-[#FFD700] hover:bg-[#2d5a2f] rounded-md font-semibold transition-all duration-200 border-l-2 border-transparent hover:border-[#FFD700]"
                        >
                          {subItem}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
            
            {/* Action Buttons */}
            <div className="flex items-center space-x-4 ml-4">
              <a href='/cart' className="relative p-3 text-white hover:text-[#FFD700] transition-colors duration-300">
                <FaShoppingCart className="text-xl" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#8B0000] text-xs rounded-full flex items-center justify-center">
                  3
                </span>
              </a>
              
              <a href='/login' className="flex items-center space-x-3 bg-gradient-to-r from-[#8B0000] to-[#B22222] hover:from-[#B22222] hover:to-[#8B0000] text-white px-6 py-3 rounded-lg font-bold transition-all duration-300 hover:shadow-xl hover:scale-105 border-2 border-[#FFD700]/30 shadow-lg group">
                <div className="relative">
                  <FaUser className="text-lg group-hover:animate-pulse" />
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#FFD700] rounded-full"></div>
                </div>
                <span className="tracking-wider">LOGIN</span>
                <div className="w-1 h-6 bg-[#FFD700]/50 rounded-full"></div>
              </a>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-4">
            <a href='/cart' className="p-3 text-white hover:text-[#FFD700] transition-colors">
              <FaShoppingCart className="text-xl" />
            </a>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-4 rounded-lg bg-gradient-to-r from-[#2d5a2f] to-[#1a3c1d] text-white hover:text-[#FFD700] hover:bg-[#1a3c1d] focus:outline-none transition-all duration-300 border-2 border-[#8B4513] shadow-lg"
            >
              {isOpen ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`md:hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
          <div className="px-4 pt-4 pb-8 space-y-2 bg-gradient-to-b from-[#1a3c1d] to-[#0f2812] rounded-xl shadow-2xl mt-4 border-2 border-[#8B4513]">
            {/* Mobile Search */}
          \

            {navItems.map((item) => (
              <div key={item.name}>
                <a
                  href={item.href}
                  className="flex items-center justify-between text-white hover:text-[#FFD700] hover:bg-[#2d5a2f]/50 px-4 py-4 rounded-lg text-lg font-bold transition-all duration-300 border-l-4 border-transparent hover:border-[#FFD700]"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                  {item.submenu && <FaCaretDown className="text-[#C5B358]" />}
                </a>
                {item.submenu && (
                  <div className="ml-8 space-y-2 py-2">
                    {item.submenu.map((subItem) => (
                      <a
                        key={subItem}
                        href="#"
                        className="block px-4 py-3 text-[#C5B358] hover:text-white hover:bg-[#2d5a2f]/30 rounded-md font-medium transition-all duration-200"
                      >
                        • {subItem}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
            
            {/* Mobile Login Button */}
            <div className="pt-6 mt-6 border-t-2 border-[#8B4513]">
              <button className="w-full flex items-center justify-center space-x-3 bg-gradient-to-r from-[#8B0000] to-[#B22222] text-white px-6 py-4 rounded-lg font-bold transition-all duration-300 active:scale-95 border-2 border-[#FFD700]/30">
                <FaUser className="text-lg" />
                <span>SOLDIER LOGIN</span>
              </button>
            </div>
            
            <div className="text-center pt-4">
              <p className="text-[#C5B358] text-sm font-semibold tracking-wider">
                ⭐ AUTHENTIC MILITARY GRADE EQUIPMENT ⭐
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Active Indicator */}
      <div className="h-1 bg-gradient-to-r from-[#8B0000] via-[#FFD700] to-[#8B0000] shadow-lg"></div>
    </nav>
  )
}

export default Navbar