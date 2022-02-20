import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import BeenhereIcon from '@mui/icons-material/Beenhere';
import DateRangeIcon from '@mui/icons-material/DateRange';
import DeleteIcon from '@mui/icons-material/Delete';
import MarkAsUnreadIcon from '@mui/icons-material/MarkAsUnread';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import { Badge, BadgeProps, Grid, IconButton, Popover, Tooltip, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { EventType } from '@the-crew/common/enums';
import { noop } from 'lodash-es';
import { MouseEvent, useEffect, useState } from 'react';

import { notificationPlaceholder } from '../../../../assets/images/generic';
import { environment } from '../../../../environments/environment';
import { useAppDispatch, useAppSelector } from '../../../store';
import { notificationActions, notificationSelectors } from '../../../store/slices';
import { notificationThunk } from '../../../store/thunks';
import style from './Notification.module.scss';

import type { INotification } from '@the-crew/common';
import type { Update } from '@reduxjs/toolkit';

const Notification: React.FC = () => {
  const dispatch = useAppDispatch();
  const notifications = useAppSelector(state =>
    notificationSelectors.selectAll(state.notifications),
  );
  const currentUser = useAppSelector(state => state.auth.user);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const open = Boolean(anchorEl);

  useEffect(() => {
    dispatch(
      notificationThunk.getNotifications({
        filter: [
          {
            field: 'receivers',
            operator: '$in',
            value: `{${currentUser.id}}`,
          },
        ],
      }),
    );
  }, []);

  useEffect(() => {
    const eventSource = new EventSource(`${environment.apiUrl}/notifications/sse`);
    eventSource.addEventListener(EventType.SUB_ORDER_CREATED, (evt: MessageEvent) => {
      const newNotif = JSON.parse(evt.data);
      dispatch(notificationActions.addNotification(newNotif));
    });
    window.addEventListener('beforeunload', () => {
      console.log('beforeunload');
      if (eventSource !== null) {
        eventSource.close();
      }
    });
    return () => {
      eventSource.removeEventListener(EventType.SUB_ORDER_CREATED, noop);
      eventSource.close();
    };
  }, []);

  const handleOpen = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton aria-label="notifications" style={{ color: 'white' }} onClick={handleOpen}>
        <StyledBadge
          badgeContent={notifications.filter(({ isRead }) => !isRead).length}
          color="secondary"
          max={99}
        >
          <NotificationsNoneIcon />
        </StyledBadge>
      </IconButton>
      <Popover
        style={{ width: '100%', overflow: 'hidden' }}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
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
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      >
        <Grid container direction="column" rowGap={1.5} className={style.notificationContainer}>
          {notifications.length ? (
            <>
              <Typography variant="body1" fontWeight="bold" marginLeft={1}>
                Notifications
              </Typography>
              {notifications.map((notif, index) => (
                <NotificationCard key={index} payload={notif} />
              ))}
            </>
          ) : (
            <Grid container direction="column" rowGap={1} padding={1} margin="auto">
              <img src={notificationPlaceholder} alt="notification-placeholder" />
              <Typography variant="h6" textAlign="center">
                You're all caught up!
              </Typography>
            </Grid>
          )}
        </Grid>
      </Popover>
    </>
  );
};

const StyledBadge = styled(Badge)<BadgeProps>(({ theme }) => ({
  '& .MuiBadge-badge': {
    padding: '0 4px',
  },
}));

const NotificationCard: React.FC<{ payload: INotification }> = ({ payload }) => {
  const dispatch = useAppDispatch();

  const toggleMarkAsReadUnread = () => {
    const delta: Update<INotification> = {
      id: payload.id,
      changes: {
        isRead: !payload.isRead,
      },
    };
    dispatch(notificationThunk.updateReadStatus(delta));
  };

  const deleteNotification = () => {
    dispatch(notificationThunk.deleteNotification(payload.id));
  };

  return (
    <Grid
      container
      columnGap={1}
      direction="row"
      flexWrap="nowrap"
      className={style.notificationCard}
      style={{ backgroundColor: payload.isRead ? 'white' : '#ebebeb' }}
    >
      <Grid item alignSelf="center">
        <AddBusinessIcon color="action" />
      </Grid>
      <Grid container item direction="column" rowGap={0.5}>
        <Grid container item display="inline-flex" alignItems="center" columnGap={0.5}>
          <Typography variant="body1">{payload.subject}</Typography>
          <Tooltip title={new Date(payload.createdOn).toUTCString()}>
            <DateRangeIcon style={{ fontSize: '16px' }} color="action" />
          </Tooltip>
        </Grid>
        <Typography variant="caption">{payload.body}</Typography>
      </Grid>
      <Grid item container xs direction="row" flexWrap="nowrap">
        <Tooltip title={payload.isRead ? 'Mark as unread' : 'Mark as read'}>
          <IconButton disableRipple size="small" onClick={toggleMarkAsReadUnread}>
            {payload.isRead ? (
              <MarkAsUnreadIcon fontSize="small" />
            ) : (
              <BeenhereIcon fontSize="small" />
            )}
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete Notification">
          <IconButton disableRipple size="small" onClick={deleteNotification}>
            <DeleteIcon fontSize="small" color="error" />
          </IconButton>
        </Tooltip>
      </Grid>
    </Grid>
  );
};

export default Notification;
