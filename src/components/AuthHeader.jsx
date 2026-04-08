import React from 'react';
import { Box, IconButton, Typography, Link as MuiLink } from '@mui/material';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import { Link as RouterLink } from 'react-router-dom';

const AuthHeader = () => {
  return (
    <Box
      sx={{
        mb: 1.5,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.7 }}>
        <IconButton
          component={RouterLink}
          to="/"
          size="small"
          aria-label="Back to home"
          sx={{
            color: '#16326e',
            border: '1px solid rgba(22,50,110,0.14)',
            backgroundColor: 'rgba(255,255,255,0.72)',
            transition: 'transform 0.16s ease, background-color 0.2s ease, border-color 0.2s ease',
            '&:hover': {
              transform: 'translateX(-2px)',
              backgroundColor: 'rgba(255,255,255,0.92)',
              borderColor: 'rgba(22,50,110,0.28)',
            },
          }}
        >
          <ArrowBackRoundedIcon fontSize="small" />
        </IconButton>

        <MuiLink
          component={RouterLink}
          to="/"
          underline="none"
          sx={{
            fontSize: '0.95rem',
            fontWeight: 700,
            color: '#16326e',
            transition: 'color 0.2s ease',
            '&:hover': {
              color: '#2753b8',
            },
          }}
        >
          MentorConnect
        </MuiLink>
      </Box>

      <MuiLink
        component={RouterLink}
        to="/"
        underline="none"
        sx={{
          fontSize: '0.85rem',
          fontWeight: 600,
          color: 'rgba(22,50,110,0.78)',
          transition: 'color 0.2s ease',
          '&:hover': {
            color: '#2753b8',
          },
        }}
      >
        Home
      </MuiLink>
    </Box>
  );
};

export default AuthHeader;
