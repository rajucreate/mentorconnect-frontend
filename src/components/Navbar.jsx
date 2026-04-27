import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  Stack,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const navLinks = [
  { label: 'Home', id: 'home' },
  { label: 'About', id: 'about' },
  { label: 'Features', id: 'features' },
  { label: 'How It Works', id: 'how-it-works' },
  { label: 'Contact', id: 'contact' },
];

const glassStyles = {
  backdropFilter: 'blur(14px)',
  backgroundColor: 'rgba(10, 18, 47, 0.56)',
  border: '1px solid rgba(255,255,255,0.15)',
  boxShadow: '0 10px 40px rgba(10, 18, 47, 0.35)',
};

const Navbar = ({ onLogin }) => {
  const navigate = useNavigate();

  const scrollTo = (id) => {
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleLogin = () => {
    if (onLogin) {
      onLogin();
      return;
    }
    navigate('/login');
  };

  const handleGetStarted = () => {
    scrollTo('home');
  };

  return (
    <AppBar position="sticky" elevation={0} sx={{ py: 1, ...glassStyles }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 800,
              letterSpacing: '0.08em',
              color: '#f4f7ff',
              textTransform: 'uppercase',
            }}
          >
            MentorConnect
          </Typography>

          <Stack
            direction="row"
            spacing={1}
            sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}
          >
            {navLinks.map((link) => (
              <Button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                sx={{
                  color: '#d9e6ff',
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 1.5,
                }}
              >
                {link.label}
              </Button>
            ))}
          </Stack>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              onClick={handleLogin}
              sx={{
                color: '#e8eeff',
                textTransform: 'none',
                fontWeight: 700,
                px: { xs: 1.5, sm: 2.5 },
              }}
            >
              Login
            </Button>
            <Button
              variant="contained"
              onClick={handleGetStarted}
              sx={{
                textTransform: 'none',
                fontWeight: 700,
                px: { xs: 2, sm: 3 },
                borderRadius: 3,
                background: 'linear-gradient(135deg, #4e7dff, #31b2ff)',
              }}
            >
              Get Started
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
