// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration

const firebaseConfig = {

  apiKey: "AIzaSyAQVAR6h_6wRKjmVtrHJE_hnU_xKnJp0nE",

  authDomain: "panaprende-astro.firebaseapp.com",

  projectId: "panaprende-astro",

  storageBucket: "panaprende-astro.appspot.com",

  messagingSenderId: "567860481177",

  appId: "1:567860481177:web:069efd8b7680b8efe43c08"

};


// Initialize Firebase

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const auth = getAuth(app);

export { auth, db };