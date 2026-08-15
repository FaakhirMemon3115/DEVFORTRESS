import React from 'react';
import { useDevFortress } from '../../context/DevFortressContext';
import type { Role } from '../../types/devfortress';
import { Shield, Server, Activity, UserCheck, Terminal, AlertTriangle } from 'lucide-react';

export const Header: React.FC = () => {
  const { currentRole, setCurrentRole, activeTab, setActiveTab, securityEvents, isWorkspaceLocked } = useDevFortress();

  const roleLabels: Record<Role, { label: string; badgeClass: string; desc: string }> = {
    SUPER_ADMIN: { label: 'Super Admin', badgeClass: 'badge-rose', desc: 'Full System & Policy Control' },
    SECURITY_ADMIN: { label: 'Security Admin', badgeClass: 'badge-amber', desc: 'Security Core, Sentinel & DLP' },
    PROJECT_MANAGER: { label: 'Project Manager', badgeClass: 'badge-indigo', desc: 'Projects & Storage Management' },
    DEVELOPER_VM_ADMIN: { label: 'Developer VM Admin', badgeClass: 'badge-cyan', desc: 'Windows Local Admin in VM' },
    DEVELOPER: { label: 'Developer', badgeClass: 'badge-emerald', desc: 'Assigned Workspace Access Only' }
  };

  const highSeverityAlerts = securityEvents.filter(e => e.severity === 'HIGH' || e.severity === 'CRITICAL').length;

  return (
    <header style={{
      height: '70px',
      background: 'rgba(12, 18, 29, 0.85)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(30, 41, 59, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      position: 'sticky',
      top: 0,
      zIndex: 50
    }}>
      {/* Brand & Tagline */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{
          width: '42px',
          height: '42px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 20px rgba(6, 182, 212, 0.4)'
        }}>
          <Shield size={24} color="#ffffff" />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.25rem',
              fontWeight: 800,
              letterSpacing: '0.05em',
              background: 'linear-gradient(90deg, #ffffff 0%, #38bdf8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              DEVFORTRESS
            </span>
            <span className="badge badge-cyan" style={{ fontSize: '0.65rem' }}>v3.4 ENTERPRISE</span>
          </div>
          <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 500 }}>
            Secure Development • Zero Uncontrolled Exfiltration
          </p>
        </div>
      </div>

      {/* System Status Indicators */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          <Server size={15} color="var(--accent-cyan)" />
          <span>Proxmox Clusters: <strong style={{ color: '#34d399' }}>2/2 ONLINE</strong></span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          <Activity size={15} color="var(--accent-emerald)" />
          <span>DLP Core: <strong style={{ color: '#34d399' }}>ENFORCED</strong></span>
        </div>

        {isWorkspaceLocked && (
          <div className="badge badge-rose" style={{ animation: 'pulse-ring 1s infinite' }}>
            <AlertTriangle size={13} />
            <span>WORKSPACE LOCKED</span>
          </div>
        )}

        {/* Sentinel Alert Counter */}
        <button 
          onClick={() => setActiveTab('sentinel')}
          style={{
            background: highSeverityAlerts > 0 ? 'rgba(244, 63, 94, 0.15)' : 'rgba(30, 41, 59, 0.5)',
            border: `1px solid ${highSeverityAlerts > 0 ? 'rgba(244, 63, 94, 0.4)' : 'rgba(51, 65, 85, 0.5)'}`,
            padding: '6px 14px',
            borderRadius: '20px',
            color: highSeverityAlerts > 0 ? '#f87171' : 'var(--text-secondary)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.8rem',
            fontWeight: 600
          }}
        >
          <span className={`pulse-dot ${highSeverityAlerts > 0 ? 'rose' : 'emerald'}`}></span>
          <span>Sentinel: {highSeverityAlerts} Alerts</span>
        </button>

        {/* Role Switcher */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          background: 'rgba(15, 23, 42, 0.8)',
          padding: '6px 12px',
          borderRadius: '10px',
          border: '1px solid rgba(51, 65, 85, 0.8)'
        }}>
          <UserCheck size={16} color="var(--accent-cyan)" />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Active Role Persona</span>
            <select
              value={currentRole}
              onChange={(e) => setCurrentRole(e.target.value as Role)}
              style={{
                background: 'transparent',
                color: '#ffffff',
                border: 'none',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              <option value="SUPER_ADMIN" style={{ background: '#0f172a' }}>⚡ Super Admin</option>
              <option value="SECURITY_ADMIN" style={{ background: '#0f172a' }}>🛡️ Security Admin</option>
              <option value="PROJECT_MANAGER" style={{ background: '#0f172a' }}>📂 Project Manager</option>
              <option value="DEVELOPER_VM_ADMIN" style={{ background: '#0f172a' }}>🛠️ Developer VM Admin</option>
              <option value="DEVELOPER" style={{ background: '#0f172a' }}>💻 Developer</option>
            </select>
          </div>
          <span className={`badge ${roleLabels[currentRole].badgeClass}`} style={{ fontSize: '0.65rem' }}>
            {roleLabels[currentRole].label}
          </span>
        </div>

        {/* Quick Launch Workspace Toggle */}
        <button
          onClick={() => setActiveTab(activeTab === 'workspace' ? 'dashboard' : 'workspace')}
          className="btn-primary"
          style={{ padding: '8px 14px', fontSize: '0.8rem' }}
        >
          <Terminal size={15} />
          <span>{activeTab === 'workspace' ? 'Exit VM Workspace' : 'Open DEV-VM Workspace'}</span>
        </button>
      </div>
    </header>
  );
};
