import React, { useState, useEffect } from "react";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import { useRouter } from 'next/router';
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  Paper,
} from "@mui/material";

//Auth
import { useAuth } from './AuthContext';
//other
import Link from 'next/link';
//firebase
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import app from '../firebase/firebaseClient';

const EditCat = () => {
  const router = useRouter();
  const { catId } = router.query;
  const [catData, setCatData] = useState(null);
  const { user, logout, loading } = useAuth();

  useEffect(() => {
    if (catId) {
      const fetchData = async () => {
        const response = await fetch(`http://localhost:3001/api/cats/${catId}`);
        const data = await response.json();
        setCatData(data);
      };
      fetchData();
    }
  }, [catId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedCatData = {
      catBreed: catData.catBreed,
      catName: catData.catName,
      catDescription: catData.catDescription,
      location: catData.location,
    };

    const response = await fetch(`http://localhost:3001/api/cats/${catId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        'Authorization': user.idToken,
      },
      body: JSON.stringify(updatedCatData),
    });

    if (response.ok) {
      router.push("/CatManagment");
    } else {
      console.error("Failed to update cat data");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCatData((prevData) => ({ ...prevData, [name]: value }));
  };

  if (!catData) {
    return <div>Loading...</div>;
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1">
          Edit Cat
        </Typography>
        <form onSubmit={handleSubmit}>
          <CardMedia
            component="img"
            height="400" 
            image={catData.catImage}
            alt={catData.catName}
          />
          <TextField
            fullWidth
            required
            margin="normal"
            label="Breed"
            name="catBreed"
            value={catData.catBreed}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            required
            margin="normal"
            label="Name"
            name="catName"
            value={catData.catName}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            required
            margin="normal"
            label="Description"
            name="catDescription"
            value={catData.catDescription}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            required
            margin="normal"
            label="Location"
            name="location"
            value={catData.location}
            onChange={handleChange}
          />
          <Button variant="contained" color="primary" type="submit">
            Update
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default EditCat;