import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { fetchActiveAlerts, fetchLiveOperations, fetchSOSRequests } from '../services/db';

export default function SupervisorDashboard({ onLogout }) {
  const [alerts, setAlerts] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [sosRequests, setSosRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [alertData, sessionData, sosData] = await Promise.all([
          fetchActiveAlerts(),
          fetchLiveOperations(),
          fetchSOSRequests()
        ]);
        setAlerts(alertData || []);
        setSessions(sessionData || []);
        setSosRequests(sosData || []);
      } catch (err) {
        console.error("Dashboard Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
    const interval = setInterval(loadData, 2000);
    return () => clearInterval(interval);
  }, []);

  const totalAlerts = alerts.length + sosRequests.length;

  return (
    <DashboardLayout role="supervisor" onLogout={onLogout}>
      <div className="px-8 py-6 space-y-8">
        {/* Header Section */}
        <section className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-extrabold font-headline text-on-surface tracking-tight">System Oversight</h1>
            <p className="text-on-surface-variant mt-1">Real-time linen cycle and discrepancy monitoring.</p>
          </div>
          <div className="flex gap-3">
            <div className="px-4 py-2 rounded-lg bg-secondary-container/30 text-on-secondary-container flex items-center gap-2 border border-secondary-container">
              <span className="material-symbols-outlined text-[18px]">verified</span>
              <span className="text-xs font-bold uppercase tracking-wider">System Status: {totalAlerts > 0 ? 'Action Required' : 'Optimal'}</span>
            </div>
          </div>
        </section>

        {/* KPI Bento Grid */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border-b-4 border-primary hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-primary-container rounded-lg group-hover:bg-primary transition-colors">
                <span className="material-symbols-outlined text-primary group-hover:text-white">inventory</span>
              </div>
              <span className="text-xs font-bold text-on-surface-variant">+2.4% vs LY</span>
            </div>
            <p className="text-[3.5rem] font-extrabold font-headline text-on-surface leading-none">5,420</p>
            <p className="text-sm font-medium text-on-surface-variant mt-2">Total Linen Inventory</p>
          </div>

          <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border-b-4 border-tertiary hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-tertiary-container rounded-lg group-hover:bg-tertiary transition-colors">
                <span className="material-symbols-outlined text-white">local_shipping</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-tertiary rounded-full animate-pulse"></div>
                <span className="text-xs font-bold text-tertiary">Live</span>
              </div>
            </div>
            <p className="text-[3.5rem] font-extrabold font-headline text-on-surface leading-none">{loading ? '...' : sessions.length}</p>
            <p className="text-sm font-medium text-on-surface-variant mt-2">Active Dispatches</p>
          </div>

          <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border-b-4 border-secondary-dim hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-secondary-container rounded-lg group-hover:bg-secondary transition-colors">
                <span className="material-symbols-outlined text-on-secondary-container group-hover:text-white">assignment_return</span>
              </div>
            </div>
            <p className="text-[3.5rem] font-extrabold font-headline text-on-surface leading-none">85</p>
            <p className="text-sm font-medium text-on-surface-variant mt-2">Pending Returns</p>
          </div>

          <div className="bg-error-container/10 p-6 rounded-2xl shadow-sm border-b-4 border-error hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-error-container rounded-lg">
                <span className="material-symbols-outlined text-on-error-container">report_problem</span>
              </div>
              <span className="text-xs font-bold text-error">High Alert</span>
            </div>
            <p className="text-[3.5rem] font-extrabold font-headline text-error leading-none">{loading ? '...' : totalAlerts}</p>
            <p className="text-sm font-medium text-on-surface-variant mt-2">Discrepancies (Missing/SOS)</p>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left & Middle: Live Status and Activities */}
          <div className="lg:col-span-2 space-y-8">
            {/* Live Status Tracker */}
            <div className="bg-surface-container-low p-8 rounded-2xl">
              <h2 className="text-xl font-bold font-headline mb-6 flex items-center gap-3">
                <span className="w-2 h-6 bg-primary rounded-full"></span>
                Live Inventory Flow
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-on-surface-variant uppercase">Linen in Wards</span>
                    <span className="text-lg font-bold text-primary">68%</span>
                  </div>
                  <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: '68%' }}></div>
                  </div>
                  <div className="flex justify-between text-[10px] font-bold text-outline">
                    <span>3,680 UNITS</span>
                    <span className="text-secondary font-black">CLEAN</span>
                  </div>
                </div>

                <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-on-surface-variant uppercase">Linen with Vendor</span>
                    <span className="text-lg font-bold text-tertiary">22%</span>
                  </div>
                  <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
                    <div className="h-full bg-tertiary rounded-full" style={{ width: '22%' }}></div>
                  </div>
                  <div className="flex justify-between text-[10px] font-bold text-outline">
                    <span>1,192 UNITS</span>
                    <span className="text-tertiary font-black">PROCESSING</span>
                  </div>
                </div>

                <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-on-surface-variant uppercase">Linen in Laundry</span>
                    <span className="text-lg font-bold text-secondary">10%</span>
                  </div>
                  <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
                    <div className="h-full bg-secondary rounded-full" style={{ width: '10%' }}></div>
                  </div>
                  <div className="flex justify-between text-[10px] font-bold text-outline">
                    <span>548 UNITS</span>
                    <span className="text-secondary font-black">READY</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Operations Table */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold font-headline">Recent Operations</h2>
                <button className="text-sm font-bold text-primary hover:underline">View All Logs</button>
              </div>
              <div className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-surface-container/50">
                    <tr>
                      <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest">Session ID</th>
                      <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest">Vendor/Ward</th>
                      <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest">Date</th>
                      <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-container-low">
                    {sessions.length === 0 ? (
                      <tr><td colSpan="4" className="px-6 py-5 text-center text-on-surface-variant">No active operations.</td></tr>
                    ) : (
                      sessions.slice(0, 5).map(session => (
                        <tr key={session.id} className="hover:bg-surface-container-low/50 transition-colors">
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded bg-primary-container flex items-center justify-center">
                                <span className="material-symbols-outlined text-[18px] text-primary">outbox</span>
                              </div>
                              <span className="text-sm font-semibold">{session.id}</span>
                            </div>
                          </td>
                          <td className="px-6 py-5 text-sm text-on-surface-variant font-medium">{session.vendor}</td>
                          <td className="px-6 py-5 text-sm font-bold text-on-surface">{new Date(session.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</td>
                          <td className="px-6 py-5 text-right">
                            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-secondary-container text-on-secondary-container">{session.status}</span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column: Alerts Panel */}
          <aside className="space-y-6">
            <div className="bg-surface-container p-6 rounded-2xl h-full border border-outline-variant/10">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-black font-headline tracking-tight">System Alerts</h2>
                {totalAlerts > 0 && <span className="px-2 py-1 bg-error rounded text-[10px] font-black text-white uppercase">{totalAlerts} Active</span>}
              </div>
              <div className="space-y-4">
                
                {/* Map SOS Requests as Critical Alerts */}
                {sosRequests.map(req => (
                  <div key={`sos-${req.id}`} className="relative overflow-hidden bg-surface-container-lowest p-6 rounded-2xl shadow-xl shadow-error/5 border-l-4 border-error group cursor-pointer hover:scale-[1.02] transition-transform">
                    <div className="absolute top-0 right-0 p-3">
                      <span className="material-symbols-outlined text-error opacity-10 text-[60px] translate-x-4 -translate-y-4">priority_high</span>
                    </div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="material-symbols-outlined text-error" style={{ fontVariationSettings: "'FILL' 1" }}>error</span>
                      <span className="text-[10px] font-black text-error uppercase tracking-widest">SOS Request</span>
                    </div>
                    <h3 className="text-sm font-bold text-on-surface leading-tight mb-2">Urgent Linen Request from {req.ward}</h3>
                    <p className="text-xs text-on-surface-variant line-clamp-2">
                      Requested by {req.empName} (Floor {req.floor}, Room {req.room}). Needs: {req.requestedItems.map(i => `${i.qty}x ${i.item}`).join(', ')}.
                    </p>
                    <div className="mt-4 flex justify-end">
                      <button className="px-4 py-2 bg-error text-white rounded-lg text-xs font-bold hover:bg-error-dim transition-colors">Dispatch Now</button>
                    </div>
                  </div>
                ))}

                {/* Map Discrepancies as Warning Alerts */}
                {alerts.map(alert => (
                  <div key={`alert-${alert.id}`} className="relative overflow-hidden bg-surface-container-lowest p-6 rounded-2xl shadow-sm border-l-4 border-[#FFB300] group cursor-pointer hover:bg-surface-bright transition-colors">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="material-symbols-outlined text-[#FFB300]" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
                      <span className="text-[10px] font-black text-[#8B6E00] uppercase tracking-widest">Discrepancy</span>
                    </div>
                    <h3 className="text-sm font-bold text-on-surface leading-tight mb-1">Missing items in Dispatch {alert.dispatchId}</h3>
                    <p className="text-xs text-on-surface-variant">Due: {alert.receivedDetails.due} | Damaged: {alert.receivedDetails.damaged}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-[10px] font-medium text-outline">Action needed</span>
                      <button className="text-[10px] font-bold text-primary underline">Resolve Alert</button>
                    </div>
                  </div>
                ))}

                {totalAlerts === 0 && (
                  <p className="text-sm text-on-surface-variant text-center mt-10">No active alerts. System optimal.</p>
                )}
                
              </div>
            </div>
          </aside>
        </div>

        {/* Dashboard Footer Analytics */}
        <section className="bg-surface-container-low rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-8 border-t-2 border-white/50">
          <div className="flex flex-wrap gap-12">
            <div>
              <p className="text-[10px] font-black text-outline-variant uppercase mb-1">Sterilization Cycle</p>
              <p className="text-lg font-bold">4.2 Hours <span className="text-xs font-medium text-secondary text-right ml-1">avg.</span></p>
            </div>
            <div>
              <p className="text-[10px] font-black text-outline-variant uppercase mb-1">Replenishment</p>
              <p className="text-lg font-bold text-on-surface">98% <span className="text-xs font-medium text-secondary ml-1">met.</span></p>
            </div>
            <div>
              <p className="text-[10px] font-black text-outline-variant uppercase mb-1">Loss Ratio</p>
              <p className="text-lg font-bold text-error">0.02% <span className="text-xs font-medium text-on-surface-variant ml-1">daily.</span></p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="px-6 py-3 bg-surface-container-highest text-primary font-bold rounded-xl text-sm hover:bg-surface-container-lowest transition-all">System Summary</button>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
