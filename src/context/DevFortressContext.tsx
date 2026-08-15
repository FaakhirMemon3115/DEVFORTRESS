import React, { createContext, useContext, useState } from 'react';
import { 
  Role, 
  Project, 
  VMInstance, 
  SecurityEvent, 
  DLPPolicy, 
  AuditLog, 
  ProxmoxNode, 
  InternalRepository 
} from '../types/devfortress';

interface DevFortressContextType {
  currentRole: Role;
  setCurrentRole: (role: Role) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  
  projects: Project[];
  vms: VMInstance[];
  securityEvents: SecurityEvent[];
  dlpPolicy: DLPPolicy;
  auditLogs: AuditLog[];
  nodes: ProxmoxNode[];
  repositories: InternalRepository[];

  // Workspace simulation states
  activeVmCode: string;
  isWorkspaceLocked: boolean;
  workspaceLockReason: string | null;

  // Actions
  triggerDLPViolation: (
    type: SecurityEvent['eventType'], 
    details: string, 
    destination?: string
  ) => void;
  submitProject: (projectId: string) => Promise<{ success: boolean; hash: string }>;
  createProject: (newProject: Omit<Project, 'id' | 'code' | 'status' | 'startedAt' | 'lastActivity' | 'filesCount' | 'sizeBytes'>) => void;
  updateDLPPolicy: (updates: Partial<DLPPolicy>) => void;
  updateVMStatus: (vmId: string, status: VMInstance['status']) => void;
  resetWorkspaceLock: () => void;
  addAuditLog: (action: string, severity?: AuditLog['severity'], metadata?: Record<string, any>) => void;
}

const initialProjects: Project[] = [
  {
    id: 'proj-1',
    code: 'PROJECT #10045',
    name: 'E-Commerce Application',
    description: 'High-volume secure payment gateway and shopping portal backend',
    assignedUser: 'Ahmed (Dev-023)',
    assignedUserId: 'usr-ahmed-101',
    assignedVm: 'DEV-VM-023',
    status: 'IN_PROGRESS',
    startedAt: '15 Aug 2026 08:00 AM',
    lastActivity: '15 Aug 2026 02:45 PM',
    filesCount: 342,
    sizeBytes: 45892100,
    techStack: ['Node.js', 'TypeScript', 'PostgreSQL', 'React']
  },
  {
    id: 'proj-2',
    code: 'PROJECT #10046',
    name: 'Banking API Gateway',
    description: 'Core microservice for zero-trust token authentication',
    assignedUser: 'Ali (Dev-024)',
    assignedUserId: 'usr-ali-102',
    assignedVm: 'DEV-VM-024',
    status: 'IN_PROGRESS',
    startedAt: '12 Aug 2026 09:30 AM',
    lastActivity: '15 Aug 2026 01:10 PM',
    filesCount: 184,
    sizeBytes: 28400100,
    techStack: ['Python', 'FastAPI', 'Redis', 'Docker']
  },
  {
    id: 'proj-3',
    code: 'PROJECT #10047',
    name: 'Healthcare Patient Portal',
    description: 'HIPAA compliant medical record management engine',
    assignedUser: 'Hamza (Dev-025)',
    assignedUserId: 'usr-hamza-103',
    assignedVm: 'DEV-VM-025',
    status: 'SUBMITTED',
    startedAt: '01 Aug 2026 10:00 AM',
    lastActivity: '14 Aug 2026 06:20 PM',
    completedAt: '14 Aug 2026 06:20 PM',
    integrityHash: 'a8f72d99c43b8110ef7e8a9012cd33b45fe6712398401aa92e887cc14299b801',
    filesCount: 512,
    sizeBytes: 98120300,
    techStack: ['Flutter', 'Android', 'Node.js', 'SQL Server']
  }
];

const initialVMs: VMInstance[] = [
  {
    id: 'vm-1',
    code: 'DEV-VM-023',
    node: 'pve-node-01',
    os: 'Windows 11 Enterprise (Security Hardened)',
    vCPU: 8,
    ramGB: 16,
    diskGB: 100,
    assignedUser: 'Ahmed (Dev-023)',
    assignedProjectId: 'proj-1',
    status: 'RUNNING',
    ip: '10.20.10.42',
    mac: 'BC:24:11:88:99:A1',
    securityAgentStatus: 'PROTECTED',
    clipboardPolicy: 'DISABLED',
    usbPassthrough: false,
    internetAccess: 'ALLOW_LIST_ONLY',
    windowsLocalAdminEnabled: true
  },
  {
    id: 'vm-2',
    code: 'DEV-VM-024',
    node: 'pve-node-01',
    os: 'Windows 11 Enterprise (Security Hardened)',
    vCPU: 8,
    ramGB: 16,
    diskGB: 100,
    assignedUser: 'Ali (Dev-024)',
    assignedProjectId: 'proj-2',
    status: 'RUNNING',
    ip: '10.20.10.43',
    mac: 'BC:24:11:88:99:A2',
    securityAgentStatus: 'PROTECTED',
    clipboardPolicy: 'DISABLED',
    usbPassthrough: false,
    internetAccess: 'ALLOW_LIST_ONLY',
    windowsLocalAdminEnabled: true
  },
  {
    id: 'vm-3',
    code: 'DEV-VM-025',
    node: 'pve-node-02',
    os: 'Windows 11 Enterprise (Security Hardened)',
    vCPU: 16,
    ramGB: 32,
    diskGB: 150,
    assignedUser: 'Hamza (Dev-025)',
    assignedProjectId: 'proj-3',
    status: 'FROZEN',
    ip: '10.20.10.44',
    mac: 'BC:24:11:88:99:A3',
    securityAgentStatus: 'PROTECTED',
    clipboardPolicy: 'DISABLED',
    usbPassthrough: false,
    internetAccess: 'ALLOW_LIST_ONLY',
    windowsLocalAdminEnabled: true
  }
];

const initialEvents: SecurityEvent[] = [
  {
    id: 'evt-101',
    timestamp: '15 Aug 2026 02:42:14',
    developerName: 'Ahmed',
    workspaceCode: 'DEV-VM-023',
    eventType: 'EGRESS_BLOCKED',
    sourceIp: '10.20.10.42',
    deviceId: 'WORKSTATION-CORP-902',
    destination: 'github.com/external-repo/clone',
    actionTaken: 'BLOCKED',
    severity: 'HIGH',
    details: 'Attempted HTTPS outgoing connection to unauthorized external Git provider (github.com)'
  },
  {
    id: 'evt-102',
    timestamp: '15 Aug 2026 02:30:05',
    developerName: 'Ahmed',
    workspaceCode: 'DEV-VM-023',
    eventType: 'USB_ATTEMPT',
    sourceIp: '10.20.10.42',
    deviceId: 'WORKSTATION-CORP-902',
    actionTaken: 'BLOCKED',
    severity: 'CRITICAL',
    details: 'Physical USB Storage Device (SanDisk Ultra 64GB) attached to host. Passthrough denied.'
  },
  {
    id: 'evt-103',
    timestamp: '15 Aug 2026 01:15:22',
    developerName: 'Ali',
    workspaceCode: 'DEV-VM-024',
    eventType: 'CLIPBOARD_BREACH',
    sourceIp: '10.20.10.43',
    deviceId: 'WORKSTATION-CORP-905',
    actionTaken: 'BLOCKED',
    severity: 'MEDIUM',
    details: 'Ctrl+C / Ctrl+V cross-boundary copy request from DEV-VM-024 to Host OS intercepted'
  }
];

const initialPolicy: DLPPolicy = {
  clipboardHostToVm: false,
  clipboardVmToHost: false,
  internalVmClipboard: true,
  usbStorageBlock: true,
  mobileConnectionBlock: true,
  cloudStorageBlock: true,
  githubBlock: true,
  emailOutboundBlock: true,
  fileSharingBlock: true,
  browserUploadProtection: true,
  watermarkEnabled: true,
  watermarkOpacity: 0.18,
  ipSubnetAllowList: ['10.20.0.0/16', '192.168.50.0/24 (VPN Subnet)'],
  requireDeviceCertificate: true,
  allowedDomains: [
    'registry.npmjs.org',
    'api.nuget.org',
    'repo.maven.apache.org',
    'pub.dev',
    'git.company.local',
    'auth.company.local',
    'packages.company.local'
  ],
  blockedDomains: [
    'github.com',
    'gitlab.com',
    'bitbucket.org',
    'drive.google.com',
    'photos.google.com',
    'onedrive.live.com',
    'dropbox.com',
    'wetransfer.com',
    'airforshare.com',
    'mail.google.com',
    'outlook.live.com'
  ]
};

const initialAuditLogs: AuditLog[] = [
  {
    id: 'aud-901',
    timestamp: '15 Aug 2026 08:00:00',
    userId: 'usr-admin-01',
    userName: 'Super Admin',
    workspaceId: 'DEV-VM-023',
    action: 'PROVISION_DEV_VM',
    sourceIp: '10.20.1.10',
    deviceId: 'ADMIN-TERM-01',
    severity: 'LOW',
    metadata: { vCPU: 8, RAM: '16GB', disk: '100GB', os: 'Win11Ent' }
  },
  {
    id: 'aud-902',
    timestamp: '15 Aug 2026 08:05:12',
    userId: 'usr-admin-01',
    userName: 'Super Admin',
    workspaceId: 'DEV-VM-023',
    action: 'INJECT_PROJECT_PAYLOAD',
    sourceIp: '10.20.1.10',
    deviceId: 'ADMIN-TERM-01',
    severity: 'MEDIUM',
    hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    metadata: { projectCode: 'PROJECT #10045' }
  }
];

const initialNodes: ProxmoxNode[] = [
  {
    id: 'node-1',
    name: 'pve-node-01.company.local',
    status: 'ONLINE',
    cpuUsagePct: 34.2,
    ramUsagePct: 62.8,
    storageUsagePct: 48.1,
    activeVMs: 8,
    uptime: '42 days, 14 hours'
  },
  {
    id: 'node-2',
    name: 'pve-node-02.company.local',
    status: 'ONLINE',
    cpuUsagePct: 22.5,
    ramUsagePct: 41.0,
    storageUsagePct: 35.6,
    activeVMs: 5,
    uptime: '18 days, 06 hours'
  }
];

const initialRepos: InternalRepository[] = [
  {
    id: 'repo-1',
    name: 'ecommerce-core',
    projectCode: 'PROJECT #10045',
    url: 'git@git.company.local:projects/ecommerce-core.git',
    defaultBranch: 'main',
    commitsCount: 142,
    lastCommit: '15 Aug 2026 02:44 PM (Ahmed)',
    sizeMB: 48.5
  },
  {
    id: 'repo-2',
    name: 'banking-auth-service',
    projectCode: 'PROJECT #10046',
    url: 'git@git.company.local:projects/banking-auth-service.git',
    defaultBranch: 'main',
    commitsCount: 89,
    lastCommit: '15 Aug 2026 01:08 PM (Ali)',
    sizeMB: 24.1
  }
];

const DevFortressContext = createContext<DevFortressContextType | undefined>(undefined);

export const DevFortressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<Role>('SUPER_ADMIN');
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [vms, setVMs] = useState<VMInstance[]>(initialVMs);
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>(initialEvents);
  const [dlpPolicy, setDlpPolicy] = useState<DLPPolicy>(initialPolicy);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(initialAuditLogs);
  const [nodes] = useState<ProxmoxNode[]>(initialNodes);
  const [repositories] = useState<InternalRepository[]>(initialRepos);

  const [activeVmCode] = useState<string>('DEV-VM-023');
  const [isWorkspaceLocked, setIsWorkspaceLocked] = useState<boolean>(false);
  const [workspaceLockReason, setWorkspaceLockReason] = useState<string | null>(null);

  const addAuditLog = (action: string, severity: AuditLog['severity'] = 'LOW', metadata?: Record<string, any>) => {
    const newLog: AuditLog = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ' ' + new Date().toLocaleTimeString(),
      userId: currentRole === 'DEVELOPER' || currentRole === 'DEVELOPER_VM_ADMIN' ? 'usr-ahmed-101' : 'usr-admin-01',
      userName: currentRole,
      workspaceId: activeVmCode,
      action,
      sourceIp: '10.20.10.42',
      deviceId: 'WORKSTATION-CORP-902',
      severity,
      metadata
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const triggerDLPViolation = (
    type: SecurityEvent['eventType'], 
    details: string, 
    destination?: string
  ) => {
    const severityMap: Record<SecurityEvent['eventType'], SecurityEvent['severity']> = {
      CLIPBOARD_BREACH: 'MEDIUM',
      USB_ATTEMPT: 'CRITICAL',
      EGRESS_BLOCKED: 'HIGH',
      AGENT_TAMPERING: 'CRITICAL',
      UNTRUSTED_NETWORK: 'CRITICAL',
      FILE_TRANSFER_ATTEMPT: 'HIGH',
      EMAIL_BLOCKED: 'HIGH'
    };

    const actionMap: Record<SecurityEvent['eventType'], SecurityEvent['actionTaken']> = {
      CLIPBOARD_BREACH: 'BLOCKED',
      USB_ATTEMPT: 'BLOCKED',
      EGRESS_BLOCKED: 'BLOCKED',
      AGENT_TAMPERING: 'LOCKED',
      UNTRUSTED_NETWORK: 'ISOLATED',
      FILE_TRANSFER_ATTEMPT: 'BLOCKED',
      EMAIL_BLOCKED: 'BLOCKED'
    };

    const newEvent: SecurityEvent = {
      id: `evt-${Date.now()}`,
      timestamp: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ' ' + new Date().toLocaleTimeString(),
      developerName: 'Ahmed',
      workspaceCode: activeVmCode,
      eventType: type,
      sourceIp: '10.20.10.42',
      deviceId: 'WORKSTATION-CORP-902',
      destination,
      actionTaken: actionMap[type],
      severity: severityMap[type],
      details
    };

    setSecurityEvents(prev => [newEvent, ...prev]);
    addAuditLog(`SECURITY_VIOLATION_INTERCEPTED: ${type}`, severityMap[type], { details, destination });

    if (type === 'AGENT_TAMPERING' || type === 'UNTRUSTED_NETWORK') {
      setIsWorkspaceLocked(true);
      setWorkspaceLockReason(details);
      setVMs(prev => prev.map(vm => vm.code === activeVmCode ? { ...vm, securityAgentStatus: 'TAMPER_ATTEMPT', status: 'FROZEN' } : vm));
    }
  };

  const submitProject = async (projectId: string): Promise<{ success: boolean; hash: string }> => {
    // Generate simulated SHA-256 hash
    const generatedHash = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');

    setProjects(prev => prev.map(p => p.id === projectId ? {
      ...p,
      status: 'SUBMITTED',
      completedAt: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ' ' + new Date().toLocaleTimeString(),
      integrityHash: generatedHash
    } : p));

    setVMs(prev => prev.map(vm => vm.assignedProjectId === projectId ? {
      ...vm,
      status: 'FROZEN',
      securityAgentStatus: 'PROTECTED'
    } : vm));

    addAuditLog(`PROJECT_SUBMITTED_HASH_VERIFIED`, 'HIGH', { projectId, generatedHash });

    return { success: true, hash: generatedHash };
  };

  const createProject = (newProject: Omit<Project, 'id' | 'code' | 'status' | 'startedAt' | 'lastActivity' | 'filesCount' | 'sizeBytes'>) => {
    const nextCodeNum = 10048 + projects.length;
    const project: Project = {
      ...newProject,
      id: `proj-${Date.now()}`,
      code: `PROJECT #${nextCodeNum}`,
      status: 'PENDING',
      startedAt: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ' ' + new Date().toLocaleTimeString(),
      lastActivity: 'Just now',
      filesCount: Math.floor(Math.random() * 200) + 50,
      sizeBytes: Math.floor(Math.random() * 50000000) + 10000000
    };

    setProjects(prev => [project, ...prev]);
    addAuditLog(`CREATE_PROJECT: ${project.code}`, 'MEDIUM', { name: project.name });
  };

  const updateDLPPolicy = (updates: Partial<DLPPolicy>) => {
    setDlpPolicy(prev => ({ ...prev, ...updates }));
    addAuditLog('UPDATE_DLP_POLICY', 'HIGH', updates);
  };

  const updateVMStatus = (vmId: string, status: VMInstance['status']) => {
    setVMs(prev => prev.map(vm => vm.id === vmId ? { ...vm, status } : vm));
    addAuditLog(`UPDATE_VM_STATUS: ${vmId} -> ${status}`, 'MEDIUM');
  };

  const resetWorkspaceLock = () => {
    setIsWorkspaceLocked(false);
    setWorkspaceLockReason(null);
    setVMs(prev => prev.map(vm => vm.code === activeVmCode ? { ...vm, securityAgentStatus: 'PROTECTED', status: 'RUNNING' } : vm));
    addAuditLog('SUPER_ADMIN_RESET_WORKSPACE_LOCK', 'HIGH');
  };

  return (
    <DevFortressContext.Provider value={{
      currentRole,
      setCurrentRole,
      activeTab,
      setActiveTab,
      projects,
      vms,
      securityEvents,
      dlpPolicy,
      auditLogs,
      nodes,
      repositories,
      activeVmCode,
      isWorkspaceLocked,
      workspaceLockReason,
      triggerDLPViolation,
      submitProject,
      createProject,
      updateDLPPolicy,
      updateVMStatus,
      resetWorkspaceLock,
      addAuditLog
    }}>
      {children}
    </DevFortressContext.Provider>
  );
};

export const useDevFortress = () => {
  const context = useContext(DevFortressContext);
  if (!context) {
    throw new Error('useDevFortress must be used within a DevFortressProvider');
  }
  return context;
};
