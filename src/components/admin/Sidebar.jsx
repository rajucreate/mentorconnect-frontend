import React from 'react';
import {
  LayoutDashboardIcon,
  UsersIcon,
  UserCheckIcon,
  CalendarIcon,
  BarChart3Icon,
} from 'lucide-react';

const Sidebar = ({ activeTab, onTabChange }) => {
  const navItems = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboardIcon },
    { id: 'users', label: 'Users', icon: UsersIcon },
    { id: 'mentors', label: 'Mentors', icon: UserCheckIcon },
    { id: 'sessions', label: 'Sessions', icon: CalendarIcon },
    { id: 'analytics', label: 'Analytics', icon: BarChart3Icon },
  ];

  return (
    <div className="admin-sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-brand-icon">M</div>
        <span className="sidebar-brand-text">MentorConnect</span>
      </div>
      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <div
              key={item.id}
              className={`sidebar-nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => onTabChange(item.id)}
            >
              <div className="sidebar-nav-icon">
                <IconComponent size={18} />
              </div>
              <span>{item.label}</span>
            </div>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;
