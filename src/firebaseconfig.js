
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDbH2SAcscDDkGYmad_dW25gUIyolEamrw",
  authDomain: "nova-finance.firebaseapp.com",
  projectId: "nova-finance",
  storageBucket: "nova-finance.appspot.com",
  messagingSenderId: "599889160812",
  appId: "1:599889160812:web:b024d0025091ee92fe4649"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, createUserWithEmailAndPassword, setDoc, doc, storage };