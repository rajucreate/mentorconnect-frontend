import React from 'react';
import { TrendingUpIcon, TrendingDownIcon } from 'lucide-react';

const StatCard = ({ title, value, icon: IconComponent, accent, change, isLoading }) => {
  const accentClass = {
    primary: 'primary-accent',
    success: 'success-accent',
    warning: 'warning-accent',
    info: 'info-accent',
  }[accent] || 'primary-accent';

  const iconClass = {
    primary: 'primary',
    success: 'success',
    warning: 'warning',
    info: 'info',
  }[accent] || 'primary';

  const isPositive = change && change > 0;

  return (
    <div className={`stat-card ${accentClass}`}>
      <div className="stat-card-header">
        <span className="stat-label">{title}</span>
        <div className={`stat-icon ${iconClass}`}>
          {IconComponent ? <IconComponent size={22} /> : '📊'}
        </div>
      </div>
      <div className="stat-value">{isLoading ? '...' : value}</div>
      {change !== undefined && (
        <div className={`stat-change ${isPositive ? 'positive' : 'negative'}`}>
          {isPositive ? <TrendingUpIcon size={14} /> : <TrendingDownIcon size={14} />}
          <span>{Math.abs(change)}% from last week</span>
        </div>
      )}
    </div>
  );
};

export default StatCard;
