import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { fetchInventoryStats, fetchLiveOperations } from '../services/db';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminDashboard({ onLogout }) {
  const [stats, setStats] = useState({ total: 0, inCirculation: 0, atVendor: 0, damaged: 0 });
  const [opsLength, setOpsLength] = useState(0);
  const [weeklyDispatchData, setWeeklyDispatchData] = useState([
    { name: 'Mon', dispatches: 800 },
    { name: 'Tue', dispatches: 1200 },
    { name: 'Wed', dispatches: 900 },
    { name: 'Thu', dispatches: 400 },
    { name: 'Fri', dispatches: 1100 },
    { name: 'Sat', dispatches: 600 },
    { name: 'Sun', dispatches: 300 },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [data, ops] = await Promise.all([fetchInventoryStats(), fetchLiveOperations()]);
        setStats(data || { total: 0, inCirculation: 0, atVendor: 0, damaged: 0 });
        setOpsLength((ops || []).length);
        
        const dayIndex = new Date().getDay();
        const newChartData = [...weeklyDispatchData];
        const mapIdx = dayIndex === 0 ? 6 : dayIndex - 1; 
        newChartData[mapIdx].dispatches = ((ops || []).length * 150) + 500;
        setWeeklyDispatchData([...newChartData]);
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

  return (
    <DashboardLayout role="admin" onLogout={onLogout}>
      <div className="pt-4 pb-12 px-8">
        {/* Header */}
        <header className="mb-10">
          <h1 className="text-4xl font-headline font-extrabold text-on-surface tracking-tight">Executive Dashboard</h1>
          <p className="text-on-surface-variant text-lg">Global overview of hospital linen operations</p>
        </header>

        {/* KPI Bento Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-10">
          <div className="bg-surface-container-lowest p-8 rounded-xl shadow-[0_8px_24px_rgba(25,28,29,0.04)] flex flex-col justify-between h-40">
            <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant font-label">Total Linen</p>
            <div>
              <h3 className="text-3xl font-headline font-extrabold">{loading ? '...' : (stats?.total || 0).toLocaleString()}</h3>
              <p className="text-secondary text-xs font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">trending_up</span> +2.4% vs last month
              </p>
            </div>
          </div>

          <div className="bg-surface-container-lowest p-8 rounded-xl shadow-[0_8px_24px_rgba(25,28,29,0.04)] flex flex-col justify-between h-40">
            <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant font-label">Active Wards</p>
            <div>
              <h3 className="text-3xl font-headline font-extrabold">18</h3>
              <p className="text-on-surface-variant text-xs">Facility-wide coverage</p>
            </div>
          </div>

          <div className="bg-surface-container-lowest p-8 rounded-xl shadow-[0_8px_24px_rgba(25,28,29,0.04)] flex flex-col justify-between h-40">
            <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant font-label">Daily Dispatch</p>
            <div>
              <h3 className="text-3xl font-headline font-extrabold">{loading ? '...' : (opsLength * 150 + 500).toLocaleString()}</h3>
              <p className="text-on-surface-variant text-xs">Avg. units per 24h</p>
            </div>
          </div>

          <div className="bg-surface-container-lowest p-8 rounded-xl shadow-[0_8px_24px_rgba(25,28,29,0.04)] flex flex-col justify-between h-40">
            <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant font-label">Loss Rate</p>
            <div>
              <h3 className="text-3xl font-headline font-extrabold text-tertiary">1.4%</h3>
              <p className="text-xs font-semibold flex items-center gap-1 text-secondary">
                <span className="material-symbols-outlined text-sm">trending_down</span> ↓ 0.2% vs last week
              </p>
            </div>
          </div>

          <div className="bg-surface-container-lowest p-8 rounded-xl shadow-[0_8px_24px_rgba(25,28,29,0.04)] border-2 border-error/10 flex flex-col justify-between h-40">
            <p className="text-xs font-bold uppercase tracking-widest text-error font-label">Critical Alerts</p>
            <div>
              <h3 className="text-3xl font-headline font-extrabold text-error">{loading ? '...' : Math.floor(stats?.damaged / 100) || 3}</h3>
              <p className="text-error text-xs font-bold">Action required now</p>
            </div>
          </div>
        </section>

        {/* Main Dashboard Content Asymmetric Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Left & Center */}
          <div className="xl:col-span-2 space-y-8">
            {/* System Analytics */}
            <div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-[0_8px_24px_rgba(25,28,29,0.04)]">
              <div className="px-8 py-6 flex justify-between items-end border-b border-outline-variant/15">
                <div>
                  <h2 className="text-xl font-headline font-bold">Facility Performance Overview</h2>
                  <p className="text-sm text-on-surface-variant">Linen Movement & Efficiency Performance</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1">Efficiency Rate</p>
                  <span className="text-2xl font-headline font-black text-secondary">98.2%</span>
                </div>
              </div>

              <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="h-64 flex flex-col">
                  <p className="text-sm font-bold mb-4">Global Linen Movement Trend</p>
                  <div className="flex-grow w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={weeklyDispatchData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-surface-variant)" vertical={false} />
                        <XAxis dataKey="name" stroke="var(--color-on-surface-variant)" fontSize={10} tickLine={false} axisLine={false} />
                        <YAxis stroke="var(--color-on-surface-variant)" fontSize={10} tickLine={false} axisLine={false} />
                        <Tooltip contentStyle={{ backgroundColor: 'var(--color-surface-container-lowest)', border: 'none', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                        <Line type="monotone" dataKey="dispatches" stroke="var(--color-primary)" strokeWidth={4} dot={{ r: 4, fill: 'var(--color-primary)' }} activeDot={{ r: 6 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="h-64 flex flex-col">
                  <p className="text-sm font-bold mb-4 text-tertiary">Loss Trend (by Category)</p>
                  <div className="flex-grow flex flex-col gap-4 justify-center">
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-medium"><span>Towel Loss</span><span>42%</span></div>
                      <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
                        <div className="h-full bg-tertiary w-[42%] rounded-full"></div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-medium"><span>Bed Linens</span><span>28%</span></div>
                      <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
                        <div className="h-full bg-primary w-[28%] rounded-full"></div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-medium"><span>Gowns</span><span>15%</span></div>
                      <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
                        <div className="h-full bg-outline-variant w-[15%] rounded-full"></div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-medium"><span>Pillowcases</span><span>15%</span></div>
                      <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
                        <div className="h-full bg-outline-variant w-[15%] rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Ward Performance Table */}
            <div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-[0_8px_24px_rgba(25,28,29,0.04)]">
              <div className="px-8 py-6 border-b border-outline-variant/15">
                <h2 className="text-xl font-headline font-bold">Ward Performance Table</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-container-low">
                      <th className="px-8 py-4 text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">Facility / Ward</th>
                      <th className="px-8 py-4 text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">Inventory</th>
                      <th className="px-8 py-4 text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">Dispatch</th>
                      <th className="px-8 py-4 text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">Returns</th>
                      <th className="px-8 py-4 text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/10">
                    <tr className="hover:bg-surface-container-low transition-colors group">
                      <td className="px-8 py-5 font-bold text-sm">Intensive Care Unit (ICU)</td>
                      <td className="px-8 py-5 text-sm">4,520</td>
                      <td className="px-8 py-5 text-sm">820</td>
                      <td className="px-8 py-5 text-sm">790</td>
                      <td className="px-8 py-5">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-secondary/10 text-secondary border border-secondary/20">Optimal</span>
                      </td>
                    </tr>
                    <tr className="hover:bg-surface-container-low transition-colors group">
                      <td className="px-8 py-5 font-bold text-sm">Emergency Department</td>
                      <td className="px-8 py-5 text-sm">3,100</td>
                      <td className="px-8 py-5 text-sm">1,200</td>
                      <td className="px-8 py-5 text-sm">980</td>
                      <td className="px-8 py-5">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-tertiary/10 text-tertiary border border-tertiary/20">Risk</span>
                      </td>
                    </tr>
                    <tr className="hover:bg-surface-container-low transition-colors group">
                      <td className="px-8 py-5 font-bold text-sm">Maternity Ward</td>
                      <td className="px-8 py-5 text-sm">2,850</td>
                      <td className="px-8 py-5 text-sm">450</td>
                      <td className="px-8 py-5 text-sm">445</td>
                      <td className="px-8 py-5">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-secondary/10 text-secondary border border-secondary/20">Optimal</span>
                      </td>
                    </tr>
                    <tr className="hover:bg-surface-container-low transition-colors group">
                      <td className="px-8 py-5 font-bold text-sm">Surgical Theatre</td>
                      <td className="px-8 py-5 text-sm">1,200</td>
                      <td className="px-8 py-5 text-sm">600</td>
                      <td className="px-8 py-5 text-sm">410</td>
                      <td className="px-8 py-5">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-error/10 text-error border border-error/20">Critical</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right: Alerts, Control Panel, Audit Log */}
          <div className="space-y-8">
            {/* Critical Alert Center */}
            <div className="bg-surface-container-lowest rounded-xl shadow-[0_8px_24px_rgba(25,28,29,0.04)] overflow-hidden">
              <div className="px-6 py-4 bg-error-container/20 flex items-center justify-between">
                <h3 className="font-headline font-bold text-error flex items-center gap-2 m-0 leading-none">
                  <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>report</span>
                  Alert Center
                </h3>
                <span className="text-[10px] font-black px-2 py-1 bg-error text-on-error rounded h-fit">3 ACTIVE</span>
              </div>
              <div className="p-6 divide-y divide-outline-variant/15">
                <div className="pb-4">
                  <div className="flex justify-between mb-1">
                    <span className="text-xs font-bold text-on-surface">Inventory Shortage</span>
                    <span className="text-[10px] font-medium text-on-surface-variant">12m ago</span>
                  </div>
                  <p className="text-xs text-on-surface-variant mb-3">Surgical Theatre current stock below 15% safety threshold.</p>
                  <div className="flex gap-2">
                    <button className="flex-1 py-2 text-[11px] font-bold bg-primary text-on-primary rounded-lg">Take Action</button>
                    <button className="flex-1 py-2 text-[11px] font-bold text-on-surface-variant border border-outline-variant/30 rounded-lg">View Details</button>
                  </div>
                </div>
                <div className="py-4">
                  <div className="flex justify-between mb-1">
                    <span className="text-xs font-bold text-on-surface">Dispatch Discrepancy</span>
                    <span className="text-[10px] font-medium text-on-surface-variant">45m ago</span>
                  </div>
                  <p className="text-xs text-on-surface-variant mb-3">Unaccounted loss of 45 units in Emergency Dept transit.</p>
                  <div className="flex gap-2">
                    <button className="flex-1 py-2 text-[11px] font-bold bg-primary text-on-primary rounded-lg">Take Action</button>
                    <button className="flex-1 py-2 text-[11px] font-bold text-on-surface-variant border border-outline-variant/30 rounded-lg">View Details</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Admin Control Panel */}
            <div className="bg-surface-container-lowest rounded-xl p-6 shadow-[0_8px_24px_rgba(25,28,29,0.04)]">
              <h3 className="font-headline font-bold mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">admin_panel_settings</span>
                Control Panel
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <button className="flex flex-col items-center justify-center gap-3 p-5 rounded-xl bg-surface-container-low hover:bg-primary-fixed transition-colors border border-transparent hover:border-primary/20 group aspect-square">
                  <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary text-2xl">warning_amber</span>
                  <span className="text-[10px] font-bold text-center">Loss Threshold</span>
                </button>
                <button className="flex flex-col items-center justify-center gap-3 p-5 rounded-xl bg-surface-container-low hover:bg-primary-fixed transition-colors border border-transparent hover:border-primary/20 group aspect-square">
                  <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary text-2xl">local_shipping</span>
                  <span className="text-[10px] font-bold text-center">Manage Vendors</span>
                </button>
                <button className="flex flex-col items-center justify-center gap-3 p-5 rounded-xl bg-surface-container-low hover:bg-primary-fixed transition-colors border border-transparent hover:border-primary/20 group aspect-square">
                  <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary text-2xl">notifications_active</span>
                  <span className="text-[10px] font-bold text-center">Configure Alerts</span>
                </button>
                <button className="flex flex-col items-center justify-center gap-3 p-5 rounded-xl bg-surface-container-low hover:bg-primary-fixed transition-colors border border-transparent hover:border-primary/20 group aspect-square">
                  <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary text-2xl">tune</span>
                  <span className="text-[10px] font-bold text-center">System Config</span>
                </button>
              </div>
            </div>

            {/* Audit Log Snapshot */}
            <div className="bg-surface-container-lowest rounded-xl p-6 shadow-[0_8px_24px_rgba(25,28,29,0.04)]">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-headline font-bold">Audit Log</h3>
                <a className="text-[11px] font-bold text-primary" href="#">View Full Log</a>
              </div>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="h-8 w-8 rounded-full bg-surface-container-high flex-shrink-0 flex items-center justify-center">
                    <span className="material-symbols-outlined text-xs text-on-surface-variant">history</span>
                  </div>
                  <div>
                    <p className="text-xs font-bold">Threshold Modified</p>
                    <p className="text-[10px] text-on-surface-variant">Admin AD updated ICU loss threshold to 1.5%</p>
                    <p className="text-[10px] text-outline mt-1 uppercase font-bold">14:20 • Global System</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="h-8 w-8 rounded-full bg-surface-container-high flex-shrink-0 flex items-center justify-center">
                    <span className="material-symbols-outlined text-xs text-on-surface-variant">inventory_2</span>
                  </div>
                  <div>
                    <p className="text-xs font-bold">Bulk Order Approval</p>
                    <p className="text-[10px] text-on-surface-variant">Batch #882 approved for Maternity Ward</p>
                    <p className="text-[10px] text-outline mt-1 uppercase font-bold">11:05 • Supply Chain</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="h-8 w-8 rounded-full bg-surface-container-high flex-shrink-0 flex items-center justify-center">
                    <span className="material-symbols-outlined text-xs text-on-surface-variant">verified_user</span>
                  </div>
                  <div>
                    <p className="text-xs font-bold">New Facility Added</p>
                    <p className="text-[10px] text-on-surface-variant">North Wing Rehab connected to HLIMS Central</p>
                    <p className="text-[10px] text-outline mt-1 uppercase font-bold">09:12 • Admin Panel</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
