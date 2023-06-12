// pages/auth.js
import { useState } from 'react';
import { useAuth } from './AuthContext';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import MenuIcon from '@mui/icons-material/Menu';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import AppBar from '@mui/material/AppBar';

import { useRouter } from 'next/router'; // Import useRouter

const Homepage = () => {
  const { user, login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [signUpCode, setSignUpCode] = useState('');
  const [message, setMessage] = useState(null);

  const router = useRouter(); // Initialize useRouter

  const handleSubmit = async (e, action) => {
    e.preventDefault();
    setMessage(null); // Clear previous message

    const response = await fetch(`/api/${action}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, signUpCode }),
    });

    const data = await response.json();

    if (action === 'login' && data.message) {
      const uid = data.message.split(' ')[2];
      login(email, uid);
      router.push('/HomePage');
    } else if (action === 'register') {
      if (response.ok) {
        setMessage({ type: 'success', text: data.message });
      } else {
        // If the error property is an object, convert it to a string
        const errorMessage = typeof data.error === 'object' ? JSON.stringify(data.error) : data.error;
        setMessage({ type: 'error', text: errorMessage });
      }
    }
  };

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
          </Box>
        </form>
      </Box>
    </>
  );
};

export default Homepage;