import { Box, Button, Typography } from '@mui/material';
import * as React from 'react';
import { alpha } from '@mui/material/styles';
import { styled } from '@mui/material/styles';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';

import Badge from '@mui/material/Badge';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MailIcon from '@mui/icons-material/Mail';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MoreIcon from '@mui/icons-material/MoreVert';
import './navBarCss/navBar.css'
import { useNavigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import AlarmOnIcon from '@mui/icons-material/AlarmOn';
import CottageIcon from '@mui/icons-material/Cottage';
import EditNoteIcon from '@mui/icons-material/EditNote';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useDispatch, useSelector } from 'react-redux';
import { userOut } from '../user/userSlice.js';
import LogoutIcon from '@mui/icons-material/Logout';
import PostAddIcon from '@mui/icons-material/PostAdd';
import { logOutInServer } from '../user/userApi.js';

const NavBar = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(state => state.user.currentUser);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      

      {user !== null && <MenuItem onClick={() => {
        navigate('/profile')
        handleMenuClose();
      }}>פרופיל</MenuItem>}

    </Menu>

  );
  ///תפריט מוקטן
  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >

      {user !== null && <MenuItem onClick={() => {
        navigate('/');
        handleMenuClose();
      }} >
        <IconButton
          size="large"
          aria-label="show "
          color="inherit"
        >
          <AlarmOnIcon />
        </IconButton>
        <p>כל התורים</p>
      </MenuItem>}


      {user === null && <MenuItem onClick={() => {
        navigate("/logIn");
        handleMenuClose();
      }}>

        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <CottageIcon />
        </IconButton>
        <p>כניסה</p>
      </MenuItem>}



      {user === null && <MenuItem onClick={() => {
        navigate("/signUp");
        handleMenuClose();
      }}
      >
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <EditNoteIcon />
        </IconButton>
        <p>הרשמה</p>
      </MenuItem>}


      {user !== null && <MenuItem onClick={() => {
        navigate("/profile");
        handleMenuClose();
      }}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>פרופיל</p>
      </MenuItem>}



      {user !== null && <MenuItem onClick={() => {
        navigate('/createAppointment');
        handleMenuClose();
      }} >
        <IconButton
          size="large"
          aria-label="show "
          color="inherit"
        >
          <PostAddIcon />
        </IconButton>

        <p> קביעת תור</p>
      </MenuItem>}


      {user !== null && <MenuItem onClick={() => {
        navigate("/login");
        handleMenuClose();
        dispatch(userOut());
        logOutInServer();

      }}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"

        >
          <LogoutIcon />
        </IconButton>

        <p>התנתקות</p>
      </MenuItem>}
    </Menu>
  );

  function stringAvatar(name) {
    return {
      sx: {
        bgcolor: '#ff8a80',
        width: "23px",
        height: "23px",
      },
      children: `${user.firstName.split(' ')[0][0]}`,
    };
  }
  return (<>
    <Box sx={{ flexGrow: 1 }}>
      <AppBar className='navBarStyle' position="static">

        <Toolbar>
          <img src={'../../../pic/logo1.png'} alt='logo' style={{ width: "8%" }} />


          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            {user !== null && <Button
              sx={{ height: "30%", mt: 1, ml: 1 }}
              onClick={() => navigate("/")}
              color='secondary'

            >כל התורים</Button>}


            {user !== null && <Button
              color='secondary'
              sx={{ height: "30%", mt: 1, ml: 1 }}
              onClick={() => {
                navigate("/logIn");
                dispatch(userOut());
                logOutInServer();
              }
              }
            >התנתקות</Button>}


            <>
              {user === null && <Button
                sx={{ height: "30%", mt: 1, ml: 1 }}
                onClick={() => navigate("/logIn")}
                color='secondary'
              >כניסה</Button>}

              {user === null && <Button
                sx={{ height: "30%", mt: 1, ml: 1 }}
                onClick={() => navigate("/signUp")}
                color='secondary'
              >הרשמה</Button>}

            </>

            {user!==null&& <Button
              sx={{ height: "30%", mt: 1, ml: 1 }}
              onClick={() => navigate("/createAppointment")}
              color='secondary'
            > קביעת תור</Button>}







            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              // aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              {user == null && <AccountCircle />}
              {user !== null && <Avatar style={{ fontSize: "12pt", textAlign: "center" }} {...stringAvatar()} />}



            </IconButton>
            {user == null && <Typography ml={1} mt={1.5}>שלום אורח</Typography>}
            {user != null && <Typography ml={1} mt={1.5}>שלום {user.firstName} {user.lastName}</Typography>}
          </Box>
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}

    </Box>


  </>
  );
}

export default NavBar;




