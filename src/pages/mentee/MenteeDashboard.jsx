import React, { useCallback, useContext, useState } from 'react';
import {
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
} from '@mui/material';
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

  const getStatusColor = (status) => {
    if (status === 'PENDING') {
      return 'warning';
    }
    if (status === 'APPROVED' || status === 'ACCEPTED') {
      return 'success';
    }
    if (status === 'REJECTED') {
      return 'error';
    }
    if (status === 'CANCELLED') {
      return 'default';
    }
    return 'default';
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

  return (
    <Grid container spacing={2} sx={{ p: 2 }}>
      <Grid size={12}>
        <DashboardHeader
          title="Mentee Dashboard"
          subtitle={`Discover mentors and book sessions, ${user?.email || 'mentee'}.`}
          onLogout={handleLogout}
        />
      </Grid>

      <Grid size={12}>
        <Typography variant="h5" gutterBottom>
          Mentor Discovery
        </Typography>
      </Grid>

      {mentorsLoading && (
        <Grid size={12} sx={{ textAlign: 'center', py: 6 }}>
          <CircularProgress />
        </Grid>
      )}

      {!mentorsLoading && mentorsError && (
        <Grid size={12}>
          <Alert severity="error">{mentorsError}</Alert>
        </Grid>
      )}

      {!mentorsLoading && !mentorsError && mentors.length === 0 && (
        <Grid size={12}>
          <Typography variant="body1">No mentors available right now.</Typography>
        </Grid>
      )}

      {!mentorsLoading && !mentorsError && mentors.length > 0 && (
        <Grid container spacing={2} size={12}>
          {mentors.map((mentor, index) => {
            const mentorKey = mentor.id || mentor._id || mentor.mentorId || index;

            return (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={mentorKey}>
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

      <Grid size={12} sx={{ mt: 2 }}>
        <Typography variant="h5" gutterBottom>
          My Matches
        </Typography>
      </Grid>

      {matchesLoading && (
        <Grid size={12} sx={{ textAlign: 'center', py: 6 }}>
          <CircularProgress />
        </Grid>
      )}

      {!matchesLoading && matchesError && (
        <Grid size={12}>
          <Alert severity="error">{matchesError}</Alert>
        </Grid>
      )}

      {!matchesLoading && !matchesError && matches.length === 0 && (
        <Grid size={12}>
          <Typography variant="body1">No data available</Typography>
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
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Mentor: {getMentorNameFromMatch(match)}
                    </Typography>
                    <Chip label={status} color={getStatusColor(status)} size="small" />
                    <ProgressList matchId={matchId} canManage={false} />
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      <Grid size={12} sx={{ mt: 2 }}>
        <Typography variant="h5" gutterBottom>
          My Sessions
        </Typography>
      </Grid>

      {sessionsLoading && (
        <Grid size={12} sx={{ textAlign: 'center', py: 6 }}>
          <CircularProgress />
        </Grid>
      )}

      {!sessionsLoading && sessionsError && (
        <Grid size={12}>
          <Alert severity="error">{sessionsError}</Alert>
        </Grid>
      )}

      {!sessionsLoading && !sessionsError && sessions.length === 0 && (
        <Grid size={12}>
          <Typography variant="body1">No data available</Typography>
        </Grid>
      )}

      {!sessionsLoading && !sessionsError && sessions.length > 0 && (
        <Grid container spacing={2} size={12}>
          {sessions.map((session, index) => {
            const sessionKey = session.id || session._id || session.sessionId || index;
            return (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={sessionKey}>
                <SessionCard session={session} />
              </Grid>
            );
          })}
        </Grid>
      )}

      <Dialog open={Boolean(bookingMentor)} onClose={closeBookingDialog} fullWidth>
        <Grid container spacing={2} sx={{ p: 2 }}>
          <Grid size={12}>
            <Typography variant="h6">
              Request Session with {bookingMentor?.name || 'Mentor'}
            </Typography>
          </Grid>

          <Grid size={12}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                label="Start Time"
                value={startDateTime}
                onChange={(value) => setStartDateTime(value)}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </LocalizationProvider>
          </Grid>

          <Grid size={12}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                label="End Time"
                value={endDateTime}
                onChange={(value) => setEndDateTime(value)}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </LocalizationProvider>
          </Grid>

          <Grid size={6}>
            <Button variant="outlined" fullWidth onClick={closeBookingDialog} disabled={bookingLoading}>
              Cancel
            </Button>
          </Grid>
          <Grid size={6}>
            <Button variant="contained" fullWidth onClick={handleBookSession} disabled={bookingLoading}>
              {bookingLoading ? 'Requesting...' : 'Request Session'}
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
    </Grid>
  );
};

export default MenteeDashboard;
