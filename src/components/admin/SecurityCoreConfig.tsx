import React from 'react';
import { useDevFortress } from '../../context/DevFortressContext';
import { 
  Lock, 
  Copy, 
  Usb, 
  Globe, 
  Mail, 
  Share2, 
  ShieldCheck, 
  Eye, 
  Wifi, 
  Smartphone, 
  Check, 
  X,
  Server
} from 'lucide-react';

export const SecurityCoreConfig: React.FC = () => {
  const { dlpPolicy, updateDLPPolicy, currentRole } = useDevFortress();

  const isEditable = currentRole === 'SUPER_ADMIN' || currentRole === 'SECURITY_ADMIN';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Banner */}
      <div className="glass-card" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Lock size={24} color="var(--accent-cyan)" />
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>DEVFORTRESS Security Core</h2>
            <span className="badge badge-emerald">Policy Engine Active</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '4px' }}>
            Configure kernel-level DLP rules, zero-trust network egress allow-lists, and watermark deterrence.
          </p>
        </div>

        {!isEditable && (
          <span className="badge badge-amber">🔒 Read Only - Security Admin Access Required</span>
        )}
      </div>

      {/* Policy Sections Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
        
        {/* Section 1: Clipboard Boundary Policy */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
            <Copy size={20} color="var(--accent-amber)" />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>1. Clipboard Boundary Controls</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong style={{ fontSize: '0.85rem', color: '#ffffff' }}>Host → VM Clipboard (Ctrl+C / Ctrl+V)</strong>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Prevent text/code copy from host laptop into DEV-VM</p>
              </div>
              <button 
                disabled={!isEditable}
                onClick={() => updateDLPPolicy({ clipboardHostToVm: !dlpPolicy.clipboardHostToVm })}
                className={`badge ${dlpPolicy.clipboardHostToVm ? 'badge-rose' : 'badge-emerald'}`}
                style={{ cursor: isEditable ? 'pointer' : 'default', padding: '6px 12px' }}
              >
                {dlpPolicy.clipboardHostToVm ? 'ALLOWED ❌' : 'BLOCKED ✓'}
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong style={{ fontSize: '0.85rem', color: '#ffffff' }}>VM → Host Clipboard</strong>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Prevent code exfiltration from DEV-VM to host desktop</p>
              </div>
              <button 
                disabled={!isEditable}
                onClick={() => updateDLPPolicy({ clipboardVmToHost: !dlpPolicy.clipboardVmToHost })}
                className={`badge ${dlpPolicy.clipboardVmToHost ? 'badge-rose' : 'badge-emerald'}`}
                style={{ cursor: isEditable ? 'pointer' : 'default', padding: '6px 12px' }}
              >
                {dlpPolicy.clipboardVmToHost ? 'ALLOWED ❌' : 'BLOCKED ✓'}
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong style={{ fontSize: '0.85rem', color: '#ffffff' }}>Internal VM Clipboard</strong>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Allow developer copy/paste within local VS Code & tools</p>
              </div>
              <span className="badge badge-emerald">ALLOWED ✓</span>
            </div>
          </div>
        </div>

        {/* Section 2: Hardware & Device Controls */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
            <Usb size={20} color="var(--accent-rose)" />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>2. Hardware & USB Interception</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong style={{ fontSize: '0.85rem', color: '#ffffff' }}>USB Storage / Pendrive / External HDD</strong>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Complete USB mass storage passthrough block</p>
              </div>
              <span className="badge badge-emerald">BLOCKED ✓</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong style={{ fontSize: '0.85rem', color: '#ffffff' }}>Mobile USB (Android MTP / iPhone PTP / ADB)</strong>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Block file transfer when phone connected via USB cable</p>
              </div>
              <span className="badge badge-emerald">BLOCKED ✓</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong style={{ fontSize: '0.85rem', color: '#ffffff' }}>Bluetooth File Transfer Protocol</strong>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Disable wireless file transfer channels</p>
              </div>
              <span className="badge badge-emerald">BLOCKED ✓</span>
            </div>
          </div>
        </div>

        {/* Section 3: Default DENY Egress Firewall Rules */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
            <Globe size={20} color="var(--accent-cyan)" />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>3. Zero-Trust Network Egress Policy</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ background: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.3)', padding: '10px', borderRadius: '8px', fontSize: '0.8rem', color: '#f87171' }}>
              <strong>DEFAULT INTERNET POLICY: DENY ALL OUTBOUND</strong>
            </div>

            <div>
              <strong style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Approved Allow-List Domains:</strong>
              <div style={{ display: 'flex', wrap: 'wrap', gap: '6px', marginTop: '6px' }}>
                {dlpPolicy.allowedDomains.map((domain, i) => (
                  <span key={i} className="badge badge-emerald" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem' }}>
                    ✓ {domain}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <strong style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Explicitly Blocked Categories:</strong>
              <div style={{ display: 'flex', wrap: 'wrap', gap: '6px', marginTop: '6px' }}>
                {dlpPolicy.blockedDomains.map((domain, i) => (
                  <span key={i} className="badge badge-rose" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem' }}>
                    ❌ {domain}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Dynamic Watermark & Screen Deterrence */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
            <Eye size={20} color="var(--accent-violet)" />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>4. Dynamic Screen Watermark</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong style={{ fontSize: '0.85rem', color: '#ffffff' }}>Watermark Overlay Engine</strong>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Inject floating metadata overlay on DEV-VM screen</p>
              </div>
              <button 
                disabled={!isEditable}
                onClick={() => updateDLPPolicy({ watermarkEnabled: !dlpPolicy.watermarkEnabled })}
                className={`badge ${dlpPolicy.watermarkEnabled ? 'badge-emerald' : 'badge-rose'}`}
                style={{ cursor: isEditable ? 'pointer' : 'default', padding: '6px 12px' }}
              >
                {dlpPolicy.watermarkEnabled ? 'ACTIVE ✓' : 'DISABLED ❌'}
              </button>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Watermark Opacity Level</span>
                <span style={{ fontWeight: 700, color: 'var(--accent-cyan)' }}>{Math.round(dlpPolicy.watermarkOpacity * 100)}%</span>
              </div>
              <input 
                type="range" 
                min="0.05" 
                max="0.5" 
                step="0.05"
                disabled={!isEditable}
                value={dlpPolicy.watermarkOpacity}
                onChange={e => updateDLPPolicy({ watermarkOpacity: parseFloat(e.target.value) })}
                style={{ width: '100%', cursor: 'pointer' }}
              />
            </div>

            <div className="glass-panel" style={{ padding: '10px', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>
              <div>Injected Metadata:</div>
              <div style={{ color: 'var(--accent-cyan)' }}>
                CONFIDENTIAL • [Developer Name] • [Employee ID] • [VM ID] • [Live Timestamp]
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Section 5: Network Subnets & Device Identity */}
      <div className="glass-card" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
          <Wifi size={20} color="var(--accent-cyan)" />
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>5. Location & Device Certificate Access Verification</h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div className="glass-panel" style={{ padding: '14px' }}>
            <strong style={{ fontSize: '0.85rem', color: '#ffffff' }}>Approved Subnets (Office Wi-Fi / IP Range)</strong>
            <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {dlpPolicy.ipSubnetAllowList.map((subnet, i) => (
                <div key={i} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#34d399', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Check size={14} /> {subnet} (ALLOWED)
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '14px' }}>
            <strong style={{ fontSize: '0.85rem', color: '#ffffff' }}>Device Certificate Requirement</strong>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Access requires valid Company Device Certificate installed on workstation TPM chip. Untrusted devices or outside networks are automatically locked out.
            </p>
            <div style={{ marginTop: '8px' }}>
              <span className="badge badge-emerald">DEVICE CERT MANDATORY ✓</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
