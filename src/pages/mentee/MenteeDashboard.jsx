import React, { useCallback, useContext, useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  Dialog,
  Snackbar,
  Alert,
  Button,
  CircularProgress,
  Skeleton,
} from '@mui/material';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined';
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined';
import SearchOffRoundedIcon from '@mui/icons-material/SearchOffRounded';
import HandshakeOutlinedIcon from '@mui/icons-material/HandshakeOutlined';
import EventBusyOutlinedIcon from '@mui/icons-material/EventBusyOutlined';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AuthContext } from '../../context/AuthContext';
import DashboardHeader from '../../components/DashboardHeader';
import MentorCard from '../../components/MentorCard';
import SessionCard from '../../components/SessionCard';
import ProgressList from '../../components/progress/ProgressList';
import {
  createMatch,
  getMatchedMentors,
  getMyMatches,
} from '../../api/matchApi';
import { bookSession, getMySessions } from '../../api/sessionApi';
import useFetch from '../../hooks/useFetch';
import './menteeDashboard.css';

const getStatusChipSx = (status) => {
  if (status === 'ACTIVE') {
    return {
      bgcolor: 'rgba(34,197,94,0.2)',
      color: '#dbffe9',
      border: '1px solid rgba(34,197,94,0.55)',
    };
  }
  if (status === 'PENDING') {
    return {
      bgcolor: 'rgba(251,146,60,0.2)',
      color: '#fff2df',
      border: '1px solid rgba(251,146,60,0.55)',
    };
  }
  if (status === 'APPROVED' || status === 'ACCEPTED') {
    return {
      bgcolor: 'rgba(59,130,246,0.2)',
      color: '#deedff',
      border: '1px solid rgba(59,130,246,0.55)',
    };
  }
  if (status === 'REJECTED') {
    return {
      bgcolor: 'rgba(239,68,68,0.2)',
      color: '#ffe3e3',
      border: '1px solid rgba(239,68,68,0.55)',
    };
  }
  return {
    bgcolor: 'rgba(148,163,184,0.2)',
    color: '#e2e8f0',
    border: '1px solid rgba(148,163,184,0.45)',
  };
};

const EmptyState = ({ icon, message }) => {
  return (
    <Grid className="empty-state glass-card">
      <Box className="icon">{icon}</Box>
      <Typography variant="body1">{message}</Typography>
    </Grid>
  );
};

const SectionHeader = ({ title, subtitle }) => {
  return (
    <Grid>
      <Typography variant="h5" className="section-title" gutterBottom>
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="body2" className="section-subtitle">
          {subtitle}
        </Typography>
      )}
    </Grid>
  );
};

const MenteeDashboard = () => {
  const [requestingMentorId, setRequestingMentorId] = useState(null);
  const [bookingMentor, setBookingMentor] = useState(null);
  const [startDateTime, setStartDateTime] = useState(dayjs().add(1, 'hour'));
  const [endDateTime, setEndDateTime] = useState(dayjs().add(2, 'hour'));
  const [bookingLoading, setBookingLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: 'success',
    message: '',
  });

  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const fetchMentors = useCallback(() => {
    return getMatchedMentors();
  }, []);

  const fetchMatches = useCallback(() => {
    return getMyMatches();
  }, []);

  const fetchSessions = useCallback(() => {
    return getMySessions();
  }, []);

  const {
    data: mentors,
    loading: mentorsLoading,
    error: mentorsError,
    refetch: refetchMentors,
  } = useFetch(fetchMentors, []);

  const {
    data: matches,
    loading: matchesLoading,
    error: matchesError,
    refetch: refetchMatches,
  } = useFetch(fetchMatches, []);

  const {
    data: sessions,
    loading: sessionsLoading,
    error: sessionsError,
    refetch: refetchSessions,
  } = useFetch(fetchSessions, []);

  React.useEffect(() => {
    const intervalId = setInterval(() => {
      refetchMentors({ showLoader: false });
      refetchMatches({ showLoader: false });
      refetchSessions({ showLoader: false });
    }, 10000);

    return () => {
      clearInterval(intervalId);
    };
  }, [refetchMatches, refetchMentors, refetchSessions]);

  const handleRequestMentor = async (mentorId) => {
    setRequestingMentorId(mentorId);

    try {
      await createMatch(mentorId);
      setSnackbar({
        open: true,
        severity: 'success',
        message: 'Mentor request sent successfully.',
      });
      refetchMatches();
      refetchSessions();
    } catch (err) {
      setSnackbar({
        open: true,
        severity: 'error',
        message: err.response?.data?.message || 'Failed to create mentor request.',
      });
    } finally {
      setRequestingMentorId(null);
    }
  };

  const openBookingDialog = (mentor) => {
    setBookingMentor(mentor);
    setStartDateTime(dayjs().add(1, 'hour'));
    setEndDateTime(dayjs().add(2, 'hour'));
  };

  const closeBookingDialog = () => {
    if (!bookingLoading) {
      setBookingMentor(null);
    }
  };

  const handleBookSession = async () => {
    const mentorId = bookingMentor?.id ?? bookingMentor?._id ?? bookingMentor?.mentorId;
    if (!mentorId) {
      return;
    }

    const relatedMatch = matches.find((match) => {
      const matchMentorId = match?.mentor?.id ?? match?.mentor?._id ?? match?.mentorId;
      return String(matchMentorId) === String(mentorId);
    });

    const matchId = relatedMatch?.id ?? relatedMatch?._id ?? relatedMatch?.matchId;
    if (!matchId) {
      setSnackbar({
        open: true,
        severity: 'error',
        message: 'No valid match found for this mentor. Send a match request first.',
      });
      return;
    }

    setBookingLoading(true);

    try {
      await bookSession({
        matchId: Number(matchId),
        startTime: startDateTime?.toISOString?.() || null,
        endTime: endDateTime?.toISOString?.() || null,
      });

      setSnackbar({
        open: true,
        severity: 'success',
        message: 'Session booked successfully.',
      });

      setBookingMentor(null);
      refetchSessions();
    } catch (err) {
      setSnackbar({
        open: true,
        severity: 'error',
        message: err.response?.data?.message || 'Failed to book session.',
      });
    } finally {
      setBookingLoading(false);
    }
  };

  const getMentorNameFromMatch = (match) => {
    return match?.mentor?.name || match?.mentorName || match?.mentor?.email || 'Unknown Mentor';
  };

  const matchedMentorIdSet = new Set(
    matches
      .filter((match) => {
        const status = match.status || 'PENDING';
        return status !== 'REJECTED' && status !== 'CANCELLED';
      })
      .map((match) => String(match?.mentor?.id ?? match?.mentor?._id ?? match?.mentorId))
      .filter(Boolean)
  );

  const stats = [
    {
      label: 'Total Matches',
      value: matches.length,
      icon: <GroupOutlinedIcon />,
    },
    {
      label: 'Sessions Booked',
      value: sessions.length,
      icon: <EventAvailableOutlinedIcon />,
    },
    {
      label: 'Progress Items',
      value: matches.length,
      icon: <TrendingUpOutlinedIcon />,
    },
  ];

  return (
    <Box className="mentee-dashboard-root">
      <Box className="mentee-dashboard-glow one" />
      <Box className="mentee-dashboard-glow two" />

      <Grid container spacing={3} className="mentee-dashboard-content" sx={{ px: { xs: 2, md: 3 }, py: 3 }}>
        <Grid size={12}>
          <Card className="glass-card">
            <CardContent>
              <DashboardHeader
                title="Mentee Dashboard"
                subtitle={`Discover mentors and book sessions, ${user?.email || 'mentee'}.`}
                onLogout={handleLogout}
                isLight
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid size={12}>
          <Grid container spacing={2}>
            {stats.map((item) => (
              <Grid size={{ xs: 12, sm: 4 }} key={item.label}>
                <Card className="glass-card metric-card card-enter">
                  <CardContent>
                    <Typography sx={{ color: 'rgba(223,241,255,0.88)' }} variant="body2" gutterBottom>
                      {item.label}
                    </Typography>
                    <Grid container alignItems="center" justifyContent="space-between">
                      <Typography variant="h4" sx={{ color: '#f4fbff', fontWeight: 800 }}>
                        {item.value}
                      </Typography>
                      <Box sx={{ color: '#91d8ff' }}>{item.icon}</Box>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>

        <Grid size={12}>
          <SectionHeader
            title="Available Mentors"
            subtitle="Explore mentor profiles and send requests instantly."
          />
        </Grid>

        {mentorsLoading && (
          <Grid size={12}>
            <Grid container spacing={2}>
              {[1, 2, 3].map((item) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={item}>
                  <Skeleton variant="rounded" height={240} sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />
                </Grid>
              ))}
            </Grid>
          </Grid>
        )}

        {!mentorsLoading && mentorsError && (
          <Grid size={12}>
            <Alert severity="error">{mentorsError}</Alert>
          </Grid>
        )}

        {!mentorsLoading && !mentorsError && mentors.length === 0 && (
          <Grid size={12}>
            <EmptyState
              icon={<SearchOffRoundedIcon />}
              message="No mentors available right now. Check back shortly for new mentors."
            />
          </Grid>
        )}

        {!mentorsLoading && !mentorsError && mentors.length > 0 && (
          <Grid container spacing={2} size={12}>
            {mentors.map((mentor, index) => {
              const mentorKey = mentor.id || mentor._id || mentor.mentorId || index;

              return (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={mentorKey} sx={{ animationDelay: `${index * 0.07}s` }}>
                  <MentorCard
                    mentor={mentor}
                    onRequestMentor={handleRequestMentor}
                    onBookSession={openBookingDialog}
                    requestingMentorId={requestingMentorId}
                    isAlreadyMatched={matchedMentorIdSet.has(String(mentor?.id ?? mentor?._id ?? mentor?.mentorId))}
                  />
                </Grid>
              );
            })}
          </Grid>
        )}

        <Grid size={12} sx={{ mt: 1 }}>
          <SectionHeader
            title="My Matches"
            subtitle="Track your match status and monitor progress updates."
          />
        </Grid>

        {matchesLoading && (
          <Grid size={12}>
            <Grid container spacing={2}>
              {[1, 2].map((item) => (
                <Grid size={{ xs: 12, sm: 6 }} key={item}>
                  <Skeleton variant="rounded" height={280} sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />
                </Grid>
              ))}
            </Grid>
          </Grid>
        )}

        {!matchesLoading && matchesError && (
          <Grid size={12}>
            <Alert severity="error">{matchesError}</Alert>
          </Grid>
        )}

        {!matchesLoading && !matchesError && matches.length === 0 && (
          <Grid size={12}>
            <EmptyState
              icon={<HandshakeOutlinedIcon />}
              message="No matches yet. Send your first mentor request to get started."
            />
          </Grid>
        )}

        {!matchesLoading && !matchesError && matches.length > 0 && (
          <Grid container spacing={2} size={12}>
            {matches.map((match, index) => {
              const matchId = match.id || match._id || match.matchId;
              const matchKey = matchId || index;
              const status = match.status || 'PENDING';
              return (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={matchKey}>
                  <Card className="glass-card card-enter" sx={{ animationDelay: `${index * 0.06}s` }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom sx={{ color: '#f2fbff', fontWeight: 700 }}>
                        Mentor: {getMentorNameFromMatch(match)}
                      </Typography>
                      <Chip label={status} size="small" sx={{ fontWeight: 700, ...getStatusChipSx(status) }} />
                      <ProgressList matchId={matchId} canManage={false} />
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}

        <Grid size={12} sx={{ mt: 1 }}>
          <SectionHeader
            title="My Sessions"
            subtitle="Review your upcoming and requested session schedule."
          />
        </Grid>

        {sessionsLoading && (
          <Grid size={12}>
            <Grid container spacing={2}>
              {[1, 2, 3].map((item) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={item}>
                  <Skeleton variant="rounded" height={170} sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />
                </Grid>
              ))}
            </Grid>
          </Grid>
        )}

        {!sessionsLoading && sessionsError && (
          <Grid size={12}>
            <Alert severity="error">{sessionsError}</Alert>
          </Grid>
        )}

        {!sessionsLoading && !sessionsError && sessions.length === 0 && (
          <Grid size={12}>
            <EmptyState
              icon={<EventBusyOutlinedIcon />}
              message="No sessions yet. Book your first session with a mentor."
            />
          </Grid>
        )}

        {!sessionsLoading && !sessionsError && sessions.length > 0 && (
          <Grid container spacing={2} size={12}>
            {sessions.map((session, index) => {
              const sessionKey = session.id || session._id || session.sessionId || index;
              return (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={sessionKey} sx={{ animationDelay: `${index * 0.07}s` }}>
                  <SessionCard session={session} />
                </Grid>
              );
            })}
          </Grid>
        )}
      </Grid>

      <Dialog
        open={Boolean(bookingMentor)}
        onClose={closeBookingDialog}
        fullWidth
        maxWidth="sm"
        PaperProps={{ className: 'modal-paper' }}
      >
        <Grid container spacing={2} sx={{ p: 2.5 }}>
          <Grid size={12}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Request Session with {bookingMentor?.name || 'Mentor'}
            </Typography>
          </Grid>

          <Grid size={12}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                label="Start Time"
                value={startDateTime}
                onChange={(value) => setStartDateTime(value)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    sx: {
                      '& .MuiInputBase-root': {
                        backgroundColor: 'rgba(255,255,255,0.08)',
                        color: '#eff8ff',
                      },
                      '& .MuiInputLabel-root': { color: 'rgba(226,242,255,0.85)' },
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(226,242,255,0.35)' },
                    },
                  },
                }}
              />
            </LocalizationProvider>
          </Grid>

          <Grid size={12}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                label="End Time"
                value={endDateTime}
                onChange={(value) => setEndDateTime(value)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    sx: {
                      '& .MuiInputBase-root': {
                        backgroundColor: 'rgba(255,255,255,0.08)',
                        color: '#eff8ff',
                      },
                      '& .MuiInputLabel-root': { color: 'rgba(226,242,255,0.85)' },
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(226,242,255,0.35)' },
                    },
                  },
                }}
              />
            </LocalizationProvider>
          </Grid>

          <Grid size={6}>
            <Button className="subtle-button" variant="outlined" fullWidth onClick={closeBookingDialog} disabled={bookingLoading}>
              Cancel
            </Button>
          </Grid>
          <Grid size={6}>
            <Button className="gradient-button" variant="contained" fullWidth onClick={handleBookSession} disabled={bookingLoading}>
              {bookingLoading ? (
                <>
                  <CircularProgress size={16} color="inherit" sx={{ mr: 1 }} />
                  Requesting...
                </>
              ) : 'Request Session'}
            </Button>
          </Grid>
        </Grid>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3500}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MenteeDashboard;
