import React from 'react'
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaFacebook, FaTwitter, FaInstagram, FaChevronRight } from 'react-icons/fa'

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0f2812] border-t-8 border-[#8B4513] text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Column 1: Brand Info */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-[#FFD700] rounded-sm flex items-center justify-center">
                <img src="/logo.png" alt="Logo" className="w-10 h-10 object-contain" />
              </div>
              <span className="text-2xl font-black tracking-tighter">39 GTC</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed border-l-2 border-[#8B0000] pl-4 italic">
              Serving the elite with precision printing and military-grade equipment since 1950. Excellence in every impression.
            </p>
            <div className="flex space-x-4">
              {[FaFacebook, FaTwitter, FaInstagram].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 bg-[#1a3c1d] border border-[#8B4513] flex items-center justify-center rounded-full hover:bg-[#8B0000] transition-colors duration-300 text-[#FFD700] hover:text-white">
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-[#FFD700] font-bold uppercase tracking-[0.2em] mb-6 text-sm flex items-center">
              <span className="w-8 h-px bg-[#8B0000] mr-3"></span> Navigation
            </h3>
            <ul className="space-y-3">
              {['About History', 'Unit Store', 'Resource Center', 'Recruitment', 'Orders'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-gray-400 hover:text-white flex items-center group text-sm font-semibold">
                    <FaChevronRight className="mr-2 text-[#8B0000] text-[10px] group-hover:translate-x-1 transition-transform" />
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Headquarters */}
          <div>
            <h3 className="text-[#FFD700] font-bold uppercase tracking-[0.2em] mb-6 text-sm flex items-center">
              <span className="w-8 h-px bg-[#8B0000] mr-3"></span> Contact HQ
            </h3>
            <div className="space-y-4 text-sm text-gray-400">
              <div className="flex items-start space-x-3">
                <FaMapMarkerAlt className="text-[#8B4513] mt-1 shrink-0" />
                <span>39 Gorkha Training Centre,<br />Cantonment Area, Varanasi, UP</span>
              </div>
              <div className="flex items-center space-x-3">
                <FaPhoneAlt className="text-[#8B4513] shrink-0" />
                <span>+91 542-XXXXXXX</span>
              </div>
              <div className="flex items-center space-x-3">
                <FaEnvelope className="text-[#8B4513] shrink-0" />
                <span>support@39gtc-press.gov.in</span>
              </div>
            </div>
          </div>

          {/* Column 4: Newsletter */}
          <div>
            <h3 className="text-[#FFD700] font-bold uppercase tracking-[0.2em] mb-6 text-sm flex items-center">
              <span className="w-8 h-px bg-[#8B0000] mr-3"></span> Briefing
            </h3>
            <p className="text-xs text-gray-400 mb-4 font-bold">SUBSCRIBE FOR OFFICIAL UPDATES</p>
            <form className="relative">
              <input 
                type="email" 
                placeholder="Military Email" 
                className="w-full bg-[#1a3c1d] border border-[#8B4513] py-3 px-4 rounded text-sm focus:outline-none focus:border-[#FFD700] text-white"
              />
              <button className="mt-3 w-full bg-[#8B0000] hover:bg-[#a00000] text-white font-bold py-2 rounded transition-colors text-xs tracking-widest border-b-4 border-[#600000]">
                ENLIST NOW
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#ffffff10] flex flex-col md:flex-row justify-between items-center text-[10px] font-bold tracking-widest text-gray-500 uppercase">
          <p>© {currentYear} 39 GTC PRINTING PRESS. ALL RIGHTS RESERVED.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-[#FFD700]">Privacy Policy</a>
            <a href="#" className="hover:text-[#FFD700]">Terms of Service</a>
            <a href="#" className="hover:text-[#FFD700]">Security Protocol</a>
          </div>
        </div>
      </div>

      {/* Military Decorative Line */}
      <div className="mt-8 h-1 bg-gradient-to-r from-transparent via-[#8B4513] to-transparent opacity-30"></div>
    </footer>
  )
}

export default Footer