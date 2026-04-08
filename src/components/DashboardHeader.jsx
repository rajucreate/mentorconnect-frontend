import React from 'react';
import { Grid, Typography, Button } from '@mui/material';
import NotificationBell from './NotificationBell';

const DashboardHeader = ({ title, subtitle, onLogout }) => {
  return (
    <Grid
      container
      spacing={2}
      alignItems="center"
      justifyContent="space-between"
      sx={{ mb: 3, px: 2, pt: 2 }}
    >
      <Grid size={{ xs: 12, md: 9 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {subtitle}
        </Typography>
      </Grid>
      <Grid size={{ xs: 12, md: 3 }}>
        <Grid container spacing={1} alignItems="center">
          <Grid>
            <NotificationBell />
          </Grid>
          <Grid size="grow">
            <Button variant="outlined" fullWidth onClick={onLogout}>
              Logout
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default DashboardHeader;
