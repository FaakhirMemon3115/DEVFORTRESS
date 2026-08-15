import React from 'react';
import { useDevFortress } from '../../context/DevFortressContext';
import { 
  Users, 
  Monitor, 
  FolderCheck, 
  CheckCircle2, 
  ShieldAlert, 
  Cpu, 
  HardDrive, 
  Activity,
  ArrowUpRight
} from 'lucide-react';

export const DashboardOverview: React.FC = () => {
  const { vms, projects, securityEvents, nodes, setActiveTab } = useDevFortress();

  const activeWorkspacesCount = vms.filter(v => v.status === 'RUNNING').length;
  const activeDevelopersCount = new Set(vms.map(v => v.assignedUser)).size;
  const inProgressProjectsCount = projects.filter(p => p.status === 'IN_PROGRESS').length;
  const completedTodayCount = projects.filter(p => p.status === 'SUBMITTED' || p.status === 'ARCHIVED').length;
  const securityAlertsCount = securityEvents.length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Banner */}
      <div className="glass-card" style={{ padding: '24px', background: 'linear-gradient(135deg, rgba(12, 18, 29, 0.9) 0%, rgba(6, 182, 212, 0.08) 100%)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '6px' }}>
              DEVFORTRESS Control Center
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Real-time hypervisor monitoring, data-loss prevention telemetry & active workspace management.
            </p>
          </div>
          <button onClick={() => setActiveTab('workspace')} className="btn-primary">
            <span>Launch DEV-VM Simulator</span>
            <ArrowUpRight size={16} />
          </button>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px' }}>
        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600 }}>Active Developers</span>
            <Users size={20} color="var(--accent-cyan)" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff' }}>{activeDevelopersCount}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)', marginTop: '4px' }}>● All 100% Authenticated</div>
        </div>

        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600 }}>Active Workspaces</span>
            <Monitor size={20} color="var(--accent-emerald)" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff' }}>{activeWorkspacesCount}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>Windows 11 DEV-VMs</div>
        </div>

        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600 }}>Projects In Progress</span>
            <FolderCheck size={20} color="var(--accent-blue)" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff' }}>{inProgressProjectsCount}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', marginTop: '4px' }}>Injected into DEV-VMs</div>
        </div>

        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600 }}>Completed Today</span>
            <CheckCircle2 size={20} color="var(--accent-violet)" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff' }}>{completedTodayCount}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)', marginTop: '4px' }}>SHA-256 Verified</div>
        </div>

        <div className="glass-card" style={{ padding: '20px', border: '1px solid rgba(244, 63, 94, 0.3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600 }}>Security Interceptions</span>
            <ShieldAlert size={20} color="var(--accent-rose)" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#f87171' }}>{securityAlertsCount}</div>
          <div style={{ fontSize: '0.75rem', color: '#f87171', marginTop: '4px' }}>● Sentinel Active</div>
        </div>
      </div>

      {/* Main Grid: Proxmox Nodes + Active Developer Workspaces */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        {/* Left Column: Active Developers Table & Hypervisor Cluster */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Active Workspaces Table */}
          <div className="glass-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Active Developer Workspaces</h3>
              <button onClick={() => setActiveTab('vm-manager')} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.78rem' }}>
                Manage All VMs
              </button>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '10px 12px' }}>Developer</th>
                  <th style={{ padding: '10px 12px' }}>Project</th>
                  <th style={{ padding: '10px 12px' }}>VM ID</th>
                  <th style={{ padding: '10px 12px' }}>IP Address</th>
                  <th style={{ padding: '10px 12px' }}>Agent Status</th>
                  <th style={{ padding: '10px 12px' }}>VM State</th>
                </tr>
              </thead>
              <tbody>
                {vms.map(vm => {
                  const assignedProj = projects.find(p => p.id === vm.assignedProjectId);
                  return (
                    <tr key={vm.id} style={{ borderBottom: '1px solid rgba(30, 41, 59, 0.4)' }}>
                      <td style={{ padding: '12px', fontWeight: 600, color: '#ffffff' }}>
                        {vm.assignedUser}
                      </td>
                      <td style={{ padding: '12px', color: 'var(--accent-cyan)' }}>
                        {assignedProj ? assignedProj.name : 'Unassigned'}
                      </td>
                      <td style={{ padding: '12px', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
                        {vm.code}
                      </td>
                      <td style={{ padding: '12px', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        {vm.ip}
                      </td>
                      <td style={{ padding: '12px' }}>
                        <span className={`badge ${vm.securityAgentStatus === 'PROTECTED' ? 'badge-emerald' : 'badge-rose'}`}>
                          {vm.securityAgentStatus}
                        </span>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <span className={`badge ${vm.status === 'RUNNING' ? 'badge-cyan' : 'badge-amber'}`}>
                          ● {vm.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Proxmox Hypervisor Nodes */}
          <div className="glass-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <Cpu size={20} color="var(--accent-cyan)" />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Proxmox VE Cluster Infrastructure</h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {nodes.map(node => (
                <div key={node.id} className="glass-panel" style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{node.name}</span>
                    <span className="badge badge-emerald">● {node.status}</span>
                  </div>

                  {/* CPU Usage Bar */}
                  <div style={{ marginBottom: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '4px' }}>
                      <span style={{ color: 'var(--text-muted)' }}>CPU Allocation</span>
                      <span>{node.cpuUsagePct}%</span>
                    </div>
                    <div style={{ height: '6px', background: 'rgba(30, 41, 59, 0.8)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: `${node.cpuUsagePct}%`, height: '100%', background: 'var(--accent-cyan)' }}></div>
                    </div>
                  </div>

                  {/* RAM Usage Bar */}
                  <div style={{ marginBottom: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '4px' }}>
                      <span style={{ color: 'var(--text-muted)' }}>RAM Usage</span>
                      <span>{node.ramUsagePct}%</span>
                    </div>
                    <div style={{ height: '6px', background: 'rgba(30, 41, 59, 0.8)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: `${node.ramUsagePct}%`, height: '100%', background: 'var(--accent-emerald)' }}></div>
                    </div>
                  </div>

                  {/* Storage Bar */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '4px' }}>
                      <span style={{ color: 'var(--text-muted)' }}>ZFS Encrypted Vault Storage</span>
                      <span>{node.storageUsagePct}%</span>
                    </div>
                    <div style={{ height: '6px', background: 'rgba(30, 41, 59, 0.8)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: `${node.storageUsagePct}%`, height: '100%', background: 'var(--accent-indigo)' }}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Sentinel Live Security Feed Widget */}
        <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Activity size={18} color="var(--accent-rose)" />
              <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Sentinel Live Interceptions</h3>
            </div>
            <button onClick={() => setActiveTab('sentinel')} className="btn-secondary" style={{ padding: '4px 8px', fontSize: '0.7rem' }}>
              Full Log
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto', flex: 1 }}>
            {securityEvents.map(evt => (
              <div key={evt.id} className="glass-panel" style={{ padding: '12px', borderLeft: `3px solid ${evt.severity === 'CRITICAL' ? '#f43f5e' : '#f59e0b'}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '4px' }}>
                  <strong style={{ color: '#ffffff' }}>{evt.eventType}</strong>
                  <span className={`badge badge-${evt.severity === 'CRITICAL' ? 'rose' : 'amber'}`} style={{ fontSize: '0.6rem' }}>
                    {evt.actionTaken}
                  </span>
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  {evt.details}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  <span>Dev: {evt.developerName} ({evt.workspaceCode})</span>
                  <span>{evt.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
