import React from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import AiTools from '../components/AiTools'
import TrustedBrands from '../components/TrustedBrands'
import Testimonial from '../components/Testimonial'
import Plans from '../components/Plans'
import Footer from '../components/Footer'

const Home = () => {
  return (
    <>
        <Navbar />
        <Hero />
        <TrustedBrands />
        <AiTools />
        <Testimonial />
        <Plans /> 
        <Footer />
    </>
  )
}

export default Home