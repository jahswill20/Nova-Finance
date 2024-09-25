import React from 'react';
import Vision from '../assets/Vision.jpeg';
import Mission from '../assets/Mission.jpeg';
import Team1 from '../assets/Team1.jpeg';
import Team2 from '../assets/Team2.jpeg';
import Team3 from '../assets/Team3.jpeg';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const AboutUs = () => {
  document.title = 'About Us | Nova-finance'
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar className="absolute -mt-11" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Introduction Section */}
        <div className="text-left">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">About Us</h1>
          <p className="text-lg text-gray-700 leading-relaxed">
            Welcome to Sigah Pay! We are dedicated to providing you with the best financial solutions.
          </p>
        </div>

        {/* Mission and Vision Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="flex flex-col justify-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              Our mission is to empower individuals and businesses with secure, efficient, and innovative payment solutions.
              We strive to make financial transactions easy, reliable, and accessible for everyone.
            </p>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Vision</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              We envision a world where financial services are seamless and inclusive, enabling growth and prosperity for all.
              At Sigah Pay, we are committed to driving the future of digital payments.
            </p>
          </div>
          <div className="flex items-center justify-center">
            <img
              src={Mission}
              alt="Mission and Vision"
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>
        </div>

        {/* Story and Values Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="flex items-center justify-center order-2 md:order-1">
            <img
              src={Vision}
              alt="Our Story"
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>
          <div className="order-1 md:order-2 flex flex-col justify-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Story</h2>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              Founded in 2024, Sigah Pay started with a simple idea: to make payments easier and more accessible for everyone.
              Over the years, we have grown into a leading provider of digital payment solutions, trusted by millions of users worldwide.
            </p>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Values</h2>
            <ul className="list-disc list-inside text-lg text-gray-700 leading-relaxed">
              <li className="mb-2">Integrity</li>
              <li className="mb-2">Innovation</li>
              <li className="mb-2">Customer Focus</li>
              <li className="mb-2">Excellence</li>
            </ul>
          </div>
        </div>

        {/* Team Section */}
        <div className="mt-16">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-8">Meet Our Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12">
            <div className="text-center">
              <img
                src={Team3}
                alt="Team Member 1"
                className="w-32 h-32 rounded-full mx-auto mb-4 shadow-lg"
              />
              <h3 className="text-xl font-semibold text-gray-900">Daniel cooper</h3>
              <p className="text-gray-700">CEO</p>
            </div>
            <div className="text-center">
              <img
                src={Team1}
                alt="Team Member 2"
                className="w-32 h-32 rounded-full mx-auto mb-4 shadow-lg"
              />
              <h3 className="text-xl font-semibold text-gray-900">Jane Smith</h3>
              <p className="text-gray-700">CTO</p>
            </div>
            <div className="text-center">
              <img
                src={Team2}
                alt="Team Member 3"
                className="w-32 h-32 rounded-full mx-auto mb-4 shadow-lg"
              />
              <h3 className="text-xl font-semibold text-gray-900">Richard Gabriel</h3>
              <p className="text-gray-700">COO</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 bg-gray-900 text-white py-12 rounded-lg shadow-lg">
          <h2 className="text-4xl font-bold text-center mb-8">Join Our Journey</h2>
          <p className="text-lg text-center mb-6 leading-relaxed">
            At Sigah Pay, we are always looking for talented individuals to join our team. 
            If you are passionate about innovation and making a difference, we would love to hear from you.
          </p>
          <div className="flex justify-center">
            <a
              href="mailto:NovaFinance@gmail.com"
              className="bg-blue-500 text-white py-3 px-8 rounded-lg shadow-lg hover:bg-blue-700 transition duration-300"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AboutUs;
