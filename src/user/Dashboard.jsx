import React, { useEffect, useState } from 'react';
import { FaPlane, FaPaypal, FaSchool, FaBitcoin, FaMoneyBillWave, FaPiggyBank, FaEye, FaEyeSlash } from 'react-icons/fa';
import { RiExchangeDollarFill } from 'react-icons/ri';
import { FaHome, FaUserCircle, FaUserTie, FaWallet } from 'react-icons/fa';
import { RiLogoutBoxRLine } from 'react-icons/ri';
import { auth, db } from '../firebaseconfig';
import { doc, getDoc, getDocs, query, where, collection } from 'firebase/firestore';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/Nova-Logo.jpeg';
import navbar from '../assets/menu-icon.png';
import { signOut } from 'firebase/auth';

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [showBalance, setShowBalance] = useState(true);
  const [transactions, setTransactions] = useState([]); // Add transaction state
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        }
      }
    };

    const fetchTransactions = async () => {
      const user = auth.currentUser;
      if (user) {
        const transactionsRef = collection(db, 'transactionHistory');
        const q = query(transactionsRef, where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        const transactionsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTransactions(transactionsData);
      }
    };

    fetchUserData();
    fetchTransactions();
  }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const toggleBalanceVisibility = () => {
    setShowBalance(!showBalance);
  };

  const handleLogout = () => {
    signOut(auth).then(() => {
      setIsOpen(!isOpen);
      navigate('/signIn', { replace: true });
    });
  };

  const contactAdmin = () => {
    alert('Contact admin to deposit');
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`fixed lg:relative bg-gray-200 top-0 left-0  h-full w-64 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform`}>
        <div className="p-6">
          <img src={logo} alt="Logo" className="h-16 mx-auto mb-8 rounded-lg shadow-md" onClick={() => navigate('/')} />
          <ul className="space-y-6">
            <li>
              <Link to="/Profile" className="block text-lg font-medium hover:text-white">
                Profile
              </Link>
            </li>
            <li>
              <Link to="/Kyc" className="block text-lg font-medium hover:text-white">
                KYC
              </Link>
            </li>
            <li>
              <Link to="/Withdrawal" className="block text-lg font-medium hover:text-white">
                Withdrawal
              </Link>
            </li>
          </ul>
          <button onClick={handleLogout} className="mt-8 block w-full bg-gray-700 text-white py-2 rounded-lg hover:bg-blue-600">
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 lg:ml-64 bg-gray-100 min-h-screen">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Nova Dashboard</h1>
          <img src={navbar} alt="Menu" className="h-8 cursor-pointer lg:hidden" onClick={toggleSidebar} />
        </div>

        <h2 className="text-2xl font-semibold mb-6">Welcome back, {userData?.username || 'User'}</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between">
              <h3 className="text-xl font-semibold">Account Balance</h3>
              <button onClick={toggleBalanceVisibility}>
                {showBalance ? <FaEyeSlash className="text-gray-500" /> : <FaEye className="text-gray-500" />}
              </button>
            </div>
            <div className="mt-4 flex justify-between">
              <div className="flex">
                <span className="text-2xl font-medium">{userData?.country || 'USD'}</span>
                {showBalance ? (
                  <span className="block text-3xl font-bold ml-3">{userData?.accountBalance?.toLocaleString() || '0.00'}</span>
                ) : (
                  <span className="block text-3xl font-bold ml-3 -mt-1 ">****</span>
                )}
              </div>
              <button onClick={contactAdmin} className="bg-gray-700 text-white text-bold py-2 px-3 rounded-md ">
                + Add money
              </button>
            </div>
            <p className="mt-4 text-gray-600">Account Number: {userData?.number?.slice(1) || 'N/A'}</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold">Income Balance</h3>
            <div className="mt-4 flex items-center">
              <FaMoneyBillWave className="text-green-500 text-2xl mr-3" />
              <span className="text-3xl font-bold">0.00</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold">Savings Balance</h3>
            <div className="mt-4 flex items-center">
              <FaPiggyBank className="text-yellow-500 text-2xl mr-3" />
              <span className="text-3xl font-bold">0.00</span>
            </div>
          </div>
        </div>

        {/* Operations Section */}
        <div className="bg-white p-8 rounded-lg shadow-md mb-12">
          <h3 className="text-2xl font-semibold mb-6">Operations</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
            {[
              { icon: <FaPlane className="text-blue-600 text-3xl" />, text: 'Withdraw to Bank', link: '/Withdrawal' },
              { icon: <FaPaypal className="text-blue-600 text-3xl" />, text: 'Withdraw to PayPal', link: '/Paypal' },
              { icon: <FaSchool className="text-purple-600 text-3xl" />, text: 'Withdraw to Skrill', link: '/Skrill' },
              { icon: <RiExchangeDollarFill className="text-yellow-600 text-3xl" />, text: 'Withdraw to Binance', link: '/Binance' },
              { icon: <FaBitcoin className="text-orange-600 text-3xl" />, text: 'Withdraw to Bitcoin', link: '/Bitcoin' },
            ].map((operation, idx) => (
              <Link key={idx} to={operation.link} className="text-center hover:bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-center mb-2">{operation.icon}</div>
                <span className="text-sm font-medium">{operation.text}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Transaction History Section */}
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h3 className="text-2xl font-semibold mb-6">Transaction History</h3>
          <table className="min-w-full bg-white">
            <thead>
              <tr className="text-left">
                <th className="py-2 px-4 border-b">Date</th>
                <th className="py-2 px-4 border-b">Amount</th>
                <th className="py-2 px-4 border-b">Type</th>
                <th className="py-2 px-4 border-b">Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td className="py-2 px-4 border-b">{new Date(transaction.date.seconds * 1000).toLocaleDateString()}</td>
                  <td className="py-2 px-4 border-b">{transaction.amount}</td>
                  <td className="py-2 px-4 border-b">{transaction.type}</td>
                  <td className="py-2 px-4 border-b">
                    <span className="text-green-500">Success</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
