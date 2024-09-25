import React, { useState } from 'react';
import { auth, db, storage } from '../firebaseconfig';
import { doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const Kyc = () => {
  const [idType, setIdType] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [idImage, setIdImage] = useState(null);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = auth.currentUser;
    if (!user) {
      setMessage('User not authenticated');
      return;
    }

    try {
      const docRef = doc(db, 'kycRequests', user.uid);
      let idImageUrl = '';

      if (idImage) {
        const idImageRef = ref(storage, `kycImages/${user.uid}/${idImage.name}`);
        await uploadBytes(idImageRef, idImage);
        idImageUrl = await getDownloadURL(idImageRef);
      }

      await setDoc(docRef, {
        uid: user.uid,
        idType,
        idNumber,
        idImageUrl,
        status: 'pending',
        timestamp: new Date(),
      });

      setMessage('KYC request pending, contact admin and pay standardized fee');
    } catch (error) {
      setMessage('KYC request pending, contact admin and pay standardized fee ');
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100 flex flex-col items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">KYC Upgrade</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="idType">
              ID Type
            </label>
            <select
              id="idType"
              value={idType}
              onChange={(e) => setIdType(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="">Select ID Type</option>
              <option value="passport">Passport</option>
              <option value="driver_license">Driver's License</option>
              <option value="national_id">National ID</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="idNumber">
              ID Number
            </label>
            <input
              type="text"
              id="idNumber"
              value={idNumber}
              onChange={(e) => setIdNumber(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="idImage">
              ID Image
            </label>
            <input
              type="file"
              id="idImage"
              onChange={(e) => setIdImage(e.target.files[0])}
              className="shadow appearance-none border border-gray-700 rounded-xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-40"
            />
          </div>
          <button type="submit" className="bg-green-500 text-white py-2 px-4 rounded-lg w-full">
            Submit KYC
          </button>
        </form>
        {message && <p className="mt-4 text-center">{message}</p>}
      </div>
    </div>
  );
};

export default Kyc;
