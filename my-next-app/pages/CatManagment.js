import React, { useEffect, useState } from 'react';
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
import { deepOrange, deepPurple } from '@mui/material/colors';

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


const pages = ['Products', 'Pricing', 'Blog'];

const ExpandMore = styled((props) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
}));

export default function CatManagment() {
    const [anchorElNav, setAnchorElNav] = useState(null);
    const [anchorElUser, setAnchorElUser] = useState(null);
    const [settings, setSettings] = useState([]);
    const [imagePreview, setImagePreview] = useState(null);
    const { user, logout, loading } = useAuth();
    const router = useRouter();


    const [catImage, setCatImage] = useState("");
    const [catBreed, setCatBreed] = useState("");
    const [catName, setCatName] = useState("");
    const [catDescription, setCatDescription] = useState("");
    const [location, setLocation] = useState("");

    //catlist
    const [catData, setCatData] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);


    const handleProfile = () => {
        router.push('/Profile');
        handleCloseUserMenu();
    };

    const handleCatManagement = () => {
        router.push('/CatManagment');
        handleCloseUserMenu();
    };

    const handleFavourite = () => {
        router.push('/FavouritePage');
        handleCloseUserMenu();
    };

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleChange = (event) => {
        setLocation(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append("catBreed", catBreed);
        formData.append("catName", catName);
        formData.append("catDescription", catDescription);
        formData.append("catImage", catImage);
        formData.append("location", location);

        // Append user uid
        if (user) {
            formData.append("userUid", user.uid);
        }

        try {
            const response = await fetch("http://localhost:3001/api/add-cat", {
                method: "POST",
                headers: {
                    'Authorization': user.idToken,
                },
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Cat added:", data.catId);

                // Post the tweet after successful cat addition
                const tweetText = `A new cat has been added! Meet ${catName}, a ${catBreed}, ${catDescription}`;

                try {
                    const tweetResponse = await fetch("http://localhost:3001/api/post-tweet", {
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': user.idToken,
                        },
                        body: JSON.stringify({ tweet: tweetText }),
                    });

                    if (tweetResponse.ok) {
                        const tweetData = await tweetResponse.json();
                        console.log("Tweet response data:", tweetData); // Add this line to log the response data
                        const tweetUrl = `https://twitter.com/matthew18511535/status/${tweetData.tweetId}`;
                        window.open(tweetUrl, '_blank');
                    } else {
                        console.error("Error posting tweet");
                    }
                } catch (error) {
                    console.error("Error posting tweet:", error);
                }

                // Reset the form fields
                setCatImage("");
                setCatBreed("");
                setCatName("");
                setCatDescription("");
                setLocation("");
            } else {
                console.error("Error adding cat");
            }
        } catch (error) {
            console.error("Error adding cat:", error);
        }
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setImagePreview(null);
        }
    };

    //user
    const fetchUserRole = async (userId) => {
        try {
            const response = await fetch(`http://localhost:3001/api/userRole/${userId}`);
            if (response.ok) {
                const data = await response.json();
                const role = data.role;
                // Set the settings menu items based on the user role
                if (role === 'employee') {
                    setSettings(['Profile', 'Cat Management', 'Logout']);
                } else if (role === 'public') {
                    setSettings(['Profile', 'Favourite', 'Logout']);
                } else {
                    setSettings([]);
                }
            } else {
                console.error('Error fetching user role:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching user role:', error);
        }
    };

    //get all cats with userUid
    const fetchCatData = async (userUid) => {
        try {
            const response = await fetch(`http://localhost:3001/api/cats?userUid=${userUid}`);
            const data = await response.json();
            setCatData(data);
        } catch (error) {
            console.error("Error fetching cat data:", error);
        }
    };

    //table
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleEdit = (cat) => {
        router.push({ pathname: "/edit-cat", query: { catId: cat.id } });
    };

    //cat delete
    const handleDelete = async (catId) => {
        const response = await fetch(`http://localhost:3001/api/cats/${catId}`, {
            method: "DELETE",
            headers: {
                'Authorization': user.idToken,
            }
        });
        if (response.ok) {
            setCatData(catData.filter((cat) => cat.id !== catId));
        } else {
            // Handle error
        }
    };

    //called whenever the user prop updates
    useEffect(() => {
        if (user) {
            fetchUserRole(user.uid);
            fetchCatData(user.uid)
        }
    }, [user]);
    return (
        <>
            <Box>
                <AppBar>
                    <Container maxWidth="xl">
                        <Toolbar disableGutters>
                            <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
                            <Typography
                                variant="h6"
                                noWrap
                                component="a"
                                href="/HomePage"
                                sx={{
                                    mr: 2,
                                    display: { xs: 'none', md: 'flex' },
                                    fontFamily: 'monospace',
                                    fontWeight: 700,
                                    letterSpacing: '.3rem',
                                    color: 'inherit',
                                    textDecoration: 'none',
                                }}
                            >
                                Home
                            </Typography>
                            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                                <IconButton
                                    size="large"
                                    aria-label="account of current user"
                                    aria-controls="menu-appbar"
                                    aria-haspopup="true"
                                    onClick={handleOpenNavMenu}
                                    color="inherit"
                                >
                                    <MenuIcon />
                                </IconButton>
                                <Menu
                                    id="menu-appbar"
                                    anchorEl={anchorElNav}
                                    anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'left',
                                    }}
                                    keepMounted
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'left',
                                    }}
                                    open={Boolean(anchorElNav)}
                                    onClose={handleCloseNavMenu}
                                    sx={{
                                        display: { xs: 'block', md: 'none' },
                                    }}
                                >
                                    {pages.map((page) => (
                                        <MenuItem key={page} onClick={handleCloseNavMenu}>
                                            <Typography textAlign="center">{page}</Typography>
                                        </MenuItem>
                                    ))}
                                </Menu>
                            </Box>
                            <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />

                            <Typography
                                variant="h5"
                                noWrap
                                component="a"
                                href="/HomePage"
                                sx={{
                                    mr: 2,
                                    display: { xs: 'flex', md: 'none' },
                                    flexGrow: 1,
                                    fontFamily: 'monospace',
                                    fontWeight: 700,
                                    letterSpacing: '.3rem',
                                    color: 'inherit',
                                    textDecoration: 'none',
                                }}
                            >
                                Cat Management
                            </Typography>
                            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                                {pages.map((page) => (
                                    <Button
                                        key={page}
                                        onClick={handleCloseNavMenu}
                                        sx={{ my: 2, color: 'white', display: 'block' }}
                                    >
                                        {page}
                                    </Button>
                                ))}
                            </Box>

                            <Box sx={{ flexGrow: 0 }}>
                                <Tooltip title="Open settings">
                                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                        <Avatar sx={{ bgcolor: deepOrange[500] }}>U</Avatar>
                                    </IconButton>
                                </Tooltip>
                                <Menu
                                    sx={{ mt: '45px' }}
                                    id="menu-appbar"
                                    anchorEl={anchorElUser}
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    keepMounted
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    open={Boolean(anchorElUser)}
                                    onClose={handleCloseUserMenu}
                                >
                                    {settings.map((setting) => (
                                        <MenuItem key={setting} onClick={handleCloseUserMenu}>
                                            <Button
                                                variant="text"
                                                sx={{
                                                    flexGrow: 1,
                                                    justifyContent: 'center',
                                                }}
                                                onClick={() => {
                                                    if (setting === 'Profile') {
                                                        handleProfile();
                                                    } else if (setting === 'Cat Management') {
                                                        handleCatManagement();
                                                    } else if (setting === 'Favourite') {
                                                        handleFavourite();
                                                    } else if (setting === 'Logout') {
                                                        logout();
                                                    } else {
                                                        console.log(`${setting} clicked`);
                                                        // Add logic for other settings here
                                                    }
                                                }}
                                            >
                                                {setting}
                                            </Button>
                                        </MenuItem>
                                    ))}
                                </Menu>
                            </Box>
                        </Toolbar>
                    </Container>
                </AppBar>
            </Box>

            <Toolbar />

            <Container maxWidth="md" sx={{ mt: 5, mb: 5 }}>
                <Box>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={12} md={12}>
                            {!loading && user && (
                                <>
                                    <form onSubmit={handleSubmit}>
                                        <Card sx={{ minWidth: 275 }}>
                                            <Typography variant="h6" gutterBottom>
                                                Cat Management
                                            </Typography>
                                            <CardContent>
                                                <Grid container direction="column" spacing={2}>
                                                    <Grid item>
                                                        Cat Image
                                                        <input
                                                            type="file"
                                                            onChange={(event) => {
                                                                setCatImage(event.target.files[0]);
                                                                handleImageChange(event);
                                                            }}
                                                        />
                                                        {imagePreview && (
                                                            <Avatar
                                                                alt="Image Preview"
                                                                src={imagePreview}
                                                                sx={{ width: 128, height: 128, marginTop: 2 }}
                                                            />
                                                        )}
                                                    </Grid>
                                                    <Grid item>
                                                        <TextField
                                                            fullWidth
                                                            id="outlined-role"
                                                            label="Cat Breeds"
                                                            sx={{ mt: 5 }}
                                                            value={catBreed}
                                                            onChange={(event) => setCatBreed(event.target.value)}
                                                        />
                                                    </Grid>
                                                    <Grid item>
                                                        <TextField
                                                            fullWidth
                                                            id="outlined-email"
                                                            label="Cat Name"
                                                            sx={{ mt: 5 }}
                                                            value={catName}
                                                            onChange={(event) => setCatName(event.target.value)}
                                                        />
                                                    </Grid>
                                                    <Grid item>
                                                        <TextField
                                                            fullWidth
                                                            id="outlined-email"
                                                            label="Cat Description"
                                                            multiline
                                                            rows={4}
                                                            sx={{ mt: 5 }}
                                                            value={catDescription}
                                                            onChange={(event) => setCatDescription(event.target.value)}
                                                        />
                                                    </Grid>
                                                    <Grid item>
                                                        <FormControl fullWidth sx={{ mt: 5, mb: 5 }}>
                                                            <InputLabel id="demo-simple-select-label">Location</InputLabel>
                                                            <Select
                                                                labelId="demo-simple-select-label"
                                                                id="demo-simple-select"
                                                                value={location}
                                                                label="location"
                                                                onChange={handleChange}
                                                            >
                                                                <MenuItem value={"Sha Tin"}>Sha Tin</MenuItem>
                                                                <MenuItem value={"Kowloon"}>Kowloon</MenuItem>
                                                                <MenuItem value={"Central"}>Central</MenuItem>
                                                            </Select>
                                                        </FormControl>
                                                    </Grid>
                                                </Grid>
                                            </CardContent>
                                            <CardActions>
                                                <Button size="small" type="submit">
                                                    Submit
                                                </Button>
                                            </CardActions>
                                        </Card>
                                    </form>
                                </>
                            )}
                        </Grid>
                    </Grid>
                </Box>
            </Container>

            <Container maxWidth="md" sx={{ mt: 5, mb: 5 }}>
                <Box>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={12} md={12}>
                            <Paper>
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Breed</TableCell>
                                                <TableCell>Name</TableCell>
                                                <TableCell>Description</TableCell>
                                                <TableCell>Location</TableCell>
                                                <TableCell>Image</TableCell>
                                                <TableCell>Actions</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {!loading && user && catData
                                                .filter(cat => cat.userUid === user.uid)
                                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                .map((cat) => (
                                                    <TableRow key={cat.id}>
                                                        <TableCell>{cat.catBreed}</TableCell>
                                                        <TableCell>{cat.catName}</TableCell>
                                                        <TableCell>{cat.catDescription}</TableCell>
                                                        <TableCell>{cat.location}</TableCell>
                                                        <TableCell>
                                                            <img src={cat.catImage} alt={cat.catName} height="50" />
                                                        </TableCell>
                                                        <TableCell>
                                                            <Button
                                                                variant="contained"
                                                                color="primary"
                                                                onClick={() => handleEdit(cat)}
                                                            >
                                                                Edit
                                                            </Button>
                                                            <Button
                                                                variant="contained"
                                                                color="secondary"
                                                                onClick={() => handleDelete(cat.id)}
                                                            >
                                                                Delete
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                                <TablePagination
                                    component="div"
                                    count={catData.length}
                                    page={page}
                                    onPageChange={handleChangePage}
                                    rowsPerPage={rowsPerPage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                />
                            </Paper>
                        </Grid>
                    </Grid>
                </Box>
            </Container>
        </>
    )
}
