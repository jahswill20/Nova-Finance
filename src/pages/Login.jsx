import React, { useState } from 'react';
import logo from '../assets/Nova-Logo.jpeg';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const auth = getAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard', {replace: true});
    } catch (error) {
      setError(error.message);
      setIsLoading(false);
    }
  };
  document.title = 'Login your account | Nova finance'
 
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-700">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="flex justify-center mb-6">
          <img src={logo} alt="NovaFinance Logo" className="w-32 h-32 object-contain" />
        </div>
        <h2 className="text-2xl text-gray-700 font-bold mb-6 text-center">
          Login to NovaFinance 
        </h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              onChange={(e) => setEmail(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              onChange={(e) => setPassword(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex items-center justify-between">
          <button
              type="submit"
              className="bg-gray-700 rounded-md w-full hover:bg-gray-800 text-white font-bold py-2 px-4 focus:outline-none focus:shadow-outline"
            >
              {isLoading ? <p>Loading...</p> : <p>Login</p>}
            </button>
          </div>
          <div className="mt-7">
            <Link to="/signup">Don't have an account? Sign-Up.</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;