// pages/auth.js
import { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const Homepage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [responseMessage, setResponseMessage] = useState("");

  const handleSubmit = async (e, action) => {
    e.preventDefault();

    const response = await fetch(`/api/${action}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    setResponseMessage(data.message || data.error);
  };

  return (
    <Box sx={{ width: "100%", maxWidth: 400, margin: "auto", pt: 10 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Registration and Login
      </Typography>
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
        <Box mt={2}>
          <Button variant="contained" onClick={(e) => handleSubmit(e, "register")}>
            Register
          </Button>
          <Button variant="contained" onClick={(e) => handleSubmit(e, "login")} sx={{ ml: 2 }}>
            Login
          </Button>
        </Box>
      </form>
      {responseMessage && (
        <Typography variant="body1" sx={{ mt: 2, color: responseMessage.includes("Error") ? "error.main" : "success.main" }}>
          {responseMessage}
        </Typography>
      )}
    </Box>
  );
};

export default Homepage;