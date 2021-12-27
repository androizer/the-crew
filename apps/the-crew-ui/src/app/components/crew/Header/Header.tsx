import './headerStyles.scss';

import { Handyman } from '@mui/icons-material';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import HandymanIcon from '@mui/icons-material/Handyman';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SettingsIcon from '@mui/icons-material/Settings';
import UpcomingIcon from '@mui/icons-material/Upcoming';
import {
  AppBar,
  Avatar,
  Button,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  SwipeableDrawer,
  Toolbar,
  Tooltip,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Box } from '@mui/system';
import { Role } from '@the-crew/common/enums';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { theCrewLogo } from '../../../../assets/icons';
import { useAppDispatch, useAppSelector } from '../../../store';
import { authSelector } from '../../../store/slices';
import { AuthThunks } from '../../../store/thunks';

export default function Header() {
  const [openSideMenu, setSideMenuStatus] = useState(false);
  const authState = useSelector(authSelector);
  const history = useHistory();
  const theme = useTheme();
  const xsView = useMediaQuery(theme.breakpoints.down('sm'));

  const handleMenuClick = () => {
    setSideMenuStatus(!openSideMenu);
  };

  const handleLogoClick = () => {
    history.push('/');
  };

  return (
    <div style={{ position: 'sticky', width: '100%', top: 0, zIndex: 100 }}>
      <AppBar position="static">
        <Toolbar>
          {xsView && !authState.user && (
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
          {(!authState.user || !authState.user?.role.includes(Role.PROFESSIONAL)) && !xsView && (
            <Button
              className="registerAsProfessionalBtn"
              color="inherit"
              style={{ textDecoration: 'underline' }}
              onClick={() => {
                history.push('/register-as-professional');
              }}
            >
              Register As A Professional
            </Button>
          )}
          {!authState.user ? (
            !xsView && (
              <>
                <Button
                  color="inherit"
                  onClick={() => {
                    history.push('/login');
                  }}
                >
                  Login
                </Button>
                <Button
                  color="inherit"
                  onClick={() => {
                    history.push('/register');
                  }}
                >
                  Sign Up
                </Button>
              </>
            )
          ) : (
            <MyAvatar />
          )}
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
                history.push('/login');
                handleMenuClick();
              }}
            >
              <ListItemIcon>
                <ExitToAppIcon />{' '}
              </ListItemIcon>
              <ListItemText primary="Login" />
            </ListItem>
            <ListItem
              button
              key="register"
              onClick={() => {
                handleMenuClick();
                history.push('/register');
              }}
            >
              <ListItemIcon>
                <PersonAddIcon />{' '}
              </ListItemIcon>
              <ListItemText primary="Sign Up" />
            </ListItem>
            {(!authState.user || !authState.user?.role.includes(Role.PROFESSIONAL)) && (
              <ListItem
                button
                key="register_as_professional"
                onClick={() => {
                  handleMenuClick();
                  history.push('/register-as-professional');
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

const MyAvatar: React.FC = props => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const dispatch = useAppDispatch();
  const open = Boolean(anchorEl);
  const history = useHistory();
  const authState = useAppSelector(authSelector);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Tooltip title={authState.user?.fullName ?? ''}>
        <IconButton onClick={handleClick} size="small" sx={{ ml: 2 }}>
          <Avatar sx={{ width: 32, height: 32 }}>
            {authState.user?.fullName?.[0].toUpperCase()}
          </Avatar>
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={() => history.push('/bookings')}>
          <ListItemIcon>
            <UpcomingIcon color="action" />
          </ListItemIcon>
          My Bookings
        </MenuItem>
        <Divider />
        <MenuItem disabled>
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          My Profile
        </MenuItem>
        {authState.user.role[0] === Role.PROFESSIONAL && (
          <MenuItem onClick={() => history.push('/services')}>
            <ListItemIcon>
              <Handyman fontSize="small" />
            </ListItemIcon>
            My Services
          </MenuItem>
        )}
        <MenuItem
          onClick={() => {
            history.push('/login');
            dispatch(AuthThunks.logout());
          }}
        >
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </>
  );
};
