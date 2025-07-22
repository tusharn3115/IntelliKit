import React from 'react'
import {PricingTable} from '@clerk/clerk-react'

const Plans = () => {
  return (
    <div id='plans' className='max-w-2xl mx-auto z-20 pb-24'>
        <div className='text-center'>
            <h2 className='text-slate-700 text-[42px] font-semibold'>Find Your Ideal Plan</h2>
            <p className='text-gray-500 max-w-lg mx-auto'>Begin with a free plan and scale seamlessly as your needs expand. Discover the ideal solution for your content creation journey.</p>
        </div>

        <div className='mt-14 max-sm:mx-8'>
            <PricingTable />
        </div>
    </div>
  )
}

export default Plans