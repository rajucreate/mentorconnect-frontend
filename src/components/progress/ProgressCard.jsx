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
    <Card variant="outlined" sx={{ mb: 1 }}>
      <CardContent>
        <Typography variant="subtitle1" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          {description}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Last updated: {formatUpdatedDate(updatedAt)}
        </Typography>
        {canManage && (
          <Grid container sx={{ mt: 1 }}>
            <Button
              variant="text"
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
