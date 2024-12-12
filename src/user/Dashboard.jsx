import { useState, useEffect } from 'react';
import { auth, db } from '../firebaseconfig';
import { FaEye, FaEyeSlash, FaExchangeAlt, FaMoneyCheckAlt, FaCreditCard, FaMoneyBillWave, FaPiggyBank, FaWallet, FaArrowCircleLeft, FaCartArrowDown } from 'react-icons/fa';
import Sidenav from '../components/Sidenav';
import { Link, Navigate } from 'react-router-dom';
import { getDoc, doc, collection, getDocs, query, where } from 'firebase/firestore';


const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [showBalance, setShowBalance] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userDocRef = doc(db, 'users', user.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            setUserData(userDocSnap.data());
          } else {
            console.error('No such document!');
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    const fetchTransactions = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const transactionsColRef = collection(db, 'transactions');
          const transactionsQuery = query(transactionsColRef, where('userId', '==', user.uid));
          const transactionsSnapshot = await getDocs(transactionsQuery);
          const transactionsList = transactionsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            date: doc.data().date?.toDate(),
          }));

          setTransactions(transactionsList);
        }
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };

    fetchUserData();
    fetchTransactions();
  }, []);

  const toggleBalanceVisibility = () => {
    setShowBalance(!showBalance);
  };


  return (
    <div className="min-w-full min-h-screen mx-auto p-4 bg-gray-100">
      <Sidenav />

      <div className="p-4">
        <h2 className="text-2xl font-semibold text-gray-700">Hello, {userData?.username || 'User'}</h2>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold text-gray-800 flex items-center">
            <FaWallet className="mr-2 text-3xl text-[#4E3629]" /> Available Balance
          </h3>
          <button onClick={toggleBalanceVisibility}>
            {showBalance ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        <div className='flex justify-between'>
          <div className="mt-4">
            {showBalance ? (
              <span className="text-3xl font-bold">{userData?.country} {userData?.accountBalance?.toLocaleString()}</span>
            ) : (
              <span className="text-[50px] font-bold">******</span>
            )}
          </div>
          <button
            onClick={() => {
              alert("contact admin to deposit")
            }}
            className="mt-4 bg-[#4E3629] h-12 font-sans text-white rounded-3xl px-4 py-2">
            + Add Money
          </button>

        </div>

        <div className='flex justify-between mt-6'>
          <h2 className='text-gray-700 '>
            Account Number
          </h2>
          <p className='font-bold text-lg'>
            20241018280
          </p>
        </div>
        <div className='h-[1px] w-full rounded-xl bg-gray-300 mt-5'></div>
        <div className='flex flex-col sm:flex-row mt-8'>
          <button
            onClick={() => {
              alert("contact admin, to deposit")
            }}
            className='px-8 py-3 text-sm max-w-full w-full text-center hover:opacity-95 rounded-2xl mb-5 bg-orange-400 text-white '
          >
            Quick pay +
          </button>
          <button
            className='px-8 py-3 text-sm max-w-full w-full text-center hover:opacity-95 rounded-2xl bg-[#0d0808] text-white flex justify-center items-center sm:ml-5'>
            <svg stroke="currentColor" fill="none" stroke-width="1.5" viewBox="0 0 24 24" aria-hidden="true" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941"></path></svg>
            <p className='ml-2'><Link to="/Withdrawal">Bank Transfer</Link></p>

          </button>
        </div>
      </div>

      <div class="my-4 bg-white rounded-xl border border-gray-100 p-6 w-full">
        <div class="sm:p-4 mx-auto max-w-lg grid grid-cols-3 items-center justify-center gap-4">
          <a class="inline-flex flex-col items-center justify-center gap-4" href="/Withdrawal">
            <div class="p-4 rounded-xl bg-red-100">
              <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" class="text-red-600 text-3xl" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M14 0a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2zM5.904 10.803 10 6.707v2.768a.5.5 0 0 0 1 0V5.5a.5.5 0 0 0-.5-.5H6.525a.5.5 0 1 0 0 1h2.768l-4.096 4.096a.5.5 0 0 0 .707.707"></path></svg>
            </div>
            <p class="text-gray-700 text-sm font-medium">Transfer</p></a><a class="inline-flex flex-col items-center justify-center gap-4" href="/loan"><div class="p-4 rounded-xl bg-blue-100"><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" class="text-blue-600 text-3xl" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M2 20H22V22H2V20ZM4 12H6V19H4V12ZM9 12H11V19H9V12ZM13 12H15V19H13V12ZM18 12H20V19H18V12ZM2 7L12 2L22 7V11H2V7ZM12 8C12.5523 8 13 7.55228 13 7C13 6.44772 12.5523 6 12 6C11.4477 6 11 6.44772 11 7C11 7.55228 11.4477 8 12 8Z"></path></svg>
            </div><p class="text-gray-700 text-sm font-medium">Loan</p></a><a class="inline-flex flex-col items-center justify-center gap-4" href="/cards"><div class="p-4 rounded-xl bg-green-100"><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 576 512" class="text-green-600 text-3xl" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M527.9 32H48.1C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48.1 48h479.8c26.6 0 48.1-21.5 48.1-48V80c0-26.5-21.5-48-48.1-48zM54.1 80h467.8c3.3 0 6 2.7 6 6v42H48.1V86c0-3.3 2.7-6 6-6zm467.8 352H54.1c-3.3 0-6-2.7-6-6V256h479.8v170c0 3.3-2.7 6-6 6zM192 332v40c0 6.6-5.4 12-12 12h-72c-6.6 0-12-5.4-12-12v-40c0-6.6 5.4-12 12-12h72c6.6 0 12 5.4 12 12zm192 0v40c0 6.6-5.4 12-12 12H236c-6.6 0-12-5.4-12-12v-40c0-6.6 5.4-12 12-12h136c6.6 0 12 5.4 12 12z"></path></svg></div><p class="text-gray-700 text-sm font-medium">Cards</p></a></div></div>
      <div className="bg-white p-6 rounded-2xl shadow-2xl mt-6 max-w-full overflow-x-auto">
        <h3 className="text-3xl font-bold mb-6 text-center text-gray-800">Transaction History</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[700px] border-separate border-spacing-y-2">
            <thead>
              <tr>
                <th className="py-3 px-4 text-sm text-gray-600 font-medium">Status</th>
                <th className="py-3 px-4 text-sm text-gray-600 font-medium">Date</th>
                <th className="py-3 px-4 text-sm text-gray-600 font-medium">Amount</th>
                <th className="py-3 px-4 text-sm text-gray-600 font-medium">Type</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length > 0 ? (
                transactions.map((transaction) => {
                  // Define status color based on transaction status
                  const getStatusColor = () => {
                    switch (transaction.status?.toLowerCase()) {
                      case 'completed':
                        return 'bg-green-100 text-green-800';
                      case 'pending':
                        return 'bg-yellow-100 text-yellow-800';
                      case 'failed':
                        return 'bg-red-100 text-red-800';
                      default:
                        return 'bg-blue-100 text-blue-800';
                    }
                  };

                  return (
                    <tr
                      key={transaction.id}
                      className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
                    >
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor()}`}>
                          {transaction.status || 'Completed'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-700">
                        {transaction.date.toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-700 font-medium">
                        {transaction.amount}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-700">
                        {transaction.type}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    className="py-6 text-center text-gray-500 bg-gray-50"
                    colSpan="4"
                  >
                    No transactions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
