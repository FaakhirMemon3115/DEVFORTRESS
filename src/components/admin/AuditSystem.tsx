import React, { useState } from 'react';
import { useDevFortress } from '../../context/DevFortressContext';
import { FileText, Search, Download, Hash } from 'lucide-react';

export const AuditSystem: React.FC = () => {
  const { auditLogs } = useDevFortress();
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredLogs = auditLogs.filter(log => 
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.workspaceId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Banner */}
      <div className="glass-card" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FileText size={24} color="var(--accent-cyan)" />
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>DEVFORTRESS Audit System</h2>
            <span className="badge badge-emerald">Immutable Ledger</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '4px' }}>
            Tamper-proof security action audit logs, admin operations & SHA-256 integrity verification records.
          </p>
        </div>

        <button onClick={() => alert('Exporting encrypted CSV audit report...')} className="btn-secondary">
          <Download size={16} /> Export Audit Report (CSV)
        </button>
      </div>

      {/* Search Input */}
      <div className="glass-card" style={{ padding: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Search size={16} color="var(--text-muted)" />
        <input 
          type="text" 
          placeholder="Filter audit logs by action, user, or workspace ID..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          style={{ background: 'transparent', border: 'none', color: '#ffffff', outline: 'none', width: '100%', fontSize: '0.85rem' }}
        />
      </div>

      {/* Table */}
      <div className="glass-card" style={{ padding: '20px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
              <th style={{ padding: '10px' }}>Audit ID</th>
              <th style={{ padding: '10px' }}>Timestamp</th>
              <th style={{ padding: '10px' }}>User / Persona</th>
              <th style={{ padding: '10px' }}>Workspace</th>
              <th style={{ padding: '10px' }}>Action Type</th>
              <th style={{ padding: '10px' }}>Source IP & Device</th>
              <th style={{ padding: '10px' }}>SHA-256 / Metadata</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map(log => (
              <tr key={log.id} style={{ borderBottom: '1px solid rgba(30, 41, 59, 0.4)' }}>
                <td style={{ padding: '12px', fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--accent-cyan)' }}>
                  {log.id}
                </td>
                <td style={{ padding: '12px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  {log.timestamp}
                </td>
                <td style={{ padding: '12px', fontWeight: 600, color: '#ffffff' }}>
                  {log.userName}
                </td>
                <td style={{ padding: '12px', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
                  {log.workspaceId}
                </td>
                <td style={{ padding: '12px' }}>
                  <span className={`badge badge-${log.severity === 'HIGH' || log.severity === 'CRITICAL' ? 'rose' : log.severity === 'MEDIUM' ? 'amber' : 'cyan'}`}>
                    {log.action}
                  </span>
                </td>
                <td style={{ padding: '12px', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  {log.sourceIp} ({log.deviceId})
                </td>
                <td style={{ padding: '12px', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  {log.hash ? (
                    <div style={{ color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Hash size={12} /> {log.hash.substring(0, 16)}...
                    </div>
                  ) : JSON.stringify(log.metadata || {})}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
