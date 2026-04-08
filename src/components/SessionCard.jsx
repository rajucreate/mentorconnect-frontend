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

  const getStatusSx = (value) => {
    if (value === 'ACTIVE') {
      return {
        bgcolor: 'rgba(34,197,94,0.2)',
        color: '#dbffe9',
        border: '1px solid rgba(34,197,94,0.55)',
      };
    }
    if (value === 'PENDING') {
      return {
        bgcolor: 'rgba(251,146,60,0.2)',
        color: '#fff2df',
        border: '1px solid rgba(251,146,60,0.55)',
      };
    }
    if (value === 'APPROVED' || value === 'ACCEPTED') {
      return {
        bgcolor: 'rgba(59,130,246,0.2)',
        color: '#deedff',
        border: '1px solid rgba(59,130,246,0.55)',
      };
    }
    if (value === 'REJECTED') {
      return {
        bgcolor: 'rgba(239,68,68,0.2)',
        color: '#ffe3e3',
        border: '1px solid rgba(239,68,68,0.55)',
      };
    }
    return {
      bgcolor: 'rgba(148,163,184,0.2)',
      color: '#e2e8f0',
      border: '1px solid rgba(148,163,184,0.45)',
    };
  };

  return (
    <Card className="glass-card card-enter" sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ color: '#f2fbff', fontWeight: 700 }}>
          Mentor: {mentorName}
        </Typography>
        <Typography variant="body2" sx={{ mb: 1, color: 'rgba(233,245,255,0.9)' }}>
          Time: {formattedTime}
        </Typography>
        <Chip label={status} size="small" sx={{ fontWeight: 700, ...getStatusSx(status) }} />
      </CardContent>
    </Card>
  );
};

export default SessionCard;
