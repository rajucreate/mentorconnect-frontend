import React, { useState } from 'react';
import {
  Dialog,
  Grid,
  Typography,
  TextField,
  Button,
  CircularProgress,
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
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{ className: 'modal-paper' }}
    >
      <Grid container spacing={2} sx={{ p: 2 }}>
        <Grid size={12}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {initialValue ? 'Update Progress' : 'Add Progress'}
          </Typography>
        </Grid>

        <Grid size={12}>
          <TextField
            fullWidth
            label="Title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            sx={{
              '& .MuiInputBase-root': {
                backgroundColor: 'rgba(255,255,255,0.08)',
                color: '#eff8ff',
              },
              '& .MuiInputLabel-root': { color: 'rgba(226,242,255,0.85)' },
              '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(226,242,255,0.35)' },
            }}
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
            sx={{
              '& .MuiInputBase-root': {
                backgroundColor: 'rgba(255,255,255,0.08)',
                color: '#eff8ff',
              },
              '& .MuiInputLabel-root': { color: 'rgba(226,242,255,0.85)' },
              '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(226,242,255,0.35)' },
            }}
          />
        </Grid>

        <Grid size={6}>
          <Button variant="outlined" className="subtle-button" fullWidth onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
        </Grid>
        <Grid size={6}>
          <Button
            variant="contained"
            className="gradient-button"
            fullWidth
            onClick={handleSubmit}
            disabled={submitting || !title.trim() || !description.trim()}
          >
            {submitting
              ? (
                <>
                  <CircularProgress size={16} color="inherit" sx={{ mr: 1 }} />
                  Saving...
                </>
              )
              : initialValue
                ? 'Update'
                : 'Create'}
          </Button>
        </Grid>
      </Grid>
    </Dialog>
  );
};

export default ProgressDialog;
