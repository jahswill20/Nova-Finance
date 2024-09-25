import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Hero from '../assets/hero1.jpeg';
import banking1 from '../assets/Banking1.png';
import appicon from '../assets/app.png';
import shield from '../assets/shield.png';
import support from '../assets/support.png';
import girl from '../assets/girl.png';
import callToActionBg from '../assets/callToActionBg.jpeg'; 
import aboutUsImg from '../assets/aboutUs.jpeg'; // replace with your About Us image
import { Link } from 'react-router-dom';
import { FaHeadset, FaLightbulb, FaUserFriends, FaShieldAlt } from 'react-icons/fa';


const Landingpage = () => {
  document.title='Nova Online Banking | bank safer with us';
  return (
    <>
      <section className='min-h-screen bg-white'>
  <Navbar />
  <div className='px-4 md:px-16 flex flex-col md:flex-row justify-between items-center md:gap-16 gap-8 mt-20 md:mt-14'>
    {/* Text content */}
    <div className='md:w-1/2 text-center md:text-left mt-12 md:mt-0'>
      <h1 className='text-4xl md:text-5xl font-bold text-[#073444] leading-tight'>
        We are Building the Future of Banking Just for You
      </h1>
      <p className='mt-6 text-gray-700 text-lg md:text-xl'>
        preparing you for financial independence, powering your financial future.
        Thousands of customers trust NovaFinance for their business and personal needs.
        Your financial journey starts here.
      </p>
      {/* Buttons */}
      <div className='flex justify-center md:justify-start gap-4 mt-8'>
        <Link to='/signup'>
          <button className='bg-[#133A5B] text-white py-3 px-6 rounded-md text-sm md:text-base font-bold shadow-md hover:bg-[#2f5445] transition-colors duration-300'>
            Create Account
          </button>
        </Link>
        <Link to='/signin'>
          <button className='bg-gray-200 text-gray-900 py-3 px-8 rounded-md text-sm md:text-base font-bold shadow-md hover:bg-gray-300 transition-colors duration-300'>
            Login
          </button>
        </Link>
      </div>
    </div>

    {/* Image container */}
    <div className='relative w-full max-w-md md:w-1/2'>
      <div className='absolute top-0 -left-4 bg-[#ebfadb] h-[350px] w-[350px] rounded-full -z-10'></div>
      <img src={Hero} alt="Hero" className='relative w-full h-auto rounded-xl shadow-lg' />
    </div>
  </div>
</section>


<section id='Products' className='px-4 md:px-16 mt-12'>
  <div className='flex flex-col md:flex-row items-center justify-center md:gap-3 md:-mt-24 text-center'>
    <h2 className='text-3xl md:text-4xl font-semibold mb-4 md:mb-0'>
      Our Banking Products
    </h2>
    <img src={banking1} alt="Banking Products" className='md:-mt-10 w-28 h-auto' />
  </div>
  <p className='text-center text-gray-800 font-semibold mt-4'>
    Enjoy several benefits and explore the awesome services we have to offer.
  </p>

  <div className='flex flex-col md:flex-row items-center justify-center mt-10 mb-12 space-y-8 md:space-y-0 md:space-x-8'>
    {/* Product 1: 24/7 Online Banking */}
    <div className='bg-white p-6 rounded-lg shadow-md w-full max-w-sm'>
      <img src={support} alt="Support" className='h-10 mb-4 mx-auto' />
      <h2 className='text-xl font-semibold mb-2 text-center'>24/7 Online Banking</h2>
      <p className='text-gray-700 text-center'>
        We provide you with 24/7 functional banking to help you run a reliable 
        freelance business and take your growth to the next level.
      </p>
    </div>

    {/* Product 2: Secure Transactions */}
    <div className='bg-white p-6 rounded-lg shadow-md w-full max-w-sm'>
      <img src={shield} alt="Secure Transactions" className='h-10 mb-4 mx-auto' />
      <h2 className='text-xl font-semibold mb-2 text-center'>Secure Transactions</h2>
      <p className='text-gray-700 text-center'>
        All transactions are safe and protected. We’re a registered finance banking 
        service and provide fast transfers. No good network? Don’t worry, we’ve got you covered.
      </p>
    </div>

    {/* Product 3: Mobile App */}
    <div className='bg-white p-6 rounded-lg shadow-md w-full max-w-sm'>
      <img src={appicon} alt="Mobile App" className='h-10 mb-4 mx-auto' />
      <h2 className='text-xl font-semibold mb-2 text-center'>Mobile App</h2>
      <p className='text-gray-700 text-center'>
        Sigah Pay offers a simple and easy-to-use mobile app, available in all countries. 
        Manage your funds seamlessly with quick responses and a serene ecosystem.
      </p>
    </div>
  </div>
</section>

<section className='flex flex-col md:flex-row px-4 md:px-16 justify-center items-center'>
  {/* Text Section */}
  <div className='max-w-sm space-y-6 mt-12 text-center md:text-left'>
    <h1 className='text-3xl md:text-4xl font-semibold'>Bank At Your Convenience</h1>
    <p className='text-gray-700'>
      We understand that your time is valuable, and that's why we offer a range of 
      flexible and accessible banking solutions tailored to your needs.
    </p>
    <Link to="/SignUp">
      <button className='bg-[#133A5B] px-6 py-3 mt-3 rounded-md text-white hover:bg-green-800 transition-colors duration-300'>
        Start Banking
      </button>
    </Link>
  </div>

  {/* Image Section */}
  <div className='relative mt-12 md:mt-0 md:ml-16'>
    <div className='bg-[#ebfadb] h-[380px] w-[300px] rounded-full flex items-center justify-center'>
      <img src={girl} alt="Girl" className='absolute h-[380px] w-auto object-cover rounded-full shadow-lg transform translate-y-4 md:translate-y-8' />
    </div>
  </div>
</section>


<section className='px-4 md:px-16 mt-12 py-12'>
  <h2 className='text-3xl text-center mb-8'>Why Choose Us</h2>
  <div className='flex flex-col md:flex-row items-center justify-center space-y-6 md:space-y-0 md:space-x-6'>
    
    <div className='bg-white p-6 rounded-lg shadow-md w-80'>
      <FaHeadset className='text-[#133A5B] text-4xl mb-4' />
      <h2 className='text-xl font-semibold mb-2'>Exceptional Customer Service</h2>
      <p className='text-gray-700'>
        Our dedicated support team is available 24/7 to assist you with any questions or issues.
      </p>
    </div>
    
    <div className='bg-white p-6 rounded-lg shadow-md w-80'>
      <FaLightbulb className='text-[#133A5B] text-4xl mb-4' />
      <h2 className='text-xl font-semibold mb-2'>Innovative Solutions</h2>
      <p className='text-gray-700'>
        We continuously develop new features and services to meet your evolving financial needs.
      </p>
    </div>

    <div className='bg-white p-6 rounded-lg shadow-md w-80'>
      <FaUserFriends className='text-[#133A5B] text-4xl mb-4' />
      <h2 className='text-xl font-semibold mb-2'>User-Friendly Interface</h2>
      <p className='text-gray-700'>
        Our platform is designed with you in mind, offering a seamless and intuitive user experience.
      </p>
    </div>

    <div className='bg-white p-6 rounded-lg shadow-md w-80'>
      <FaShieldAlt className='text-[#133A5B] text-4xl mb-4' />
      <h2 className='text-xl font-semibold mb-2'>Security You Can Trust</h2>
      <p className='text-gray-700'>
        We employ industry-standard security measures to ensure your data is protected at all times.
      </p>
    </div>
    
  </div>
</section>

      <section className='relative mt-12'>
        <div className='absolute inset-0 bg-cover bg-center' style={{ backgroundImage: `url(${callToActionBg})` }}></div>
        <div className='relative bg-black bg-opacity-50 text-white px-4 md:px-16 py-16 flex flex-col md:items-center'>
          <h2 className='text-3xl md:text-4xl mb-4'>Ready to Take Control of Your Finances?</h2>
          <p className='text-center mb-8'>Join thousands of satisfied customers who trust NovaFinance for their business and personal financial needs.</p>
          <Link to="/Signin"><button className='bg-[#133A5B] px-4 py-2 rounded-md'>Get Started</button></Link>
        </div>
      </section>

     <section id='About' className='px-4 md:px-16 py-16 bg-gray-50'>
  <div className='container mx-auto flex flex-col md:flex-row items-center'>
    {/* Image Section */}
    <div className='w-full md:w-1/2 mb-8 md:mb-0'>
      <div className='relative'>
        <img src={aboutUsImg} alt="About Us" className='rounded-lg shadow-lg' />
        <div className='absolute inset-0 bg-gradient-to-r from-gray-600 to-gray-700 opacity-50 rounded-lg'></div>
      </div>
    </div>
    
    {/* Text Section */}
    <div className='w-full md:w-1/2 md:pl-12'>
      <h2 className='text-4xl font-bold text-gray-900 mb-6'>Who We Are</h2>
      <p className='text-lg text-gray-700 leading-relaxed'>
        NovaFinance is committed to offering forward-thinking, reliable financial solutions that help individuals and businesses thrive. 
        With a focus on empowering our users, we provide the tools and insights needed to secure financial independence and stability.
      </p>
      <p className='text-lg text-gray-700 mt-4 leading-relaxed'>
        Our mission is rooted in trust and innovation, and we’re passionate about transforming the future of finance for everyone. 
        Whether you're managing personal finances or running a business, NovaFinance is here to support your journey to success.
      </p>
      <a href='/#' className='mt-6 inline-block bg-[#133A5B] text-white px-6 py-3 rounded-md text-sm font-semibold hover:bg-green-700 transition'>
        Learn More
      </a>
    </div>
  </div>
</section>
<Footer/>
    </>
  );
}

export default Landingpage;
