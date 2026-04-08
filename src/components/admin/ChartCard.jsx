import React from 'react';

const ChartCard = ({ title, children, isLoading }) => {
  return (
    <div className="chart-card">
      <h3 className="chart-title">{title}</h3>
      <div className="chart-container">
        {isLoading ? (
          <div style={{ textAlign: 'center', color: '#10234f', fontSize: '14px' }}>
            Loading chart data...
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
};

export default ChartCard;
