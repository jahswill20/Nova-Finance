import { useState, useEffect } from 'react';
import { auth, db } from '../firebaseconfig';
import { doc, getDoc, addDoc, collection } from 'firebase/firestore';

const useWithdraw = (collectionName) => {
  const [userData, setUserData] = useState(null);
  const [amount, setAmount] = useState('');
  const [showUpgradePopup, setShowUpgradePopup] = useState(false);
  const [showCodePopup, setShowCodePopup] = useState(false);
  const [showAdminPopup, setShowAdminPopup] = useState(false);
  const [code, setCode] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        }
      }
    };

    fetchUserData();
  }, []);

  const handleWithdraw = () => {
    if (userData.accountLevel <= 1) {
      setShowUpgradePopup(true);
    } else if (parseFloat(amount) <= userData.accountBalance) {
      setShowCodePopup(true);
    } else {
      alert('Insufficient balance.');
    }
  };

  const handleCodeSubmit = async (additionalData) => {
    const user = auth.currentUser;
    if (user) {
      await addDoc(collection(db, collectionName), {
        uid: user.uid,
        amount: parseFloat(amount),
        timestamp: new Date(),
        ...additionalData,
      });
      setShowCodePopup(false);
      alert(' Transfer pending , kindly contact admin or file dispute');
    }
  };

  const handleSetCode = () => {
    setShowAdminPopup(true);
  };

  return {
    userData,
    amount,
    setAmount,
    showUpgradePopup,
    showCodePopup,
    showAdminPopup,
    setShowUpgradePopup,
    setShowCodePopup,
    setShowAdminPopup,
    code,
    setCode,
    handleWithdraw,
    handleCodeSubmit,
    handleSetCode,
  };
};

export default useWithdraw;
