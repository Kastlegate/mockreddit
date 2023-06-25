// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword  } from "firebase/auth";
import { getFirestore, } from "firebase/firestore"



// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration

const firebaseConfig = {

  apiKey: "AIzaSyB1r2oCMz-D1WEbWK4KZJNiiW8S7i2_AMk",

  authDomain: "mockreddit-22590.firebaseapp.com",

  projectId: "mockreddit-22590",

  storageBucket: "mockreddit-22590.appspot.com",

  messagingSenderId: "283630195903",

  appId: "1:283630195903:web:0e05635b34a3ce7a57e20a"

};


// Initialize Firebase

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore();

export { db, auth, signInWithEmailAndPassword, createUserWithEmailAndPassword}