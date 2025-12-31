import React, { useState, useEffect } from 'react'
import { FaPrint, FaAward, FaTruckFast, FaChevronRight } from 'react-icons/fa6'

const HeroSection = () => {
  // Array of images for the right-side carousel
  const images = [
    '/sliding1.png', // Replace with your actual paths
    '/sliding2.jpeg',
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-sliding logic
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000); // Slide every 4 seconds

    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <section className="relative w-full min-h-[700px] bg-gradient-to-b from-[#1a3c1d] to-[#0f2812] overflow-hidden flex items-center">
      {/* Background Overlay Texture */}
      <div className="absolute inset-0 opacity-10 z-0" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"6\" height=\"6\" viewBox=\"0 0 6 6\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"%239C92AC\" fill-opacity=\"0.1\" fill-rule=\"evenodd\"%3E%3Cpath d=\"M5 0h1L0 6V5zm1 5v1H5z\"/%3E%3C/g%3E%3C/svg%3E')"}}></div>

      <div className="relative z-10 w-full mx-auto px-4 sm:px-6 lg:px-8 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-12">
        
        {/* LEFT COLUMN: Content */}
        <div className="space-y-6 text-left">
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight tracking-tighter text-white drop-shadow-lg">
            PRECISION <span className="text-[#FFD700]">PRINTING</span>, <br className="hidden sm:inline" />
            MILITARY <span className="text-[#8B0000]">STANDARDS</span>
          </h1>

          <p className="text-xl md:text-2xl font-semibold text-[#C5B358] tracking-wide border-l-4 border-[#8B4513] pl-4 italic">
            Your Vision. Our Discipline. Unmatched Quality.
          </p>

          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 pt-4">
            <button className="flex items-center justify-center space-x-3 bg-gradient-to-r from-[#8B0000] to-[#B22222] text-white px-6 py-4 rounded-lg font-bold transition-all duration-300 hover:scale-105 border-2 border-[#FFD700]/30 shadow-lg group">
              <FaPrint className="text-xl group-hover:animate-pulse" />
              <span className="tracking-wider uppercase">START PROJECT</span>
              <FaChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="flex items-center justify-center space-x-3 bg-transparent border-2 border-[#C5B358] text-[#C5B358] hover:bg-[#1a3c1d]/50 px-6 py-4 rounded-lg font-bold transition-all duration-300 hover:scale-105">
              <FaAward className="text-xl" />
              <span className="tracking-wider uppercase">SERVICES</span>
            </button>
          </div>

     
        </div>

        {/* RIGHT COLUMN: Auto-Carousel */}
        <div className="relative w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-2xl border-4 border-[#C5B358]/20">
          {images.map((img, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === currentIndex ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={img}
                alt={`Slide ${index}`}
                className="w-full h-full object-cover"
              />
              {/* Image Overlay to maintain military aesthetic */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f2812]/40 to-transparent"></div>
            </div>
          ))}
          
          {/* Carousel Indicators (Dots) */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
            {images.map((_, index) => (
              <div
                key={index}
                className={`h-2 w-2 rounded-full transition-all ${
                  index === currentIndex ? 'bg-[#FFD700] w-6' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}

export default HeroSection