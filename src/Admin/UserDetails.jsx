import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { db } from '../firebaseconfig';
import { doc, getDoc, updateDoc, onSnapshot } from 'firebase/firestore';
import { FaUser, FaMoneyBill, FaCoins, FaMinusCircle, FaArrowLeft, FaCopy, FaCheck, FaShieldAlt } from 'react-icons/fa';

const UserDetails = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [amount, setAmount] = useState('');
    const [transactionType, setTransactionType] = useState('send');
    const [message, setMessage] = useState('');
    const [copiedVat, setCopiedVat] = useState(false);
    const [copiedBvt, setCopiedBvt] = useState(false);

    // Real-time user data fetching
    useEffect(() => {
        const userRef = doc(db, 'users', userId);
        const unsubscribeUser = onSnapshot(userRef, (doc) => {
            if (doc.exists()) {
                setUser({ id: doc.id, ...doc.data() });
                setError(null);
            } else {
                setError('User not found');
            }
            setLoading(false);
        });

        return () => unsubscribeUser();
    }, [userId]);

    const handleTransaction = async (e) => {
        e.preventDefault();
        if (!amount || isNaN(amount) || amount <= 0) {
            setError('Please enter a valid amount');
            return;
        }

        try {
            const userDoc = doc(db, 'users', userId);
            const numericAmount = parseFloat(amount);
            let updates = {};
            let txnType = transactionType;

            switch (transactionType) {
                case 'send':
                    updates.accountBalance = user.accountBalance + numericAmount;
                    break;
                case 'loan':
                    updates.accountBalance = user.accountBalance + numericAmount;
                    updates.loanBalance = (user.loanBalance || 0) + numericAmount;
                    break;
                case 'remove':
                    if (user.accountBalance < numericAmount) {
                        setError('Insufficient funds');
                        return;
                    }
                    updates.accountBalance = user.accountBalance - numericAmount;
                    txnType = 'withdrawal';
                    break;
            }

            await updateDoc(userDoc, updates);
            setMessage(`Successfully processed ${user.country}${numericAmount.toFixed(2)}`);
            setAmount('');
            setError(null);

        } catch (err) {
            console.error('Transaction error:', err);
            setError('Transaction failed: ' + err.message);
        }
    };

    const copyVatCode = () => {
        if (user?.vatCode) {
            navigator.clipboard.writeText(user.vatCode);
            setCopiedVat(true);
            setTimeout(() => setCopiedVat(false), 2000);
        }
    };

    const copyBvtCode = () => {
        if (user?.bvtCode) {
            navigator.clipboard.writeText(user.bvtCode);
            setCopiedBvt(true);
            setTimeout(() => setCopiedBvt(false), 2000);
        }
    };

    if (loading) return <div className="text-center p-8">Loading user details...</div>;
    if (error) return <div className="text-red-500 p-8">{error}</div>;
    if (!user) return <div className="p-8">User not found</div>;

    return (
        <div className="max-w-4xl mx-auto p-6">
            <button
                onClick={() => navigate(-1)}
                className="mb-4 flex items-center text-blue-600 hover:text-blue-800"
            >
                <FaArrowLeft className="mr-2" />
                Back to Users
            </button>

            <div className="bg-white rounded-xl shadow-lg p-6">
                {/* User Header */}
                <div className="flex items-center gap-4 mb-8">
                    <div className="bg-blue-100 p-4 rounded-full">
                        <FaUser className="text-3xl text-blue-600" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">{user.username}</h1>
                        <p className="text-gray-600">{user.email}</p>
                        <p className="text-gray-600">{user.number || 'No phone number'}</p>
                    </div>
                </div>

                {/* Account Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-green-50 p-6 rounded-xl">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-gray-600 mb-1">Account Balance</p>
                                <p className="text-3xl font-bold">{user.country} {user.accountBalance?.toFixed(2)}</p>
                            </div>
                            <FaCoins className="text-3xl text-green-600" />
                        </div>
                    </div>

                    <div className="bg-purple-50 p-6 rounded-xl">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-gray-600 mb-1">Loan Balance</p>
                                <p className="text-3xl font-bold">{user.country}{user.loanBalance?.toFixed(2)}</p>
                            </div>
                            <FaMoneyBill className="text-3xl text-purple-600" />
                        </div>
                    </div>
                </div>

                {/* Transaction Form */}
                <div className="bg-gray-50 p-6 rounded-xl mb-8">
                    <h2 className="text-xl font-semibold mb-4">Account Actions</h2>

                    <form onSubmit={handleTransaction} className="space-y-4">
                        <div className="flex gap-4 flex-wrap">
                            <button
                                type="button"
                                onClick={() => setTransactionType('send')}
                                className={`px-4 py-2 rounded-lg ${transactionType === 'send'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-200 hover:bg-gray-300'
                                    }`}
                            >
                                Add Funds
                            </button>
                            <button
                                type="button"
                                onClick={() => setTransactionType('loan')}
                                className={`px-4 py-2 rounded-lg ${transactionType === 'loan'
                                    ? 'bg-green-600 text-white'
                                    : 'bg-gray-200 hover:bg-gray-300'
                                    }`}
                            >
                                Send Loan
                            </button>
                            <button
                                type="button"
                                onClick={() => setTransactionType('remove')}
                                className={`px-4 py-2 rounded-lg ${transactionType === 'remove'
                                    ? 'bg-red-600 text-white'
                                    : 'bg-gray-200 hover:bg-gray-300'
                                    }`}
                            >
                                Remove Funds
                            </button>
                        </div>

                        <div>
                            <label className="block text-gray-700 mb-2">Amount</label>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter amount"
                                step="0.01"
                            />
                        </div>

                        {error && <p className="text-red-500">{error}</p>}
                        {message && <p className="text-green-500">{message}</p>}

                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                        >
                            {transactionType === 'send' && <FaCoins />}
                            {transactionType === 'loan' && <FaMoneyBill />}
                            {transactionType === 'remove' && <FaMinusCircle />}
                            {transactionType === 'send' && 'Add Funds'}
                            {transactionType === 'loan' && 'Send Loan'}
                            {transactionType === 'remove' && 'Remove Funds'}
                        </button>
                    </form>
                </div>

                {/* User Metadata */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                    <div className="bg-white p-4 rounded-lg border">
                        <p className="text-gray-600">Account Level</p>
                        <p className="text-lg font-semibold capitalize">{user.accountLevel}</p>
                    </div>

                    <div className="bg-white p-4 rounded-lg border">
                        <p className="text-gray-600">VAT Code</p>
                        <div className="flex items-center gap-2">
                            <p className="text-lg font-semibold">{user.vatCode || 'N/A'}</p>
                            {user.vatCode && (
                                <button
                                    onClick={copyVatCode}
                                    className="text-blue-600 hover:text-blue-800"
                                >
                                    {copiedVat ? (
                                        <span className="flex items-center">
                                            <FaCheck className="mr-1" /> Copied!
                                        </span>
                                    ) : (
                                        <FaCopy />
                                    )}
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-lg border">
                        <p className="text-gray-600">BVT Code</p>
                        <div className="flex items-center gap-2">
                            <p className="text-lg font-semibold">{user.bvtCode || 'N/A'}</p>
                            {user.bvtCode && (
                                <button
                                    onClick={copyBvtCode}
                                    className="text-blue-600 hover:text-blue-800"
                                >
                                    {copiedBvt ? (
                                        <span className="flex items-center">
                                            <FaCheck className="mr-1" /> Copied!
                                        </span>
                                    ) : (
                                        <FaCopy />
                                    )}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDetails;