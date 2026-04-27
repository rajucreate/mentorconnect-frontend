import React, { useEffect, useState } from 'react';
import {
  Container,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Divider,
} from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import AuthHeader from '../components/AuthHeader';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: localStorage.getItem('selectedRole') || '',
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem('selectedRole');
    if (role) {
      setFormData(prev => ({ ...prev, role }));
    }
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password || !formData.role) {
      setError('Please fill in all fields.');
      return;
    }

    if (!EMAIL_REGEX.test(formData.email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setError(null);
    setLoading(true);
    setSuccess(false);

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      };

      const response = await api.post('/auth/register', payload);

      if (response.data) {
        setSuccess(true);
        localStorage.removeItem('selectedRole');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (err) {
      if (err.response) {
        setError(err.response.data?.message || 'Registration failed. Please check the backend errors.');
      } else if (err.request) {
        setError('No response from the server. Is the backend running?');
      } else {
        setError('An error occurred during registration: ' + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    if (!formData.role) {
      setError('Please choose Mentee or Mentor before signing up with Google.');
      return;
    }

    const selectedRole = formData.role;
    const backendBase = (api.defaults.baseURL || '').replace(/\/api\/?$/, '');
    window.location.href = `${backendBase}/api/auth/oauth2/authorize/google?role=${selectedRole}`;
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: 'linear-gradient(145deg, #d7e8ff 0%, #f5f8ff 45%, #e8f1ff 100%)',
        py: 4,
      }}
    >
      <Container maxWidth="xs">
        <AuthHeader />
        <Card
          elevation={0}
          sx={{
            p: 1,
            borderRadius: 4,
            border: '1px solid rgba(255,255,255,0.6)',
            backdropFilter: 'blur(12px)',
            backgroundColor: 'rgba(255,255,255,0.82)',
            boxShadow: '0 18px 45px rgba(12,29,74,0.14)',
          }}
        >
          <CardContent>
            <Stack spacing={0.8} sx={{ mb: 2.5 }}>
              <Typography variant="h5" align="center" sx={{ fontWeight: 900, color: '#10234f' }}>
                Create an Account
              </Typography>
              <Typography variant="body2" align="center" sx={{ color: 'rgba(16,35,79,0.75)' }}>
                Join MentorConnect today
              </Typography>
            </Stack>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {success && (
              <Alert severity="success" sx={{ mb: 2 }}>
                Account created successfully! Redirecting to login...
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} noValidate>
              <TextField
                margin="normal"
                required
                fullWidth
                id="name"
                label="Full Name"
                name="name"
                autoComplete="name"
                autoFocus
                value={formData.name}
                onChange={handleChange}
                disabled={loading || success}
                variant="outlined"
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                disabled={loading || success}
                variant="outlined"
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
                disabled={loading || success}
                variant="outlined"
              />

              <Typography variant="subtitle2" sx={{ mt: 2.5, mb: 1, fontWeight: 600, color: '#10234f' }}>
                Select Your Role
              </Typography>
              <ToggleButtonGroup
                value={formData.role}
                exclusive
                onChange={(e, newRole) => {
                  if (newRole) {
                    setFormData({ ...formData, role: newRole });
                  }
                }}
                fullWidth
                sx={{ mb: 2 }}
                disabled={loading || success}
              >
                <ToggleButton
                  value="MENTEE"
                  sx={{
                    textTransform: 'none',
                    fontWeight: 600,
                    '&.Mui-selected': {
                      background: 'linear-gradient(135deg, #4e7dff, #31b2ff)',
                      color: '#fff',
                    },
                  }}
                >
                  Mentee
                </ToggleButton>
                <ToggleButton
                  value="MENTOR"
                  sx={{
                    textTransform: 'none',
                    fontWeight: 600,
                    '&.Mui-selected': {
                      background: 'linear-gradient(135deg, #4e7dff, #31b2ff)',
                      color: '#fff',
                    },
                  }}
                >
                  Mentor
                </ToggleButton>
              </ToggleButtonGroup>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                sx={{
                  mt: 3,
                  mb: 2,
                  minHeight: 44,
                  borderRadius: 2.5,
                  textTransform: 'none',
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #4e7dff, #31b2ff)',
                }}
                disabled={loading || success || !formData.role}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Register'}
              </Button>

              <Divider sx={{ my: 2 }}>or</Divider>

              <Button
                fullWidth
                variant="outlined"
                size="large"
                onClick={handleGoogleSignup}
                sx={{
                  minHeight: 44,
                  borderRadius: 2.5,
                  textTransform: 'none',
                  fontWeight: 700,
                }}
                disabled={loading || success}
              >
                Sign up with Google
              </Button>

              <Typography align="center" variant="body2" sx={{ color: 'rgba(16,35,79,0.8)' }}>
                Already have an account?{' '}
                <Link to="/login" style={{ color: '#315ed1', textDecoration: 'none', fontWeight: 600 }}>
                  Log in
                </Link>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default Register;
