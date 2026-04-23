import React from 'react';
import { Fingerprint, MonitorSmartphone } from 'lucide-react';

export default function Login({ onLogin }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', padding: '1rem' }}>
      
      <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '480px', padding: '3rem', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', padding: '1rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '50%', color: 'var(--primary)', marginBottom: '1.5rem' }}>
          <Fingerprint size={48} />
        </div>
        
        <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem' }}>HLIMS Secure Access</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '3rem' }}>PESUIMSR Laundry Management Prototype</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Demo Login Buttons for Prototype ease */}
          <button 
            className="btn btn-primary" 
            onClick={() => onLogin('admin')}
            style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
          >
            Login as Nursing Superintendent
          </button>
          
          <button 
            className="btn" 
            onClick={() => onLogin('supervisor')}
            style={{ width: '100%', background: 'rgba(255,255,255,0.1)', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
          >
            Login as Operations Supervisor
          </button>

          <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid var(--glass-border)', color: 'var(--text-muted)', fontSize: '0.875rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
             <MonitorSmartphone size={16} /> Note: Ground Workers use the Mobile APK.
          </div>
        </div>

      </div>
    </div>
  );
}
