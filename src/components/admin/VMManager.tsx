import React, { useState } from 'react';
import { useDevFortress } from '../../context/DevFortressContext';
import { VMInstance, VMStatus } from '../../types/devfortress';
import { 
  Cpu, 
  Plus, 
  Play, 
  Square, 
  Snowflake, 
  Trash2, 
  RotateCcw, 
  ShieldCheck, 
  AlertTriangle, 
  Check,
  Server
} from 'lucide-react';

export const VMManager: React.FC = () => {
  const { vms, updateVMStatus, currentRole } = useDevFortress();
  const [showProvisionModal, setShowProvisionModal] = useState<boolean>(false);
  const [newVmDevName, setNewVmDevName] = useState<string>('');
  const [newVmCpu, setNewVmCpu] = useState<number>(8);
  const [newVmRam, setNewVmRam] = useState<number>(16);

  const handleStatusChange = (vmId: string, status: VMStatus) => {
    updateVMStatus(vmId, status);
  };

  const isAllowedToManageVM = currentRole === 'SUPER_ADMIN' || currentRole === 'SECURITY_ADMIN';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Banner */}
      <div className="glass-card" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Cpu size={24} color="var(--accent-cyan)" />
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>DEVFORTRESS VM Manager</h2>
            <span className="badge badge-emerald">Proxmox VE Integrated</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '4px' }}>
            Provision, monitor & lifecycle-manage isolated Windows 11 Enterprise Developer VMs (DEV-VMs).
          </p>
        </div>

        {isAllowedToManageVM ? (
          <button onClick={() => setShowProvisionModal(true)} className="btn-primary">
            <Plus size={16} /> Provision New DEV-VM
          </button>
        ) : (
          <span className="badge badge-amber">🔒 VM Management Restricted to Super / Security Admin</span>
        )}
      </div>

      {/* VM List Table */}
      <div className="glass-card" style={{ padding: '20px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
              <th style={{ padding: '12px' }}>VM Code</th>
              <th style={{ padding: '12px' }}>Assigned Developer</th>
              <th style={{ padding: '12px' }}>Proxmox Node</th>
              <th style={{ padding: '12px' }}>Specs (vCPU / RAM / Disk)</th>
              <th style={{ padding: '12px' }}>Network & IP</th>
              <th style={{ padding: '12px' }}>Local Admin Privileges</th>
              <th style={{ padding: '12px' }}>Security Agent</th>
              <th style={{ padding: '12px' }}>Status</th>
              <th style={{ padding: '12px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {vms.map(vm => (
              <tr key={vm.id} style={{ borderBottom: '1px solid rgba(30, 41, 59, 0.4)' }}>
                <td style={{ padding: '14px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--accent-cyan)' }}>
                  {vm.code}
                </td>
                <td style={{ padding: '14px', fontWeight: 600, color: '#ffffff' }}>
                  {vm.assignedUser}
                </td>
                <td style={{ padding: '14px', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Server size={14} color="var(--text-muted)" />
                    <span>{vm.node}</span>
                  </div>
                </td>
                <td style={{ padding: '14px', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
                  {vm.vCPU} vCPU • {vm.ramGB} GB RAM • {vm.diskGB} GB
                </td>
                <td style={{ padding: '14px', fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  <div>IP: {vm.ip}</div>
                  <div style={{ fontSize: '0.7rem' }}>VLAN 20 (Isolated)</div>
                </td>
                <td style={{ padding: '14px' }}>
                  <span className="badge badge-indigo" style={{ fontSize: '0.65rem' }}>
                    🛠️ Local Admin Allowed
                  </span>
                </td>
                <td style={{ padding: '14px' }}>
                  <span className={`badge ${vm.securityAgentStatus === 'PROTECTED' ? 'badge-emerald' : 'badge-rose'}`}>
                    <ShieldCheck size={12} /> {vm.securityAgentStatus}
                  </span>
                </td>
                <td style={{ padding: '14px' }}>
                  <span className={`badge ${vm.status === 'RUNNING' ? 'badge-cyan' : vm.status === 'FROZEN' ? 'badge-amber' : 'badge-rose'}`}>
                    ● {vm.status}
                  </span>
                </td>
                <td style={{ padding: '14px' }}>
                  {isAllowedToManageVM ? (
                    <div style={{ display: 'flex', gap: '6px' }}>
                      {vm.status === 'RUNNING' ? (
                        <button onClick={() => handleStatusChange(vm.id, 'FROZEN')} className="btn-secondary" title="Freeze Workspace" style={{ padding: '6px 8px' }}>
                          <Snowflake size={14} color="var(--accent-amber)" />
                        </button>
                      ) : (
                        <button onClick={() => handleStatusChange(vm.id, 'RUNNING')} className="btn-secondary" title="Start VM" style={{ padding: '6px 8px' }}>
                          <Play size={14} color="var(--accent-emerald)" />
                        </button>
                      )}
                      <button onClick={() => handleStatusChange(vm.id, 'STOPPED')} className="btn-secondary" title="Stop VM" style={{ padding: '6px 8px' }}>
                        <Square size={14} color="var(--accent-rose)" />
                      </button>
                      <button onClick={() => handleStatusChange(vm.id, 'DESTROYING')} className="btn-danger" title="Destroy Working Copy" style={{ padding: '6px 8px' }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ) : (
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Read Only</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Developer VM Admin Permissions Clarification Box */}
      <div className="glass-panel" style={{ padding: '20px', display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
        <div style={{ padding: '10px', background: 'rgba(6, 182, 212, 0.15)', borderRadius: '10px' }}>
          <ShieldCheck size={28} color="var(--accent-cyan)" />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff' }}>
            Developer VM Administrator Boundary Rules
          </h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Developers are granted <strong>Windows Local Administrator</strong> rights inside their designated DEV-VM to install compilers, configure IIS/Apache/Node, install VS Code extensions, and run local databases. However, <strong>DEVFORTRESS Security Core</strong> operates at the hypervisor & network layer — preventing developers from unblocking USB, altering firewall egress rules, disabling clipboard controls, or accessing Proxmox VE hypervisors.
          </p>
        </div>
      </div>

      {/* Provision Modal */}
      {showProvisionModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(8px)',
          zIndex: 999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div className="glass-card" style={{ width: '450px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Provision New DEV-VM</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Assigned Developer Name:</label>
              <input 
                type="text" 
                placeholder="e.g. Usman (Dev-026)"
                value={newVmDevName}
                onChange={e => setNewVmDevName(e.target.value)}
                style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid var(--border-color)', padding: '10px', borderRadius: '8px', color: '#ffffff', outline: 'none' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>vCPU Cores:</label>
                <select 
                  value={newVmCpu}
                  onChange={e => setNewVmCpu(Number(e.target.value))}
                  style={{ background: '#0f172a', border: '1px solid var(--border-color)', padding: '10px', borderRadius: '8px', color: '#ffffff' }}
                >
                  <option value={4}>4 vCPU</option>
                  <option value={8}>8 vCPU (Recommended)</option>
                  <option value={16}>16 vCPU High Perf</option>
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>RAM (GB):</label>
                <select 
                  value={newVmRam}
                  onChange={e => setNewVmRam(Number(e.target.value))}
                  style={{ background: '#0f172a', border: '1px solid var(--border-color)', padding: '10px', borderRadius: '8px', color: '#ffffff' }}
                >
                  <option value={8}>8 GB</option>
                  <option value={16}>16 GB (Standard)</option>
                  <option value={32}>32 GB Heavy Dev</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
              <button onClick={() => setShowProvisionModal(false)} className="btn-secondary">Cancel</button>
              <button onClick={() => setShowProvisionModal(false)} className="btn-primary">Provision VM</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
