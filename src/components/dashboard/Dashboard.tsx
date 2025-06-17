
import React from 'react';
import KPICards from './KPICards';
import WeatherWidget from './WeatherWidget';
import ProductivityChart from './ProductivityChart';
import AlertsPanel from './AlertsPanel';
import RecentActivities from './RecentActivities';

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <KPICards />
        </div>
        <div className="lg:col-span-1">
          <WeatherWidget />
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProductivityChart />
        <AlertsPanel />
      </div>
      
      <RecentActivities />
    </div>
  );
};

export default Dashboard;
