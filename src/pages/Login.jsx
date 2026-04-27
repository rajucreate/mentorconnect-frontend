import React, { useState, useContext, useEffect } from 'react';
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
  Divider,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';
import AuthHeader from '../components/AuthHeader';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const getDashboardPath = (role) => {
  if (role === 'MENTOR') return '/mentor-dashboard';
  if (role === 'ADMIN') return '/admin-dashboard';
  return '/mentee-dashboard';
};

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [googleRole, setGoogleRole] = useState(localStorage.getItem('selectedRole') || '');

  const { login, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (user) {
      navigate(getDashboardPath(user.role), { replace: true });
    }
  }, [user, navigate]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const oauthToken = params.get('token');
    const oauthError = params.get('oauthError');

    if (oauthError) {
      setError(oauthError);
      return;
    }

    if (oauthToken) {
      try {
        login(oauthToken);
        const decodedToken = jwtDecode(oauthToken);
        navigate(getDashboardPath(decodedToken.role), { replace: true });
      } catch {
        setError('Google login returned an invalid token.');
      }
    }
  }, [location.search, login, navigate]);

  const handleGoogleLogin = () => {
    if (!googleRole) {
      setError('Please choose Mentee or Mentor before continuing with Google.');
      return;
    }

    const backendBase = (api.defaults.baseURL || '').replace(/\/api\/?$/, '');
    localStorage.setItem('selectedRole', googleRole);
    window.location.href = `${backendBase}/api/auth/oauth2/authorize/google?role=${googleRole}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Please fill in both email and password.');
      return;
    }

    if (!EMAIL_REGEX.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const response = await api.post('/auth/login', { email, password });

      const token = response.data?.token;

      if (!token) {
        throw new Error('No token received from the server.');
      }

      login(token);
      const decodedToken = jwtDecode(token);
      navigate(getDashboardPath(decodedToken.role), { replace: true });
    } catch (err) {
      if (err.response) {
        setError(err.response.data?.message || 'Invalid credentials. Please try again.');
      } else if (err.request) {
        setError('No response from the server. Is the backend running?');
      } else {
        setError('An error occurred during login: ' + err.message);
      }
    } finally {
      setLoading(false);
    }
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
                Welcome Back
              </Typography>
              <Typography variant="body2" align="center" sx={{ color: 'rgba(16,35,79,0.75)' }}>
                Sign in to continue to MentorConnect
              </Typography>
            </Stack>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} noValidate>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value.trim())}
                disabled={loading}
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
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                variant="outlined"
              />
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
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Log In'}
              </Button>

              <Typography variant="subtitle2" sx={{ mt: 1, mb: 1, fontWeight: 600, color: '#10234f' }}>
                Choose Role for Google Login
              </Typography>
              <ToggleButtonGroup
                value={googleRole}
                exclusive
                onChange={(e, newRole) => {
                  if (newRole) {
                    setGoogleRole(newRole);
                    localStorage.setItem('selectedRole', newRole);
                  }
                }}
                fullWidth
                sx={{ mb: 1 }}
                disabled={loading}
              >
                <ToggleButton value="MENTEE" sx={{ textTransform: 'none', fontWeight: 600 }}>
                  Mentee
                </ToggleButton>
                <ToggleButton value="MENTOR" sx={{ textTransform: 'none', fontWeight: 600 }}>
                  Mentor
                </ToggleButton>
              </ToggleButtonGroup>

              <Divider sx={{ my: 2 }}>or</Divider>

              <Button
                fullWidth
                variant="outlined"
                size="large"
                onClick={handleGoogleLogin}
                disabled={loading}
                sx={{
                  minHeight: 44,
                  borderRadius: 2.5,
                  textTransform: 'none',
                  fontWeight: 700,
                }}
              >
                Continue with Google
              </Button>

              <Typography align="center" variant="body2" sx={{ color: 'rgba(16,35,79,0.8)' }}>
                Don&apos;t have an account?{' '}
                <Link to="/register" style={{ color: '#315ed1', textDecoration: 'none', fontWeight: 600 }}>
                  Choose role and register
                </Link>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default Login;
