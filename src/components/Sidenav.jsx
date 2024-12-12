import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaTree, FaBars, FaTachometerAlt, FaExchangeAlt, FaMoneyCheckAlt, FaCreditCard, FaUserCheck, FaUserAlt, FaSignOutAlt, FaTimes } from 'react-icons/fa';
import { getAuth, signOut } from 'firebase/auth';
import Logo from '../assets/Nova-Logo.jpeg';

const Sidenav = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation(); // For active state tracking
    const navigate = useNavigate(); // For programmatic navigation

    // Toggle sidebar open/close
    const toggleSidenav = () => {
        setIsOpen(!isOpen);
    };

    const auth = getAuth();

    // Logout logic
    const handleLogout = async () => {
        try {
            await signOut(auth);
            setIsOpen(false); // Close the sidenav after logout
            navigate('/signIn', { replace: true });
        } catch (error) {
            console.error('Logout Error:', error);
        }
    };

    return (
        <div className="relative">
            {/* Header */}
            <header className="flex justify-between items-center bg-[#4e3629] rounded-md shadow-md p-4 text-white">
                <div className="flex items-center">
                    <FaTree className="text-2xl mr-4" />
                    <h1 className="text-lg font-bold">Nova Finance</h1>
                </div>
                <button onClick={toggleSidenav} className="text-2xl">
                    <FaBars />
                </button>
            </header>

            {/* Sidebar */}
            <div className={`fixed top-0 left-0 h-full w-64 bg-[#4e3629] text-white p-6 transition-transform transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>

                {/* Close Button */}
                <div className="flex justify-end">
                    <button onClick={toggleSidenav} className="text-2xl">
                        <FaTimes />
                    </button>
                </div>

                {/* Logo */}
                <img src={Logo} alt="Logo" className="h-24 rounded-full mx-auto mb-7" />

                {/* Navigation Links */}
                <nav className="space-y-6">
                    <Link
                        to="/dashboard"
                        className={`flex items-center text-lg cursor-pointer ${location.pathname === '/dashboard' ? 'text-yellow-400' : ''}`}
                    >
                        <FaTachometerAlt className="mr-3" /> Dashboard
                    </Link>
                    <Link
                        to="/withdrawal"
                        className={`flex items-center text-lg cursor-pointer ${location.pathname === '/withdrawal' ? 'text-yellow-400' : ''}`}
                    >
                        <FaExchangeAlt className="mr-3" /> Transfer
                    </Link>
                    <Link
                        to="/loan"
                        className={`flex items-center text-lg cursor-pointer ${location.pathname === '/loan' ? 'text-yellow-400' : ''}`}
                    >
                        <FaMoneyCheckAlt className="mr-3" /> Loan
                    </Link>
                    <Link
                        to="/cards"
                        className={`flex items-center text-lg cursor-pointer ${location.pathname === '/cards' ? 'text-yellow-400' : ''}`}
                    >
                        <FaCreditCard className="mr-3" /> Cards
                    </Link>
                    <Link
                        to="/kyc"
                        className={`flex items-center text-lg cursor-pointer ${location.pathname === '/kyc' ? 'text-yellow-400' : ''}`}
                    >
                        <FaUserCheck className="mr-3" /> KYC
                    </Link>
                    <Link
                        to="/profile"
                        className={`flex items-center text-lg cursor-pointer ${location.pathname === '/profile' ? 'text-yellow-400' : ''}`}
                    >
                        <FaUserAlt className="mr-3" /> Profile
                    </Link>

                    {/* Logout Button */}
                    <button onClick={handleLogout} className="flex items-center text-lg text-red-600 mt-5">
                        <FaSignOutAlt className="mr-3" /> Logout
                    </button>
                </nav>
            </div>

            {/* Overlay for closing the sidenav by clicking outside */}
            {/* {isOpen && <div className="fixed inset-0 bg-black opacity-50" onClick={toggleSidenav}></div>} */}
        </div>
    );
};

export default Sidenav;
