import React from 'react'

const Orders = () => {
  return (
    <div className="bg-[#0f2812] px-4 py-8 min-h-screen font-sans text-white">
      <div className="max-w-screen-xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-wrap justify-between items-center gap-6 border-l-4 border-[#C5B358] pl-6 py-2 bg-[#1a3c1d]/20">
          <div className="max-w-96">
            <h2 className="text-[#C5B358] text-2xl font-black uppercase tracking-widest">Service Record</h2>
            <p className="text-sm text-white/60 uppercase font-bold tracking-tight">Archive of past deployments and requisitions</p>
          </div>
          <div className="relative">
            <input
              type="text"
              className="px-4 py-2.5 bg-[#0f2812] border border-[#C5B358]/30 text-white w-full sm:w-64 text-xs rounded uppercase tracking-widest focus:border-[#C5B358] outline-none placeholder:text-white/20"
              placeholder="Search Archives..."
            />
          </div>
        </div>

        {/* Filters and Sorting */}
        <div className="flex flex-wrap items-center gap-8 mt-12">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-black text-[#C5B358] uppercase tracking-widest">Filter:</span>
            <button className="px-4 py-2 cursor-pointer bg-gradient-to-r from-[#8B0000] to-[#B22222] text-white rounded-sm text-[10px] font-black uppercase tracking-widest shadow-lg">All Logs</button>
            <button className="px-4 py-2 cursor-pointer bg-[#1a3c1d] border border-white/10 text-white/70 rounded-sm text-[10px] font-black uppercase tracking-widest hover:text-[#C5B358] hover:border-[#C5B358] transition-all">Completed</button>
            <button className="px-4 py-2 cursor-pointer bg-[#1a3c1d] border border-white/10 text-white/70 rounded-sm text-[10px] font-black uppercase tracking-widest hover:text-[#C5B358] hover:border-[#C5B358] transition-all">In Transit</button>
            <button className="px-4 py-2 cursor-pointer bg-[#1a3c1d] border border-white/10 text-white/70 rounded-sm text-[10px] font-black uppercase tracking-widest hover:text-[#C5B358] hover:border-[#C5B358] transition-all">Aborted</button>
          </div>
          <div className="ml-auto">
            <select className="appearance-none px-4 py-2.5 bg-[#1a3c1d] border border-white/10 text-[#C5B358] text-[10px] font-black uppercase tracking-widest rounded-sm outline-none cursor-pointer">
              <option>Sort: Newest First</option>
              <option>Sort: Oldest First</option>
              <option>Sort: High Value</option>
            </select>
          </div>
        </div>

        {/* Order Cards List */}
        <div className="space-y-6 mt-6">
          {/* Card 1 */}
          <div className="bg-[#1a3c1d]/40 rounded-lg border border-white/5 overflow-hidden p-6 hover:border-[#C5B358]/30 transition-all shadow-xl">
            <div className="flex flex-wrap justify-between gap-6">
              <div className="max-w-96">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-black text-white uppercase tracking-widest">Deployment #3245</span>
                  <span className="px-3 py-1 bg-[#0f2812] border border-[#C5B358]/50 text-[#C5B358] text-[10px] font-black uppercase rounded">Delivered</span>
                </div>
                <p className="text-white/50 text-[10px] font-bold uppercase mt-3 tracking-wider">Timestamp: May 12, 2025 | 12:30 HRS</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-black text-[#C5B358]">$248.75</p>
                <p className="text-white/40 text-[10px] font-bold uppercase mt-2">03 Units Manifested</p>
              </div>
            </div>

            <hr className="border-white/5 my-6" />

            {/* Product Thumbs */}
            <div className="flex flex-wrap items-center gap-8">
              {[
                { name: 'Tactical Tee', img: 'dark-green-tshirt-2.webp' },
                { name: 'Echo Elegance', img: 'product14.webp' },
                { name: 'Combat Watch', img: 'watch5.webp' }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-[#0f2812] p-1.5 rounded border border-white/10">
                    <img src={`https://readymadeui.com/images/${item.img}`} alt="Product" className="w-full h-full object-contain brightness-90" />
                  </div>
                  <div>
                    <p className="text-[11px] font-black text-white uppercase tracking-tight">{item.name}</p>
                    <p className="text-[10px] text-white/40 font-bold uppercase">Qty: 01</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-wrap gap-4">
              <button className="px-4 py-2 bg-[#0f2812] border border-[#C5B358]/30 rounded-sm text-[10px] text-[#C5B358] font-black uppercase tracking-widest cursor-pointer hover:bg-[#C5B358] hover:text-[#0f2812] transition-all flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 fill-current" viewBox="0 0 511.999 511.999"><path d="M508.745 246.041c-4.574-6.257-113.557-153.206-252.748-153.206S7.818 239.784 3.249 246.035a16.896 16.896 0 0 0 0 19.923c4.569 6.257 113.557 153.206 252.748 153.206s248.174-146.95 252.748-153.201a16.875 16.875 0 0 0 0-19.922zM255.997 385.406c-102.529 0-191.33-97.533-217.617-129.418 26.253-31.913 114.868-129.395 217.617-129.395 102.524 0 191.319 97.516 217.617 129.418-26.253 31.912-114.868 129.395-217.617 129.395z" /></svg>
                View Intelligence
              </button>
              <button className="px-4 py-2 bg-[#0f2812] border border-white/10 rounded-sm text-[10px] text-white/70 font-black uppercase tracking-widest cursor-pointer hover:border-[#C5B358] transition-all flex items-center gap-2">
                Re-Deploy
              </button>
              <button className="px-4 py-2 bg-[#0f2812] border border-white/10 rounded-sm text-[10px] text-white/70 font-black uppercase tracking-widest cursor-pointer hover:border-[#C5B358] transition-all flex items-center gap-2">
                Download PDF
              </button>
            </div>
          </div>
          {/* Add more cards here... */}
        </div>

        {/* Pagination */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/10 pt-8">
          <div className="text-[10px] font-black text-white/40 uppercase tracking-widest">
            Logged <span className="text-[#C5B358]">1-3</span> of 12 Operations
          </div>

          <div className="flex gap-2">
            <button className="px-3 py-1 bg-[#1a3c1d] border border-white/10 rounded-sm opacity-50 cursor-not-allowed">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 fill-white" viewBox="0 0 492 492"><path d="M198.608 246.104 382.664 62.04c5.068-5.056 7.856-11.816 7.856-19.024 0-7.212-2.788-13.968-7.856-19.032l-16.128-16.12C361.476 2.792 354.712 0 347.504 0s-13.964 2.792-19.028 7.864L109.328 227.008c-5.084 5.08-7.868 11.868-7.848 19.084-.02 7.248 2.76 14.028 7.848 19.112l218.944 218.932c5.064 5.072 11.82 7.864 19.032 7.864 7.208 0 13.964-2.792 19.032-7.864l16.124-16.12c10.492-10.492 10.492-27.572 0-38.06L198.608 246.104z"/></svg>
            </button>
            <button className="px-4 py-1 bg-gradient-to-b from-[#8B0000] to-[#4a0000] text-white rounded-sm text-xs font-black">1</button>
            <button className="px-4 py-1 bg-[#1a3c1d] text-white/60 border border-white/10 rounded-sm text-xs font-black hover:text-[#C5B358]">2</button>
            <button className="px-4 py-1 bg-[#1a3c1d] text-white/60 border border-white/10 rounded-sm text-xs font-black hover:text-[#C5B358]">3</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Orders;