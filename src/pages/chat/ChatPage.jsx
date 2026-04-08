import React from 'react';
import { Grid, Typography } from '@mui/material';
import ChatBox from '../../components/ChatBox';

const ChatPage = () => {
  return (
    <Grid container spacing={2} sx={{ p: 2 }}>
      <Grid size={12}>
        <Typography variant="h4" gutterBottom>
          Chat
        </Typography>
      </Grid>
      <Grid size={12}>
        <ChatBox />
      </Grid>
    </Grid>
  );
};

export default ChatPage;
