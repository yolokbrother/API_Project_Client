// firebaseClient.js
import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyCA9lSzD78MgxPp7bSIGFRMSQgdmTLnhJk",
    authDomain: "apinode-64713.firebaseapp.com",
    projectId: "apinode-64713",
    storageBucket: "apinode-64713.appspot.com",
    messagingSenderId: "819686321395",
    appId: "1:819686321395:web:f49f68da2278b7e2d01b86",
    measurementId: "G-CYE9WDLH89"
  };

// Initialize Firebase only if it's not already initialized
if (typeof window !== 'undefined' && getApps().length === 0) {
  initializeApp(firebaseConfig);
}

const firebaseApp = typeof window !== 'undefined' ? getApps()[0] : null;
const auth = typeof window !== 'undefined' ? getAuth(firebaseApp) : null;

export { auth };