import React, { useContext, useState } from 'react';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { Badge, IconButton, Menu, List, Typography, Button } from '@mui/material';
import { NotificationContext } from '../context/NotificationStore';
import NotificationItem from './NotificationItem';

const NotificationBell = () => {
  const { notifications, unreadCount, markAllAsRead } = useContext(NotificationContext);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
    markAllAsRead();
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <IconButton color="primary" onClick={handleOpen}>
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <List sx={{ width: 360, maxHeight: 360, overflowY: 'auto' }}>
          {notifications.length === 0 ? (
            <Typography variant="body2" sx={{ px: 2, py: 1 }}>
              No notifications
            </Typography>
          ) : (
            notifications.map((item) => <NotificationItem key={item.id} notification={item} />)
          )}
        </List>
        <Button fullWidth onClick={handleClose}>Close</Button>
      </Menu>
    </>
  );
};

export default NotificationBell;
