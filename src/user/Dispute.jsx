import React, { useState } from 'react';
import { db } from '../firebaseconfig'; // Make sure this path is correct
import { collection, addDoc } from 'firebase/firestore';

const Dispute = () => {
  const [amount, setAmount] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [message, setMessage] = useState('');

  const generateReferenceNumber = () => {
    return `REF-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const refNumber = generateReferenceNumber();
    setReferenceNumber(refNumber);

    try {
      // Save dispute to Firestore
      await addDoc(collection(db, 'disputes'), {
        amount,
        accountNumber,
        referenceNumber: refNumber,
        status: 'pending',
        createdAt: new Date(),
      });

      setMessage(`Your dispute has been submitted. Your reference number is ${refNumber}. Please send this number to the admin and pay the processing fee.`);

      // Clear form fields
      setAmount('');
      setAccountNumber('');
    } catch (error) {
      console.error('Error submitting dispute:', error);
      setMessage('There was an error submitting your dispute. Please try again.');
    }
  };

  return (
    <div className="bg-gray-200 w-full min-h-screen flex flex-col items-center p-6">
      <h2 className="text-2xl font-bold mb-6">Report an Issue</h2>
      <div className="bg-white p-6 rounded-md shadow-md w-full max-w-lg">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="amount" className="block text-gray-700">Amount</label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="accountNumber" className="block text-gray-700">Recipient's Account Number</label>
            <input
              type="text"
              id="accountNumber"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded-lg w-full mt-4"
          >
            Submit Dispute
          </button>
        </form>
        {message && (
          <div className="mt-6 p-4 bg-green-100 text-green-700 rounded-lg">
            {message}
            <div className="mt-2">
              <button
                onClick={() => navigator.clipboard.writeText(referenceNumber)}
                className="text-blue-500 underline"
              >
                Copy Reference Number
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dispute;
