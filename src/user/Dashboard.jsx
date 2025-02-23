import { useState, useEffect } from 'react';
import { auth, db } from '../firebaseconfig';
import { FaEye, FaEyeSlash, FaWallet } from 'react-icons/fa';
import Sidenav from '../components/Sidenav';
import { Link } from 'react-router-dom';
import { doc, collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { Toaster } from 'react-hot-toast';

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [showBalance, setShowBalance] = useState(false);

  const toggleBalanceVisibility = () => {
    setShowBalance(!showBalance);
  };

  // Real-time user data listener
  useEffect(() => {
    let unsubscribeUser = () => { };

    const setupRealtimeUser = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);

        unsubscribeUser = onSnapshot(userDocRef, (snapshot) => {
          if (snapshot.exists()) {
            setUserData(snapshot.data());
          }
        }, (error) => {
          console.error("User data listener error:", error);
        });
      }
    };

    setupRealtimeUser();
    return () => unsubscribeUser();
  }, []);

  // Real-time transactions listener
  useEffect(() => {
    let unsubscribe = () => { };

    const user = auth.currentUser;
    if (user) {
      const transactionsRef = collection(db, 'transactions');

      unsubscribe = onSnapshot(transactionsRef, (snapshot) => {
        const allTransactions = [];

        snapshot.forEach((doc) => {
          const data = doc.data();
          // Basic validation and formatting
          if (data.userId === user.uid) {
            allTransactions.push({
              id: doc.id,
              status: data.status || 'completed',
              amount: data.amount ? Number(data.amount) : 0,
              type: data.type || 'other',
              date: data.date?.toDate?.() || new Date(),
            });
          }
        });

        // Simple date-based sorting
        const sortedTransactions = allTransactions.sort((a, b) =>
          b.date.getTime() - a.date.getTime()
        );

        setTransactions(sortedTransactions);
      }, (error) => {
        console.error('Transaction error:', error);
        toast.error('Error loading transactions');
      });
    }

    return () => unsubscribe();
  }, []);
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };


  return (
    <div className="min-w-full min-h-screen mx-auto p-4 bg-gray-100">
      <Toaster position="top-left" />
      <Sidenav />

      <div className="p-4">
        <h2 className="text-2xl font-semibold text-gray-700">
          Hello, {userData?.username || 'User'}
        </h2>
      </div>

      {/* Balance Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold text-gray-800 flex items-center">
            <FaWallet className="mr-2 text-3xl text-blue-600" />
            Available Balance
          </h3>
          <button onClick={toggleBalanceVisibility} className="text-gray-600 hover:text-gray-800">
            {showBalance ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        <div className="flex justify-between items-center mt-4">
          <div>
            {showBalance ? (
              <span className="text-3xl font-bold">
                {userData?.country} {userData?.accountBalance?.toLocaleString()}
              </span>
            ) : (
              <span className="text-4xl font-bold select-none">••••••</span>
            )}
          </div>
          <Link to="/dashboard/deposit">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-2xl hover:bg-blue-700 transition-colors">
              + Add Money
            </button>
          </Link>
        </div>

        <div className="mt-6">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Account Number</span>
            <span className="font-semibold">20241018280</span>
          </div>
          <div className="h-px bg-gray-200 my-4" />
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => alert("Contact admin for deposits")}
              className="bg-blue-700 text-white py-3 rounded-2xl hover:bg-blue-800 transition-colors"
            >
              Quick Pay +
            </button>
            <Link
              to="/withdrawal"
              className="bg-black text-white py-3 rounded-2xl hover:bg-gray-800 transition-colors flex items-center justify-center"
            >
              <svg
                stroke="currentColor"
                fill="none"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
                className="w-5 h-5 mr-2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 18L9 11.25l4.306 4.306a11.95 11.95 0 015.814-5.518l2.74-1.22m0 0l-5.94-2.281m5.94 2.28l-2.28 5.941"
                />
              </svg>
              Bank Transfer
            </Link>
          </div>
        </div>
      </div>
      {/* Services Quick Access Section - ADDED BACK */}
      <div className="my-4 bg-white rounded-xl border border-gray-100 p-6 w-full">
        <div className="sm:p-4 mx-auto max-w-lg grid grid-cols-3 items-center justify-center gap-4">
          <Link to="/Withdrawal" className="inline-flex flex-col items-center justify-center gap-4">
            <div className="p-4 rounded-xl bg-red-100">
              <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" className="text-red-600 text-3xl" height="1em" width="1em">
                <path d="M14 0a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2zM5.904 10.803 10 6.707v2.768a.5.5 0 0 0 1 0V5.5a.5.5 0 0 0-.5-.5H6.525a.5.5 0 1 0 0 1h2.768l-4.096 4.096a.5.5 0 0 0 .707.707"></path>
              </svg>
            </div>
            <p className="text-gray-700 text-sm font-medium">Transfer</p>
          </Link>

          <Link to="/loan" className="inline-flex flex-col items-center justify-center gap-4">
            <div className="p-4 rounded-xl bg-blue-100">
              <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" className="text-blue-600 text-3xl" height="1em" width="1em">
                <path d="M2 20H22V22H2V20ZM4 12H6V19H4V12ZM9 12H11V19H9V12ZM13 12H15V19H13V12ZM18 12H20V19H18V12ZM2 7L12 2L22 7V11H2V7ZM12 8C12.5523 8 13 7.55228 13 7C13 6.44772 12.5523 6 12 6C11.4477 6 11 6.44772 11 7C11 7.55228 11.4477 8 12 8Z"></path>
              </svg>
            </div>
            <p className="text-gray-700 text-sm font-medium">Loan</p>
          </Link>

          <Link to="/cards" className="inline-flex flex-col items-center justify-center gap-4">
            <div className="p-4 rounded-xl bg-green-100">
              <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 576 512" className="text-green-600 text-3xl" height="1em" width="1em">
                <path d="M527.9 32H48.1C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48.1 48h479.8c26.6 0 48.1-21.5 48.1-48V80c0-26.5-21.5-48-48.1-48zM54.1 80h467.8c3.3 0 6 2.7 6 6v42H48.1V86c0-3.3 2.7-6 6-6zm467.8 352H54.1c-3.3 0-6-2.7-6-6V256h479.8v170c0 3.3-2.7 6-6 6zM192 332v40c0 6.6-5.4 12-12 12h-72c-6.6 0-12-5.4-12-12v-40c0-6.6 5.4-12 12-12h72c6.6 0 12 5.4 12 12zm192 0v40c0 6.6-5.4 12-12 12H236c-6.6 0-12-5.4-12-12v-40c0-6.6 5.4-12 12-12h136c6.6 0 12 5.4 12 12z"></path>
              </svg>
            </div>
            <p className="text-gray-700 text-sm font-medium">Cards</p>
          </Link>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white p-6 rounded-2xl shadow-2xl mt-6">
        <h3 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Transaction History
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[700px] border-separate border-spacing-y-2">
            <thead>
              <tr className="text-left text-sm text-gray-600">
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Type</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr
                  key={transaction.id}
                  className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
                >
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(transaction.status)}`}>
                      {transaction.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700">
                    {transaction.date.toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700 font-medium">
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: userData?.country || 'USD',
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    }).format(Number(transaction.amount))}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700 capitalize">
                    {transaction.type}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;