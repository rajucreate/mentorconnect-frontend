import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
} from '@mui/material';

const formatUpdatedDate = (value) => {
  if (!value) {
    return 'N/A';
  }

  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.getTime())) {
    return value;
  }

  return parsedDate.toLocaleString();
};

const ProgressCard = ({ progress, canManage, onEdit }) => {
  const progressId = progress?.id || progress?._id || progress?.progressId;
  const title = progress?.title || progress?.goal || 'Untitled';
  const description = progress?.description || progress?.mentorNotes || progress?.menteeNotes || 'No description';
  const updatedAt = progress?.updatedAt || progress?.updatedDate || progress?.createdAt;

  return (
    <Card className="glass-card" variant="outlined" sx={{ mb: 1 }}>
      <CardContent>
        <Typography variant="subtitle1" gutterBottom sx={{ color: '#f2fbff', fontWeight: 700 }}>
          {title}
        </Typography>
        <Typography variant="body2" sx={{ mb: 1, color: 'rgba(232,244,255,0.88)' }}>
          {description}
        </Typography>
        <Typography variant="caption" sx={{ color: 'rgba(219,234,254,0.78)' }}>
          Last updated: {formatUpdatedDate(updatedAt)}
        </Typography>
        {canManage && (
          <Grid container sx={{ mt: 1 }}>
            <Button
              variant="outlined"
              className="subtle-button"
              size="small"
              disabled={!progressId}
              onClick={() => onEdit(progress)}
            >
              Edit
            </Button>
          </Grid>
        )}
      </CardContent>
    </Card>
  );
};

export default ProgressCard;
