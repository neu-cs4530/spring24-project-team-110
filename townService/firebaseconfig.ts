// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyB5NgunkPi8YMqlqI9fN1Zu9pDJVJg0H54',
  authDomain: 'persistentown.firebaseapp.com',
  projectId: 'persistentown',
  storageBucket: 'persistentown.appspot.com',
  messagingSenderId: '749310898949',
  appId: '1:749310898949:web:2e2b46de5ad5e24c093d6c',
  measurementId: 'G-JRSQ1RPEXQ',
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

export default db;
