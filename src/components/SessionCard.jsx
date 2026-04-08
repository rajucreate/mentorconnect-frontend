import React from 'react';
import { Card, CardContent, Typography, Chip } from '@mui/material';

const SessionCard = ({ session }) => {
  const mentorName =
    session?.mentor?.name ||
    session?.mentorName ||
    session?.mentor?.email ||
    'Unknown Mentor';

  const rawTime =
    session?.time ||
    session?.dateTime ||
    session?.scheduledAt ||
    session?.sessionDate ||
    null;

  let formattedTime = 'Not specified';
  if (rawTime) {
    const parsed = new Date(rawTime);
    formattedTime = Number.isNaN(parsed.getTime()) ? rawTime : parsed.toLocaleString();
  }

  const status = session?.status || 'N/A';

  const getStatusColor = (value) => {
    if (value === 'PENDING') {
      return 'warning';
    }
    if (value === 'APPROVED' || value === 'ACCEPTED') {
      return 'success';
    }
    if (value === 'REJECTED') {
      return 'error';
    }
    if (value === 'CANCELLED') {
      return 'default';
    }
    return 'default';
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Mentor: {mentorName}
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          Time: {formattedTime}
        </Typography>
        <Chip label={status} color={getStatusColor(status)} size="small" />
      </CardContent>
    </Card>
  );
};

export default SessionCard;
