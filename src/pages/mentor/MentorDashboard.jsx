import React, { useCallback, useContext, useState } from 'react';
import {
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  Dialog,
  TextField,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import DashboardHeader from '../../components/DashboardHeader';
import ProgressList from '../../components/progress/ProgressList';
import { getMyMatches } from '../../api/matchApi';
import { getMentorSessions, updateSessionStatus as updateSessionStatusApi } from '../../api/sessionApi';
import useFetch from '../../hooks/useFetch';

const MentorDashboard = () => {
  const [processingSessionId, setProcessingSessionId] = useState(null);
  const [acceptingSession, setAcceptingSession] = useState(null);
  const [meetingLinkInput, setMeetingLinkInput] = useState('');
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

  const getSessionId = (session) => {
    return session?.id || session?._id || session?.sessionId || session?.session?.id || session?.session?._id;
  };

  const fetchMentorSessions = useCallback(() => {
    return getMentorSessions();
  }, []);

  const fetchMyMatches = useCallback(() => {
    return getMyMatches();
  }, []);

  const {
    data: sessions,
    setData: setSessions,
    loading: sessionsLoading,
    error: sessionsError,
    refetch: refetchSessions,
  } = useFetch(fetchMentorSessions, []);

  const {
    data: matches,
    loading: matchesLoading,
    error: matchesError,
    refetch: refetchMatches,
  } = useFetch(fetchMyMatches, []);

  React.useEffect(() => {
    const intervalId = setInterval(() => {
      refetchMatches({ showLoader: false });
      refetchSessions({ showLoader: false });
    }, 10000);

    return () => {
      clearInterval(intervalId);
    };
  }, [refetchMatches, refetchSessions]);

  const updateSessionStatus = async (sessionId, status, payload = null) => {
    const previousSessions = [...sessions];
    setProcessingSessionId(sessionId);
    setSessions((prev) =>
      prev.map((session) =>
        String(getSessionId(session)) === String(sessionId)
          ? { ...session, status, ...(payload || {}) }
          : session
      )
    );

    try {
      await updateSessionStatusApi(sessionId, status, payload);
      setSnackbar({
        open: true,
        severity: 'success',
        message: `Session ${status.toLowerCase()} successfully.`,
      });
    } catch (err) {
      setSessions(previousSessions);
      setSnackbar({
        open: true,
        severity: 'error',
        message: err.response?.data?.message || `Failed to update session status to ${status}.`,
      });
    } finally {
      setProcessingSessionId(null);
    }
  };

  const openAcceptDialog = (session) => {
    setAcceptingSession(session);
    setMeetingLinkInput(session?.meetingLink || '');
  };

  const closeAcceptDialog = () => {
    if (!processingSessionId) {
      setAcceptingSession(null);
      setMeetingLinkInput('');
    }
  };

  const handleAcceptWithMeetingLink = async () => {
    const sessionId = getSessionId(acceptingSession);
    const trimmedMeetingLink = meetingLinkInput.trim();

    if (!sessionId || !trimmedMeetingLink) {
      setSnackbar({
        open: true,
        severity: 'error',
        message: 'Meeting link is required to accept a session.',
      });
      return;
    }

    await updateSessionStatus(sessionId, 'ACCEPTED', { meetingLink: trimmedMeetingLink });
    setAcceptingSession(null);
    setMeetingLinkInput('');
  };

  const getMenteeName = (session) => {
    return (
      session.mentee?.name ||
      session.menteeName ||
      session.mentee?.email ||
      'Unknown Mentee'
    );
  };

  const getSessionDateTime = (session) => {
    const value =
      session.dateTime ||
      session.scheduledAt ||
      session.date ||
      session.sessionDate ||
      null;

    if (!value) {
      return 'Not specified';
    }

    const parsedDate = new Date(value);
    if (Number.isNaN(parsedDate.getTime())) {
      return value;
    }

    return parsedDate.toLocaleString();
  };

  const getStatusColor = (status) => {
    if (status === 'PENDING') {
      return 'warning';
    }
    if (status === 'APPROVED') {
      return 'success';
    }
    if (status === 'ACCEPTED') {
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

  const getMenteeNameFromMatch = (match) => {
    return match?.mentee?.name || match?.menteeName || match?.mentee?.email || 'Unknown Mentee';
  };

  return (
    <Grid container spacing={2} sx={{ p: 2 }}>
      <Grid size={12}>
        <DashboardHeader
          title="Mentor Dashboard"
          subtitle={`Manage incoming mentorship sessions, ${user?.email || 'mentor'}.`}
          onLogout={handleLogout}
        />
      </Grid>

      <Grid size={12}>
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
                      Mentee: {getMenteeNameFromMatch(match)}
                    </Typography>
                    <Chip label={status} color={getStatusColor(status)} size="small" />
                    <ProgressList matchId={matchId} canManage />
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      <Grid size={12} sx={{ mt: 2 }}>
        <Typography variant="h5" gutterBottom>
          Session Requests
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
            const sessionId = getSessionId(session);
            const sessionKey = sessionId || `session-${index}`;
            const sessionStatus = session?.status?.toUpperCase?.() || 'PENDING';
            const isPending = sessionStatus === 'PENDING';
            const isProcessing = processingSessionId === sessionId;

            return (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={sessionKey}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Mentee: {getMenteeName(session)}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      Time: {getSessionDateTime(session)}
                    </Typography>
                    <Chip label={sessionStatus} color={getStatusColor(sessionStatus)} size="small" />
                  </CardContent>
                  <CardActions>
                    <Button
                      variant="contained"
                      onClick={() => openAcceptDialog(session)}
                      disabled={!isPending || isProcessing}
                    >
                      {isProcessing ? 'Updating...' : 'Accept'}
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => updateSessionStatus(sessionId, 'REJECTED')}
                      disabled={!isPending || isProcessing}
                    >
                      Reject
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      <Dialog open={Boolean(acceptingSession)} onClose={closeAcceptDialog} fullWidth>
        <Grid container spacing={2} sx={{ p: 2 }}>
          <Grid size={12}>
            <Typography variant="h6">Accept Session</Typography>
          </Grid>

          <Grid size={12}>
            <TextField
              fullWidth
              required
              label="Meeting Link"
              value={meetingLinkInput}
              onChange={(event) => setMeetingLinkInput(event.target.value)}
              placeholder="https://meet.google.com/..."
            />
          </Grid>

          <Grid size={6}>
            <Button variant="outlined" fullWidth onClick={closeAcceptDialog} disabled={Boolean(processingSessionId)}>
              Cancel
            </Button>
          </Grid>
          <Grid size={6}>
            <Button variant="contained" fullWidth onClick={handleAcceptWithMeetingLink} disabled={Boolean(processingSessionId)}>
              {processingSessionId ? 'Saving...' : 'Confirm Accept'}
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

export default MentorDashboard;
