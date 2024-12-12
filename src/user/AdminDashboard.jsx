import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebaseconfig';
import { collection, getDocs, doc, updateDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { Dialog } from '@headlessui/react';
import { FaEllipsisV, FaMoneyBill, FaBarcode, FaDollarSign, FaLevelUpAlt } from 'react-icons/fa'; // Added FaLevelUpAlt for upgrade action

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loanAmount, setLoanAmount] = useState('');
  const [sendAmount, setSendAmount] = useState('');
  const [showActionPopup, setShowActionPopup] = useState(false);
  const [accountLevel, setAccountLevel] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
      } catch (err) {
        console.error(err);
        setError('An error occurred while fetching users.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [navigate]);

  // Handle Send Loan Logic
  const handleSendLoan = async () => {
    try {
      const userDoc = doc(db, 'users', selectedUser.id);
      const newLoanBalance =
        parseFloat(selectedUser.loanBalance || 0) + parseFloat(loanAmount);
      const newAccountBalance =
        parseFloat(selectedUser.accountBalance || 0) + parseFloat(loanAmount);

      await updateDoc(userDoc, {
        loanBalance: newLoanBalance,
        accountBalance: newAccountBalance,
      });

      await addDoc(collection(db, 'transactions'), {
        type: 'send_loan',
        amount: parseFloat(loanAmount),
        userId: selectedUser.id,
        date: serverTimestamp(),
        balance: newAccountBalance,
      });

      setUsers(
        users.map((u) =>
          u.id === selectedUser.id
            ? { ...u, loanBalance: newLoanBalance, accountBalance: newAccountBalance }
            : u
        )
      );

      setShowActionPopup(false);
      setLoanAmount('');
    } catch (err) {
      console.error('Error sending loan:', err);
      setError('An error occurred while sending the loan.');
    }
  };

  // Handle Send Money Logic
  const handleSendMoney = async () => {
    try {
      const userDoc = doc(db, 'users', selectedUser.id);
      const newBalance =
        parseFloat(selectedUser.accountBalance || 0) + parseFloat(sendAmount);

      await updateDoc(userDoc, {
        accountBalance: newBalance,
      });

      await addDoc(collection(db, 'transactions'), {
        type: 'send_money',
        amount: parseFloat(sendAmount),
        userId: selectedUser.id,
        date: serverTimestamp(),
        balance: newBalance,
      });

      setUsers(
        users.map((u) =>
          u.id === selectedUser.id ? { ...u, accountBalance: newBalance } : u
        )
      );
      setShowActionPopup(false);
      setSendAmount('');
    } catch (err) {
      console.error('Error sending money:', err);
      setError('An error occurred while sending the money.');
    }
  };

  // Handle Generate VAT Code Logic
  const handleGenerateVatCode = async () => {
    try {
      const userDoc = doc(db, 'users', selectedUser.id);
      const vatCode = Math.floor(1000 + Math.random() * 9000);

      await updateDoc(userDoc, {
        vatCode,
      });

      setUsers(
        users.map((u) =>
          u.id === selectedUser.id ? { ...u, vatCode } : u
        )
      );

      setShowActionPopup(false);
    } catch (err) {
      console.error('Error generating VAT code:', err);
      setError('An error occurred while generating the VAT code.');
    }
  };

  // Handle Upgrade Level Logic
  const handleUpgradeLevel = async () => {
    try {
      const userDoc = doc(db, 'users', selectedUser.id);

      await updateDoc(userDoc, {
        accountLevel: accountLevel,
      });

      setUsers(
        users.map((u) =>
          u.id === selectedUser.id ? { ...u, accountLevel } : u
        )
      );

      setShowActionPopup(false);
      setAccountLevel(''); // Clear the input
    } catch (err) {
      console.error('Error upgrading user level:', err);
      setError('An error occurred while upgrading the user level.');
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
                <th className="py-2 px-4 border">Loan Balance</th>
                <th className="py-2 px-4 border">VAT Code</th>
                <th className="py-2 px-4 border">Account Level</th> {/* New Column */}
                <th className="py-2 px-4 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user, index) => (
                  <tr key={index} className="border-t">
                    <td className="py-2 px-4 border">{user.username}</td>
                    <td className="py-2 px-4 border">{user.accountBalance}</td>
                    <td className="py-2 px-4 border">{user.loanBalance || 'N/A'}</td>
                    <td className="py-2 px-4 border">{user.vatCode || 'N/A'}</td>
                    <td className="py-2 px-4 border">{user.accountLevel || 'N/A'}</td> {/* Displaying accountLevel */}
                    <td className="py-2 px-4 border text-center">
                      <FaEllipsisV
                        className="cursor-pointer text-gray-600 hover:text-gray-800"
                        onClick={() => {
                          setSelectedUser(user);
                          setShowActionPopup(true);
                        }}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-4">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Popup */}
      {showActionPopup && (
        <Dialog
          open={showActionPopup}
          onClose={() => setShowActionPopup(false)}
          className="fixed z-10 inset-0 overflow-y-auto"
        >
          <div className="flex items-center justify-center min-h-screen">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
              <h2 className="text-lg font-bold mb-4">Actions for {selectedUser.username}</h2>

              {/* Send Money Section */}
              <div className="mb-4">
                <h3 className="font-bold mb-2">Send Money</h3>
                <input
                  type="number"
                  value={sendAmount}
                  onChange={(e) => setSendAmount(e.target.value)}
                  className="w-full border p-2 rounded-lg mb-4"
                  placeholder="Enter amount"
                />
                <button
                  onClick={handleSendMoney}
                  className="bg-green-500 text-white py-2 px-4 rounded-lg w-full"
                >
                  <FaDollarSign className="inline-block mr-2" />
                  Send Money
                </button>
              </div>

              {/* Send Loan Section */}
              <div className="mb-4">
                <h3 className="font-bold mb-2">Send Loan</h3>
                <input
                  type="number"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(e.target.value)}
                  className="w-full border p-2 rounded-lg mb-4"
                  placeholder="Enter loan amount"
                />
                <button
                  onClick={handleSendLoan}
                  className="bg-green-500 text-white py-2 px-4 rounded-lg w-full"
                >
                  <FaMoneyBill className="inline-block mr-2" />
                  Send Loan
                </button>
              </div>

              {/* Generate VAT Code Section */}
              <div className="mb-4">
                <h3 className="font-bold mb-2">Generate VAT Code</h3>
                <button
                  onClick={handleGenerateVatCode}
                  className="bg-blue-500 text-white py-2 px-4 rounded-lg w-full"
                >
                  <FaBarcode className="inline-block mr-2" />
                  Generate VAT Code
                </button>
              </div>

              {/* Upgrade Level Section */}
              <div className="mb-4">
                <h3 className="font-bold mb-2">Upgrade Level</h3>
                <input
                  type="text"
                  value={accountLevel}
                  onChange={(e) => setAccountLevel(e.target.value)}
                  className="w-full border p-2 rounded-lg mb-4"
                  placeholder="Enter new account level"
                />
                <button
                  onClick={handleUpgradeLevel}
                  className="bg-purple-500 text-white py-2 px-4 rounded-lg w-full"
                >
                  <FaLevelUpAlt className="inline-block mr-2" />
                  Upgrade Level
                </button>
              </div>
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
};

export default AdminDashboard;
