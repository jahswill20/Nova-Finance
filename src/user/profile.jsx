import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebaseconfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { Dialog } from '@headlessui/react';
import { useNavigate, Link } from 'react-router-dom';
import { FaUserEdit, FaSignOutAlt, FaTimes } from 'react-icons/fa';
import logo from '../assets/Nova-Logo.jpeg'
const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [showEditUsernamePopup, setShowEditUsernamePopup] = useState(false);
  const [showEditEmailPopup, setShowEditEmailPopup] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
          setLoading(false);
        }
      }
    };
    fetchUserData();
  }, []);

  const handleEditUsername = async () => {
    const user = auth.currentUser;
    if (user) {
      await updateDoc(doc(db, 'users', user.uid), {
        username: newUsername,
      });
      setUserData((prevData) => ({ ...prevData, username: newUsername }));
      setShowEditUsernamePopup(false);
    }
  };

  const handleEditEmail = async () => {
    const user = auth.currentUser;
    if (user) {
      await updateDoc(doc(db, 'users', user.uid), {
        email: newEmail,
      });
      setUserData((prevData) => ({ ...prevData, email: newEmail }));
      setShowEditEmailPopup(false);
    }
  };

  const handleLogout = () => {
    signOut(auth).then(() => {
      navigate('/SignIn', { replace: true });
    });
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50 flex flex-col items-center">
      {loading ? (
        <div className="flex items-center justify-center min-h-screen">
          <h1 className="text-lg font-semibold text-gray-700">Loading...</h1>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md space-y-3">
          <div className='flex justify-between'>
          <h2 className="text-xl font-semibold mt-10 text-gray-800">Profile</h2>
          <img src={logo} 
          className='rounded-md shadow-lg h-20'
          alt="" />
          </div>
          <div className="mb-4 space-y-5">
            <p className="text-gray-700">
              <strong>Username:</strong> {userData.username}
            </p>
            <button
              onClick={() => setShowEditUsernamePopup(true)}
              className="flex items-center text-gray-600 mt-2"
            >
              <FaUserEdit className="mr-2" /> Edit Username
            </button>
          </div>
          <div className="mb-4">
            <p className="text-gray-700">
              <strong>Email:</strong> {userData.email}
            </p>
            <button
              onClick={() => setShowEditEmailPopup(true)}
              className="flex items-center text-gray-600 mt-2"
            >
              <FaUserEdit className="mr-2" /> Edit Email
            </button>
          </div>
          <div className="mb-4">
            <p className="text-gray-700">
              <strong>Account Level:</strong> {userData.accountLevel}
            </p>
          </div>
          <div className="flex space-x-4">
            <Link to="/Kyc">
              <button className="bg-blue-600 text-white py-2 px-4 rounded-lg mr-3">
                KYC Upgrade
              </button>
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white py-2 px-6 rounded-lg flex"
            >
              <FaSignOutAlt className="mr-2 mt-1" /> Logout
            </button>
            
          </div>
          <Link to='/dispute'>
            <button className="bg-blue-800 mt-4 w-full text-white py-2 px-4 rounded-lg">
                file Dispute
              </button>
            </Link>
        </div>
      )}

      {/* Edit Username Popup */}
      <Dialog
        open={showEditUsernamePopup}
        onClose={() => setShowEditUsernamePopup(false)}
        className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50"
      >
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
          <Dialog.Title className="text-lg font-semibold mb-4">
            Edit Username
          </Dialog.Title>
          <div>
            <input
              type="text"
              placeholder="New Username"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              className="border border-gray-300 rounded-lg w-full p-2 mb-4"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={handleEditUsername}
                className="bg-green-500 text-white py-2 px-4 rounded-lg"
              >
                Save
              </button>
              <button
                onClick={() => setShowEditUsernamePopup(false)}
                className="bg-gray-500 text-white py-2 px-4 rounded-lg"
              >
                <FaTimes />
              </button>
            </div>
          </div>
        </div>
      </Dialog>

      {/* Edit Email Popup */}
      <Dialog
        open={showEditEmailPopup}
        onClose={() => setShowEditEmailPopup(false)}
        className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50"
      >
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
          <Dialog.Title className="text-lg font-semibold mb-4">
            Edit Email
          </Dialog.Title>
          <div>
            <input
              type="email"
              placeholder="New Email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="border border-gray-300 rounded-lg w-full p-2 mb-4"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={handleEditEmail}
                className="bg-green-500 text-white py-2 px-4 rounded-lg"
              >
                Save
              </button>
              <button
                onClick={() => setShowEditEmailPopup(false)}
                className="bg-gray-500 text-white py-2 px-4 rounded-lg"
              >
                <FaTimes />
              </button>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default Profile;
