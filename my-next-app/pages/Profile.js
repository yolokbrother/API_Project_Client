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

import { useRouter } from 'next/router';

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

// Initialize Firestore and Auth
const firestore = getFirestore(app);

export default function Profile() {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [settings, setSettings] = useState([]);
  const { user, logout, loading } = useAuth();
  const [userData, setUserData] = useState({});
  const router = useRouter();

  const handleProfile = () => {
    router.push('/Profile');
    handleCloseUserMenu();
  };

  const handleCatManagement = () => {
    router.push('/CatManagment');
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

  //user
  const fetchUserRole = async () => {
    try {
      if (user) {
        const userDocRef = doc(firestore, 'userProfile', user.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const data = userDocSnap.data();
          setUserData(data); // Save the user data to the state
          console.log('User data:', data); // Log the fetched user data
          const role = userDocSnap.data().role;
          // Set the settings menu items based on the user role
          if (role === 'employee') {
            setSettings(['Profile', 'Cat Management', 'Logout']);
          } else if (role === 'public') {
            setSettings(['Profile', 'Favourite', 'Logout']);
          } else {
            setSettings([]);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching user role:', error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserRole();
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
                Profile
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
                    <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
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
                  <Card sx={{ minWidth: 275 }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Welcome! {user.email}
                      </Typography>
                      <Grid container direction="column" spacing={2}>
                        <Grid item>
                          <TextField
                            id="outlined-username"
                            label="UserName"
                            value={userData.userName || ''}
                            disabled
                            sx={{ mt: 5 }}
                          />
                        </Grid>
                        <Grid item>
                          <TextField
                            id="outlined-role"
                            label="Role"
                            value={userData.role || ''}
                            disabled
                            sx={{ mt: 5 }}
                          />
                        </Grid>
                        <Grid item>
                          <TextField
                            id="outlined-email"
                            label="Email"
                            value={user ? user.email : ''}
                            disabled
                            sx={{ mt: 5, mb: 5 }}
                          />
                        </Grid>
                      </Grid>
                    </CardContent>
                    <CardActions>
                      <Button size="small">Learn More</Button>
                    </CardActions>
                  </Card>
                </>
              )}
            </Grid>
          </Grid>
        </Box>
      </Container>
    </>
  )
}
