import React, { useState } from 'react';
import Logo from '../assets/Nova-Logo.jpeg';
import MenuIcon from '../assets/menu-icon.png'; // Replace with your menu icon path
import CloseIcon from '../assets/close-icon.png'; // Replace with your close icon path

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className='relative'>
      {/* Navbar for desktop and mobile */}
      <nav className='px-4 md:px-16 py-2 flex justify-between items-center bg-white shadow-md'>
        <img src={Logo} alt="Logo" className='h-14 rounded-lg' />
        {/* Hamburger icon for mobile */}
        <div className='md:hidden' onClick={toggleMenu}>
          <img 
            src={isOpen ? CloseIcon : MenuIcon} 
            alt="Menu Icon" 
            className='h-8 w-8 transition-transform duration-300 transform hover:scale-110 cursor-pointer'
          />
        </div>
        {/* Desktop menu */}
        <ul className={`hidden md:flex gap-7 text-[#073444] transition-colors duration-300`}>
          <li className='py-2 md:py-0 hover:text-[#386546]'><a href="/AboutUs">About us</a></li>
          <li className='py-2 md:py-0 hover:text-[#386546]'><a href="#Products">Banking Products</a></li>
          <li className='border border-[#386546] rounded-md px-2 py-2 md:py-0 mt-2 md:mt-0 hover:bg-[#386546] hover:text-white transition-colors duration-300'>
            <a href="/SignIn">Get Started</a>
          </li>
        </ul>
      </nav>
      
      {/* Full-screen mobile menu */}
      <div className={`fixed inset-0 bg-white z-50 transform transition-transform duration-500 ${isOpen ? 'translate-y-0' : '-translate-y-full'}`}>
        {/* Close icon in the mobile menu */}
        <div className='flex justify-end p-4'>
          <img 
            src={CloseIcon} 
            alt="Close Icon" 
            className='h-8 w-8 cursor-pointer transition-transform transform hover:scale-110 duration-300' 
            onClick={toggleMenu} 
          />
        </div>
        {/* Mobile menu items */}
        <ul className='flex flex-col items-center space-y-6 py-10'>
          <li>
            <a href="/AboutUs" className='text-[#073444] text-xl hover:text-[#386546] transition-colors duration-300'>
              About us
            </a>
          </li>
          <li>
            <a href="#Products" className='text-[#073444] text-xl hover:text-[#386546] transition-colors duration-300'>
              Banking Products
            </a>
          </li>
          <li>
            <a href="/SignIn" className='border border-[#386546] rounded-md px-6 py-2 text-[#386546] text-xl hover:bg-[#386546] hover:text-white transition-colors duration-300'>
              Get Started
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Navbar;
