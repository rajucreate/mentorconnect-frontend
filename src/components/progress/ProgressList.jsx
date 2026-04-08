import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Button,
  CircularProgress,
  Grid,
  Snackbar,
  Typography,
} from '@mui/material';
import {
  createProgress,
  getProgressByMatch,
  updateProgress,
} from '../../api/progressApi';
import ProgressCard from './ProgressCard';
import ProgressDialog from './ProgressDialog';

const normalizeList = (response) => {
  if (Array.isArray(response?.data)) {
    return response.data;
  }
  if (Array.isArray(response?.data?.data)) {
    return response.data.data;
  }
  return [];
};

const ProgressList = ({ matchId, canManage }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProgress, setEditingProgress] = useState(null);
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: 'success',
    message: '',
  });

  const loadProgress = useCallback(async () => {
    if (!matchId) {
      setItems([]);
      setLoading(false);
      setError('');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await getProgressByMatch(matchId);
      setItems(normalizeList(response));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load progress.');
    } finally {
      setLoading(false);
    }
  }, [matchId]);

  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  const handleOpenCreate = () => {
    setEditingProgress(null);
    setDialogOpen(true);
  };

  const handleOpenEdit = (progressItem) => {
    setEditingProgress(progressItem);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    if (!saving) {
      setDialogOpen(false);
      setEditingProgress(null);
    }
  };

  const handleSaveProgress = async ({ title, description }) => {
    if (!matchId) {
      return;
    }

    setSaving(true);

    try {
      const requestBody = {
        matchId: Number(matchId),
        goal: title,
        completed: editingProgress?.completed ?? false,
        mentorNotes: canManage ? description : (editingProgress?.mentorNotes || ''),
        menteeNotes: canManage ? (editingProgress?.menteeNotes || '') : description,
      };

      console.log(requestBody);

      if (editingProgress) {
        const progressId = editingProgress?.id || editingProgress?._id || editingProgress?.progressId;
        await updateProgress(progressId, requestBody);
      } else {
        await createProgress(requestBody);
      }

      setSnackbar({
        open: true,
        severity: 'success',
        message: editingProgress ? 'Progress updated successfully.' : 'Progress added successfully.',
      });
      setDialogOpen(false);
      setEditingProgress(null);
      await loadProgress();
    } catch (err) {
      setSnackbar({
        open: true,
        severity: 'error',
        message: err.response?.data?.message || 'Failed to save progress.',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Grid container spacing={1} sx={{ mt: 1 }}>
      <Grid size={12}>
        <Typography variant="subtitle2">Progress</Typography>
      </Grid>

      {canManage && (
        <Grid size={12}>
          <Button variant="outlined" size="small" onClick={handleOpenCreate}>
            Add Progress
          </Button>
        </Grid>
      )}

      {loading && (
        <Grid size={12} sx={{ py: 2, textAlign: 'center' }}>
          <CircularProgress size={20} />
        </Grid>
      )}

      {!loading && error && (
        <Grid size={12}>
          <Alert severity="error">{error}</Alert>
        </Grid>
      )}

      {!loading && !error && items.length === 0 && (
        <Grid size={12}>
          <Typography variant="body2">No progress yet.</Typography>
        </Grid>
      )}

      {!loading && !error && items.length > 0 && (
        <Grid size={12}>
          {items.map((item, index) => {
            const key = item?.id || item?._id || item?.progressId || index;
            return (
              <ProgressCard
                key={key}
                progress={item}
                canManage={canManage}
                onEdit={handleOpenEdit}
              />
            );
          })}
        </Grid>
      )}

      <ProgressDialog
        key={`${dialogOpen}-${editingProgress?.id || editingProgress?._id || editingProgress?.progressId || 'new'}`}
        open={dialogOpen}
        onClose={handleCloseDialog}
        onSubmit={handleSaveProgress}
        initialValue={editingProgress}
        submitting={saving}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Grid>
  );
};

export default ProgressList;
