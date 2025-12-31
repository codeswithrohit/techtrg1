import React from 'react'

const OrderDetails = () => {
  return (
    <div className="bg-[#0f2812] min-h-screen p-4 font-sans text-white">
      <div className="max-w-6xl mx-auto max-lg:max-w-2xl py-8">
        {/* Success Header */}
        <div className="border-l-4 border-[#C5B358] pl-6 py-2 bg-[#1a3c1d]/30">
          <h1 className="text-3xl font-black uppercase tracking-widest text-[#C5B358]">Mission Accomplished</h1>
          <p className="text-sm text-white/60 mt-2 uppercase tracking-tight font-bold">Deployment successful. Your tactical gear is being prepared for dispatch.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-y-16 mt-12">
          {/* Sidebar: Intelligence & Billing */}
          <div className="lg:border-r lg:border-white/10 lg:pr-8">
            <div>
              <h3 className="text-lg font-black text-white uppercase tracking-widest mb-6 border-b border-white/10 pb-2">Deployment Intelligence</h3>
              <div className="grid sm:grid-cols-2 gap-x-4 gap-y-6">
                <div>
                  <p className="text-[#C5B358] text-[10px] font-black uppercase tracking-widest">Personnel</p>
                  <p className="text-white text-sm font-bold mt-1">Alex Johnson</p>
                </div>
                <div>
                  <p className="text-[#C5B358] text-[10px] font-black uppercase tracking-widest">Logistics Mode</p>
                  <p className="text-white text-sm font-bold mt-1">Express Tactical</p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-[#C5B358] text-[10px] font-black uppercase tracking-widest">Coordinates</p>
                  <p className="text-white text-sm font-bold mt-1">425 Park Avenue, San Francisco, CA 94107</p>
                </div>
                <div>
                  <p className="text-[#C5B358] text-[10px] font-black uppercase tracking-widest">Comms</p>
                  <p className="text-white text-sm font-bold mt-1">(555) 123-4567</p>
                </div>
              </div>
            </div>

            <div className="mt-12 bg-[#1a3c1d]/40 p-6 border border-white/5 rounded-lg shadow-2xl">
              <h3 className="text-lg font-black text-white uppercase tracking-widest mb-6">Manifest Totals</h3>
              <ul className="font-bold space-y-4">
                <li className="flex justify-between text-white/60 text-xs uppercase">Subtotal <span>$120.00</span></li>
                <li className="flex justify-between text-white/60 text-xs uppercase">Logistics Fee <span>$4.00</span></li>
                <li className="flex justify-between text-white/60 text-xs uppercase">Ops Tax <span>$6.00</span></li>
                <hr className="border-white/10" />
                <li className="flex justify-between text-lg font-black text-[#C5B358] uppercase">Grand Total <span>$130.00</span></li>
              </ul>

              <div className="mt-8 space-y-3">
                <button type="button" className="text-xs px-4 py-3.5 w-full font-black tracking-widest bg-gradient-to-r from-[#8B0000] to-[#B22222] text-white rounded uppercase shadow-lg hover:brightness-125 transition-all border-b-4 border-[#4a0000] active:border-0 active:translate-y-1">
                  Track Dispatch
                </button>
                <button type="button" className="text-xs px-4 py-3.5 w-full font-black tracking-widest bg-transparent text-[#C5B358] border-2 border-[#C5B358] rounded uppercase hover:bg-[#C5B358] hover:text-[#0f2812] transition-all">
                  Return to Base
                </button>
              </div>
            </div>
          </div>

          {/* Main Content: Gear Manifest */}
          <div className="lg:col-span-2 space-y-6 lg:pl-12 max-lg:-order-1">
            <h3 className="text-lg font-black text-white uppercase tracking-widest mb-6">Gear Manifest</h3>
            
            <div className="space-y-4">
              {[
                { name: 'Velvet Sneaker', size: 'MD', price: '$20.00', img: 'product14.webp' },
                { name: 'Smart Watch Timex', size: 'SM', price: '$60.00', img: 'watch5.webp' },
                { name: 'French Connection', size: 'LG', price: '$40.00', img: 'watch4.webp' }
              ].map((item, idx) => (
                <div key={idx} className="group">
                  <div className="grid sm:grid-cols-3 items-center gap-4 bg-[#1a3c1d]/20 p-4 border border-white/5 hover:border-[#C5B358]/30 transition-all rounded-md">
                    <div className="col-span-2 flex items-center gap-6">
                      <div className="w-24 h-24 shrink-0 bg-[#0f2812] p-2 rounded border border-[#C5B358]/20 group-hover:border-[#C5B358]/50 transition-all">
                        <img src={`https://readymadeui.com/images/${item.img}`} className="w-full h-full object-contain brightness-90" alt={item.name} />
                      </div>
                      <div>
                        <h3 className="text-lg font-black text-white uppercase tracking-tight">{item.name}</h3>
                        <div className="mt-2 flex gap-4">
                          <p className="text-[10px] font-black text-[#C5B358] uppercase bg-white/5 px-2 py-1">Size: {item.size}</p>
                          <p className="text-[10px] font-black text-white/40 uppercase bg-white/5 px-2 py-1">Qty: 1</p>
                        </div>
                      </div>
                    </div>
                    <div className="sm:ml-auto text-right">
                      <h4 className="text-xl font-black text-[#C5B358]">{item.price}</h4>
                    </div>
                  </div>
                  {idx !== 2 && <hr className="border-white/5 mt-4" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderDetails;