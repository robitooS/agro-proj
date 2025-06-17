
import React from 'react';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import LoginPage from '@/components/auth/LoginPage';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import Dashboard from '@/components/dashboard/Dashboard';
import PropertiesModule from '@/components/modules/PropertiesModule';
import ClimateAnalysis from '@/components/modules/ClimateAnalysis';
import PlantationAnalysis from '@/components/modules/PlantationAnalysis';
import CropManagement from '@/components/modules/CropManagement';
import InventoryModule from '@/components/modules/InventoryModule';
import ReportsModule from '@/components/modules/ReportsModule';
import SustainabilityModule from '@/components/modules/SustainabilityModule';

const AppContent = () => {
  const { isAuthenticated } = useAuth();
  const [activeModule, setActiveModule] = React.useState('dashboard');

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const renderActiveModule = () => {
    switch (activeModule) {
      case 'dashboard':
        return <Dashboard />;
      case 'properties':
        return <PropertiesModule />;
      case 'climate':
        return <ClimateAnalysis />;
      case 'plantation':
        return <PlantationAnalysis />;
      case 'crops':
        return <CropManagement />;
      case 'inventory':
        return <InventoryModule />;
      case 'reports':
        return <ReportsModule />;
      case 'sustainability':
        return <SustainabilityModule />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <div className="flex h-screen">
        <Sidebar activeModule={activeModule} setActiveModule={setActiveModule} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50/50 p-6">
            {renderActiveModule()}
          </main>
        </div>
      </div>
    </div>
  );
};

const Index = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default Index;
