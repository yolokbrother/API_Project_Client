// pages/auth.js
import { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Toolbar from '@mui/material/Toolbar';
import AppBar from '@mui/material/AppBar';
import { auth } from '../firebase/firebaseClient';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useRouter } from 'next/router';
import { useAuth } from './AuthContext';
import { getIdToken } from 'firebase/auth';

const Homepage = () => {
  const { user, login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [signUpCode, setSignUpCode] = useState('');
  const [message, setMessage] = useState(null);

  const router = useRouter();

  //handle Google sign-in
  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const db = getFirestore(); // Initialize Firestore
  
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const idToken = await getIdToken(user);
  
      // Access the email of the signed-in Google account
      const googleAccountEmail = user.email;
      const uid = user.uid;
  
      console.log('User signed in with Google:', user);
      console.log('User ID token:', idToken);
      console.log('Google account email:', googleAccountEmail);
  
      // Check if userProfile exists in the Firestore collection
      const userProfileRef = doc(db, 'userProfile', uid);
      const userProfileDoc = await getDoc(userProfileRef);
  
      // If userProfile doesn't exist, create a new userProfile document
      if (!userProfileDoc.exists()) {
        const userName = 'default'; // You can set this value based on your requirements
        const role = 'public'; // You can set this value based on your requirements
  
        await setDoc(userProfileRef, {
          userName,
          email: googleAccountEmail,
          role,
        });
  
        console.log('New userProfile created for Google user:', uid);
      } else {
        console.log('User profile already exists:', uid);
      }
  
      login(googleAccountEmail, uid, idToken);
      // Redirect to your desired page after successful sign-in
      router.push('/HomePage');
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    }
  };

  const handleSubmit = async (e, action) => {
    e.preventDefault();
    setMessage(null);

    if (action === 'google') {
      signInWithGoogle();
    } else if (action === 'login') {
      signInWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
          // Call your /api/login endpoint to fetch the user record
          console.log('User signed in:', userCredential.user);
          const idToken = await getIdToken(userCredential.user);
          console.log('User ID token:', idToken);
          const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          });

          if (response.ok) {
            const data = await response.json();
            const { uid } = data.user;
            login(email, uid, idToken);
            router.push('/HomePage');
          } else {
            const error = await response.json();
            setMessage({ type: 'error', text: error.message });
          }
        })
        .catch((error) => {
          setMessage({ type: 'error', text: error.message });
        });
    } else if (action === 'register') {
      // Registration logic remains unchanged
      const response = await fetch(`/api/${action}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, signUpCode }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: data.message });
      } else {
        const errorMessage = typeof data.error === 'object' ? JSON.stringify(data.error) : data.error;
        setMessage({ type: 'error', text: errorMessage });
      }
    }
  }

  return (
    <>
      <Box>
        <AppBar>
          <Toolbar variant="dense">
            <Typography variant="h6" color="inherit" component="div">
              HomePage
            </Typography>
          </Toolbar>
        </AppBar>
      </Box>

      <Box sx={{ width: "100%", maxWidth: 400, margin: "auto", pt: 10 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Registration and Login
        </Typography>
        {message && (
          <Alert severity={message.type === 'success' ? 'success' : 'error'} sx={{ mb: 2 }}>
            {message.text}
          </Alert>
        )}
        <form>
          <TextField
            fullWidth
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Sign Up Code"
            value={signUpCode}
            onChange={(e) => setSignUpCode(e.target.value)}
            margin="normal"
          />

          <Box mt={2}>
            <Button variant="contained" onClick={(e) => handleSubmit(e, "register")}>
              Register
            </Button>
            <Button variant="contained" onClick={(e) => handleSubmit(e, "login")} sx={{ ml: 2 }}>
              Login
            </Button>
            <Button variant="contained" onClick={(e) => handleSubmit(e, 'google')} sx={{ ml: 2 }}>Sign in with Google</Button>
          </Box>
        </form>
      </Box>
    </>
  );
};

export default Homepage;