import React from 'react';
import { LogOutIcon } from 'lucide-react';

const Topbar = ({ admin, onLogout, activeTab = 'overview' }) => {
  const getInitials = (name) => {
    if (!name) return 'A';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getPageTitle = (tab) => {
    const titles = {
      overview: 'Dashboard Overview',
      users: 'User Management',
      mentors: 'Mentor Management',
      sessions: 'Session Monitoring',
      analytics: 'Analytics & Insights',
    };
    return titles[tab] || 'Admin Dashboard';
  };

  const getPageSubtitle = (tab) => {
    const subtitles = {
      overview: 'View key metrics and platform health',
      users: 'Manage all platform users',
      mentors: 'Manage mentors and approvals',
      sessions: 'Monitor and manage sessions',
      analytics: 'View platform analytics and trends',
    };
    return subtitles[tab] || 'Platform administration';
  };

  return (
    <div className="admin-topbar">
      <div className="topbar-left">
        <div>
          <div className="topbar-title">{getPageTitle(activeTab)}</div>
          <div className="topbar-subtitle">{getPageSubtitle(activeTab)}</div>
        </div>
      </div>
      <div className="topbar-right">
        <div className="admin-info">
          <div className="admin-avatar">{getInitials(admin?.name || admin?.email)}</div>
          <div>
            <div className="admin-name">{admin?.name || admin?.email || 'Admin'}</div>
            <div className="admin-role">Administrator</div>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="logout-btn"
          style={{
            background: 'linear-gradient(135deg, #dc2626, #ef4444)',
            border: 'none',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '14px',
            fontWeight: '600',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 6px 12px rgba(220, 38, 38, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = 'none';
          }}
        >
          <LogOutIcon size={16} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Topbar;
