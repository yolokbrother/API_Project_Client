// firebaseClient.js
import { initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyCA9lSzD78MgxPp7bSIGFRMSQgdmTLnhJk",
    authDomain: "apinode-64713.firebaseapp.com",
    projectId: "apinode-64713",
    storageBucket: "apinode-64713.appspot.com",
    messagingSenderId: "819686321395",
    appId: "1:819686321395:web:f49f68da2278b7e2d01b86",
    measurementId: "G-CYE9WDLH89"
  };

const app = initializeApp(firebaseConfig);

export default app;