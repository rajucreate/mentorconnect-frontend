import React, { useCallback, useContext, useState } from 'react';
import {
  Box,
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
  Skeleton,
} from '@mui/material';
import PendingActionsOutlinedIcon from '@mui/icons-material/PendingActionsOutlined';
import DoneAllOutlinedIcon from '@mui/icons-material/DoneAllOutlined';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import InsightsOutlinedIcon from '@mui/icons-material/InsightsOutlined';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import DashboardHeader from '../../components/DashboardHeader';
import LogoutConfirmDialog from '../../components/LogoutConfirmDialog';
import ProgressList from '../../components/progress/ProgressList';
import { getMyMatches } from '../../api/matchApi';
import { getMentorSessions, updateSessionStatus as updateSessionStatusApi } from '../../api/sessionApi';
import useFetch from '../../hooks/useFetch';
import './mentorDashboard.css';

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

const MentorDashboard = () => {
  const [processingSessionId, setProcessingSessionId] = useState(null);
  const [acceptingSession, setAcceptingSession] = useState(null);
  const [meetingLinkInput, setMeetingLinkInput] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: 'success',
    message: '',
  });
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogoutRequest = () => {
    setLogoutDialogOpen(true);
  };

  const handleLogoutConfirm = () => {
    navigate('/', { replace: true });
    logout();
    setLogoutDialogOpen(false);
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

  const getMenteeNameFromMatch = (match) => {
    return match?.mentee?.name || match?.menteeName || match?.mentee?.email || 'Unknown Mentee';
  };

  const normalizedSessions = sessions.map((session) => ({
    ...session,
    normalizedStatus: session?.status?.toUpperCase?.() || 'PENDING',
  }));

  const pendingSessions = normalizedSessions.filter((session) => session.normalizedStatus === 'PENDING');
  const nonPendingSessions = normalizedSessions.filter((session) => session.normalizedStatus !== 'PENDING');

  const stats = [
    { label: 'My Matches', value: matches.length, icon: <GroupOutlinedIcon /> },
    { label: 'Pending Requests', value: pendingSessions.length, icon: <PendingActionsOutlinedIcon /> },
    { label: 'Resolved Sessions', value: nonPendingSessions.length, icon: <DoneAllOutlinedIcon /> },
  ];

  const renderSessionCard = (session, index, isPendingList = false) => {
    const sessionId = getSessionId(session);
    const sessionKey = sessionId || `session-${index}`;
    const sessionStatus = session.normalizedStatus;
    const isPending = sessionStatus === 'PENDING';
    const isProcessing = processingSessionId === sessionId;

    return (
      <Grid size={{ xs: 12, sm: 6, md: 4 }} key={sessionKey} sx={{ animationDelay: `${index * 0.07}s` }}>
        <Card className={`mentor-glass-card mentor-card-enter ${isPending ? 'mentor-pending-card' : ''}`}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ color: '#f2fbff', fontWeight: 700 }}>
              Mentee: {getMenteeName(session)}
            </Typography>
            <Typography variant="body2" sx={{ mb: 1.2, color: 'rgba(233,245,255,0.9)' }}>
              Time: {getSessionDateTime(session)}
            </Typography>
            <Chip label={sessionStatus} size="small" sx={{ fontWeight: 700, ...getStatusChipSx(sessionStatus) }} />
          </CardContent>

          <CardActions sx={{ px: 2, pb: 2, pt: 0 }}>
            <Grid container spacing={1} size={12}>
              <Grid size={6}>
                <Button
                  variant="contained"
                  className="mentor-accept-button"
                  fullWidth
                  onClick={() => openAcceptDialog(session)}
                  disabled={!isPending || isProcessing}
                >
                  {isProcessing ? 'Updating...' : 'Accept'}
                </Button>
              </Grid>
              <Grid size={6}>
                <Button
                  variant="contained"
                  className="mentor-reject-button"
                  fullWidth
                  onClick={() => updateSessionStatus(sessionId, 'REJECTED')}
                  disabled={!isPending || isProcessing}
                >
                  {isProcessing ? 'Updating...' : 'Reject'}
                </Button>
              </Grid>
            </Grid>
          </CardActions>
          {isPendingList && <Box className="mentor-pending-accent" />}
        </Card>
      </Grid>
    );
  };

  return (
    <Box className="mentor-dashboard-root">
      <Grid container spacing={3} sx={{ p: { xs: 2, md: 3 } }}>
        <Grid size={12}>
          <Card className="mentor-glass-card">
            <CardContent>
              <DashboardHeader
                title="Mentor Dashboard"
                subtitle={`Manage incoming mentorship sessions, ${user?.email || 'mentor'}.`}
                onLogout={handleLogoutRequest}
                isLight
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid size={12}>
          <Grid container spacing={2}>
            {stats.map((item) => (
              <Grid size={{ xs: 12, sm: 4 }} key={item.label}>
                <Card className="mentor-glass-card mentor-stat-card mentor-card-enter">
                  <CardContent>
                    <Typography sx={{ color: 'rgba(223,241,255,0.88)' }} variant="body2" gutterBottom>
                      {item.label}
                    </Typography>
                    <Grid container alignItems="center" justifyContent="space-between">
                      <Typography variant="h4" sx={{ color: '#f4fbff', fontWeight: 800 }}>
                        {item.value}
                      </Typography>
                      <Box sx={{ color: '#8cd8ff' }}>{item.icon}</Box>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>

        <Grid size={12}>
          <Typography variant="h5" className="mentor-section-title" gutterBottom>
            Session Requests
          </Typography>
          <Typography variant="body2" className="mentor-section-subtitle">
            Pending requests are prioritized for quick decision-making.
          </Typography>
        </Grid>

        {sessionsLoading && (
          <Grid size={12}>
            <Grid container spacing={2}>
              {[1, 2, 3].map((item) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={item}>
                  <Skeleton variant="rounded" height={220} sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />
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

        {!sessionsLoading && !sessionsError && pendingSessions.length === 0 && (
          <Grid size={12}>
            <Card className="mentor-glass-card mentor-empty-card">
              <CardContent sx={{ textAlign: 'center' }}>
                <InsightsOutlinedIcon sx={{ fontSize: 30, color: '#e8f6ff', mb: 1 }} />
                <Typography sx={{ color: '#e8f6ff', fontWeight: 600 }}>
                  You're all caught up! No pending sessions.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        )}

        {!sessionsLoading && !sessionsError && pendingSessions.length > 0 && (
          <Grid container spacing={2} size={12}>
            {pendingSessions.map((session, index) => renderSessionCard(session, index, true))}
          </Grid>
        )}

        {!sessionsLoading && !sessionsError && nonPendingSessions.length > 0 && (
          <>
            <Grid size={12}>
              <Typography variant="h6" className="mentor-section-subtitle" sx={{ mt: 1 }}>
                Other Session Updates
              </Typography>
            </Grid>
            <Grid container spacing={2} size={12}>
              {nonPendingSessions.map((session, index) => renderSessionCard(session, index))}
            </Grid>
          </>
        )}

        <Grid size={12} sx={{ mt: 1 }}>
          <Typography variant="h5" className="mentor-section-title" gutterBottom>
            My Matches
          </Typography>
          <Typography variant="body2" className="mentor-section-subtitle">
            Review current mentees and add progress notes quickly.
          </Typography>
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
          <Card className="mentor-glass-card mentor-empty-card">
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography sx={{ color: '#e8f6ff' }}>No matches yet.</Typography>
            </CardContent>
          </Card>
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
                <Card className="mentor-glass-card mentor-card-enter">
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ color: '#f2fbff', fontWeight: 700 }}>
                      Mentee: {getMenteeNameFromMatch(match)}
                    </Typography>
                    <Chip label={status} size="small" sx={{ fontWeight: 700, ...getStatusChipSx(status) }} />
                    <ProgressList matchId={matchId} canManage />
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      <Dialog
        open={Boolean(acceptingSession)}
        onClose={closeAcceptDialog}
        fullWidth
        maxWidth="sm"
        PaperProps={{ className: 'mentor-modal-paper' }}
      >
        <Grid container spacing={2} sx={{ p: 2 }}>
          <Grid size={12}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>Accept Session</Typography>
          </Grid>

          <Grid size={12}>
            <TextField
              fullWidth
              required
              label="Meeting Link"
              value={meetingLinkInput}
              onChange={(event) => setMeetingLinkInput(event.target.value)}
              placeholder="https://meet.google.com/..."
              sx={{
                '& .MuiInputBase-root': {
                  backgroundColor: 'rgba(255,255,255,0.08)',
                  color: '#eff8ff',
                },
                '& .MuiInputLabel-root': { color: 'rgba(226,242,255,0.85)' },
                '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(226,242,255,0.35)' },
              }}
            />
          </Grid>

          <Grid size={6}>
            <Button variant="outlined" className="mentor-subtle-button" fullWidth onClick={closeAcceptDialog} disabled={Boolean(processingSessionId)}>
              Cancel
            </Button>
          </Grid>
          <Grid size={6}>
            <Button variant="contained" className="mentor-accept-button" fullWidth onClick={handleAcceptWithMeetingLink} disabled={Boolean(processingSessionId)}>
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
      <LogoutConfirmDialog
        open={logoutDialogOpen}
        onCancel={() => setLogoutDialogOpen(false)}
        onConfirm={handleLogoutConfirm}
      />
      </Grid>
    </Box>
  );
};

export default MentorDashboard;
