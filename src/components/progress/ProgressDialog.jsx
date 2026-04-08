import React, { useState } from 'react';
import {
  Dialog,
  Grid,
  Typography,
  TextField,
  Button,
} from '@mui/material';

const ProgressDialog = ({ open, onClose, onSubmit, initialValue, submitting }) => {
  const [title, setTitle] = useState(initialValue?.title || initialValue?.goal || '');
  const [description, setDescription] = useState(
    initialValue?.description || initialValue?.mentorNotes || initialValue?.menteeNotes || ''
  );

  const handleSubmit = async () => {
    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();

    if (!trimmedTitle || !trimmedDescription) {
      return;
    }

    await onSubmit({
      title: trimmedTitle,
      description: trimmedDescription,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <Grid container spacing={2} sx={{ p: 2 }}>
        <Grid size={12}>
          <Typography variant="h6">
            {initialValue ? 'Update Progress' : 'Add Progress'}
          </Typography>
        </Grid>

        <Grid size={12}>
          <TextField
            fullWidth
            label="Title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
        </Grid>

        <Grid size={12}>
          <TextField
            fullWidth
            multiline
            minRows={3}
            label="Description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </Grid>

        <Grid size={6}>
          <Button variant="outlined" fullWidth onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
        </Grid>
        <Grid size={6}>
          <Button
            variant="contained"
            fullWidth
            onClick={handleSubmit}
            disabled={submitting || !title.trim() || !description.trim()}
          >
            {submitting ? 'Saving...' : initialValue ? 'Update' : 'Create'}
          </Button>
        </Grid>
      </Grid>
    </Dialog>
  );
};

export default ProgressDialog;
