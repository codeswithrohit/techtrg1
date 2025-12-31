import React from 'react'

const Featured = () => {
  // Data array for cleaner code and easier updates
  const collections = [
    { title: "Watch Collection", discount: "Up To 40% OFF", img: "watch1.webp" },
    { title: "Laptops", discount: "Up To 50% OFF", img: "laptop2.webp" },
    { title: "Sneakers Shoes", discount: "Up To 35% OFF", img: "product14.webp" },
    { title: "Sunscreen Cream", discount: "Up To 30% OFF", img: "sunscreen-img-5.webp" },
    { title: "Sunglass Collection", discount: "Up To 30% OFF", img: "sunglass1.webp" },
    { title: "Coffee", discount: "Up To 30% OFF", img: "coffee6.webp" },
  ];

  return (
    <div className="py-12 px-4 bg-[#0f2812]">
      <div className="md:max-w-7xl max-w-xl mx-auto">
        {/* Section Header */}
        <h2 className="text-white text-3xl font-black uppercase tracking-widest mb-12 border-l-4 border-[#C5B358] pl-4">
          Popular Design & <span className="text-[#C5B358]">Products</span>
        </h2>

        <div className="grid md:grid-cols-2 gap-x-12 gap-y-16">
          {collections.map((item, index) => (
            <div key={index} className="grid grid-cols-2 items-center gap-4 sm:gap-8 group">
              {/* Product Image Container */}
              <div className="aspect-[13/11] bg-[#1a3c1d] rounded-lg p-4 border border-white/5 shadow-2xl overflow-hidden relative">
                <img 
                  src={`https://readymadeui.com/images/${item.img}`} 
                  alt={item.title} 
                  className="h-full w-full object-contain brightness-90 group-hover:scale-110 group-hover:brightness-100 transition-all duration-500" 
                />
                {/* Tactical Corner Accent */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#C5B358]/30"></div>
              </div>

              {/* Product Details */}
              <div>
                <div>
                  <h4 className="text-white text-base sm:text-xl font-black uppercase tracking-tight leading-tight">
                    {item.title}
                  </h4>
                  <p className="text-[#C5B358] font-bold text-sm mt-2 tracking-widest bg-[#C5B358]/10 px-2 py-1 inline-block rounded">
                    {item.discount}
                  </p>
                </div>
                <div className="mt-6">
                  <button type='button' 
                    className="flex items-center bg-gradient-to-r from-[#8B0000] to-[#B22222] text-white px-5 py-2.5 font-black text-xs uppercase tracking-widest cursor-pointer shadow-lg hover:brightness-125 transition-all border-b-2 border-[#4a0000] active:translate-y-0.5 active:border-b-0 rounded-sm">
                    <span>Explore</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 w-3 h-3 fill-current inline-block" viewBox="0 0 512 512">
                      <path d="m506.134 241.843-.018-.019-104.504-104c-7.829-7.791-20.492-7.762-28.285.068-7.792 7.829-7.762 20.492.067 28.284L443.558 236H20c-11.046 0-20 8.954-20 20s8.954 20 20 20h423.557l-70.162 69.824c-7.829 7.792-7.859 20.455-.067 28.284 7.793 7.831 20.457 7.858 28.285.068l104.504-104 .018-.019c7.833-7.818 7.808-20.522-.001-28.314z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Featured