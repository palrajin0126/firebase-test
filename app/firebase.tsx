// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore,  } from 'firebase/firestore';
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


const dotenv = require('dotenv');
dotenv.config();

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDgHzYfee_So2n3sk5a6H5ibLm0IqT4KuY",
  authDomain: "real-estate-380ce.firebaseapp.com",
  projectId: "real-estate-380ce",
  storageBucket: "real-estate-380ce.appspot.com",
  messagingSenderId: "891870984237",
  appId: "1:891870984237:web:ea384a66acbadad097a0a4",
  measurementId: "G-K6N4KG6FG1"
};

  const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const auth = getAuth(app);
  const storage = getStorage(app);
  
  export { app, db, auth, storage };