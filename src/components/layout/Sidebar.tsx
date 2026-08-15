import React from 'react';
import { useDevFortress } from '../../context/DevFortressContext';
import { 
  LayoutDashboard, 
  ShieldAlert, 
  Cpu, 
  FolderLock, 
  Lock, 
  FileText, 
  GitBranch, 
  MonitorPlay,
  Layers
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, securityEvents, projects, vms } = useDevFortress();

  const unhandledEvents = securityEvents.filter(e => e.actionTaken === 'BLOCKED' || e.actionTaken === 'LOCKED').length;
  const runningVMs = vms.filter(v => v.status === 'RUNNING').length;
  const inProgressProjects = projects.filter(p => p.status === 'IN_PROGRESS').length;

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Control Center Overview',
      subtitle: 'System & Cluster Metrics',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'sentinel',
      label: 'DEVFORTRESS Sentinel',
      subtitle: 'Security Monitoring & Threat Feed',
      icon: ShieldAlert,
      badge: unhandledEvents > 0 ? { text: `${unhandledEvents}`, type: 'rose' } : null
    },
    {
      id: 'vm-manager',
      label: 'DEVFORTRESS VM Manager',
      subtitle: 'Proxmox VM Provisioning',
      icon: Cpu,
      badge: { text: `${runningVMs} Active`, type: 'emerald' }
    },
    {
      id: 'vault',
      label: 'DEVFORTRESS Vault',
      subtitle: 'Secure Project Storage',
      icon: FolderLock,
      badge: { text: `${inProgressProjects}`, type: 'cyan' }
    },
    {
      id: 'security-core',
      label: 'DEVFORTRESS Security Core',
      subtitle: 'DLP, Egress & Firewall Policy',
      icon: Lock,
      badge: { text: 'STRICT', type: 'indigo' }
    },
    {
      id: 'audit',
      label: 'DEVFORTRESS Audit',
      subtitle: 'Immutable Action Logs & SHA-256',
      icon: FileText,
      badge: null
    },
    {
      id: 'git',
      label: 'DEVFORTRESS Git',
      subtitle: 'Internal Repository Server',
      icon: GitBranch,
      badge: { text: 'git.company.local', type: 'cyan' }
    },
    {
      id: 'workspace',
      label: 'DEVFORTRESS Workspace',
      subtitle: 'Simulated DEV-VM Desktop',
      icon: MonitorPlay,
      badge: { text: 'LIVE VM', type: 'emerald' }
    }
  ];

  return (
    <aside style={{
      width: '280px',
      background: 'rgba(12, 18, 29, 0.9)',
      backdropFilter: 'blur(16px)',
      borderRight: '1px solid rgba(30, 41, 59, 0.8)',
      padding: '20px 16px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      height: 'calc(100vh - 70px)'
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div style={{
          padding: '8px 12px',
          marginBottom: '8px',
          fontSize: '0.68rem',
          fontWeight: 700,
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <Layers size={12} color="var(--accent-cyan)" />
          <span>Platform Architecture</span>
        </div>

        {menuItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 14px',
                borderRadius: '10px',
                border: `1px solid ${isActive ? 'rgba(6, 182, 212, 0.5)' : 'transparent'}`,
                background: isActive 
                  ? 'linear-gradient(90deg, rgba(6, 182, 212, 0.15) 0%, rgba(59, 130, 246, 0.05) 100%)' 
                  : 'transparent',
                color: isActive ? '#ffffff' : 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                textAlign: 'left'
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'rgba(30, 41, 59, 0.4)';
                  e.currentTarget.style.color = '#f8fafc';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Icon size={18} color={isActive ? 'var(--accent-cyan)' : 'var(--text-muted)'} />
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: isActive ? 700 : 500 }}>
                    {item.label}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    {item.subtitle}
                  </div>
                </div>
              </div>

              {item.badge && (
                <span className={`badge badge-${item.badge.type}`} style={{ fontSize: '0.65rem', padding: '2px 8px' }}>
                  {item.badge.text}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Proxmox VE Info Box */}
      <div className="glass-panel" style={{ padding: '14px', borderRadius: '10px', fontSize: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
          <span style={{ fontWeight: 700, color: '#f8fafc' }}>Hypervisor Cluster</span>
          <span className="badge badge-emerald" style={{ fontSize: '0.6rem' }}>PROXMOX VE</span>
        </div>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div>VLAN 10: Management Subnet</div>
          <div>VLAN 20: Developer VMs (Isolated)</div>
          <div>VLAN 40: Internal Git & Vault</div>
        </div>
      </div>
    </aside>
  );
};
