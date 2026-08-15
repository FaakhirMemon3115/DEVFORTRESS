export type Role = 
  | 'SUPER_ADMIN' 
  | 'SECURITY_ADMIN' 
  | 'PROJECT_MANAGER' 
  | 'DEVELOPER_VM_ADMIN' 
  | 'DEVELOPER';

export type ProjectStatus = 
  | 'DRAFT' 
  | 'PENDING' 
  | 'IN_PROGRESS' 
  | 'SUBMITTED' 
  | 'FROZEN' 
  | 'ARCHIVED';

export type VMStatus = 
  | 'RUNNING' 
  | 'STOPPED' 
  | 'FROZEN' 
  | 'DESTROYING' 
  | 'REBUILDING';

export type SecurityAgentStatus = 
  | 'PROTECTED' 
  | 'WARNING' 
  | 'TAMPER_ATTEMPT' 
  | 'OFFLINE';

export type SecuritySeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface Project {
  id: string;
  code: string;
  name: string;
  description: string;
  assignedUser: string;
  assignedUserId: string;
  assignedVm: string;
  status: ProjectStatus;
  startedAt: string;
  lastActivity: string;
  completedAt?: string;
  integrityHash?: string;
  filesCount: number;
  sizeBytes: number;
  techStack: string[];
}

export interface VMInstance {
  id: string;
  code: string;
  node: string;
  os: string;
  vCPU: number;
  ramGB: number;
  diskGB: number;
  assignedUser: string;
  assignedProjectId: string;
  status: VMStatus;
  ip: string;
  mac: string;
  securityAgentStatus: SecurityAgentStatus;
  clipboardPolicy: 'DISABLED' | 'INTERNAL_ONLY' | 'ENABLED';
  usbPassthrough: boolean;
  internetAccess: 'ALLOW_LIST_ONLY' | 'DENY_ALL' | 'FULL';
  windowsLocalAdminEnabled: boolean;
}

export interface SecurityEvent {
  id: string;
  timestamp: string;
  developerName: string;
  workspaceCode: string;
  eventType: 
    | 'CLIPBOARD_BREACH' 
    | 'USB_ATTEMPT' 
    | 'EGRESS_BLOCKED' 
    | 'AGENT_TAMPERING' 
    | 'UNTRUSTED_NETWORK' 
    | 'FILE_TRANSFER_ATTEMPT' 
    | 'EMAIL_BLOCKED';
  sourceIp: string;
  deviceId: string;
  destination?: string;
  actionTaken: 'BLOCKED' | 'ISOLATED' | 'LOCKED' | 'FLAGGED';
  severity: SecuritySeverity;
  details: string;
}

export interface DLPPolicy {
  clipboardHostToVm: boolean;
  clipboardVmToHost: boolean;
  internalVmClipboard: boolean;
  usbStorageBlock: boolean;
  mobileConnectionBlock: boolean;
  cloudStorageBlock: boolean;
  githubBlock: boolean;
  emailOutboundBlock: boolean;
  fileSharingBlock: boolean;
  browserUploadProtection: boolean;
  watermarkEnabled: boolean;
  watermarkOpacity: number;
  ipSubnetAllowList: string[];
  requireDeviceCertificate: boolean;
  allowedDomains: string[];
  blockedDomains: string[];
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  workspaceId: string;
  action: string;
  sourceIp: string;
  deviceId: string;
  severity: SecuritySeverity;
  hash?: string;
  metadata?: Record<string, any>;
}

export interface ProxmoxNode {
  id: string;
  name: string;
  status: 'ONLINE' | 'OFFLINE';
  cpuUsagePct: number;
  ramUsagePct: number;
  storageUsagePct: number;
  activeVMs: number;
  uptime: string;
}

export interface InternalRepository {
  id: string;
  name: string;
  projectCode: string;
  url: string;
  defaultBranch: string;
  commitsCount: number;
  lastCommit: string;
  sizeMB: number;
}
