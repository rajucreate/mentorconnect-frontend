import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';

const LogoutConfirmDialog = ({ open, onCancel, onConfirm }) => {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          p: 0.5,
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: 800, color: '#10234f' }}>Confirm Logout</DialogTitle>
      <DialogContent>
        <Typography variant="body1" sx={{ color: 'rgba(16,35,79,0.8)' }}>
          Are you sure you want to log out of your account?
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button onClick={onCancel} variant="outlined" sx={{ textTransform: 'none', fontWeight: 700 }}>
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          sx={{
            textTransform: 'none',
            fontWeight: 700,
            background: 'linear-gradient(135deg, #dc2626, #ef4444)',
          }}
        >
          Logout
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LogoutConfirmDialog;