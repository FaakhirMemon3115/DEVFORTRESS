import React, { useState } from 'react';
import { useDevFortress } from '../../context/DevFortressContext';
import { Project } from '../../types/devfortress';
import { 
  FolderLock, 
  Plus, 
  CheckCircle2, 
  Lock, 
  FileCode, 
  Upload, 
  Hash, 
  Layers, 
  Trash2,
  HardDrive
} from 'lucide-react';

export const VaultManager: React.FC = () => {
  const { projects, createProject, submitProject, currentRole } = useDevFortress();
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [projectName, setProjectName] = useState<string>('');
  const [projectDesc, setProjectDesc] = useState<string>('');
  const [assignedDev, setAssignedDev] = useState<string>('Ahmed (Dev-023)');
  const [techStackInput, setTechStackInput] = useState<string>('Node.js, React, PostgreSQL');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName.trim()) return;

    createProject({
      name: projectName,
      description: projectDesc,
      assignedUser: assignedDev,
      assignedUserId: 'usr-dev-new',
      assignedVm: 'DEV-VM-023',
      techStack: techStackInput.split(',').map(s => s.trim())
    });

    setShowCreateModal(false);
    setProjectName('');
    setProjectDesc('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Banner */}
      <div className="glass-card" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FolderLock size={24} color="var(--accent-cyan)" />
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>DEVFORTRESS Vault</h2>
            <span className="badge badge-indigo">Encrypted Project Storage</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '4px' }}>
            Central repository for source code packages, automated SHA-256 integrity verification & archived completed projects.
          </p>
        </div>

        {currentRole === 'SUPER_ADMIN' || currentRole === 'PROJECT_MANAGER' ? (
          <button onClick={() => setShowCreateModal(true)} className="btn-primary">
            <Plus size={16} /> Create & Upload New Project
          </button>
        ) : null}
      </div>

      {/* Lifecycle Visual Workflow */}
      <div className="glass-card" style={{ padding: '20px' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '14px', color: '#ffffff' }}>
          DEVFORTRESS Complete Project Lifecycle
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: '8px', textAlign: 'center', fontSize: '0.72rem' }}>
          {[
            { step: '1', title: 'Create Project', icon: FolderLock, active: true },
            { step: '2', title: 'Assign Developer', icon: Layers, active: true },
            { step: '3', title: 'Upload Package', icon: Upload, active: true },
            { step: '4', title: 'Provision DEV-VM', icon: HardDrive, active: true },
            { step: '5', title: 'Inject Payload', icon: FileCode, active: true },
            { step: '6', title: 'Developer Works', icon: Lock, active: true },
            { step: '7', title: 'Submit & SHA-256', icon: Hash, active: true },
            { step: '8', title: 'Destroy Working Copy', icon: Trash2, active: true }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="glass-panel" style={{ padding: '10px 6px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                <span className="badge badge-cyan" style={{ padding: '2px 6px', fontSize: '0.6rem' }}>Step {item.step}</span>
                <Icon size={16} color="var(--accent-cyan)" />
                <span style={{ fontWeight: 600, color: '#f8fafc' }}>{item.title}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Projects Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
        {projects.map(proj => (
          <div key={proj.id} className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '16px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--accent-cyan)', fontWeight: 700 }}>
                  {proj.code}
                </span>
                <span className={`badge badge-${proj.status === 'SUBMITTED' ? 'emerald' : proj.status === 'IN_PROGRESS' ? 'cyan' : 'amber'}`}>
                  ● {proj.status}
                </span>
              </div>

              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff', marginBottom: '6px' }}>
                {proj.name}
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '14px', minHeight: '36px' }}>
                {proj.description}
              </p>

              {/* Developer & VM info */}
              <div className="glass-panel" style={{ padding: '10px', fontSize: '0.78rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div><strong>Assigned Developer:</strong> {proj.assignedUser}</div>
                <div><strong>Active VM:</strong> <span style={{ fontFamily: 'var(--font-mono)' }}>{proj.assignedVm}</span></div>
                <div><strong>Files & Size:</strong> {proj.filesCount} files ({(proj.sizeBytes / 1024 / 1024).toFixed(1)} MB)</div>
              </div>

              {/* Tech Stack tags */}
              <div style={{ display: 'flex', wrap: 'wrap', gap: '6px', marginTop: '12px' }}>
                {proj.techStack.map((tech, i) => (
                  <span key={i} className="badge badge-indigo" style={{ fontSize: '0.65rem' }}>{tech}</span>
                ))}
              </div>
            </div>

            {/* Integrity Hash section if submitted */}
            {proj.integrityHash ? (
              <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '10px', borderRadius: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#34d399', fontSize: '0.75rem', fontWeight: 700 }}>
                  <CheckCircle2 size={14} />
                  <span>SHA-256 Integrity Verified</span>
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: '4px' }}>
                  {proj.integrityHash}
                </div>
              </div>
            ) : (
              <button 
                onClick={() => submitProject(proj.id)}
                className="btn-secondary" 
                style={{ width: '100%', justifyContent: 'center', fontSize: '0.8rem' }}
              >
                <Upload size={14} /> Force Admin Submit & Hash Verify
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Create Project Modal */}
      {showCreateModal && (
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
          <form onSubmit={handleCreate} className="glass-card" style={{ width: '500px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Create & Inject New Project</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Project Name:</label>
              <input 
                type="text"
                placeholder="e.g. Fintech Mobile App Backend"
                value={projectName}
                onChange={e => setProjectName(e.target.value)}
                required
                style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid var(--border-color)', padding: '10px', borderRadius: '8px', color: '#ffffff', outline: 'none' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Description:</label>
              <textarea 
                placeholder="Core architectural details and scope..."
                value={projectDesc}
                onChange={e => setProjectDesc(e.target.value)}
                style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid var(--border-color)', padding: '10px', borderRadius: '8px', color: '#ffffff', outline: 'none', height: '80px' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Assign Developer:</label>
              <select 
                value={assignedDev} 
                onChange={e => setAssignedDev(e.target.value)}
                style={{ background: '#0f172a', border: '1px solid var(--border-color)', padding: '10px', borderRadius: '8px', color: '#ffffff' }}
              >
                <option value="Ahmed (Dev-023)">Ahmed (DEV-VM-023)</option>
                <option value="Ali (Dev-024)">Ali (DEV-VM-024)</option>
                <option value="Hamza (Dev-025)">Hamza (DEV-VM-025)</option>
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Tech Stack (comma separated):</label>
              <input 
                type="text"
                value={techStackInput}
                onChange={e => setTechStackInput(e.target.value)}
                style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid var(--border-color)', padding: '10px', borderRadius: '8px', color: '#ffffff', outline: 'none' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
              <button type="button" onClick={() => setShowCreateModal(false)} className="btn-secondary">Cancel</button>
              <button type="submit" className="btn-primary">Inject into DEV-VM</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
