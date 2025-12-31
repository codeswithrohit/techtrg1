import React from 'react';

const FooterMinimalist = () => {
  const date = new Date();
  const currentYear = date.getFullYear();

  return (
    <footer className="bg-gray-800 text-gray-300 border-t-4 border-emerald-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          
          {/* Main Copyright Section */}
          {/* <span className="text-center text-sm md:text-base">
            &copy; Copyright reserved to{" "}
            <span className="font-extrabold text-white transition-colors duration-300 hover:text-emerald-400">
              39-Gorkha Training Centre
            </span>{" "}
            since {currentYear}
          </span> */}
          
          {/* Technical Info Section */}
          <div className="flex flex-col items-center md:items-end text-xs sm:text-sm space-y-1">
            <span className="font-semibold text-emerald-400">
              Powered By Tech Rakshak
            </span>
            <div className="flex flex-wrap justify-center md:justify-end items-center gap-x-3 gap-y-1">
              <span className="text-gray-400">Technical Help:</span>
              <span className="font-medium text-white transition-colors duration-300 hover:text-emerald-300">
                +91 7667411501
              </span>
              <span className="hidden md:inline text-gray-600">|</span>
              <span className="font-medium text-white">
                Mr. Rohit Kumar Gupta
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default FooterMinimalist;