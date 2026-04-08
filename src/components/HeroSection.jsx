import React from 'react';
import { Box, Button, Container, Stack, Typography } from '@mui/material';

const HeroSection = ({ onJoinAsMentee, onJoinAsMentor }) => {
  return (
    <Box
      id="home"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        background:
          'linear-gradient(-45deg, #0e1f4d, #1f2f73, #1d5ca8, #2d7bc5, #49a7ff)',
        backgroundSize: '300% 300%',
        animation: 'gradientShift 16s ease infinite',
        '@keyframes gradientShift': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          width: 500,
          height: 500,
          borderRadius: '50%',
          top: -170,
          right: -120,
          background: 'radial-gradient(circle, rgba(125, 206, 255, 0.5), transparent 60%)',
          pointerEvents: 'none',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          width: 420,
          height: 420,
          borderRadius: '50%',
          bottom: -180,
          left: -140,
          background: 'radial-gradient(circle, rgba(78, 125, 255, 0.45), transparent 62%)',
          pointerEvents: 'none',
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
        <Stack spacing={3} sx={{ maxWidth: 700 }}>
          <Typography
            variant="h2"
            sx={{
              color: '#f5f8ff',
              fontWeight: 900,
              fontSize: { xs: '2.2rem', md: '4rem' },
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
              animation: 'heroTextReveal 800ms ease-out both',
              '@keyframes heroTextReveal': {
                from: { opacity: 0, transform: 'translateY(14px)' },
                to: { opacity: 1, transform: 'translateY(0)' },
              },
            }}
          >
            Connect. Learn. Grow.
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: 'rgba(234, 241, 255, 0.92)',
              maxWidth: 560,
              fontWeight: 500,
              animation: 'heroTextReveal 1.2s ease-out both',
            }}
          >
            Find mentors, book sessions, and track your progress.
          </Typography>

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            sx={{ pt: 1, animation: 'heroTextReveal 1.4s ease-out both' }}
          >
            <Button
              variant="contained"
              size="large"
              onClick={onJoinAsMentee}
              sx={{
                textTransform: 'none',
                borderRadius: 3,
                fontWeight: 700,
                px: 3,
                py: 1.4,
                background: 'linear-gradient(135deg, #4e7dff, #6aa3ff)',
                '&:hover': {
                  transform: 'translateY(-2px)',
                },
                transition: 'transform 220ms ease',
              }}
            >
              Join as Mentee
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={onJoinAsMentor}
              sx={{
                textTransform: 'none',
                borderRadius: 3,
                fontWeight: 700,
                px: 3,
                py: 1.4,
                color: '#eaf1ff',
                borderColor: 'rgba(234, 241, 255, 0.65)',
                backgroundColor: 'rgba(255,255,255,0.08)',
                '&:hover': {
                  borderColor: '#eaf1ff',
                  backgroundColor: 'rgba(255,255,255,0.16)',
                  transform: 'translateY(-2px)',
                },
                transition: 'transform 220ms ease, background-color 220ms ease',
              }}
            >
              Join as Mentor
            </Button>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};

export default HeroSection;
