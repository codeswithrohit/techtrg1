import React from 'react'

const Hero = () => {
  return (
    <div>
       <main>
			<div className="relative ">
				<div className="overflow-hidden h-[100vh] absolute -z-10 w-full mx-auto">
					<video autoPlay muted loop className="h-full w-full object-cover">
						<source src="Extra pt.MP4" type="video/mp4" />
					</video>
				</div>
				<div className="max-w-screen-sm lg:max-w-screen-xl  md:max-w-screen-md  sm:max-w-screen-sm h-[100vh] px-4 mx-auto flex items-center">
					<div className="text-left">
						<p className="mb-2 text-3xl leading-8 text-white">Learn the</p>
						<h1 className="text-2xl font-semibold tracking-normal text-white sm:text-5xl ">
							True Art of Defending
						</h1>
						{/* <div className="mt-6 flex items-center justify-left gap-x-6">
							<a
								href="/phase1"
								className="rounded-md bg-green px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-dark-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green"
							>
						View Courses
							</a>
							<a
								href="/Admin"
								className="rounded-md bg-green px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-dark-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green"
							>
						Add Courses
							</a>
						</div> */}
					</div>
				</div>
			</div>
			{/* <div>
				<div className="max-w-screen-xl mx-auto py-20">
					<p className="font-semibold text-green text-3xl text-center mb-10">
						We have Recruitment courses for
					</p>
					<div className="flex flex-col justify-evenly items-center md:flex-row">
						<div className="flex flex-col justify-center text-center">
							<img
								className="w-40 mx-auto"
								src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/ADGPI_Indian_Army.svg/790px-ADGPI_Indian_Army.svg.png"
								alt=""
							/>
							<p className="font-semibold text-xl mt-4 font-army">Indian Army</p>
						</div>
						<div className="flex flex-col justify-center items-center">
							<img
								className="w-28 mx-auto"
								src="https://upload.wikimedia.org/wikipedia/commons/0/04/Indian_Navy_Crest.png"
								alt=""
							/>
							<p className="font-semibold text-xl mt-4 font-army">Indian Navy</p>
						</div>
						<div className="flex flex-col justify-center">
							<img
								className="w-40 mx-auto"
								src="https://upload.wikimedia.org/wikipedia/commons/1/17/Badge_of_the_Indian_Air_Force.svg"
								alt=""
							/>
							<p className="font-semibold text-xl mt-4 font-army">Indian Air Force</p>
						</div>
						<div className="flex flex-col justify-center">
							<img
								className="w-40 mx-auto"
								src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/BSF_Logo.svg/969px-BSF_Logo.svg.png"
								alt=""
							/>
							<p className="font-semibold text-xl mt-4 font-army">
								Paramilitary Forces
							</p>
						</div>
					</div>
				</div>
			</div> */}
		
		</main>
    </div>
  )
}

export default Hero