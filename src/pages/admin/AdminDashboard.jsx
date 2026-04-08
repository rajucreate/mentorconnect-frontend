import React, { useContext, useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  Tab,
  Tabs,
  Typography,
  TableContainer,
  Paper,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { AuthContext } from '../../context/AuthContext';
import DashboardHeader from '../../components/DashboardHeader';
import { getAdminMatches, updateAdminMatchStatus } from '../../api/matchApi';
import { getAdminSessions, updateAdminSessionStatus } from '../../api/sessionApi';
import UserTable from '../../components/admin/UserTable';
import MatchTable from '../../components/admin/MatchTable';
import SessionTable from '../../components/admin/SessionTable';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [users, setUsers] = useState([]);
  const [matches, setMatches] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: 'success',
    message: '',
  });
  const [deleteUserDialogOpen, setDeleteUserDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [processingUserId, setProcessingUserId] = useState(null);
  const [processingMatchId, setProcessingMatchId] = useState(null);
  const [processingSessionId, setProcessingSessionId] = useState(null);

  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    let isMounted = true;

    const loadAdminData = async () => {
      setLoading(true);
      setError('');

      try {
        const [usersResponse, matchesResponse, sessionsResponse] = await Promise.all([
          api.get('/admin/users'),
          getAdminMatches(),
          getAdminSessions(),
        ]);

        if (!isMounted) {
          return;
        }

        setUsers(Array.isArray(usersResponse?.data) ? usersResponse.data : usersResponse?.data?.data || []);
        setMatches(Array.isArray(matchesResponse?.data) ? matchesResponse.data : matchesResponse?.data?.data || []);
        setSessions(Array.isArray(sessionsResponse?.data) ? sessionsResponse.data : sessionsResponse?.data?.data || []);
      } catch (err) {
        if (!isMounted) {
          return;
        }
        setError(err.response?.data?.message || 'Failed to load admin data.');
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadAdminData();

    return () => {
      isMounted = false;
    };
  }, []);

  const showSnackbar = (severity, message) => {
    setSnackbar({
      open: true,
      severity,
      message,
    });
  };

  const reloadAdminData = async () => {
    try {
      const [usersResponse, matchesResponse, sessionsResponse] = await Promise.all([
        api.get('/admin/users'),
        getAdminMatches(),
        getAdminSessions(),
      ]);

      setUsers(Array.isArray(usersResponse?.data) ? usersResponse.data : usersResponse?.data?.data || []);
      setMatches(Array.isArray(matchesResponse?.data) ? matchesResponse.data : matchesResponse?.data?.data || []);
      setSessions(Array.isArray(sessionsResponse?.data) ? sessionsResponse.data : sessionsResponse?.data?.data || []);
    } catch (err) {
      showSnackbar('error', err.response?.data?.message || 'Failed to refresh admin data.');
    }
  };

  const handleDeleteUserRequest = (userEntry) => {
    setSelectedUser(userEntry);
    setDeleteUserDialogOpen(true);
  };

  const handleDeleteUserConfirm = async () => {
    const userId = selectedUser?.id || selectedUser?._id || selectedUser?.userId;

    if (!userId) {
      showSnackbar('error', 'User id is missing.');
      return;
    }

    setProcessingUserId(userId);

    try {
      await api.delete(`/admin/users/${userId}`);
      setUsers((prev) => prev.filter((entry) => String(entry.id || entry._id || entry.userId) !== String(userId)));
      showSnackbar('success', 'User deleted successfully.');
      setDeleteUserDialogOpen(false);
      setSelectedUser(null);
    } catch (err) {
      showSnackbar('error', err.response?.data?.message || 'Failed to delete user.');
    } finally {
      setProcessingUserId(null);
    }
  };

  const handleUpdateMatchStatus = async (matchEntry, status) => {
    const matchId = matchEntry?.id || matchEntry?._id || matchEntry?.matchId;

    if (!matchId) {
      showSnackbar('error', 'Match id is missing.');
      return;
    }

    setProcessingMatchId(matchId);

    try {
      await updateAdminMatchStatus(matchId, status);
      setMatches((prev) => prev.map((entry) => {
        const currentMatchId = entry.id || entry._id || entry.matchId;
        return String(currentMatchId) === String(matchId)
          ? { ...entry, status }
          : entry;
      }));
      showSnackbar('success', `Match ${status.toLowerCase()} successfully.`);
    } catch (err) {
      showSnackbar('error', err.response?.data?.message || `Failed to update match status to ${status}.`);
      reloadAdminData();
    } finally {
      setProcessingMatchId(null);
    }
  };

  const handleUpdateSessionStatus = async (sessionEntry, status) => {
    const sessionId = sessionEntry?.id || sessionEntry?._id || sessionEntry?.sessionId || sessionEntry?.session?.id || sessionEntry?.session?._id;

    if (!sessionId) {
      showSnackbar('error', 'Session id is missing.');
      return;
    }

    setProcessingSessionId(sessionId);

    try {
      await updateAdminSessionStatus(sessionId, status);
      setSessions((prev) => prev.map((entry) => {
        const currentSessionId = entry.id || entry._id || entry.sessionId || entry?.session?.id || entry?.session?._id;
        return String(currentSessionId) === String(sessionId)
          ? { ...entry, status }
          : entry;
      }));
      showSnackbar('success', `Session ${status.toLowerCase()} successfully.`);
    } catch (err) {
      showSnackbar('error', err.response?.data?.message || `Failed to update session status to ${status}.`);
      reloadAdminData();
    } finally {
      setProcessingSessionId(null);
    }
  };

  const tabContent = () => {
    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      );
    }

    if (error) {
      return <Alert severity="error">{error}</Alert>;
    }

    if (activeTab === 0) {
      return users.length > 0 ? (
        <TableContainer component={Paper} variant="outlined">
          <UserTable users={users} onDeleteUser={handleDeleteUserRequest} processingUserId={processingUserId} />
        </TableContainer>
      ) : (
        <Typography variant="body1">No users found.</Typography>
      );
    }

    if (activeTab === 1) {
      return matches.length > 0 ? (
        <TableContainer component={Paper} variant="outlined">
          <MatchTable
            matches={matches}
            onUpdateMatchStatus={handleUpdateMatchStatus}
            processingMatchId={processingMatchId}
          />
        </TableContainer>
      ) : (
        <Typography variant="body1">No matches found.</Typography>
      );
    }

    return sessions.length > 0 ? (
      <TableContainer component={Paper} variant="outlined">
        <SessionTable
          sessions={sessions}
          onUpdateSessionStatus={handleUpdateSessionStatus}
          processingSessionId={processingSessionId}
        />
      </TableContainer>
    ) : (
      <Typography variant="body1">No sessions found.</Typography>
    );
  };

  return (
    <Box sx={{ p: 2 }}>
      <DashboardHeader
        title="Admin Dashboard"
        subtitle={`Platform overview for ${user?.email || 'admin'}.`}
        onLogout={handleLogout}
      />

      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Admin Dashboard
          </Typography>
          <Tabs value={activeTab} onChange={(_, nextValue) => setActiveTab(nextValue)} sx={{ mb: 3 }}>
            <Tab label="Users" />
            <Tab label="Matches" />
            <Tab label="Sessions" />
          </Tabs>

          {tabContent()}
        </CardContent>
      </Card>

      <Dialog open={deleteUserDialogOpen} onClose={() => setDeleteUserDialogOpen(false)}>
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete {selectedUser?.name || selectedUser?.email || 'this user'}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteUserDialogOpen(false)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleDeleteUserConfirm} disabled={Boolean(processingUserId)}>
            {processingUserId ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
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

export default AdminDashboard;
