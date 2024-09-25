import React from 'react';

const Footer = () => {
  return (
    <div>
       <footer className='bg-gray-900 text-white py-8'>
  <div className='px-4 md:px-16'>
    {/* Upper Section */}
    <div className='flex flex-col md:flex-row justify-between items-start md:items-center'>
      {/* Company Information */}
      <div className='mb-6 md:mb-0'>
        <h2 className='text-2xl font-semibold'>NovaFinance</h2>
        <p className='mt-2 text-gray-400'>
          Building the future of finance for you.
        </p>
      </div>
      {/* Quick Links */}
      <div className='flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-8'>
        <a href='#' className='hover:underline'>Home</a>
        <a href='#' className='hover:underline'>About Us</a>
        <a href='#' className='hover:underline'>Contact</a>
      </div>
      {/* Subscription Form */}
      <div className='mt-6 md:mt-0'>
        <h3 className='text-lg font-medium mb-2'>Subscribe for Updates</h3>
        <form className='flex space-x-2'>
          <input 
            type='email' 
            placeholder='Your email' 
            className='px-4 py-2 w-full md:w-64 rounded-md focus:outline-none text-gray-900'
          />
          <button className='bg-green-600 px-4 py-2 rounded-md text-white hover:bg-green-700 transition duration-300'>
            Subscribe
          </button>
        </form>
      </div>
    </div>
    
    {/* Divider */}
    <div className='border-t border-gray-700 my-6'></div>

    {/* Lower Section */}
    <div className='flex flex-col md:flex-row justify-between items-center'>
      <p className='text-sm'>&copy; 2024 NovaFinance. All rights reserved.</p>
      {/* Contact Information */}
      <div className='mt-4 md:mt-0 flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-6'>
        <a href='mailto:NovaFinance@gmail.com' className='hover:underline'>Email: NovaFinance@gmail.com</a>
        <p>Phone: +1 (608) 814-1301</p>
      </div>
    </div>
  </div>
</footer>
    </div>
  );
}

export default Footer;
