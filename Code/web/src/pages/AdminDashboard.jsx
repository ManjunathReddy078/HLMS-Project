import React, { useState, useEffect } from 'react';
import { Package, Truck, AlertTriangle, RefreshCw } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { fetchInventoryStats } from '../services/db';

export default function AdminDashboard({ onLogout }) {
  const [stats, setStats] = useState({
    total: 0,
    inCirculation: 0,
    atVendor: 0,
    damaged: 0
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await fetchInventoryStats();
      setStats(data);
      setLoading(false);
    };
    loadData();
  }, []);

  // Standard static mock for the chart structure visualization
  const weeklyDispatchData = [
    { name: 'Mon', items: 1200 },
    { name: 'Tue', items: 1900 },
    { name: 'Wed', items: 1500 },
    { name: 'Thu', items: 2100 },
    { name: 'Fri', items: 1800 },
    { name: 'Sat', items: 900 },
    { name: 'Sun', items: 700 },
  ];

  return (
    <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }} className="animate-fade-in">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
            Nursing Superintendent Dashboard
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>Master Inventory & Dispatch Analytics</p>
        </div>
        <button onClick={onLogout} className="btn glass-panel" style={{ color: 'var(--text-main)' }}>
          Logout
        </button>
      </header>

      {/* Top Value Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '1rem', background: 'rgba(2, 132, 199, 0.1)', borderRadius: '12px' }}>
            <Package color="var(--primary)" size={28} />
          </div>
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: '500' }}>Total Inventory</p>
            <h3 style={{ fontSize: '1.75rem', fontWeight: '700' }}>{loading ? '...' : stats.total.toLocaleString()}</h3>
          </div>
        </div>
        
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px' }}>
            <RefreshCw color="var(--accent)" size={28} />
          </div>
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: '500' }}>In Circulation (Wards)</p>
            <h3 style={{ fontSize: '1.75rem', fontWeight: '700' }}>{loading ? '...' : stats.inCirculation.toLocaleString()}</h3>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '1rem', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '12px' }}>
            <Truck color="var(--warning)" size={28} />
          </div>
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: '500' }}>At External Vendors</p>
            <h3 style={{ fontSize: '1.75rem', fontWeight: '700' }}>{loading ? '...' : stats.atVendor.toLocaleString()}</h3>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '12px' }}>
            <AlertTriangle color="var(--danger)" size={28} />
          </div>
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: '500' }}>Damaged / Retired</p>
            <h3 style={{ fontSize: '1.75rem', fontWeight: '700' }}>{loading ? '...' : stats.damaged.toLocaleString()}</h3>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="glass-panel" style={{ padding: '2rem', height: '400px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '2rem' }}>Weekly Dispatch Volume</h2>
        <ResponsiveContainer width="100%" height="80%">
          <LineChart data={weeklyDispatchData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
            <XAxis dataKey="name" stroke="var(--text-muted)" />
            <YAxis stroke="var(--text-muted)" />
            <Tooltip contentStyle={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-light)', borderRadius: '8px' }} />
            <Line type="monotone" dataKey="items" stroke="var(--primary)" strokeWidth={3} dot={{ r: 6 }} activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}
