import React from 'react'

const Checkout = () => {
  return (
    <div className="bg-[#0f2812] min-h-screen font-sans">
      <div className="flex max-md:flex-col gap-12 max-lg:gap-4 h-full">
        
        {/* LEFT COLUMN: Order Summary (Sidebar) */}
        <div className="bg-[#1a3c1d] md:h-screen md:sticky md:top-0 md:min-w-[400px] border-r border-white/10 shadow-2xl">
          <div className="relative h-full">
            <div className="px-6 py-8 md:overflow-auto md:h-screen">
              <h2 className="text-[#C5B358] text-xl font-black uppercase tracking-widest mb-8">Manifest Summary</h2>
              
              <div className="space-y-6">
                {/* Item Block */}
                {[
                  { name: 'Black Sweater', qty: 2, price: 40, img: 'black-sweaters-1.webp' },
                  { name: 'Dark Green Tshirt', qty: 1, price: 16, img: 'dark-green-tshirt-2.webp' },
                  { name: 'Jacket', qty: 1, price: 16, img: 'green-jacket-3.webp' },
                  { name: 'Combat Sneakers', qty: 1, price: 16, img: 'product14.webp' }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-4 bg-[#0f2812]/50 p-3 rounded border border-white/5">
                    <div className="w-20 h-20 flex p-2 shrink-0 bg-[#1a3c1d] rounded border border-[#C5B358]/20">
                      <img src={`https://readymadeui.com/images/${item.img}`} className="w-full object-contain brightness-90" alt={item.name} />
                    </div>
                    <div className="w-full">
                      <h3 className="text-sm text-white font-bold uppercase tracking-tight">{item.name}</h3>
                      <ul className="text-xs text-white/60 space-y-1 mt-2">
                        <li className="flex justify-between">Qty <span>{item.qty}</span></li>
                        <li className="flex justify-between text-[#C5B358] font-bold">Price <span>${item.price}</span></li>
                      </ul>
                    </div>
                  </div>
                ))}
              </div>

              <hr className="border-white/10 my-8" />
              
              <div className="bg-[#0f2812]/80 p-6 rounded-lg border border-[#C5B358]/10">
                <ul className="text-white/70 font-bold space-y-4">
                  <li className="flex justify-between text-sm uppercase">Subtotal <span>$102.00</span></li>
                  <li className="flex justify-between text-sm uppercase">Logistics <span>$6.00</span></li>
                  <li className="flex justify-between text-sm uppercase">Service Tax <span>$5.00</span></li>
                  <hr className="border-white/10" />
                  <li className="flex justify-between text-lg font-black text-white uppercase tracking-tighter">
                    Total Pay <span className="text-[#C5B358]">$113.00</span>
                  </li>
                </ul>

                <div className="mt-8">
                  <button type="button" className="rounded px-4 py-4 w-full text-sm font-black tracking-widest bg-gradient-to-r from-[#8B0000] to-[#B22222] text-white cursor-pointer uppercase border-b-4 border-[#4a0000] active:translate-y-1 active:border-b-0 transition-all shadow-lg hover:brightness-110">
                  <a href='/orderdetails' >Pay Now</a>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Form Details */}
        <div className="max-w-4xl w-full h-max px-6 py-8 max-md:-order-1">
          <form className="space-y-12">
            {/* Delivery Section */}
            <section>
              <h2 className="text-2xl text-white font-black uppercase tracking-widest mb-8 border-l-4 border-[#C5B358] pl-4">
                Shipping Intelligence
              </h2>
              <div className="grid lg:grid-cols-2 gap-y-6 gap-x-6">
                {[
                  { label: 'First Name', type: 'text', placeholder: 'Enter First Name' },
                  { label: 'Last Name', type: 'text', placeholder: 'Enter Last Name' },
                  { label: 'Email Address', type: 'email', placeholder: 'Enter Email' },
                  { label: 'Comms No.', type: 'number', placeholder: 'Enter Phone No.' },
                  { label: 'Deployment Address', type: 'text', placeholder: 'Enter Address Line' },
                  { label: 'City', type: 'text', placeholder: 'Enter City' },
                  { label: 'State/Sector', type: 'text', placeholder: 'Enter State' },
                  { label: 'Zip Code', type: 'text', placeholder: 'Enter Zip Code' }
                ].map((input, idx) => (
                  <div key={idx}>
                    <label className="text-[10px] text-[#C5B358] font-black uppercase tracking-widest block mb-2">{input.label}</label>
                    <input 
                      type={input.type} 
                      placeholder={input.placeholder}
                      className="px-4 py-3 bg-[#1a3c1d]/50 border border-white/20 text-white w-full text-sm rounded focus:border-[#C5B358] outline-none transition-all placeholder:text-white/20" 
                    />
                  </div>
                ))}
              </div>
            </section>

            {/* Payment Section */}
            <section>
              <h2 className="text-2xl text-white font-black uppercase tracking-widest mb-8 border-l-4 border-[#C5B358] pl-4">
                Secure Payment
              </h2>
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Card Option */}
                <div className="bg-[#1a3c1d] p-5 rounded border-2 border-[#C5B358]/50 relative">
                  <div className="flex items-center">
                    <input type="radio" name="method" className="w-5 h-5 accent-[#C5B358] cursor-pointer" id="card" checked />
                    <label htmlFor="card" className="ml-4 flex gap-2 cursor-pointer">
                      <img src="https://readymadeui.com/images/visa.webp" className="w-10 grayscale brightness-200" alt="visa" />
                      <img src="https://readymadeui.com/images/master.webp" className="w-10 grayscale brightness-200" alt="master" />
                    </label>
                  </div>
                  <p className="mt-4 text-[10px] text-white/50 font-bold uppercase tracking-tight">Encrypted Credit/Debit Transfer</p>
                </div>
                {/* PayPal Option */}
                <div className="bg-[#1a3c1d]/30 p-5 rounded border border-white/10 opacity-60">
                  <div className="flex items-center">
                    <input type="radio" name="method" className="w-5 h-5 accent-[#C5B358] cursor-pointer" id="paypal" />
                    <label htmlFor="paypal" className="ml-4 flex gap-2 cursor-pointer">
                      <img src="https://readymadeui.com/images/paypal.webp" className="w-16 grayscale brightness-200" alt="paypal" />
                    </label>
                  </div>
                  <p className="mt-4 text-[10px] text-white/50 font-bold uppercase tracking-tight">Paypal Secure Relay</p>
                </div>
              </div>
            </section>

            {/* Promo Code */}
            <section className="max-w-md bg-[#1a3c1d]/30 p-6 rounded border border-white/10">
              <p className="text-[#C5B358] text-[10px] font-black uppercase mb-3 tracking-widest">Authorization Code</p>
              <div className="flex gap-2">
                <input type="text" placeholder="PROMO CODE"
                  className="px-4 py-3 bg-[#0f2812] border border-white/10 text-white w-full text-sm rounded outline-none focus:border-[#C5B358] placeholder:text-white/10" />
                <button type='button' className="bg-[#C5B358] hover:bg-white text-[#0f2812] font-black px-6 rounded text-xs uppercase transition-all">
                  Apply
                </button>
              </div>
            </section>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Checkout;