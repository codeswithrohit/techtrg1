import React from 'react'

const Login = () => {
  return (
    <div className="bg-[#0f2812] min-h-screen font-sans">
      <div className="flex items-center max-md:flex-col gap-6">
        
        {/* FORM SECTION */}
        <form className="max-w-lg w-full p-6 mx-auto">
          <div className="mb-12 border-l-4 border-[#C5B358] pl-6">
            <h1 className="text-white text-4xl font-black uppercase tracking-widest">Sign <span className="text-[#C5B358]">In</span></h1>
            <p className="text-white/60 text-xs mt-4 uppercase font-bold tracking-widest leading-relaxed">
              Personnel Authorization Required. Enter your credentials to access the tactical network.
            </p>
          </div>

          <div className="space-y-10">
            {/* Email Input */}
            <div className="relative flex items-center">
              <label className="text-[#C5B358] text-[11px] bg-[#0f2812] absolute px-2 top-[-10px] left-[18px] font-black uppercase tracking-widest z-10">
                Service Email
              </label>
              <input 
                type="email" 
                placeholder="operator@sector.com"
                className="px-4 py-4 bg-transparent w-full text-sm text-white border-2 border-white/10 focus:border-[#C5B358] rounded-sm outline-none transition-all placeholder:text-white/10" 
              />
              <svg xmlns="http://www.w3.org/2000/svg" fill="#C5B358" className="w-[18px] h-[18px] absolute right-4 opacity-50" viewBox="0 0 682.667 682.667">
                <g transform="matrix(1.33 0 0 -1.33 0 682.667)">
                  <path fill="none" stroke="#C5B358" strokeMiterlimit="10" strokeWidth="40" d="M452 444H60c-22.091 0-40-17.909-40-40v-39.446l212.127-157.782c14.17-10.54 33.576-10.54 47.746 0L492 364.554V404c0 22.091-17.909 40-40 40Z"></path>
                </g>
              </svg>
            </div>

            {/* Password Input */}
            <div className="relative flex items-center">
              <label className="text-[#C5B358] text-[11px] bg-[#0f2812] absolute px-2 top-[-10px] left-[18px] font-black uppercase tracking-widest z-10">
                Security Key
              </label>
              <input 
                type="password" 
                placeholder="••••••••"
                className="px-4 py-4 bg-transparent w-full text-sm text-white border-2 border-white/10 focus:border-[#C5B358] rounded-sm outline-none transition-all placeholder:text-white/10" 
              />
              <svg xmlns="http://www.w3.org/2000/svg" fill="#C5B358" className="w-[18px] h-[18px] absolute right-4 cursor-pointer opacity-50" viewBox="0 0 128 128">
                <path d="M64 104C22.127 104 1.367 67.496.504 65.943a4 4 0 0 1 0-3.887C1.367 60.504 22.127 24 64 24s62.633 36.504 63.496 38.057a4 4 0 0 1 0 3.887C126.633 67.496 105.873 104 64 104zM8.707 63.994C13.465 71.205 32.146 96 64 96c31.955 0 50.553-24.775 55.293-31.994C114.535 56.795 95.854 32 64 32 32.045 32 13.447 56.775 8.707 63.994zM64 88c-13.234 0-24-10.766-24-24s10.766-24 24-24 24 10.766 24 24-10.766 24-24 24zm0-40c-8.822 0-16 7.178-16 16s7.178 16 16 16 16-7.178 16-16-7.178-16-16-16z"></path>
              </svg>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center">
                <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 shrink-0 border-white/20 rounded accent-[#C5B358]" />
                <label htmlFor="remember-me" className="ml-3 block text-xs font-bold text-white/50 uppercase tracking-widest">
                  Maintain Session
                </label>
              </div>
              <div>
                <a href="#" className="text-[#C5B358] font-black text-xs uppercase tracking-widest hover:text-white transition-colors">
                  Key Recovery?
                </a>
              </div>
            </div>
          </div>

          <div className="mt-12">
            <button type="button" className="w-full shadow-2xl py-4 px-4 text-sm tracking-[0.2em] font-black rounded-sm text-white bg-gradient-to-r from-[#8B0000] to-[#B22222] border-b-4 border-[#4a0000] hover:brightness-110 active:translate-y-1 active:border-b-0 uppercase cursor-pointer transition-all">
              Authorize Access
            </button>
            <p className="text-xs text-white/40 mt-8 text-center font-bold uppercase tracking-widest">
              New Recruit? <a href="/register" className="text-[#C5B358] font-black hover:underline ml-1">Enlist Here</a>
            </p>
          </div>
        </form>

        {/* INFO SIDEBAR */}
        <div className="w-full md:max-w-96">
          <div className="flex flex-col justify-center space-y-16 md:h-screen min-h-full bg-[#1a3c1d] border-l border-white/10 lg:px-10 px-6 py-12 relative overflow-hidden">
            {/* Background Texture Effect */}
            <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
            
            <div className="relative z-10">
              <h4 className="text-[#C5B358] text-sm font-black uppercase tracking-widest border-b border-[#C5B358]/20 pb-2">Encrypted Comms</h4>
              <p className="text-xs text-white/70 mt-3 leading-relaxed font-medium">All data transmissions are secured via 256-bit tactical encryption protocols.</p>
            </div>
            
            <div className="relative z-10">
              <h4 className="text-[#C5B358] text-sm font-black uppercase tracking-widest border-b border-[#C5B358]/20 pb-2">Biometric Sync</h4>
              <p className="text-xs text-white/70 mt-3 leading-relaxed font-medium">Maintain session persistence across secured devices for immediate field access.</p>
            </div>
            
            <div className="relative z-10">
              <h4 className="text-[#C5B358] text-sm font-black uppercase tracking-widest border-b border-[#C5B358]/20 pb-2">Protocol 4-0-4</h4>
              <p className="text-xs text-white/70 mt-3 leading-relaxed font-medium">If security keys are compromised, initiate the recovery sequence immediately.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login;