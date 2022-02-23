import HandymanIcon from '@mui/icons-material/Handyman';
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';
import UpcomingIcon from '@mui/icons-material/Upcoming';
import { Avatar, Divider, IconButton, ListItemIcon, Menu, MenuItem, Tooltip } from '@mui/material';
import { User } from '@the-crew/common';
import { Role } from '@the-crew/common/enums';
import { useState } from 'react';
import { useGoogleLogout } from 'react-google-login';
import { useNavigate } from 'react-router-dom';

import { environment } from '../../../../environments/environment';
import { useAppDispatch } from '../../../store';
import { AuthThunks } from '../../../store/thunks';

interface IMyAvatar {
  currentUser: User;
}

const MyAvatar: React.FC<IMyAvatar> = ({ currentUser }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const dispatch = useAppDispatch();
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const { signOut } = useGoogleLogout({
    clientId: environment.googleClientId,
    onLogoutSuccess: () => {
      onLogout();
    },
    onFailure: () => {
      onLogout();
    },
  });

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onLogout = () => {
    dispatch(AuthThunks.logout())
      .unwrap()
      .finally(() => {
        navigate('/login');
      });
  };

  return (
    <>
      <Tooltip title={currentUser.fullName ?? ''}>
        <IconButton onClick={handleClick} size="small" sx={{ ml: 2 }}>
          <Avatar
            sx={{ height: 48, width: 48 }}
            {...(currentUser.meta.imgUrl ? { src: `${currentUser.meta.imgUrl}` } : null)}
          >
            {currentUser.fullName[0].toUpperCase()}
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
        <MenuItem onClick={() => navigate('/bookings')}>
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
        {currentUser.role.includes(Role.PROFESSIONAL) && (
          <MenuItem onClick={() => navigate('/services')}>
            <ListItemIcon>
              <HandymanIcon fontSize="small" />
            </ListItemIcon>
            My Services
          </MenuItem>
        )}
        <MenuItem
          onClick={() => {
            if (currentUser.meta.googleId) {
              signOut();
            } else {
              onLogout();
            }
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

export default MyAvatar;
