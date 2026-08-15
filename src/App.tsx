import React from 'react';
import { DevFortressProvider, useDevFortress } from './context/DevFortressContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { DashboardOverview } from './components/admin/DashboardOverview';
import { SentinelMonitor } from './components/admin/SentinelMonitor';
import { VMManager } from './components/admin/VMManager';
import { VaultManager } from './components/admin/VaultManager';
import { SecurityCoreConfig } from './components/admin/SecurityCoreConfig';
import { AuditSystem } from './components/admin/AuditSystem';
import { InternalGitManager } from './components/admin/InternalGitManager';
import { DeveloperVMWorkspace } from './components/workspace/DeveloperVMWorkspace';

const MainContent: React.FC = () => {
  const { activeTab } = useDevFortress();

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardOverview />;
      case 'sentinel': return <SentinelMonitor />;
      case 'vm-manager': return <VMManager />;
      case 'vault': return <VaultManager />;
      case 'security-core': return <SecurityCoreConfig />;
      case 'audit': return <AuditSystem />;
      case 'git': return <InternalGitManager />;
      case 'workspace': return <DeveloperVMWorkspace />;
      default: return <DashboardOverview />;
    }
  };

  return (
    <main style={{ flex: 1, padding: '24px', overflowY: 'auto', maxHeight: 'calc(100vh - 70px)' }}>
      {renderContent()}
    </main>
  );
};

export const App: React.FC = () => {
  return (
    <DevFortressProvider>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg-primary)' }}>
        <Header />
        <div style={{ display: 'flex', flex: 1 }}>
          <Sidebar />
          <MainContent />
        </div>
      </div>
    </DevFortressProvider>
  );
};

export default App;
