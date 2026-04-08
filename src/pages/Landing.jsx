import React from 'react';
import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import PersonSearchRoundedIcon from '@mui/icons-material/PersonSearchRounded';
import EventAvailableRoundedIcon from '@mui/icons-material/EventAvailableRounded';
import TimelineRoundedIcon from '@mui/icons-material/TimelineRounded';
import ForumRoundedIcon from '@mui/icons-material/ForumRounded';
import KeyboardDoubleArrowRightRoundedIcon from '@mui/icons-material/KeyboardDoubleArrowRightRounded';
import RocketLaunchRoundedIcon from '@mui/icons-material/RocketLaunchRounded';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import FeatureCard from '../components/FeatureCard';

const features = [
  {
    title: 'Find Mentors',
    description: 'Discover experienced mentors aligned with your learning goals and growth path.',
    icon: <PersonSearchRoundedIcon fontSize="medium" />,
  },
  {
    title: 'Book Sessions',
    description: 'Schedule one-on-one sessions with seamless booking and availability visibility.',
    icon: <EventAvailableRoundedIcon fontSize="medium" />,
  },
  {
    title: 'Track Progress',
    description: 'Monitor milestones, completed sessions, and your mentorship outcomes clearly.',
    icon: <TimelineRoundedIcon fontSize="medium" />,
  },
  {
    title: 'Real-time Interaction',
    description: 'Connect through chat and collaborative interactions for continuous learning.',
    icon: <ForumRoundedIcon fontSize="medium" />,
  },
];

const steps = ['Register', 'Find Mentor', 'Book Session', 'Track Progress'];

const sectionShell = {
  borderRadius: 5,
  border: '1px solid rgba(255,255,255,0.3)',
  backdropFilter: 'blur(10px)',
  backgroundColor: 'rgba(255,255,255,0.75)',
  boxShadow: '0 18px 45px rgba(12, 29, 74, 0.13)',
};

const Landing = () => {
  const navigate = useNavigate();

  const selectRoleAndGoToRegister = (role) => {
    localStorage.setItem('selectedRole', role);
    navigate('/register');
  };

  return (
    <Box sx={{ background: 'linear-gradient(180deg, #d8e8ff 0%, #f4f7ff 55%, #edf4ff 100%)' }}>
      <Navbar />

      <HeroSection
        onJoinAsMentee={() => selectRoleAndGoToRegister('MENTEE')}
        onJoinAsMentor={() => selectRoleAndGoToRegister('MENTOR')}
      />

      <Container maxWidth="lg" sx={{ py: { xs: 7, md: 10 } }}>
        <Paper id="about" sx={{ p: { xs: 3, md: 5 }, ...sectionShell }}>
          <Typography variant="h4" sx={{ fontWeight: 900, color: '#10234f', mb: 1.5 }}>
            What is MentorConnect?
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(16,35,79,0.84)', fontSize: '1.05rem', lineHeight: 1.8 }}>
            MentorConnect connects ambitious learners with experienced mentors through structured, goal-driven sessions. From discovering the right mentor to tracking progress, the platform enables meaningful guidance that accelerates personal and professional growth.
          </Typography>
        </Paper>
      </Container>

      <Container id="features" maxWidth="lg" sx={{ pb: { xs: 8, md: 10 } }}>
        <Stack spacing={1.2} sx={{ mb: 3.5 }}>
          <Typography variant="h4" sx={{ fontWeight: 900, color: '#10234f' }}>
            Features Designed For Growth
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(16,35,79,0.82)' }}>
            A clean and guided learning experience from discovery to outcomes.
          </Typography>
        </Stack>

        <Grid container spacing={2.5}>
          {features.map((feature) => (
            <Grid key={feature.title} size={{ xs: 12, sm: 6, md: 3 }}>
              <FeatureCard {...feature} />
            </Grid>
          ))}
        </Grid>
      </Container>

      <Container id="how-it-works" maxWidth="lg" sx={{ pb: { xs: 8, md: 10 } }}>
        <Paper sx={{ p: { xs: 3, md: 5 }, ...sectionShell }}>
          <Typography variant="h4" sx={{ fontWeight: 900, color: '#10234f', mb: 3 }}>
            How It Works
          </Typography>
          <Grid container spacing={2}>
            {steps.map((step, index) => (
              <Grid key={step} size={{ xs: 12, sm: 6, md: 3 }}>
                <Stack
                  spacing={1.5}
                  sx={{
                    p: 2.2,
                    borderRadius: 3,
                    backgroundColor: 'rgba(255,255,255,0.78)',
                    border: '1px solid rgba(49,98,195,0.18)',
                    minHeight: 145,
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 900, color: '#2454bf' }}>
                    {index + 1}
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 700, color: '#10234f' }}>
                    {step}
                  </Typography>
                  <KeyboardDoubleArrowRightRoundedIcon sx={{ color: '#4e7dff' }} />
                </Stack>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Container>

      <Container id="contact" maxWidth="lg" sx={{ pb: { xs: 8, md: 10 } }}>
        <Paper
          sx={{
            p: { xs: 3, md: 6 },
            borderRadius: 5,
            color: '#eef4ff',
            background: 'linear-gradient(145deg, #11265c, #22499f)',
            boxShadow: '0 18px 45px rgba(12, 29, 74, 0.2)',
          }}
        >
          <Stack spacing={2} alignItems="flex-start">
            <Typography variant="h4" sx={{ fontWeight: 900 }}>
              Start your journey today
            </Typography>
            <Typography variant="body1" sx={{ maxWidth: 650, opacity: 0.9 }}>
              Your next breakthrough can begin with one great mentorship session. Pick your role and
              begin on MentorConnect.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
              <Button
                variant="contained"
                startIcon={<RocketLaunchRoundedIcon />}
                onClick={() => selectRoleAndGoToRegister('MENTEE')}
                sx={{
                  textTransform: 'none',
                  fontWeight: 700,
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, #4e7dff, #31b2ff)',
                }}
              >
                Join as Mentee
              </Button>
              <Button
                variant="outlined"
                onClick={() => selectRoleAndGoToRegister('MENTOR')}
                sx={{
                  textTransform: 'none',
                  fontWeight: 700,
                  borderRadius: 3,
                  color: '#e8efff',
                  borderColor: '#e8efff',
                }}
              >
                Join as Mentor
              </Button>
            </Stack>
          </Stack>
        </Paper>
      </Container>

      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          borderTop: '1px solid rgba(16,35,79,0.12)',
          backgroundColor: 'rgba(255,255,255,0.8)',
        }}
      >
        <Container
          maxWidth="lg"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 1.5,
            flexWrap: 'wrap',
          }}
        >
          <Typography variant="body2" sx={{ color: 'rgba(16,35,79,0.78)' }}>
            MentorConnect
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(16,35,79,0.74)' }}>
            Copyright {new Date().getFullYear()} MentorConnect. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Landing;
