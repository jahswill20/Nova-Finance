import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebaseconfig';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { Dialog } from '@headlessui/react';
import { FaUser, FaSearch, FaBarcode, FaLevelUpAlt, FaEye, FaSpinner } from 'react-icons/fa';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [accountLevel, setAccountLevel] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showActionPopup, setShowActionPopup] = useState(false);
  const [isGeneratingVat, setIsGeneratingVat] = useState(false);
  const [isGeneratingBvt, setIsGeneratingBvt] = useState(false);
  const [isUpgradingLevel, setIsUpgradingLevel] = useState(false);
  const [isTogglingTransaction, setIsTogglingTransaction] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'users'));
        const usersData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(usersData);
        setFilteredUsers(usersData);
      } catch (err) {
        console.error(err);
        setError('An error occurred while fetching users.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const results = users.filter(user =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(results);
  }, [searchTerm, users]);

  const handleGenerateVatCode = async () => {
    try {
      setIsGeneratingVat(true);
      const userDoc = doc(db, 'users', selectedUser.id);
      const vatCode = Math.floor(1000 + Math.random() * 9000);
      await updateDoc(userDoc, { vatCode });
      setUsers(users.map(u => u.id === selectedUser.id ? { ...u, vatCode } : u));
      setShowActionPopup(false);
    } catch (err) {
      console.error('Error generating VAT code:', err);
      setError('An error occurred while generating the VAT code.');
    } finally {
      setIsGeneratingVat(false);
    }
  };
  const handleGenerateBvtCode = async () => {
    try {
      setIsGeneratingBvt(true);
      const userDoc = doc(db, 'users', selectedUser.id);
      const bvtCode = Math.floor(100000 + Math.random() * 900000); // 6-digit code
      await updateDoc(userDoc, { bvtCode });
      setUsers(users.map(u => u.id === selectedUser.id ? { ...u, bvtCode } : u));
      setShowActionPopup(false);
    } catch (err) {
      console.error('Error generating BVT code:', err);
      setError('An error occurred while generating the BVT code.');
    } finally {
      setIsGeneratingBvt(false);
    }
  };

  const handleUpgradeLevel = async () => {
    try {
      setIsUpgradingLevel(true);
      const userDoc = doc(db, 'users', selectedUser.id);
      await updateDoc(userDoc, { accountLevel });
      setUsers(users.map(u => u.id === selectedUser.id ? { ...u, accountLevel } : u));
      setShowActionPopup(false);
      setAccountLevel('');
    } catch (err) {
      console.error('Error upgrading user level:', err);
      setError('An error occurred while upgrading the user level.');
    } finally {
      setIsUpgradingLevel(false);
    }
  };

  const handleToggleTransaction = async () => {
    try {
      setIsTogglingTransaction(true);
      const userDoc = doc(db, 'users', selectedUser.id);
      const newTransactionEnabled = !selectedUser.transactionEnabled;
      await updateDoc(userDoc, { transactionEnabled: newTransactionEnabled });
      setUsers(users.map(u => u.id === selectedUser.id ? { ...u, transactionEnabled: newTransactionEnabled } : u));
      setShowActionPopup(false);
    } catch (err) {
      console.error('Error toggling transaction:', err);
      setError('An error occurred while toggling transaction status.');
    } finally {
      setIsTogglingTransaction(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full absolute min-h-screen bg-gray-100 flex justify-center items-center">
        <h1 className="text-xl font-bold">Loading...</h1>
      </div>
    );
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="bg-blue-600 text-white p-6 rounded-xl shadow-lg flex items-center gap-4">
            <FaUser className="text-3xl" />
            <div>
              <h2 className="text-2xl font-bold">{users.length}</h2>
              <p className="opacity-90">Total Users</p>
            </div>
          </div>

          <div className="w-full md:w-64 relative">
            <input
              type="text"
              placeholder="Search users..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-scroll">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Balance</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">VAT Code</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Level</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm">{user.username}</td>
                  <td className="px-6 py-4 text-sm">{user.country} {user.accountBalance?.toFixed(2)}</td>
                  <td className="px-6 py-4 text-sm">{user.vatCode || 'N/A'}</td>
                  <td className="px-6 py-4 text-sm capitalize">{user.accountLevel}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${user.transactionEnabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {user.transactionEnabled ? 'Active' : 'Disabled'}
                    </span>
                  </td>
                  <td className="px-6 py-4 space-x-2">
                    <button
                      onClick={() => navigate(`/admin/${user.id}`)}
                      className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                    >
                      <FaEye />
                      <span>View</span>
                    </button>
                    <button
                      onClick={() => {
                        setSelectedUser(user);
                        setShowActionPopup(true);
                      }}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      •••
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Action Popup */}
        <Dialog
          open={showActionPopup}
          onClose={() => setShowActionPopup(false)}
          className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center p-4"
        >
          <Dialog.Panel className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <Dialog.Title className="text-xl font-bold">{selectedUser?.username}</Dialog.Title>
              <button onClick={() => setShowActionPopup(false)}>✕</button>
            </div>

            <div className="space-y-4">
              {/* Transaction Toggle */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span>Transaction Status</span>
                <button
                  onClick={handleToggleTransaction}
                  disabled={isTogglingTransaction}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${selectedUser?.transactionEnabled ? 'bg-green-500' : 'bg-gray-300'
                    } ${isTogglingTransaction ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${selectedUser?.transactionEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  {isTogglingTransaction && (
                    <FaSpinner className="animate-spin absolute inset-0 m-auto" />
                  )}
                </button>
              </div>

              {/* Account Level Upgrade */}
              <div className="space-y-2">
                <input
                  type="text"
                  value={accountLevel}
                  onChange={(e) => setAccountLevel(e.target.value)}
                  placeholder="Enter account level"
                  className="w-full p-2 border rounded-lg"
                />
                <button
                  onClick={handleUpgradeLevel}
                  disabled={isUpgradingLevel}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUpgradingLevel ? (
                    <FaSpinner className="animate-spin inline mr-2" />
                  ) : (
                    <FaLevelUpAlt className="inline mr-2" />
                  )}
                  Upgrade Level
                </button>
              </div>

              {/* VAT Code Generator */}
              <button
                onClick={handleGenerateVatCode}
                disabled={isGeneratingVat}
                className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGeneratingVat ? (
                  <FaSpinner className="animate-spin inline mr-2" />
                ) : (
                  <FaBarcode className="inline mr-2" />
                )}
                Generate VAT Code
              </button>

              {/* BVT Code Generator */}
              <button
                onClick={handleGenerateBvtCode}
                disabled={isGeneratingBvt}
                className="w-full bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGeneratingBvt ? (
                  <FaSpinner className="animate-spin inline mr-2" />
                ) : (
                  <FaBarcode className="inline mr-2" />
                )}
                Generate BVT Code
              </button>
            </div>
          </Dialog.Panel>
        </Dialog>
      </div>
    </div>
  );
};

export default AdminDashboard;