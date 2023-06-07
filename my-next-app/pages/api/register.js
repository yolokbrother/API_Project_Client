// pages/api/register.js
import axios from "axios";

export default async function handler(req, res) {
  const { email, password } = req.body;

  try {
    const response = await axios.post("http://localhost:3001/api/register", { email, password });
    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error in frontend register.js:", error); 
    res.status(400).json({ error: error.response.data });
  }
}