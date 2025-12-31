import React from 'react'

const Cart = () => {
  return (
    <div className="min-h-screen bg-[#0f2812] p-4 font-sans">
      <div className="w-full mx-auto py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          
          {/* LEFT COLUMN: Items List */}
          <div className="lg:col-span-2 bg-[#1a3c1d]/40 border border-white/5 p-6 rounded-lg backdrop-blur-sm">
            <h3 className="text-xl font-black text-[#C5B358] uppercase tracking-widest">Inventory List</h3>
            <hr className="border-white/10 mt-4 mb-8" />

            <div className="sm:space-y-6 space-y-8">
              {/* Product Item 1 */}
              <div className="grid sm:grid-cols-3 items-center gap-4 border-b border-white/5 pb-6">
                <div className="sm:col-span-2 flex sm:items-center max-sm:flex-col gap-6">
                  <div className="w-24 h-24 shrink-0 bg-[#0f2812] p-2 rounded border border-[#C5B358]/20">
                    <img src='https://readymadeui.com/images/product14.webp' className="w-full h-full object-contain" alt="item" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white uppercase">Velvet Sneaker</h4>
                    <h6 className="text-xs font-bold text-[#8B0000] uppercase cursor-pointer mt-1 hover:underline">Discard Item</h6>
                    
                    <div className="flex gap-4 mt-4">
                      {/* Size Selector */}
                      <div className="relative group">
                        <button type="button"
                          className="flex items-center px-3 py-1.5 border border-[#C5B358]/30 text-white text-xs font-bold cursor-pointer bg-white/5 rounded">
                          XL
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-2.5 fill-[#C5B358] inline ml-2.5" viewBox="0 0 24 24">
                            <path d="M11.99997 18.1669a2.38 2.38 0 0 1-1.68266-.69733l-9.52-9.52a2.38 2.38 0 1 1 3.36532-3.36532l7.83734 7.83734 7.83734-7.83734a2.38 2.38 0 1 1 3.36532 3.36532l-9.52 9.52a2.38 2.38 0 0 1-1.68266.69734z" />
                          </svg>
                        </button>
                      </div>

                      {/* Quantity Controller */}
                      <div className="flex items-center px-2.5 py-1.5 border border-[#C5B358]/30 text-white text-xs rounded bg-white/5">
                        <span className="cursor-pointer font-bold text-[#C5B358] hover:text-white">-</span>
                        <span className="mx-4 font-bold">02</span>
                        <span className="cursor-pointer font-bold text-[#C5B358] hover:text-white">+</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="sm:ml-auto">
                  <h4 className="text-xl font-black text-[#C5B358]">$40.00</h4>
                </div>
              </div>

              {/* Repeat items as needed... (simplified for code length) */}
            </div>
          </div>

          {/* RIGHT COLUMN: Summary */}
          <div className="bg-[#1a3c1d] border-2 border-[#C5B358]/20 rounded-lg p-6 md:sticky top-6 h-max shadow-2xl">
            <h3 className="text-xl font-black text-white uppercase tracking-widest">Order Summary</h3>
            <hr className="border-white/10 mt-4 mb-8" />

            <ul className="text-white/70 font-bold mt-8 space-y-4">
              <li className="flex flex-wrap gap-4 text-sm uppercase">Discount <span className="ml-auto text-[#C5B358]">$0.00</span></li>
              <li className="flex flex-wrap gap-4 text-sm uppercase">Logistics <span className="ml-auto text-[#C5B358]">$2.00</span></li>
              <li className="flex flex-wrap gap-4 text-sm uppercase">Service Tax <span className="ml-auto text-[#C5B358]">$4.00</span></li>
              <li className="flex flex-wrap gap-4 text-lg text-white border-t border-white/10 pt-4 font-black">
                TOTAL <span className="ml-auto text-[#C5B358]">$216.00</span>
              </li>
            </ul>

            <div className="mt-8 space-y-3">
              {/* Checkout Button - Regimental Red */}
              <button type="button" className="text-sm px-4 py-3.5 w-full font-black tracking-widest bg-gradient-to-r from-[#8B0000] to-[#B22222] text-white rounded uppercase shadow-lg hover:brightness-125 transition-all border-b-4 border-[#4a0000] active:border-0 active:translate-y-1">
              <a href='/checkout' >Proceed to Checkout</a>  
              </button>
              {/* Continue Shopping - Transparent/Gold */}
              <button type="button" className="text-sm px-4 py-3.5 w-full font-black tracking-widest bg-transparent text-[#C5B358] border-2 border-[#C5B358] rounded uppercase hover:bg-[#C5B358] hover:text-[#0f2812] transition-all">
                Add More Gear
              </button>
            </div>

            {/* Promo Code Section */}
            <div className="mt-8 pt-6 border-t border-white/10">
              <p className="text-white text-xs font-black uppercase mb-3 tracking-tighter">Auth Code / Promo</p>
              <div className="flex border border-[#C5B358]/40 overflow-hidden rounded bg-[#0f2812]">
                <input type="text" placeholder="ENTER CODE"
                  className="w-full outline-0 bg-transparent text-white text-sm px-4 py-2.5 placeholder:text-white/20" />
                <button type='button' className="bg-[#C5B358] px-4 text-xs font-black text-[#0f2812] uppercase hover:bg-white transition-colors">
                  Apply
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Cart;