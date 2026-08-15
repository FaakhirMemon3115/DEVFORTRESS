import React, { useState, useEffect } from 'react';
import { useDevFortress } from '../../context/DevFortressContext';
import { 
  Terminal as TerminalIcon, 
  Code, 
  Copy, 
  Usb, 
  Globe, 
  Lock, 
  AlertTriangle, 
  Zap, 
  FileCode, 
  Send, 
  ShieldCheck
} from 'lucide-react';

export const DeveloperVMWorkspace: React.FC = () => {
  const { 
    projects, 
    dlpPolicy, 
    triggerDLPViolation, 
    submitProject, 
    isWorkspaceLocked, 
    workspaceLockReason,
    resetWorkspaceLock,
    currentRole
  } = useDevFortress();

  const [activeFile, setActiveFile] = useState<string>('src/server.ts');
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    'DEVFORTRESS Security Core Agent v3.4 initialized.',
    'Session ID: DEV-VM-023-SESS-9021',
    'Windows 11 Local Admin Privileges: ACTIVE (DEV-VM-023\\Ahmed)',
    'Network Egress Policy: ALLOW-LIST ONLY (git.company.local, registry.npmjs.org)',
    'Type "help" or click action buttons to simulate development & DLP violations.'
  ]);
  const [terminalInput, setTerminalInput] = useState<string>('');
  
  // Simulation states
  const [simulatedBrowserUrl, setSimulatedBrowserUrl] = useState<string | null>(null);
  const [simulatedModal, setSimulatedModal] = useState<{ title: string; message: string; type: 'blocked' | 'success' } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionStep, setSubmissionStep] = useState<string>('');
  const [, setSubmittedHash] = useState<string | null>(null);

  // Live timestamp for watermark
  const [currentTime, setCurrentTime] = useState<string>(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const activeProject = projects.find(p => p.assignedVm === 'DEV-VM-023') || projects[0];

  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!terminalInput.trim()) return;

    const cmd = terminalInput.trim();
    const newLogs = [...terminalLogs, `C:\\workspace\\${activeProject.name.toLowerCase().replace(/\s+/g, '-')}> ${cmd}`];

    if (cmd.startsWith('git push')) {
      if (cmd.includes('github') || cmd.includes('external')) {
        newLogs.push('❌ FATAL: Network Egress Denied by DEVFORTRESS Security Core.');
        newLogs.push('Reason: External Git provider (github.com) blocked on port 443/22.');
        triggerDLPViolation('EGRESS_BLOCKED', 'Attempted git push to external repository', 'github.com');
      } else {
        newLogs.push('✓ Pushing to git@git.company.local:projects/ecommerce-core.git');
        newLogs.push('✓ Delta compression 100% done. Everything up-to-date.');
      }
    } else if (cmd.startsWith('npm install')) {
      newLogs.push('✓ Fetching packages from approved registry: https://registry.npmjs.org');
      newLogs.push('✓ Installed 42 packages cleanly (Developer VM Admin local privileges verified).');
    } else if (cmd.startsWith('net user') || cmd.startsWith('whoami')) {
      newLogs.push('User: DEV-VM-023\\Ahmed');
      newLogs.push('Group Memberships: *Administrators, *Users');
      newLogs.push('Local Admin Privileges: YES (Inside DEV-VM)');
    } else if (cmd === 'help') {
      newLogs.push('Available commands: npm install <pkg>, git push origin main, net user, submit project');
    } else {
      newLogs.push(`Executed command '${cmd}' successfully.`);
    }

    setTerminalLogs(newLogs);
    setTerminalInput('');
  };

  const handleSimulateEgress = (url: string) => {
    setSimulatedBrowserUrl(url);
    triggerDLPViolation('EGRESS_BLOCKED', `Attempted browser navigation to blocked cloud/git URL (${url})`, url);
  };

  const handleSimulateClipboard = () => {
    setSimulatedModal({
      title: 'DLP CLIPBOARD VIOLATION INTERCEPTED',
      message: 'Ctrl+C / Ctrl+V between Host Operating System and DEV-VM is blocked by DEVFORTRESS policy. Internal VM clipboard remains functional.',
      type: 'blocked'
    });
    triggerDLPViolation('CLIPBOARD_BREACH', 'Attempted cross-boundary clipboard copy from VM to Host');
  };

  const handleSimulateUSB = () => {
    setSimulatedModal({
      title: 'USB DEVICE ACCESS DENIED',
      message: 'SanDisk Ultra 64GB USB Storage detected on host hardware. Passthrough to DEV-VM is completely blocked by DEVFORTRESS Security Core.',
      type: 'blocked'
    });
    triggerDLPViolation('USB_ATTEMPT', 'Physical USB storage device attached to host');
  };

  const handleSimulateTamper = () => {
    triggerDLPViolation('AGENT_TAMPERING', 'Process termination signal sent to DEVFORTRESS Security Core Agent service');
  };

  const handleProjectSubmitFlow = async () => {
    setIsSubmitting(true);
    setSubmissionStep('Phase 1: Freezing DEV-VM Workspace & Taking Snapshot...');
    await new Promise(r => setTimeout(r, 1200));

    setSubmissionStep('Phase 2: Verifying File Integrity & Calculating SHA-256 Hash...');
    await new Promise(r => setTimeout(r, 1500));

    setSubmissionStep('Phase 3: Transferring Package to Admin Vault Storage...');
    const result = await submitProject(activeProject.id);
    setSubmittedHash(result.hash);
    
    setSubmissionStep('Phase 4: Destroying Local DEV-VM Working Copy...');
    await new Promise(r => setTimeout(r, 1500));

    setIsSubmitting(false);
  };

  if (isWorkspaceLocked) {
    return (
      <div className="glass-card glow-border-rose" style={{ padding: '40px', textAlign: 'center', margin: '40px auto', maxWidth: '600px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
        <div style={{ padding: '20px', background: 'rgba(244, 63, 94, 0.2)', borderRadius: '50%' }}>
          <Lock size={48} color="#f43f5e" />
        </div>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f87171' }}>
          DEVFORTRESS WORKSPACE LOCKED
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          This DEV-VM session has been automatically isolated by Sentinel due to a critical security policy violation:
        </p>
        <div style={{ background: 'rgba(15, 23, 42, 0.9)', padding: '14px 20px', borderRadius: '8px', color: '#ffffff', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
          {workspaceLockReason}
        </div>
        {currentRole === 'SUPER_ADMIN' ? (
          <button onClick={resetWorkspaceLock} className="btn-primary" style={{ background: '#10b981' }}>
            Super Admin Emergency Unlock
          </button>
        ) : (
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Contact your Security Administrator to unlock this DEV-VM.
          </p>
        )}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative', minHeight: 'calc(100vh - 110px)' }}>
      
      {/* Dynamic Watermark Overlay */}
      {dlpPolicy.watermarkEnabled && (
        <div className="watermark-overlay" style={{ opacity: dlpPolicy.watermarkOpacity }}>
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="watermark-item">
              <div>CONFIDENTIAL • DEVFORTRESS</div>
              <div>Project: {activeProject.name}</div>
              <div>Dev: Ahmed (EMP-8092)</div>
              <div>VM: DEV-VM-023</div>
              <div style={{ fontSize: '0.7rem', opacity: 0.8 }}>{currentTime}</div>
            </div>
          ))}
        </div>
      )}

      {/* Scanline Effect */}
      <div className="scanline"></div>

      {/* Top DLP Attack / Violation Simulation Action Bar */}
      <div className="glass-card" style={{ padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(6, 182, 212, 0.4)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <ShieldCheck size={20} color="var(--accent-cyan)" />
          <span style={{ fontWeight: 700, fontSize: '0.88rem', color: '#ffffff' }}>
            Interactive Security & DLP Violation Simulator Bar:
          </span>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={handleSimulateClipboard} className="btn-secondary" style={{ padding: '6px 10px', fontSize: '0.75rem' }}>
            <Copy size={13} color="var(--accent-amber)" /> Test Copy/Paste Block
          </button>

          <button onClick={() => handleSimulateEgress('https://github.com/exfiltration-target')} className="btn-secondary" style={{ padding: '6px 10px', fontSize: '0.75rem' }}>
            <Globe size={13} color="var(--accent-rose)" /> Test GitHub Block
          </button>

          <button onClick={() => handleSimulateEgress('https://drive.google.com')} className="btn-secondary" style={{ padding: '6px 10px', fontSize: '0.75rem' }}>
            <Globe size={13} color="var(--accent-cyan)" /> Test Google Drive Block
          </button>

          <button onClick={handleSimulateUSB} className="btn-secondary" style={{ padding: '6px 10px', fontSize: '0.75rem' }}>
            <Usb size={13} color="var(--accent-rose)" /> Test USB Passthrough
          </button>

          <button onClick={handleSimulateTamper} className="btn-danger" style={{ padding: '6px 10px', fontSize: '0.75rem' }}>
            <Zap size={13} /> Test Agent Tamper Lock
          </button>
        </div>
      </div>

      {/* Main IDE Workspace Window */}
      <div className="glass-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(51, 65, 85, 0.9)' }}>
        
        {/* IDE Header Bar */}
        <div style={{ background: '#090d16', padding: '10px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(30, 41, 59, 0.8)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ display: 'flex', gap: '6px' }}>
              <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ef4444' }}></span>
              <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#f59e0b' }}></span>
              <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10b981' }}></span>
            </div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
              DEV-VM-023 [Windows 11 Enterprise] — {activeProject.name} ({activeProject.code})
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span className="badge badge-emerald" style={{ fontSize: '0.65rem' }}>
              🛠️ Local Admin Enabled
            </span>
            <span className="badge badge-cyan" style={{ fontSize: '0.65rem' }}>
              Git: git.company.local
            </span>
            <button 
              onClick={handleProjectSubmitFlow} 
              disabled={isSubmitting || activeProject.status === 'SUBMITTED'}
              className="btn-primary" 
              style={{ padding: '6px 14px', fontSize: '0.78rem' }}
            >
              <Send size={14} /> {activeProject.status === 'SUBMITTED' ? 'Project Submitted' : 'Submit Completed Project'}
            </button>
          </div>
        </div>

        {/* IDE Body: Sidebar + Code Editor + Terminal Split */}
        <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr 340px', flex: 1, minHeight: '480px', background: '#080c14' }}>
          
          {/* Column 1: File Explorer */}
          <div style={{ borderRight: '1px solid rgba(30, 41, 59, 0.6)', padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              PROJECT EXPLORER
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.8rem' }}>
              {[
                { name: 'src/server.ts', icon: FileCode, active: activeFile === 'src/server.ts' },
                { name: 'src/routes/api.ts', icon: FileCode, active: activeFile === 'src/routes/api.ts' },
                { name: 'src/config/db.ts', icon: FileCode, active: activeFile === 'src/config/db.ts' },
                { name: 'package.json', icon: Code, active: activeFile === 'package.json' },
                { name: '.env.local', icon: Lock, active: activeFile === '.env.local' }
              ].map(f => {
                const Icon = f.icon;
                return (
                  <button
                    key={f.name}
                    onClick={() => setActiveFile(f.name)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '6px 10px',
                      borderRadius: '6px',
                      background: f.active ? 'rgba(6, 182, 212, 0.2)' : 'transparent',
                      color: f.active ? '#ffffff' : 'var(--text-secondary)',
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.78rem'
                    }}
                  >
                    <Icon size={14} color={f.active ? 'var(--accent-cyan)' : 'var(--text-muted)'} />
                    <span>{f.name}</span>
                  </button>
                );
              })}
            </div>

            <div style={{ marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid rgba(30, 41, 59, 0.6)', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              <div>Repo: git.company.local</div>
              <div>Branch: <strong>main</strong></div>
            </div>
          </div>

          {/* Column 2: Code Editor Window */}
          <div style={{ display: 'flex', flexDirection: 'column', background: '#0a0f1d' }}>
            <div style={{ background: '#0d1322', padding: '6px 14px', borderBottom: '1px solid rgba(30, 41, 59, 0.6)', fontSize: '0.78rem', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
              {activeFile}
            </div>

            <div style={{ padding: '16px', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: '#e2e8f0', flex: 1, overflowY: 'auto', lineHeight: 1.6 }}>
              {activeFile === 'src/server.ts' && (
                <pre style={{ margin: 0 }}>
                  <span style={{ color: '#c678dd' }}>import</span> express <span style={{ color: '#c678dd' }}>from</span> <span style={{ color: '#98c379' }}>'express'</span>;{'\n'}
                  <span style={{ color: '#c678dd' }}>import</span> {'{'} SecurityGuard {'}'} <span style={{ color: '#c678dd' }}>from</span> <span style={{ color: '#98c379' }}>'@devfortress/core'</span>;{'\n\n'}
                  <span style={{ color: '#e5c07b' }}>const</span> app = express();{'\n'}
                  <span style={{ color: '#e5c07b' }}>const</span> PORT = process.env.PORT || 4000;{'\n\n'}
                  <span style={{ color: '#5c6370' }}>// Internal Company Microservice Routing</span>{'\n'}
                  app.use(express.json());{'\n'}
                  app.get(<span style={{ color: '#98c379' }}>'/api/v1/health'</span>, (req, res) ={'>'} {'{\n'}
                  {'  '}res.json({'{'} status: <span style={{ color: '#98c379' }}>'OK'</span>, workspace: <span style={{ color: '#98c379' }}>'DEV-VM-023'</span> {'}'});{'\n'}
                  {'}'});{'\n\n'}
                  app.listen(PORT, () ={'>'} {'{\n'}
                  {'  '}console.log(<span style={{ color: '#98c379' }}>`Server running on internal port ${'{'}PORT{'}'}`</span>);{'\n'}
                  {'}'});
                </pre>
              )}

              {activeFile === 'package.json' && (
                <pre style={{ margin: 0 }}>
                  {`{
  "name": "${activeProject.name.toLowerCase().replace(/\s+/g, '-')}",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "ts-node src/server.ts",
    "build": "tsc",
    "test": "jest"
  },
  "dependencies": {
    "express": "^4.18.2",
    "pg": "^8.11.0",
    "dotenv": "^16.0.3"
  }
}`}
                </pre>
              )}

              {activeFile !== 'src/server.ts' && activeFile !== 'package.json' && (
                <pre style={{ margin: 0 }}>
                  <span style={{ color: '#5c6370' }}>// {activeFile} — DEVFORTRESS Vault Protected Source File</span>{'\n'}
                  <span style={{ color: '#c678dd' }}>export const</span> config = {'{\n'}
                  {'  '}environment: <span style={{ color: '#98c379' }}>'internal-development'</span>,{'\n'}
                  {'  '}vaultId: <span style={{ color: '#98c379' }}>'VAULT-SEC-8902'</span>{'\n'}
                  {'}'};
                </pre>
              )}
            </div>
          </div>

          {/* Column 3: Terminal Emulator Window */}
          <div style={{ borderLeft: '1px solid rgba(30, 41, 59, 0.6)', background: '#05080e', padding: '12px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '10px' }}>
                <TerminalIcon size={14} color="var(--accent-cyan)" />
                <span>DEV-VM TERMINAL</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#34d399', overflowY: 'auto', maxHeight: '360px' }}>
                {terminalLogs.map((log, idx) => (
                  <div key={idx} style={{ color: log.includes('❌') || log.includes('FATAL') ? '#f87171' : log.includes('✓') ? '#34d399' : 'var(--text-secondary)' }}>
                    {log}
                  </div>
                ))}
              </div>
            </div>

            {/* Terminal Prompt Input */}
            <form onSubmit={handleTerminalSubmit} style={{ display: 'flex', alignItems: 'center', gap: '6px', borderTop: '1px solid rgba(30, 41, 59, 0.6)', paddingTop: '10px' }}>
              <span style={{ color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>$</span>
              <input 
                type="text"
                placeholder="git push, npm install..."
                value={terminalInput}
                onChange={e => setTerminalInput(e.target.value)}
                style={{ background: 'transparent', border: 'none', color: '#ffffff', outline: 'none', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', width: '100%' }}
              />
            </form>
          </div>

        </div>
      </div>

      {/* Simulated Browser Egress Block Modal */}
      {simulatedBrowserUrl && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="glass-card glow-border-rose" style={{ width: '550px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', background: '#0c121d' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Lock size={32} color="#f43f5e" />
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f87171' }}>DEVFORTRESS FIREWALL — ACCESS DENIED</h3>
                <span className="badge badge-rose" style={{ fontSize: '0.65rem' }}>Policy Rule: Default Egress Deny</span>
              </div>
            </div>

            <div style={{ background: 'rgba(244, 63, 94, 0.1)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(244, 63, 94, 0.3)' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Target Destination:</div>
              <div style={{ fontFamily: 'var(--font-mono)', color: '#ffffff', fontWeight: 700 }}>{simulatedBrowserUrl}</div>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Outgoing connection was intercepted by DEVFORTRESS Security Core. Cloud storage, personal email, and unauthorized external git providers are strictly prohibited under Company Data-Loss Prevention policy.
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => setSimulatedBrowserUrl(null)} className="btn-secondary">Close Window</button>
            </div>
          </div>
        </div>
      )}

      {/* Simulated Violation Modal */}
      {simulatedModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="glass-card" style={{ width: '500px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <AlertTriangle size={28} color="var(--accent-amber)" />
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff' }}>{simulatedModal.title}</h3>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              {simulatedModal.message}
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => setSimulatedModal(null)} className="btn-primary">Acknowledge</button>
            </div>
          </div>
        </div>
      )}

      {/* Submission & Destruction Overlay */}
      {isSubmitting && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(6, 9, 14, 0.92)', backdropFilter: 'blur(16px)', zIndex: 1000, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
          <div className="pulse-dot rose" style={{ width: '20px', height: '20px' }}></div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ffffff' }}>DEVFORTRESS PROJECT SUBMISSION IN PROGRESS</h2>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.95rem', color: 'var(--accent-cyan)' }}>
            {submissionStep}
          </div>
        </div>
      )}
    </div>
  );
};
