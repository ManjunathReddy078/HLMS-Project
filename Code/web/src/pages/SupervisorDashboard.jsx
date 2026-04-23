import React, { useState, useEffect } from 'react';
import { Network, Search, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import { fetchActiveAlerts, fetchLiveOperations } from '../services/db';

export default function SupervisorDashboard({ onLogout }) {
  const [search, setSearch] = useState('');
  const [alerts, setAlerts] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const [alertData, sessionData] = await Promise.all([
        fetchActiveAlerts(),
        fetchLiveOperations()
      ]);
      setAlerts(alertData);
      setSessions(sessionData);
      setLoading(false);
    };
    loadData();
  }, []);

  const dismissAlert = (id) => {
    setAlerts(alerts.filter(a => a.id !== id));
  };

  const filteredSessions = sessions.filter(s => 
    s.id.toLowerCase().includes(search.toLowerCase()) || 
    s.vendor.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }} className="animate-fade-in">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
            Supervisor Console
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>Daily Operations & Reconciliation</p>
        </div>
        <button onClick={onLogout} className="btn glass-panel" style={{ color: 'var(--text-main)' }}>
          Logout
        </button>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '2rem' }}>
        
        {/* Discrepancies Panel */}
        <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--danger)' }}>
            <AlertCircle size={24} />
            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: 'var(--text-main)' }}>Active Alerts</h2>
          </div>
          
          {alerts.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>No active discrepancies.</p>
          ) : (
            alerts.map(alert => (
              <div key={alert.id} style={{ background: 'rgba(239, 68, 68, 0.05)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                <p style={{ fontWeight: '600', marginBottom: '0.25rem', color: 'var(--danger)' }}>Missing Items: Session {alert.session}</p>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>{alert.text}</p>
                <button 
                  onClick={() => dismissAlert(alert.id)}
                  style={{ background: 'transparent', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <CheckCircle size={14} /> Resolve Alert
                </button>
              </div>
            ))
          )}
        </div>

        {/* Live Tracking Panel */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '600' }}>Live Operations</h2>
            <div style={{ position: 'relative' }}>
              <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
              <input 
                type="text" 
                placeholder="Search Session or Vendor..." 
                className="input-field" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ paddingLeft: '40px', width: '300px' }} 
              />
            </div>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-light)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '1rem 0' }}>Session ID</th>
                <th style={{ padding: '1rem 0' }}>Type</th>
                <th style={{ padding: '1rem 0' }}>Vendor</th>
                <th style={{ padding: '1rem 0' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredSessions.length === 0 ? (
                 <tr><td colSpan="4" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No sessions found.</td></tr>
              ) : (
                filteredSessions.map((session, i) => (
                  <tr key={i}>
                    <td style={{ padding: '1.2rem 0', borderBottom: '1px solid var(--border-light)', fontWeight: '500' }}>{session.id}</td>
                    <td style={{ padding: '1.2rem 0', borderBottom: '1px solid var(--border-light)' }}>{session.type}</td>
                    <td style={{ padding: '1.2rem 0', borderBottom: '1px solid var(--border-light)' }}>{session.vendor}</td>
                    <td style={{ padding: '1.2rem 0', borderBottom: '1px solid var(--border-light)' }}>
                      <span style={{ 
                        padding: '4px 8px', 
                        background: session.status === 'Reconciled' ? 'var(--accent)' : session.status === 'In Transit' ? 'var(--warning)' : 'var(--primary)', 
                        color: 'white', 
                        borderRadius: '4px', 
                        fontSize: '0.875rem' 
                      }}>
                        {session.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
