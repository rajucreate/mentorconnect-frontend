import React from 'react';
import { ListItem, ListItemText, Typography } from '@mui/material';

const NotificationItem = ({ notification }) => {
  return (
    <ListItem divider>
      <ListItemText
        primary={notification.message}
        secondary={
          <Typography variant="caption" color="text.secondary">
            {new Date(notification.createdAt).toLocaleString()}
          </Typography>
        }
      />
    </ListItem>
  );
};

export default NotificationItem;
