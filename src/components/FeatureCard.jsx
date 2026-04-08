import React from 'react';
import { Card, CardContent, Stack, Typography } from '@mui/material';

const FeatureCard = ({ icon, title, description }) => {
  return (
    <Card
      sx={{
        height: '100%',
        borderRadius: 4,
        border: '1px solid rgba(255,255,255,0.25)',
        backdropFilter: 'blur(12px)',
        backgroundColor: 'rgba(255,255,255,0.7)',
        transition: 'transform 260ms ease, box-shadow 260ms ease',
        boxShadow: '0 12px 30px rgba(9, 26, 67, 0.12)',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 18px 38px rgba(9, 26, 67, 0.2)',
        },
      }}
    >
      <CardContent>
        <Stack spacing={2}>
          <Stack
            sx={{
              width: 52,
              height: 52,
              borderRadius: '50%',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(140deg, rgba(78,125,255,0.2), rgba(49,178,255,0.22))',
              color: '#1b3f94',
            }}
          >
            {icon}
          </Stack>
          <Typography variant="h6" sx={{ fontWeight: 800, color: '#10234f' }}>
            {title}
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(16,35,79,0.82)' }}>
            {description}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default FeatureCard;
