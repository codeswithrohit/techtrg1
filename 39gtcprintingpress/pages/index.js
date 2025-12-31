import Featured from '@/components/Featured'
import HeroSection from '@/components/Hero'
import Product from '@/components/Product'
import React from 'react'

const index = () => {
  return (
    <div className='min-h-screen' >
      <HeroSection/>
      <Featured/>
      <Product/>
    </div>
  )
}

export default index