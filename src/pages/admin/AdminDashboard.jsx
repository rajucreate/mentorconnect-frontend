import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  UsersIcon,
  UserCheckIcon,
  CalendarIcon,
  AlertCircleIcon,
  CheckCircleIcon,
  ClockIcon,
} from 'lucide-react';
import api from '../../api/axios';
import { AuthContext } from '../../context/AuthContext';
import Sidebar from '../../components/admin/Sidebar';
import Topbar from '../../components/admin/Topbar';
import StatCard from '../../components/admin/StatCard';
import ChartCard from '../../components/admin/ChartCard';
import UserTable from '../../components/admin/UserTable';
import MatchTable from '../../components/admin/MatchTable';
import SessionTable from '../../components/admin/SessionTable';
import LogoutConfirmDialog from '../../components/LogoutConfirmDialog';
import { getAdminMatches, updateAdminMatchStatus } from '../../api/matchApi';
import { getAdminSessions, updateAdminSessionStatus } from '../../api/sessionApi';
import './adminDashboard.css';

const pickValue = (...values) => values.find((value) => value !== undefined && value !== null && value !== '');

const toDate = (value) => {
  if (!value) {
    return null;
  }
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const normalizeStatus = (value) => String(value || 'PENDING').toUpperCase();

const normalizeRole = (value) => String(value || '').toUpperCase();

const getSessionDate = (session) =>
  toDate(
    pickValue(
      session?.startTime,
      session?.startDateTime,
      session?.dateTime,
      session?.scheduledAt,
      session?.sessionDate,
      session?.date,
      session?.createdAt,
      session?.session?.startTime,
      session?.session?.startDateTime,
      session?.session?.dateTime,
      session?.session?.scheduledAt,
      session?.session?.sessionDate,
      session?.session?.date,
      session?.session?.createdAt
    )
  );

const getUserDate = (entry) =>
  toDate(
    pickValue(
      entry?.createdAt,
      entry?.joinedAt,
      entry?.createdDate,
      entry?.user?.createdAt,
      entry?.user?.joinedAt,
      entry?.user?.createdDate
    )
  );

const getLastNMonths = (count) => {
  const now = new Date();
  const points = [];
  for (let index = count - 1; index >= 0; index -= 1) {
    const pointDate = new Date(now.getFullYear(), now.getMonth() - index, 1);
    points.push({
      label: pointDate.toLocaleString(undefined, { month: 'short' }),
      key: `${pointDate.getFullYear()}-${String(pointDate.getMonth() + 1).padStart(2, '0')}`,
      endTime: new Date(pointDate.getFullYear(), pointDate.getMonth() + 1, 1).getTime(),
    });
  }
  return points;
};

const getLastNWeeks = (count) => {
  const now = new Date();
  const points = [];
  for (let index = count - 1; index >= 0; index -= 1) {
    const end = new Date(now);
    end.setDate(end.getDate() - index * 7);
    const start = new Date(end);
    start.setDate(end.getDate() - 6);
    points.push({
      label: `${start.toLocaleString(undefined, { month: 'short', day: 'numeric' })}`,
      startTime: start.getTime(),
      endTime: end.getTime(),
    });
  }
  return points;
};

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
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
  const [sessionFilter, setSessionFilter] = useState('all');
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

        if (!isMounted) return;

        setUsers(Array.isArray(usersResponse?.data) ? usersResponse.data : usersResponse?.data?.data || []);
        setMatches(Array.isArray(matchesResponse?.data) ? matchesResponse.data : matchesResponse?.data?.data || []);
        setSessions(Array.isArray(sessionsResponse?.data) ? sessionsResponse.data : sessionsResponse?.data?.data || []);
      } catch (err) {
        if (!isMounted) return;
        setError(err.response?.data?.message || 'Failed to load admin data.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadAdminData();
    return () => {
      isMounted = false;
    };
  }, []);

  const showSnackbar = (severity, message) => {
    setSnackbar({ open: true, severity, message });
  };

  useEffect(() => {
    if (!snackbar.open) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setSnackbar((prev) => ({ ...prev, open: false }));
    }, 3000);

    return () => window.clearTimeout(timer);
  }, [snackbar.open]);

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
      setMatches((prev) =>
        prev.map((entry) => {
          const currentMatchId = entry.id || entry._id || entry.matchId;
          return String(currentMatchId) === String(matchId) ? { ...entry, status } : entry;
        })
      );
      showSnackbar('success', `Match ${status.toLowerCase()} successfully.`);
    } catch (err) {
      showSnackbar('error', err.response?.data?.message || `Failed to update match status to ${status}.`);
      reloadAdminData();
    } finally {
      setProcessingMatchId(null);
    }
  };

  const handleUpdateSessionStatus = async (sessionEntry, status) => {
    const sessionId =
      sessionEntry?.id ||
      sessionEntry?._id ||
      sessionEntry?.sessionId ||
      sessionEntry?.session?.id ||
      sessionEntry?.session?._id;

    if (!sessionId) {
      showSnackbar('error', 'Session id is missing.');
      return;
    }

    setProcessingSessionId(sessionId);

    try {
      await updateAdminSessionStatus(sessionId, status);
      setSessions((prev) =>
        prev.map((entry) => {
          const currentSessionId =
            entry.id || entry._id || entry.sessionId || entry?.session?.id || entry?.session?._id;
          return String(currentSessionId) === String(sessionId) ? { ...entry, status } : entry;
        })
      );
      showSnackbar('success', `Session ${status.toLowerCase()} successfully.`);
    } catch (err) {
      showSnackbar('error', err.response?.data?.message || `Failed to update session status to ${status}.`);
      reloadAdminData();
    } finally {
      setProcessingSessionId(null);
    }
  };

  // Calculate stats
  const totalMentees = users.filter((u) => normalizeRole(u?.role) === 'MENTEE').length;
  const totalMentors = users.filter((u) => normalizeRole(u?.role) === 'MENTOR').length;
  const totalSessions = sessions.length;
  const pendingSessions = sessions.filter((s) => normalizeStatus(s?.status) === 'PENDING').length;
  const approvedMatches = matches.filter((m) => normalizeStatus(m?.status) === 'APPROVED').length;

  const userGrowthPoints = getLastNMonths(6);
  const userGrowthData = userGrowthPoints.map((point) => {
    const mentors = users.filter((entry) => {
      const date = getUserDate(entry);
      const role = normalizeRole(entry?.role);
      return date && role === 'MENTOR' && date.getTime() < point.endTime;
    }).length;

    const mentees = users.filter((entry) => {
      const date = getUserDate(entry);
      const role = normalizeRole(entry?.role);
      return date && role === 'MENTEE' && date.getTime() < point.endTime;
    }).length;

    // If user dates are absent, use current totals at the latest point.
    const fallbackMentors = point === userGrowthPoints[userGrowthPoints.length - 1] ? totalMentors : 0;
    const fallbackMentees = point === userGrowthPoints[userGrowthPoints.length - 1] ? totalMentees : 0;

    return {
      month: point.label,
      mentors: mentors || fallbackMentors,
      mentees: mentees || fallbackMentees,
      total: (mentors || fallbackMentors) + (mentees || fallbackMentees),
    };
  });

  const sessionTrendPoints = getLastNWeeks(6);
  const sessionTrendsData = sessionTrendPoints.map((point) => {
    const entries = sessions.filter((entry) => {
      const sessionDate = getSessionDate(entry);
      if (!sessionDate) {
        return false;
      }
      const value = sessionDate.getTime();
      return value >= point.startTime && value <= point.endTime;
    });

    return {
      week: point.label,
      booked: entries.length,
      completed: entries.filter((entry) => ['COMPLETED', 'APPROVED', 'ACCEPTED'].includes(normalizeStatus(entry?.status))).length,
      cancelled: entries.filter((entry) => ['CANCELLED', 'REJECTED'].includes(normalizeStatus(entry?.status))).length,
    };
  });

  const roleDistribution = [
    { name: 'Mentees', value: totalMentees, fill: '#4e7dff' },
    { name: 'Mentors', value: totalMentors, fill: '#1fbf75' },
    { name: 'Admins', value: users.filter((u) => normalizeRole(u?.role) === 'ADMIN').length, fill: '#fb923c' },
  ].filter((item) => item.value > 0);

  // Filter sessions by status
  const filteredSessions =
    sessionFilter === 'all'
      ? sessions
      : sessions.filter((s) => normalizeStatus(s?.status) === sessionFilter.toUpperCase());

  const renderContent = () => {
    if (loading) {
      return (
        <div className="admin-loading">
          <div>Loading dashboard data...</div>
        </div>
      );
    }

    if (error) {
      return <div style={{ color: '#dc2626', fontWeight: 600 }}>{error}</div>;
    }

    if (activeTab === 'overview') {
      return (
        <>
          {/* Stats Cards */}
          <div className="admin-stats-grid">
            <StatCard
              title="Total Users"
              value={users.length}
              icon={UsersIcon}
              accent="primary"
              isLoading={false}
            />
            <StatCard
              title="Total Mentors"
              value={totalMentors}
              icon={UserCheckIcon}
              accent="success"
              isLoading={false}
            />
            <StatCard
              title="Total Mentees"
              value={totalMentees}
              icon={UsersIcon}
              accent="info"
              isLoading={false}
            />
            <StatCard
              title="Total Sessions"
              value={totalSessions}
              icon={CalendarIcon}
              accent="warning"
              isLoading={false}
            />
          </div>

          {/* Charts Section */}
          <div className="admin-charts-section">
            <ChartCard title="User Growth Trend" isLoading={false}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={userGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(79, 125, 255, 0.1)" />
                  <XAxis dataKey="month" stroke="#10234f" />
                  <YAxis stroke="#10234f" />
                  <Tooltip
                    contentStyle={{
                      background: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid rgba(79, 125, 255, 0.2)',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend wrapperStyle={{ color: '#10234f' }} />
                  <Line
                    type="monotone"
                    dataKey="mentees"
                    stroke="#4e7dff"
                    strokeWidth={3}
                    dot={{ fill: '#4e7dff', r: 5 }}
                    activeDot={{ r: 7 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="mentors"
                    stroke="#1fbf75"
                    strokeWidth={3}
                    dot={{ fill: '#1fbf75', r: 5 }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Session Trends" isLoading={false}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sessionTrendsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(79, 125, 255, 0.1)" />
                  <XAxis dataKey="week" stroke="#10234f" />
                  <YAxis stroke="#10234f" />
                  <Tooltip
                    contentStyle={{
                      background: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid rgba(79, 125, 255, 0.2)',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend wrapperStyle={{ color: '#10234f' }} />
                  <Bar dataKey="booked" fill="#4e7dff" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="completed" fill="#1fbf75" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="cancelled" fill="#dc2626" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          {/* Quick Stats */}
          <div className="admin-stats-grid" style={{ marginTop: '32px' }}>
            <StatCard
              title="Pending Sessions"
              value={pendingSessions}
              icon={AlertCircleIcon}
              accent="warning"
              isLoading={false}
            />
            <StatCard
              title="Approved Matches"
              value={approvedMatches}
              icon={CheckCircleIcon}
              accent="success"
              isLoading={false}
            />
            <StatCard
              title="Active Sessions"
              value={sessions.filter((s) => normalizeStatus(s?.status) === 'ACTIVE').length}
              icon={ClockIcon}
              accent="info"
              isLoading={false}
            />
            <StatCard
              title="Completed Sessions"
              value={sessions.filter((s) => ['COMPLETED', 'APPROVED', 'ACCEPTED'].includes(normalizeStatus(s?.status))).length}
              icon={CheckCircleIcon}
              accent="success"
              isLoading={false}
            />
          </div>
        </>
      );
    }

    if (activeTab === 'users') {
      return (
        <div className="admin-tables-section">
          <div className="table-card">
            <div className="table-header">
              <div className="table-title">User Management</div>
              <div style={{ fontSize: '13px', color: 'rgba(16, 35, 79, 0.6)' }}>
                Total Users: {users.length}
              </div>
            </div>
            <div className="table-content">
              {users.length > 0 ? (
                <UserTable users={users} onDeleteUser={handleDeleteUserRequest} processingUserId={processingUserId} />
              ) : (
                <div style={{ padding: '40px', textAlign: 'center', color: '#10234f' }}>
                  No users found.
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    if (activeTab === 'mentors') {
      const mentorMatches = matches.filter((m) => m.status !== 'REJECTED');
      return (
        <div className="admin-tables-section">
          <div className="table-card">
            <div className="table-header">
              <div className="table-title">Mentor Management</div>
              <div style={{ fontSize: '13px', color: 'rgba(16, 35, 79, 0.6)' }}>
                Active Mentors: {totalMentors} | Matches: {mentorMatches.length}
              </div>
            </div>
            <div className="table-content">
              {mentorMatches.length > 0 ? (
                <MatchTable
                  matches={mentorMatches}
                  onUpdateMatchStatus={handleUpdateMatchStatus}
                  processingMatchId={processingMatchId}
                />
              ) : (
                <div style={{ padding: '40px', textAlign: 'center', color: '#10234f' }}>
                  No mentor matches found.
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    if (activeTab === 'sessions') {
      return (
        <div className="admin-tables-section">
          <div className="table-card">
            <div className="table-header">
              <div className="table-title">Session Monitoring</div>
              <div className="table-filter">
                <button
                  className={`filter-btn ${sessionFilter === 'all' ? 'active' : ''}`}
                  onClick={() => setSessionFilter('all')}
                >
                  All ({sessions.length})
                </button>
                <button
                  className={`filter-btn ${sessionFilter === 'PENDING' ? 'active' : ''}`}
                  onClick={() => setSessionFilter('PENDING')}
                >
                  Pending ({sessions.filter((s) => normalizeStatus(s?.status) === 'PENDING').length})
                </button>
                <button
                  className={`filter-btn ${sessionFilter === 'ACTIVE' ? 'active' : ''}`}
                  onClick={() => setSessionFilter('ACTIVE')}
                >
                  Active ({sessions.filter((s) => normalizeStatus(s?.status) === 'ACTIVE').length})
                </button>
                <button
                  className={`filter-btn ${sessionFilter === 'COMPLETED' ? 'active' : ''}`}
                  onClick={() => setSessionFilter('COMPLETED')}
                >
                  Completed ({sessions.filter((s) => normalizeStatus(s?.status) === 'COMPLETED').length})
                </button>
              </div>
            </div>
            <div className="table-content">
              {filteredSessions.length > 0 ? (
                <SessionTable
                  sessions={filteredSessions}
                  onUpdateSessionStatus={handleUpdateSessionStatus}
                  processingSessionId={processingSessionId}
                />
              ) : (
                <div style={{ padding: '40px', textAlign: 'center', color: '#10234f' }}>
                  No sessions found.
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    if (activeTab === 'analytics') {
      return (
        <>
          <div className="admin-charts-section">
            <ChartCard title="User Growth Over Time" isLoading={false}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={userGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(79, 125, 255, 0.1)" />
                  <XAxis dataKey="month" stroke="#10234f" />
                  <YAxis stroke="#10234f" />
                  <Tooltip
                    contentStyle={{
                      background: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid rgba(79, 125, 255, 0.2)',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend wrapperStyle={{ color: '#10234f' }} />
                  <Line
                    type="monotone"
                    dataKey="total"
                    stroke="#4e7dff"
                    strokeWidth={3}
                    dot={{ fill: '#4e7dff', r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="User Role Distribution" isLoading={false}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={roleDistribution} cx="50%" cy="50%" labelLine={false} label outerRadius={80}>
                    {roleDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend wrapperStyle={{ color: '#10234f' }} />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          <div className="admin-charts-section">
            <ChartCard title="Detailed Session Analytics" isLoading={false}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sessionTrendsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(79, 125, 255, 0.1)" />
                  <XAxis dataKey="week" stroke="#10234f" />
                  <YAxis stroke="#10234f" />
                  <Tooltip
                    contentStyle={{
                      background: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid rgba(79, 125, 255, 0.2)',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend wrapperStyle={{ color: '#10234f' }} />
                  <Bar dataKey="booked" fill="#4e7dff" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="completed" fill="#1fbf75" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="cancelled" fill="#dc2626" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        </>
      );
    }
  };

  return (
    <div className="admin-dashboard-root">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <Topbar admin={user} onLogout={handleLogoutRequest} activeTab={activeTab} />
      <div className="admin-main-content">{renderContent()}</div>

      {/* Delete User Dialog */}
      {deleteUserDialogOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
          onClick={() => setDeleteUserDialogOpen(false)}
        >
          <div
            style={{
              background: 'white',
              borderRadius: '12px',
              padding: '24px',
              maxWidth: '400px',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ margin: '0 0 12px 0', color: '#10234f', fontSize: '18px', fontWeight: '700' }}>
              Delete User
            </h3>
            <p style={{ margin: '0 0 24px 0', color: 'rgba(16, 35, 79, 0.7)', fontSize: '14px' }}>
              Are you sure you want to delete {selectedUser?.name || selectedUser?.email || 'this user'}? This action
              cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setDeleteUserDialogOpen(false)}
                style={{
                  padding: '8px 16px',
                  border: '1px solid rgba(79, 125, 255, 0.2)',
                  background: 'transparent',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  color: '#4e7dff',
                  fontWeight: '600',
                  fontSize: '14px',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteUserConfirm}
                disabled={Boolean(processingUserId)}
                style={{
                  padding: '8px 16px',
                  background: 'linear-gradient(135deg, #dc2626, #ef4444)',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: processingUserId ? 'not-allowed' : 'pointer',
                  color: 'white',
                  fontWeight: '600',
                  fontSize: '14px',
                  opacity: processingUserId ? 0.6 : 1,
                }}
              >
                {processingUserId ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Snackbar */}
      {snackbar.open && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            padding: '16px 24px',
            borderRadius: '8px',
            background: snackbar.severity === 'success' ? '#1fbf75' : '#dc2626',
            color: 'white',
            fontWeight: '600',
            fontSize: '14px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            zIndex: 1001,
            animation: 'slideInUp 0.3s ease-out',
          }}
        >
          {snackbar.message}
        </div>
      )}

      <LogoutConfirmDialog
        open={logoutDialogOpen}
        onCancel={() => setLogoutDialogOpen(false)}
        onConfirm={handleLogoutConfirm}
      />
    </div>
  );
};

export default AdminDashboard;
