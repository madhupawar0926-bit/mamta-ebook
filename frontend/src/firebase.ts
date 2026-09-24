// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD2Gjf-XdbWKETHMdcZftIS7lhYxnUyhP8",
  authDomain: "mamta-ebook-reader.firebaseapp.com",
  projectId: "mamta-ebook-reader",
  storageBucket: "mamta-ebook-reader.firebasestorage.app",
  messagingSenderId: "13594977091",
  appId: "1:13594977091:web:ed591b037ef4d45db605f6",
  measurementId: "G-19XGSBW5MM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);