import React from 'react'
import {navLists} from '../constants'
import {appleImg, bagImg, searchImg} from '../utils';
const Navbar = () => {
  return (
    <header className="flex w-full items-center justify-between py-5 sm:px-10">
        <nav className='screen-max-width flex w-full'>
            <img src={appleImg} alt="Apple" width={14} height={18}/>
            <div className='flex flex-1 justify-center max-sm:hidden'>
                {navLists.map((nav)=>(
                    <div key={nav} className='transition:all cursor-pointer px-5 text-sm text-gray hover:text-white'>
                        {nav}
                    </div>
                ))}
            </div>
            <div className='flex items-baseline gap-7 max-sm:flex-1 max-sm:justify-end'>
                <img src={searchImg} alt="search" width={18} height={18}/>
                <img src={bagImg} alt="bag" width={18} height={18}/>
            </div>
        </nav>
    </header>
  )
}

export default Navbar