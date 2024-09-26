import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebaseconfig';

const TransactionTable = ({ userId }) => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const transactionsRef = collection(db, 'transactionHistory');
        const q = query(transactionsRef, where('userId', '==', userId));
        const querySnapshot = await getDocs(q);
        const transactionsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setTransactions(transactionsData);
      } catch (err) {
        console.error('Error fetching transactions: ', err);
      }
    };

    fetchTransactions();
  }, [userId]);

  return (
    <div className="w-full mt-2">
      <h2 className="text-xl font-bold mb-4 ">Transaction History</h2>
      <table className="min-w-full bg-white p-3 shadow-lg rounded-lg">
        <thead>
          <tr className="text-left">
            <th className="py-2 px-4">Date</th>
            <th className="py-2 px-4">Amount</th>
            <th className="py-2 px-4">Type</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id} className="border-t">
              <td className="py-2 px-4">{new Date(transaction.date).toLocaleString()}</td>
              <td className="py-2 px-4">{transaction.amount}</td>
              <td className="py-2 px-4">{transaction.transactionType}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionTable;
