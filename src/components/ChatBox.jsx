import React, { useState } from 'react';
import { Card, CardContent, Grid, Typography, TextField, Button } from '@mui/material';

const ChatBox = () => {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'System', text: 'Welcome to chat.' },
  ]);
  const [draft, setDraft] = useState('');

  const sendMessage = () => {
    const value = draft.trim();
    if (!value) {
      return;
    }

    setMessages((prev) => [...prev, { id: Date.now(), sender: 'You', text: value }]);
    setDraft('');
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Chat
        </Typography>

        <Grid container spacing={1} sx={{ mb: 2 }}>
          {messages.map((message) => (
            <Grid size={12} key={message.id}>
              <Typography variant="body2">
                <strong>{message.sender}:</strong> {message.text}
              </Typography>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={1} alignItems="center">
          <Grid size={{ xs: 12, sm: 9 }}>
            <TextField
              fullWidth
              label="Type a message"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }}>
            <Button variant="contained" fullWidth onClick={sendMessage}>
              Send
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default ChatBox;
