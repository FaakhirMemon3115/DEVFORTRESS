import React from 'react';
import { useDevFortress } from '../../context/DevFortressContext';
import { GitBranch, GitCommit, Lock, CheckCircle2 } from 'lucide-react';

export const InternalGitManager: React.FC = () => {
  const { repositories } = useDevFortress();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Banner */}
      <div className="glass-card" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <GitBranch size={24} color="var(--accent-cyan)" />
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>DEVFORTRESS Git Server</h2>
            <span className="badge badge-emerald">git.company.local</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '4px' }}>
            Company-hosted internal Git repository server. External GitHub, GitLab, & Bitbucket access are hard-blocked.
          </p>
        </div>

        <span className="badge badge-cyan" style={{ fontSize: '0.85rem', padding: '8px 14px' }}>
          🔒 Internal Repository Vault
        </span>
      </div>

      {/* Internal vs External Comparison Box */}
      <div className="glass-card" style={{ padding: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div className="glass-panel" style={{ padding: '16px', borderLeft: '4px solid #10b981' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <CheckCircle2 size={18} color="#10b981" />
            <strong style={{ color: '#34d399', fontSize: '0.95rem' }}>ALLOWED: Internal Company Git</strong>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
            Developer VM can freely pull, commit, and push to company-controlled repositories hosted on `git.company.local`.
          </p>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--accent-cyan)' }}>
            git clone git@git.company.local:projects/ecommerce-core.git
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '16px', borderLeft: '4px solid #f43f5e' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Lock size={18} color="#f43f5e" />
            <strong style={{ color: '#f87171', fontSize: '0.95rem' }}>DENIED: External Providers (GitHub / GitLab / SSH)</strong>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
            Outbound DNS, HTTPS (443), and SSH (22) traffic to github.com, gitlab.com, and bitbucket.org are blocked by Security Core.
          </p>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#f87171' }}>
            git clone https://github.com/external/repo ❌ (FIREWALL DENY)
          </div>
        </div>
      </div>

      {/* Repository List */}
      <div className="glass-card" style={{ padding: '20px' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '16px' }}>Company Hosted Repositories</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
              <th style={{ padding: '10px' }}>Repository Name</th>
              <th style={{ padding: '10px' }}>Associated Project</th>
              <th style={{ padding: '10px' }}>Internal Git URL</th>
              <th style={{ padding: '10px' }}>Branch</th>
              <th style={{ padding: '10px' }}>Commits</th>
              <th style={{ padding: '10px' }}>Last Activity</th>
            </tr>
          </thead>
          <tbody>
            {repositories.map(repo => (
              <tr key={repo.id} style={{ borderBottom: '1px solid rgba(30, 41, 59, 0.4)' }}>
                <td style={{ padding: '12px', fontWeight: 700, color: '#ffffff' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <GitBranch size={16} color="var(--accent-cyan)" />
                    <span>{repo.name}</span>
                  </div>
                </td>
                <td style={{ padding: '12px', color: 'var(--accent-cyan)' }}>
                  {repo.projectCode}
                </td>
                <td style={{ padding: '12px', fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  {repo.url}
                </td>
                <td style={{ padding: '12px' }}>
                  <span className="badge badge-indigo" style={{ fontSize: '0.7rem' }}>{repo.defaultBranch}</span>
                </td>
                <td style={{ padding: '12px', fontFamily: 'var(--font-mono)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <GitCommit size={14} color="var(--accent-emerald)" />
                    <span>{repo.commitsCount} commits</span>
                  </div>
                </td>
                <td style={{ padding: '12px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  {repo.lastCommit}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
