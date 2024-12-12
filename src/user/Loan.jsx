import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebaseconfig'; // Import Firebase Auth and Firestore
import { FaUserCircle, FaMoneyCheckAlt } from 'react-icons/fa';
import Sidenav from '../components/Sidenav';
import { doc, setDoc, getDoc } from 'firebase/firestore'; // Firestore functions

const Loan = () => {
    const [loanAmount, setLoanAmount] = useState('');
    const [loanDetails, setLoanDetails] = useState(null);
    const [message, setMessage] = useState('');
    const [userData, setUserData] = useState(null);

    // Fetch user data from Firebase
    useEffect(() => {
        const fetchUserData = async () => {
            const user = auth.currentUser;
            if (user) {
                const userDoc = doc(db, 'users', user.uid);
                const userDocSnap = await getDoc(userDoc);
                if (userDocSnap.exists()) {
                    setUserData(userDocSnap.data());
                }
            }
        };

        fetchUserData();
    }, []);

    // Handle loan application submission
    const handleApplyLoan = async (e) => {
        e.preventDefault();
        const user = auth.currentUser;
        if (!user) {
            setMessage('User not authenticated');
            return;
        }

        try {
            const loanRef = doc(db, 'loans', user.uid);
            await setDoc(loanRef, {
                loanAmount,
                status: 'pending',
                timestamp: new Date(),
            });

            setLoanDetails({
                loanAmount,
                status: 'Pending',
            });
            setMessage('Loan request submitted. Please contact admin for further processing.');
        } catch (error) {
            console.error('Error applying for loan:', error);
            setMessage('Failed to apply for loan. Please try again.');
        }
    };

    return (
        <div className="bg-gray-100 p-6 min-h-screen">
            <Sidenav />

            {/* Loan Application Content */}
            <div className="flex-grow p-6 min-h-screen">
                <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-lg">
                    {/* User Information Card */}
                    <div className="flex items-center mb-6">
                        <FaUserCircle className="text-4xl text-gray-600 mr-4" />
                        <div>
                            <h3 className="text-lg font-bold">{userData?.username || 'User'}</h3>
                            <p className="text-sm text-gray-500">Account Number: {userData?.number || 'N/A'}</p>
                        </div>
                    </div>

                    {/* Loan Application Form */}
                    <form onSubmit={handleApplyLoan} className="mb-6">
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="loanAmount">
                                Loan Amount
                            </label>
                            <input
                                type="number"
                                id="loanAmount"
                                value={loanAmount}
                                onChange={(e) => setLoanAmount(e.target.value)}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                placeholder="Enter loan amount"
                            />
                        </div>
                        <button
                            type="submit"
                            className="bg-[#4E3629] hover:bg-[#251810] text-white font-bold py-2 px-4 rounded w-full"
                        >
                            Apply for Loan
                        </button>
                    </form>

                    {/* Loan Details Box */}
                    {loanDetails && (
                        <div className="bg-yellow-100 p-4 rounded-lg shadow-md mt-4">
                            <h3 className="text-lg font-semibold mb-2">Loan Details</h3>
                            <p className="text-gray-800">Loan Amount:{userData?.country} {loanDetails.loanAmount}</p>
                            <p className="text-gray-800">Status: {loanDetails.status}</p>
                        </div>
                    )}

                    {/* Message (Feedback for the user) */}
                    {message && (
                        <p className="text-sm text-gray-700 mt-4">
                            {message}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Loan;
