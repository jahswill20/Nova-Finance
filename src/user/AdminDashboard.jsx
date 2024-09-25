import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebaseconfig';
import { collection, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore';
import { Dialog } from '@headlessui/react';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [kycRequests, setKycRequests] = useState([]);
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
        const usersData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setUsers(usersData);
      } catch (err) {
        console.error(err);
        setError('An error occurred while fetching users.');
      }
    };

    const fetchKycRequests = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'kycRequests'));
        const requests = querySnapshot.docs.map(doc => doc.data());
        setKycRequests(requests);
      } catch (err) {
        console.error(err);
        setError('An error occurred while fetching KYC requests.');
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
      setUsers(users.map(u => u.id === user.id ? { ...u, accountLevel: 2 } : u));
      setShowUpgradePopup(false);
    } catch (err) {
      console.error(err);
      setError('An error occurred while upgrading the user.');
    }
  };

  const handleSendMoney = async () => {
    try {
      const userDoc = doc(db, 'users', selectedUser.id);
      const newBalance = parseFloat(selectedUser.accountBalance) + parseFloat(amount);
      await updateDoc(userDoc, {
        accountBalance: newBalance,
      });
      setUsers(users.map(u => u.id === selectedUser.id ? { ...u, accountBalance: newBalance } : u));
      setShowSendMoneyPopup(false);
      setAmount('');
    } catch (err) {
      console.error(err);
      setError('An error occurred while sending money.');
    }
  };

  if (loading) {
    return <div className='w-full absolute min-h-screen bg-green-100 flex justify-center items-center'>
        <h1 className='text-xl font-bold'>Loading...</h1>
    </div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Users</h2>
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2">Name</th>
              <th className="py-2">Balance</th>
              <th className="py-2">Account Level</th>
              <th className="py-2">Actions</th>
            </tr>
          </thead>
          <tbody className="h-24">
            {users.map((user, index) => (
              <tr key={index} className="border-t">
                <td className="py-2">{user.username}</td>
                <td className="py-2">{user.accountBalance}</td>
                <td className="py-2">{user.accountLevel}</td>
                <td className="py-2">
                  {user.accountLevel < 2 && (
                    <button
                      onClick={() => {
                        setSelectedUser(user);
                        setShowUpgradePopup(true);
                      }}
                      className="bg-blue-500 h-10 w-32 mb-3 flex text-white py-1 px-3 rounded-lg mr-2"
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

      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl mx-auto mt-6">
        <h2 className="text-2xl font-bold mb-6">KYC Requests</h2>
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2">User ID</th>
              <th className="py-2">ID Type</th>
              <th className="py-2">ID Number</th>
              <th className="py-2">ID Image</th>
              <th className="py-2">Status</th>
            </tr>
          </thead>
          <tbody className='md:ml-15'>
            {kycRequests.map((request, index) => (
              <tr key={index} className="border-t">
                <td className="py-2">{request.uid}</td>
                <td className="py-2">{request.idType}</td>
                <td className="py-2">{request.idNumber}</td>
                <td className="py-2">
                  <a href={request.idImageUrl} target="_blank" rel="noopener noreferrer">
                    View Image
                  </a>
                </td>
                <td className="py-2">{request.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Upgrade to Level 2 Popup */}
      <Dialog open={showUpgradePopup} onClose={() => setShowUpgradePopup(false)}>
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <Dialog.Title className="text-lg font-bold">Upgrade to Level 2</Dialog.Title>
            <div className="mt-4">
              <p>Are you sure you want to upgrade {selectedUser?.username} to level 2?</p>
              <button
                onClick={() => handleUpgrade(selectedUser)}
                className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg"
              >
                Yes
              </button>
              <button
                onClick={() => setShowUpgradePopup(false)}
                className="mt-4 ml-5 bg-gray-500 text-white py-2 px-4 rounded-lg"
              >
                No
              </button>
            </div>
          </div>
        </div>
      </Dialog>

      {/* Send Money Popup */}
      <Dialog open={showSendMoneyPopup} onClose={() => setShowSendMoneyPopup(false)}>
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <Dialog.Title className="text-lg font-bold">Send Money</Dialog.Title>
            <div className="mt-4">
              <p>Send money to {selectedUser?.username}</p>
              <input
                type="number"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
              <button
                onClick={handleSendMoney}
                className="mt-4  bg-green-500 text-white py-2 px-4 rounded-lg"
              >
                Send
              </button>
              <button
                onClick={() => setShowSendMoneyPopup(false)}
                className="mt-4 ml-5 bg-gray-500 text-white py-2 px-4 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
