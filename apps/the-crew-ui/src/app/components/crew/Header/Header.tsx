import './headerStyles.scss';

import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import HandymanIcon from '@mui/icons-material/Handyman';
import MenuIcon from '@mui/icons-material/Menu';
import {
  AppBar,
  Button,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  SwipeableDrawer,
  Toolbar,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Box } from '@mui/system';
import { Role } from '@the-crew/common/enums';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { theCrewLogo } from '../../../../assets/icons';
import { authSelector } from '../../../store/slices';
import MyAvatar from '../MyAvatar/MyAvatar';
import Notification from '../Notification/Notification';

export default function Header() {
  const [openSideMenu, setSideMenuStatus] = useState(false);
  const { user: currentUser } = useSelector(authSelector);
  const navigate = useNavigate();
  const theme = useTheme();
  const xsView = useMediaQuery(theme.breakpoints.down('sm'));

  const handleMenuClick = () => {
    setSideMenuStatus(!openSideMenu);
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <div style={{ position: 'sticky', width: '100%', top: 0, zIndex: 100 }}>
      <AppBar position="static" style={{ backgroundColor: '#212121' }}>
        <Toolbar className="headerToolbar">
          {xsView && !currentUser && (
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => {
                handleMenuClick();
              }}
              aria-label="menu"
            >
              <MenuIcon />
            </IconButton>
          )}
          <div className="headerTitle">
            <img
              src={theCrewLogo}
              alt="the-crew-logo"
              onClick={() => {
                handleLogoClick();
              }}
            />
          </div>
          <div className="headerLinks">
            {/* <Button
              color="inherit"
              onClick={() => {
                navigate('/about-us');
              }}
            >
              About Us
            </Button> */}
            {(!currentUser || !currentUser?.role.includes(Role.PROFESSIONAL)) && !xsView && (
              <>
                {/* <VerticalDivider /> */}
                <Button
                  className="registerAsProfessionalBtn"
                  color="inherit"
                  onClick={() => {
                    navigate('/register-as-professional');
                  }}
                >
                  Register As A Professional
                </Button>
              </>
            )}
            {!currentUser ? (
              !xsView && (
                <>
                  <VerticalDivider />
                  <Button
                    color="inherit"
                    onClick={() => {
                      navigate('/login');
                    }}
                  >
                    Login
                  </Button>
                  {/* <VerticalDivider />
                <Button
                  color="inherit"
                  onClick={() => {
                    navigate('/register');
                  }}
                >
                  Sign Up
                </Button> */}
                </>
              )
            ) : (
              <>
                <VerticalDivider />
                <Notification />
                <VerticalDivider />
                <MyAvatar currentUser={currentUser} />
              </>
            )}
          </div>
        </Toolbar>
      </AppBar>
      <SwipeableDrawer
        anchor="left"
        role="presentation"
        open={openSideMenu}
        onClose={() => {
          handleMenuClick();
        }}
        onOpen={() => {
          handleMenuClick();
        }}
      >
        <Box sx={{ width: 250 }}>
          <List>
            <ListItem
              button
              key="login"
              onClick={() => {
                navigate('/login');
                handleMenuClick();
              }}
            >
              <ListItemIcon>
                <ExitToAppIcon />{' '}
              </ListItemIcon>
              <ListItemText primary="Login" />
            </ListItem>
            {/* <ListItem
              button
              key="register"
              onClick={() => {
                handleMenuClick();
                navigate('/register');
              }}
            >
              <ListItemIcon>
                <PersonAddIcon />{' '}
              </ListItemIcon>
              <ListItemText primary="Sign Up" />
            </ListItem> */}
            {(!currentUser || !currentUser?.role.includes(Role.PROFESSIONAL)) && (
              <ListItem
                button
                key="register_as_professional"
                onClick={() => {
                  handleMenuClick();
                  navigate('/register-as-professional');
                }}
              >
                <ListItemIcon>
                  <HandymanIcon />{' '}
                </ListItemIcon>
                <ListItemText primary="Register as Professional" />
              </ListItem>
            )}
          </List>
        </Box>
      </SwipeableDrawer>
    </div>
  );
}

const VerticalDivider = () => {
  return (
    <Divider
      orientation="vertical"
      style={{ borderColor: 'white', borderBottomWidth: '16px', margin: '0 4px' }}
    ></Divider>
  );
};
