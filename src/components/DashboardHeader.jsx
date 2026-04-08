import React from 'react';
import { Grid, Typography, Button } from '@mui/material';
import NotificationBell from './NotificationBell';

const DashboardHeader = ({ title, subtitle, onLogout, isLight = false }) => {
  const titleColor = isLight ? '#f4fbff' : 'text.primary';
  const subtitleColor = isLight ? 'rgba(229,245,255,0.82)' : 'text.secondary';

  return (
    <Grid
      container
      spacing={2}
      alignItems="center"
      justifyContent="space-between"
      sx={{ mb: 3, px: 2, pt: 2 }}
    >
      <Grid size={{ xs: 12, md: 9 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ color: titleColor, fontWeight: 800 }}>
          {title}
        </Typography>
        <Typography variant="body1" sx={{ color: subtitleColor }}>
          {subtitle}
        </Typography>
      </Grid>
      <Grid size={{ xs: 12, md: 3 }}>
        <Grid container spacing={1} alignItems="center">
          <Grid>
            <NotificationBell />
          </Grid>
          <Grid size="grow">
            <Button
              variant="outlined"
              className={isLight ? 'subtle-button' : undefined}
              fullWidth
              onClick={onLogout}
            >
              Logout
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default DashboardHeader;
