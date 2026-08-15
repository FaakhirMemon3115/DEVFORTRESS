import React, { useState } from 'react';
import { useDevFortress } from '../../context/DevFortressContext';
import type { SecurityEvent } from '../../types/devfortress';
import { 
  ShieldAlert, 
  Filter, 
  Search, 
  CheckCircle2, 
  AlertTriangle, 
  Copy, 
  Usb, 
  Globe, 
  Zap 
} from 'lucide-react';

export const SentinelMonitor: React.FC = () => {
  const { securityEvents, triggerDLPViolation, resetWorkspaceLock, isWorkspaceLocked, workspaceLockReason } = useDevFortress();
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedEvent, setSelectedEvent] = useState<SecurityEvent | null>(null);

  const filteredEvents = securityEvents.filter(evt => {
    const matchesSeverity = severityFilter === 'ALL' || evt.severity === severityFilter;
    const matchesSearch = evt.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          evt.developerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          evt.workspaceCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          evt.eventType.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSeverity && matchesSearch;
  });

  const getEventIcon = (type: SecurityEvent['eventType']) => {
    switch (type) {
      case 'CLIPBOARD_BREACH': return <Copy size={16} color="var(--accent-amber)" />;
      case 'USB_ATTEMPT': return <Usb size={16} color="var(--accent-rose)" />;
      case 'EGRESS_BLOCKED': return <Globe size={16} color="var(--accent-cyan)" />;
      case 'AGENT_TAMPERING': return <Zap size={16} color="var(--accent-rose)" />;
      default: return <ShieldAlert size={16} color="var(--accent-indigo)" />;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Banner */}
      <div className="glass-card" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShieldAlert size={24} color="var(--accent-rose)" />
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>DEVFORTRESS Sentinel</h2>
            <span className="badge badge-rose">● Real-time Monitoring</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '4px' }}>
            Centralized telemetry feed for DLP breaches, USB attempts, egress violations, and agent tampering alerts.
          </p>
        </div>

        {/* Attack Simulator Quick Triggers for Security Admins */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            onClick={() => triggerDLPViolation('USB_ATTEMPT', 'Physical USB storage drive attached to Host Workstation. Blocked by Security Core.')} 
            className="btn-secondary"
            style={{ fontSize: '0.78rem' }}
          >
            <Usb size={14} /> Simulate USB Attack
          </button>
          <button 
            onClick={() => triggerDLPViolation('EGRESS_BLOCKED', 'Attempted clone to github.com via HTTPS port 443.', 'github.com')} 
            className="btn-secondary"
            style={{ fontSize: '0.78rem' }}
          >
            <Globe size={14} /> Simulate Egress Violation
          </button>
          <button 
            onClick={() => triggerDLPViolation('AGENT_TAMPERING', 'Security Core Agent service termination attempt detected inside VM.')} 
            className="btn-danger"
            style={{ fontSize: '0.78rem' }}
          >
            <Zap size={14} /> Simulate Agent Tampering
          </button>
        </div>
      </div>

      {/* Workspace Lock Banner if Active */}
      {isWorkspaceLocked && (
        <div className="glass-card glow-border-rose" style={{ padding: '16px', background: 'rgba(244, 63, 94, 0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <AlertTriangle size={24} color="#f43f5e" />
            <div>
              <strong style={{ color: '#f87171', fontSize: '0.95rem' }}>DEV-VM WORKSPACE LOCKED BY SENTINEL</strong>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Reason: {workspaceLockReason}</p>
            </div>
          </div>
          <button onClick={resetWorkspaceLock} className="btn-primary" style={{ background: '#10b981' }}>
            <CheckCircle2 size={16} /> Super Admin Reset Lock
          </button>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="glass-card" style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
        {/* Search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid var(--border-color)', padding: '8px 14px', borderRadius: '8px', flex: 1 }}>
          <Search size={16} color="var(--text-muted)" />
          <input 
            type="text"
            placeholder="Search events by developer, VM code, destination, or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ background: 'transparent', border: 'none', color: '#ffffff', width: '100%', outline: 'none', fontSize: '0.85rem' }}
          />
        </div>

        {/* Severity Filters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Filter size={16} color="var(--text-muted)" />
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Severity:</span>
          {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map(sev => (
            <button
              key={sev}
              onClick={() => setSeverityFilter(sev)}
              style={{
                background: severityFilter === sev ? 'rgba(6, 182, 212, 0.2)' : 'rgba(30, 41, 59, 0.5)',
                border: `1px solid ${severityFilter === sev ? 'var(--accent-cyan)' : 'rgba(51, 65, 85, 0.5)'}`,
                color: severityFilter === sev ? '#ffffff' : 'var(--text-secondary)',
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Main Events Table & Detail Modal Split */}
      <div style={{ display: 'grid', gridTemplateColumns: selectedEvent ? '2fr 1fr' : '1fr', gap: '20px' }}>
        {/* Events Table */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '10px' }}>Type</th>
                <th style={{ padding: '10px' }}>Severity</th>
                <th style={{ padding: '10px' }}>Developer / VM</th>
                <th style={{ padding: '10px' }}>Source IP / Device</th>
                <th style={{ padding: '10px' }}>Timestamp</th>
                <th style={{ padding: '10px' }}>Action</th>
                <th style={{ padding: '10px' }}>Details</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.map(evt => (
                <tr 
                  key={evt.id}
                  onClick={() => setSelectedEvent(evt)}
                  style={{
                    borderBottom: '1px solid rgba(30, 41, 59, 0.4)',
                    cursor: 'pointer',
                    background: selectedEvent?.id === evt.id ? 'rgba(6, 182, 212, 0.1)' : 'transparent'
                  }}
                >
                  <td style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, color: '#ffffff' }}>
                      {getEventIcon(evt.eventType)}
                      <span>{evt.eventType}</span>
                    </div>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <span className={`badge badge-${evt.severity === 'CRITICAL' ? 'rose' : evt.severity === 'HIGH' ? 'amber' : 'cyan'}`}>
                      {evt.severity}
                    </span>
                  </td>
                  <td style={{ padding: '12px', color: '#ffffff' }}>
                    {evt.developerName} <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>({evt.workspaceCode})</span>
                  </td>
                  <td style={{ padding: '12px', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    {evt.sourceIp}
                  </td>
                  <td style={{ padding: '12px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {evt.timestamp}
                  </td>
                  <td style={{ padding: '12px' }}>
                    <span className="badge badge-rose">● {evt.actionTaken}</span>
                  </td>
                  <td style={{ padding: '12px', fontSize: '0.8rem', color: 'var(--text-secondary)', maxWidth: '250px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {evt.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Selected Event Details Side Panel */}
        {selectedEvent && (
          <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Security Event Detail</h3>
              <button onClick={() => setSelectedEvent(null)} className="btn-secondary" style={{ padding: '2px 8px', fontSize: '0.75rem' }}>✕ Close</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.82rem' }}>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Event ID:</span>
                <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)', fontWeight: 600 }}>{selectedEvent.id}</div>
              </div>

              <div>
                <span style={{ color: 'var(--text-muted)' }}>Event Type:</span>
                <div style={{ fontWeight: 700, color: '#ffffff' }}>{selectedEvent.eventType}</div>
              </div>

              <div>
                <span style={{ color: 'var(--text-muted)' }}>Severity & Action:</span>
                <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                  <span className={`badge badge-${selectedEvent.severity === 'CRITICAL' ? 'rose' : 'amber'}`}>{selectedEvent.severity}</span>
                  <span className="badge badge-emerald">{selectedEvent.actionTaken}</span>
                </div>
              </div>

              <div>
                <span style={{ color: 'var(--text-muted)' }}>Full Description:</span>
                <div style={{ background: 'rgba(15, 23, 42, 0.9)', padding: '10px', borderRadius: '6px', marginTop: '4px', color: '#e2e8f0' }}>
                  {selectedEvent.details}
                </div>
              </div>

              {selectedEvent.destination && (
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Attempted Egress Destination:</span>
                  <div style={{ fontFamily: 'var(--font-mono)', color: '#f87171', background: 'rgba(244, 63, 94, 0.1)', padding: '8px', borderRadius: '6px', marginTop: '4px' }}>
                    ❌ {selectedEvent.destination}
                  </div>
                </div>
              )}

              <div>
                <span style={{ color: 'var(--text-muted)' }}>Workstation Device Certificate:</span>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  {selectedEvent.deviceId} (COMPLIANT)
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
