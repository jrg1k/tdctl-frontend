import React from 'react';
import UniqueVisitsCharts from 'components/molecules/charts/uniqueVisitChart/UniqueVisitChart';

const StatsPage: React.FC = () => {
  return (
    <div style={{ display: 'flex', width: '100vw', height: '100vh' }}>
      <UniqueVisitsCharts />
    </div>
  );
};

export default StatsPage;
