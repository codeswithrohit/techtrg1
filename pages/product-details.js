import React from 'react'

const ProductDetails = () => {
  return (
    // Updated background to match the Hero Section deep green
    <div className="p-4 bg-[#0f2812] font-sans min-h-screen">
      <div className="lg:max-w-6xl max-w-xl mx-auto py-8">
        <div className="grid items-start grid-cols-1 lg:grid-cols-2 gap-8 max-lg:gap-12 max-sm:gap-8">
          
          {/* LEFT COLUMN: Images */}
          <div className="w-full lg:sticky top-0">
            <div className="flex flex-col gap-4">
              {/* Main Image Container with Brass Border */}
              <div className="bg-[#1a3c1d] shadow-2xl p-2 border-2 border-[#C5B358]/30 rounded-lg">
                <img 
                  src="https://readymadeui.com/images/sunscreen-img-1.webp" 
                  alt="Product"
                  className="w-full aspect-[11/8] object-cover object-top rounded brightness-90 hover:brightness-100 transition-all" 
                />
              </div>
              {/* Thumbnails */}
              <div className="bg-[#1a3c1d]/50 p-2 w-full max-w-full overflow-auto rounded-lg border border-white/10">
                <div className="flex justify-between flex-row gap-4 shrink-0">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <img 
                      key={i}
                      src={`https://readymadeui.com/images/sunscreen-img-${i === 6 ? 1 : i}.webp`} 
                      alt={`Product${i}`}
                      className={`w-16 h-16 aspect-square object-cover object-top cursor-pointer shadow-sm border-b-4 transition-all ${i === 1 ? 'border-[#C5B358]' : 'border-transparent hover:border-[#C5B358]/50'}`} 
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Content */}
          <div className="w-full">
            <div className="space-y-4">
              <h3 className="text-3xl sm:text-4xl font-black text-white tracking-tight uppercase">
                Tactical <span className="text-[#C5B358]">SunProtect</span> SPF 50
              </h3>
              
              <div className="flex items-center gap-3 mt-3">
                <div className="flex items-center gap-1">
                  <p className="text-base font-bold text-[#C5B358]">4.8</p>
                  {/* Stars in Gold */}
                  {[...Array(4)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 fill-[#C5B358]" viewBox="0 0 14 13" xmlns="http://www.w3.org/2000/svg">
                      <path d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
                    </svg>
                  ))}
                  <svg className="w-4 h-4 fill-white/20" viewBox="0 0 14 13" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
                  </svg>
                </div>
                <span className="text-white/20">|</span>
                <p className="text-xs font-bold text-white/60 uppercase tracking-widest">76 Field Reports</p>
              </div>

              {/* Quote box adjusted for Dark Mode */}
              <div className="mt-6 p-4 border-l-4 border-[#8B4513] bg-white/5 backdrop-blur-sm">
                <p className="text-white/80 leading-relaxed italic">
                  "High-discipline protection for extreme environments. Optimized for long-range field operations."
                </p>
              </div>

              <div className="flex items-center flex-wrap gap-4 mt-8">
                <p className="text-[#C5B358] text-lg line-through decoration-[#8B0000]">$16.00</p>
                <h4 className="text-white text-4xl font-black">$12.00</h4>
                <div className="flex py-1 px-3 bg-[#8B0000] border border-[#C5B358]/30">
                  <span className="text-white text-xs font-bold uppercase">Unit Discount Applied</span>
                </div>
              </div>
            </div>

            <hr className="my-8 border-white/10" />

            {/* Quantity and Actions */}
            <div>
              <div className="flex gap-0 items-center border-2 border-[#C5B358]/50 w-max rounded overflow-hidden">
                <button type="button" className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white font-bold transition-colors">-</button>
                <span className="text-white text-sm font-bold px-8 bg-white/10 flex items-center">1</span>
                <button type="button" className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white font-bold transition-colors">+</button>
              </div>

              <div className="mt-6 flex flex-wrap gap-4">
                <button type="button"
                  className="px-8 py-4 w-full sm:w-[45%] cursor-pointer border-2 border-[#C5B358] bg-transparent text-[#C5B358] hover:bg-[#C5B358] hover:text-[#0f2812] transition-all font-black uppercase tracking-widest text-sm">
                  Add to Gear
                </button>
                <button type="button"
                  className="px-8 py-4 w-full sm:w-[45%] cursor-pointer bg-gradient-to-r from-[#8B0000] to-[#B22222] text-white shadow-lg hover:brightness-125 transition-all font-black uppercase tracking-widest text-sm border-b-4 border-[#4a0000] active:border-b-0 active:translate-y-1">
                  Deploy Now
                </button>
              </div>
            </div>

            <hr className="my-8 border-white/10" />

            {/* Delivery - Army Supply Chain style */}
            <div>
              <h3 className="text-lg font-bold text-[#C5B358] uppercase tracking-wide">Supply Chain Check</h3>
              <div className="flex items-center gap-2 mt-4 max-w-sm">
                <input type='number' placeholder='Enter Zip Code'
                  className="bg-white/5 px-4 py-3 text-sm w-full border border-white/20 focus:border-[#C5B358] text-white outline-none transition-colors" />
                <button type='button'
                  className="bg-[#C5B358] text-[#0f2812] font-black px-6 py-3 text-sm uppercase hover:bg-white transition-colors">
                  Check
                </button>
              </div>
            </div>

         
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetails;