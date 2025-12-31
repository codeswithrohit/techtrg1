import React from 'react'
import { FaHeart, FaCartPlus } from 'react-icons/fa6'

const Product = () => {
  const products = [
    { id: 1, name: "Sole Elegance", price: "10.00", img: "https://readymadeui.com/images/product9.webp" },
    { id: 2, name: "Urban Sneakers", price: "12.00", img: "https://readymadeui.com/images/product10.webp" },
    { id: 3, name: "Velvet Boots", price: "14.00", img: "https://readymadeui.com/images/product11.webp" },
    { id: 4, name: "Summit Hiking", price: "12.00", img: "https://readymadeui.com/images/product12.webp" },
    { id: 5, name: "Zenith Glow", price: "15.00", img: "https://readymadeui.com/images/product13.webp" },
    { id: 6, name: "Echo Elegance", price: "16.00", img: "https://readymadeui.com/images/product14.webp" },
    { id: 7, name: "Tactical Pumps", price: "12.00", img: "https://readymadeui.com/images/product15.webp" },
    { id: 8, name: "Blaze Burst", price: "11.00", img: "https://readymadeui.com/images/product10.webp" },
  ];

  return (
    <div className="bg-[#0f2812] py-12 px-4">
      <div className="mx-auto lg:max-w-7xl md:max-w-4xl sm:max-w-xl max-sm:max-w-sm">
        {/* Header with Military Accent */}
        <div className="border-l-4 border-[#FFD700] pl-4 mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tighter uppercase">
            Military <span className="text-[#FFD700]">Spec</span> Footwear
          </h2>
          <p className="text-[#C5B358] text-sm font-medium">Built for durability. Designed for discipline.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((item) => (
            <div key={item.id} className="bg-[#1a3c1d] shadow-xl border border-[#8B4513]/30 rounded-xl p-4 transition-all duration-300 hover:border-[#FFD700]/50 group">
              <a href="/product-details" className="block">
                <div className="aspect-[12/11] bg-[#0f2812] rounded-lg p-4 relative overflow-hidden">
                  {/* Subtle Camo Pattern Overlay on Image Background */}
                  <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.4\" fill-rule=\"evenodd\"%3E%3Ccircle cx=\"3\" cy=\"3\" r=\"3\"/%3E%3Ccircle cx=\"13\" cy=\"13\" r=\"3\"/%3E%3C/g%3E%3C/svg%3E')" }}></div>
                  
                  <img src={item.img} alt={item.name} className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110" />
                </div>

                <div className="flex gap-2 mt-4 items-center">
                  <h5 className="text-base font-bold text-white uppercase tracking-tight">{item.name}</h5>
                  <h6 className="text-base text-[#FFD700] font-black ml-auto">${item.price}</h6>
                </div>
                <p className="text-gray-400 text-[13px] mt-2 line-clamp-2">High-performance gear engineered for extreme environments and daily operations.</p>
              </a>

              <div className="flex items-center gap-2 mt-6">
                
                
                <button 
                  type="button" 
                  className="flex items-center justify-center gap-2 text-sm px-4 py-2.5 font-bold cursor-pointer w-full bg-[#8B0000] hover:bg-[#a10000] text-white uppercase tracking-wider ml-auto rounded-lg shadow-lg active:scale-95 transition-all"
                >
                  <FaCartPlus className="text-base" />
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Product