import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebaseconfig';
import { collection, getDocs, doc, updateDoc, setDoc } from 'firebase/firestore';
import { Dialog } from '@headlessui/react';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [kycRequests, setKycRequests] = useState([]);
  const [transactions, setTransactions] = useState([]); // State for transaction history
  const [selectedUser, setSelectedUser] = useState(null);
  const [amount, setAmount] = useState('');
  const [showUpgradePopup, setShowUpgradePopup] = useState(false);
  const [showSendMoneyPopup, setShowSendMoneyPopup] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        fetchUsers();
        fetchKycRequests();
        fetchTransactions(); // Fetch transaction history
      } catch (err) {
        console.error(err);
        setError('An error occurred while checking admin status.');
      } finally {
        setLoading(false);
      }
    };

    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'users'));
        const usersData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(usersData);
      } catch (err) {
        console.error(err);
        setError('An error occurred while fetching users.');
      }
    };

    const fetchKycRequests = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'kycRequests'));
        const requests = querySnapshot.docs.map((doc) => doc.data());
        setKycRequests(requests);
      } catch (err) {
        console.error(err);
        setError('An error occurred while fetching KYC requests.');
      }
    };

    const fetchTransactions = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'transactionHistory'));
        const transactionsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTransactions(transactionsData);
      } catch (err) {
        console.error(err);
        setError('An error occurred while fetching transactions.');
      }
    };

    checkAdmin();
  }, [navigate]);

  const handleUpgrade = async (user) => {
    try {
      const userDoc = doc(db, 'users', user.id);
      await updateDoc(userDoc, {
        accountLevel: 2,
      });
      setUsers(
        users.map((u) => (u.id === user.id ? { ...u, accountLevel: 2 } : u))
      );
      setShowUpgradePopup(false);
    } catch (err) {
      console.error(err);
      setError('An error occurred while upgrading the user.');
    }
  };

  const handleSendMoney = async () => {
    try {
      const userDoc = doc(db, 'users', selectedUser.id);
      const newBalance =
        parseFloat(selectedUser.accountBalance) + parseFloat(amount);

      // Update user balance
      await updateDoc(userDoc, {
        accountBalance: newBalance,
      });

      // Store transaction in the transactionHistory collection
      const transactionDoc = doc(collection(db, 'transactionHistory')); // Creates a new document with an auto-generated ID
      await setDoc(transactionDoc, {
        userId: selectedUser.id,
        amount: parseFloat(amount),
        transactionType: 'credit', // Record the type of transaction (credit in this case)
        date: new Date().toISOString(), // Use current time
      });

      // Update the local state to reflect the balance change
      setUsers(
        users.map((u) =>
          u.id === selectedUser.id
            ? { ...u, accountBalance: newBalance }
            : u
        )
      );
      setShowSendMoneyPopup(false);
      setAmount('');
    } catch (err) {
      console.error('Error occurred while sending money or storing transaction:', err);
      setError('An error occurred while sending money or storing the transaction.');
    }
  };

  if (loading) {
    return (
      <div className="w-full absolute min-h-screen bg-green-100 flex justify-center items-center">
        <h1 className="text-xl font-bold">Loading...</h1>
      </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      {/* Total Users Section */}
      <div className="bg-white p-4 mb-6 rounded-lg shadow-lg text-center">
        <h2 className="text-lg font-bold">Total Users: {users.length}</h2>
      </div>

      {/* Users Table */}
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Users</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="text-left">
                <th className="py-2 px-4 border">Name</th>
                <th className="py-2 px-4 border">Balance</th>
                <th className="py-2 px-4 border">Account Level</th>
                <th className="py-2 px-4 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={index} className="border-t">
                  <td className="py-2 px-4 border">{user.username}</td>
                  <td className="py-2 px-4 border">{user.accountBalance}</td>
                  <td className="py-2 px-4 border">{user.accountLevel}</td>
                  <td className="py-2 px-4 border flex gap-2">
                    {user.accountLevel < 2 && (
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setShowUpgradePopup(true);
                        }}
                        className="bg-blue-500 text-white py-1 px-3 rounded-lg"
                      >
                        Upgrade Level
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setSelectedUser(user);
                        setShowSendMoneyPopup(true);
                      }}
                      className="bg-green-500 text-white py-1 px-3 rounded-lg"
                    >
                      Send Money
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transaction History Table */}
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl mx-auto mt-6">
        <h2 className="text-2xl font-bold mb-6">Transaction History</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="text-left">
                <th className="py-2 px-4 border">User ID</th>
                <th className="py-2 px-4 border">Amount</th>
                <th className="py-2 px-4 border">Transaction Type</th>
                <th className="py-2 px-4 border">Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction, index) => (
                <tr key={index} className="border-t">
                  <td className="py-2 px-4 border">{transaction.userId}</td>
                  <td className="py-2 px-4 border">{transaction.amount}</td>
                  <td className="py-2 px-4 border">{transaction.transactionType}</td>
                  <td className="py-2 px-4 border">{transaction.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* KYC Requests Table */}
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl mx-auto mt-6">
        <h2 className="text-2xl font-bold mb-6">KYC Requests</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="text-left">
                <th className="py-2 px-4 border">KYC Information</th>
              </tr>
            </thead>
            <tbody>
              {kycRequests.map((request, index) => (
                <tr key={index} className="border-t">
                  <td className="py-2 px-4 border">{request.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Send Money Popup */}
      {showSendMoneyPopup && (
        <Dialog
          open={showSendMoneyPopup}
          onClose={() => setShowSendMoneyPopup(false)}
          className="fixed z-10 inset-0 overflow-y-auto"
        >
          <div className="flex items-center justify-center min-h-screen">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
              <h2 className="text-lg font-bold mb-4">
                Send Money to {selectedUser.username}
              </h2>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full border p-2 rounded-lg mb-4"
                placeholder="Enter amount"
              />
              <button
                onClick={handleSendMoney}
                className="bg-green-500 text-white py-2 px-4 rounded-lg"
              >
                Send Money
              </button>
            </div>
          </div>
        </Dialog>
      )}

      {/* Upgrade Account Popup */}
      {showUpgradePopup && (
        <Dialog
          open={showUpgradePopup}
          onClose={() => setShowUpgradePopup(false)}
          className="fixed z-10 inset-0 overflow-y-auto"
        >
          <div className="flex items-center justify-center min-h-screen">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
              <h2 className="text-lg font-bold mb-4">
                Upgrade Account for {selectedUser.username}
              </h2>
              <button
                onClick={() => handleUpgrade(selectedUser)}
                className="bg-blue-500 text-white py-2 px-4 rounded-lg"
              >
                Upgrade to Level 2
              </button>
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
};

export default AdminDashboard;
