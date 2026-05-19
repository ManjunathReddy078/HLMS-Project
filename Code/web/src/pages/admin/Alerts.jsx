import React from 'react';
import DashboardLayout from '../../components/DashboardLayout';

export default function Alerts({ onLogout }) {
  return (
    <DashboardLayout role="admin" onLogout={onLogout}>
      <div className="p-8 space-y-8 max-w-[1600px] animate-fade-in">
        {/* Page Header Section */}
        <div className="flex flex-col md:flex-row justify-between md:items-end gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-on-surface font-headline tracking-tight">Alerts & Notifications</h1>
            <p className="text-on-surface-variant mt-1 font-medium font-body">Monitor system alerts, risks, and operational issues</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant hidden md:block">Filter by</span>
            <select className="bg-surface-container-lowest border-none shadow-sm rounded-lg text-sm font-semibold py-2.5 px-4 focus:ring-2 focus:ring-primary/10 cursor-pointer w-full md:w-auto">
              <option>All Alerts</option>
              <option>Critical</option>
              <option>Warning</option>
              <option>Informational</option>
            </select>
          </div>
        </div>

        {/* Summary Cards Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-surface-container-lowest p-8 rounded-xl shadow-sm transition-all hover:translate-y-[-2px]">
            <div className="flex justify-between items-start mb-4">
              <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>notifications_active</span>
              <span className="text-[10px] font-bold uppercase tracking-tighter text-on-surface-variant bg-surface-container px-2 py-1 rounded">Total</span>
            </div>
            <p className="text-4xl font-extrabold font-headline text-primary mb-1">24</p>
            <p className="text-sm font-semibold text-on-surface-variant">Active Alerts</p>
          </div>
          <div className="bg-surface-container-lowest p-8 rounded-xl shadow-sm transition-all hover:translate-y-[-2px]">
            <div className="flex justify-between items-start mb-4">
              <span className="material-symbols-outlined text-error" style={{ fontVariationSettings: "'FILL' 1" }}>priority_high</span>
              <span className="text-[10px] font-bold uppercase tracking-tighter text-error bg-error-container px-2 py-1 rounded">Critical</span>
            </div>
            <p className="text-4xl font-extrabold font-headline text-error mb-1">5</p>
            <p className="text-sm font-semibold text-on-surface-variant">High Priority</p>
          </div>
          <div className="bg-surface-container-lowest p-8 rounded-xl shadow-sm transition-all hover:translate-y-[-2px]">
            <div className="flex justify-between items-start mb-4">
              <span className="material-symbols-outlined text-tertiary">warning</span>
              <span className="text-[10px] font-bold uppercase tracking-tighter text-tertiary bg-tertiary-fixed px-2 py-1 rounded">Warnings</span>
            </div>
            <p className="text-4xl font-extrabold font-headline text-tertiary mb-1">12</p>
            <p className="text-sm font-semibold text-on-surface-variant">Needs Attention</p>
          </div>
          <div className="bg-surface-container-lowest p-8 rounded-xl shadow-sm transition-all hover:translate-y-[-2px]">
            <div className="flex justify-between items-start mb-4">
              <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>task_alt</span>
              <span className="text-[10px] font-bold uppercase tracking-tighter text-secondary bg-secondary-container px-2 py-1 rounded">Healthy</span>
            </div>
            <p className="text-4xl font-extrabold font-headline text-secondary mb-1">7</p>
            <p className="text-sm font-semibold text-on-surface-variant">Resolved Today</p>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Table Section (2/3 width) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm">
              <div className="px-8 py-6 flex justify-between items-center bg-surface-container-low/50">
                <h2 className="font-bold font-headline text-lg">Active System Monitoring</h2>
                <button className="text-primary text-sm font-bold flex items-center gap-1 hover:underline">
                  <span className="material-symbols-outlined text-lg">download</span>
                  Export Log
                </button>
              </div>
              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="text-[10px] uppercase tracking-widest text-on-surface-variant bg-surface-container-low/30 border-b border-outline-variant/10">
                      <th className="px-8 py-4 font-bold">Alert ID</th>
                      <th className="px-4 py-4 font-bold">Alert Type</th>
                      <th className="px-4 py-4 font-bold">Location</th>
                      <th className="px-4 py-4 font-bold text-center">Severity</th>
                      <th className="px-4 py-4 font-bold">Time</th>
                      <th className="px-8 py-4 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/10">
                    <tr className="hover:bg-surface-container-low/20 transition-colors group">
                      <td className="px-8 py-5 text-sm font-bold text-primary">AL-2041</td>
                      <td className="px-4 py-5 text-sm font-semibold">Inventory Shortage</td>
                      <td className="px-4 py-5 text-sm text-on-surface-variant">ICU</td>
                      <td className="px-4 py-5 text-center">
                        <span className="inline-block w-2.5 h-2.5 rounded-full bg-error mr-2"></span>
                        <span className="text-xs font-bold text-error uppercase">Critical</span>
                      </td>
                      <td className="px-4 py-5 text-sm text-on-surface-variant">10 mins ago</td>
                      <td className="px-8 py-5 text-right space-x-2">
                        <button className="text-[11px] font-bold bg-primary/5 text-primary px-3 py-1.5 rounded hover:bg-primary hover:text-white transition-all">VIEW</button>
                        <button className="text-[11px] font-bold bg-error/10 text-error px-3 py-1.5 rounded hover:bg-error hover:text-white transition-all">RESOLVE</button>
                      </td>
                    </tr>
                    <tr className="hover:bg-surface-container-low/20 transition-colors group">
                      <td className="px-8 py-5 text-sm font-bold text-primary">AL-2038</td>
                      <td className="px-4 py-5 text-sm font-semibold">Dispatch Mismatch</td>
                      <td className="px-4 py-5 text-sm text-on-surface-variant">Emergency Dept</td>
                      <td className="px-4 py-5 text-center">
                        <span className="inline-block w-2.5 h-2.5 rounded-full bg-tertiary mr-2"></span>
                        <span className="text-xs font-bold text-tertiary uppercase">Warning</span>
                      </td>
                      <td className="px-4 py-5 text-sm text-on-surface-variant">25 mins ago</td>
                      <td className="px-8 py-5 text-right space-x-2">
                        <button className="text-[11px] font-bold bg-primary/5 text-primary px-3 py-1.5 rounded hover:bg-primary hover:text-white transition-all">VIEW</button>
                        <button className="text-[11px] font-bold bg-tertiary/10 text-tertiary px-3 py-1.5 rounded hover:bg-tertiary hover:text-white transition-all">RESOLVE</button>
                      </td>
                    </tr>
                    <tr className="hover:bg-surface-container-low/20 transition-colors group">
                      <td className="px-8 py-5 text-sm font-bold text-primary">AL-2035</td>
                      <td className="px-4 py-5 text-sm font-semibold">Laundry Delay</td>
                      <td className="px-4 py-5 text-sm text-on-surface-variant">External Vendor</td>
                      <td className="px-4 py-5 text-center">
                        <span className="inline-block w-2.5 h-2.5 rounded-full bg-tertiary mr-2"></span>
                        <span className="text-xs font-bold text-tertiary uppercase">Warning</span>
                      </td>
                      <td className="px-4 py-5 text-sm text-on-surface-variant">1 hr ago</td>
                      <td className="px-8 py-5 text-right space-x-2">
                        <button className="text-[11px] font-bold bg-primary/5 text-primary px-3 py-1.5 rounded hover:bg-primary hover:text-white transition-all">VIEW</button>
                        <button className="text-[11px] font-bold bg-tertiary/10 text-tertiary px-3 py-1.5 rounded hover:bg-tertiary hover:text-white transition-all">RESOLVE</button>
                      </td>
                    </tr>
                    <tr className="hover:bg-surface-container-low/20 transition-colors group">
                      <td className="px-8 py-5 text-sm font-bold text-primary">AL-2032</td>
                      <td className="px-4 py-5 text-sm font-semibold">System Sync Issue</td>
                      <td className="px-4 py-5 text-sm text-on-surface-variant">Main Server</td>
                      <td className="px-4 py-5 text-center">
                        <span className="inline-block w-2.5 h-2.5 rounded-full bg-primary-container mr-2"></span>
                        <span className="text-xs font-bold text-primary-container uppercase">Info</span>
                      </td>
                      <td className="px-4 py-5 text-sm text-on-surface-variant">2 hrs ago</td>
                      <td className="px-8 py-5 text-right space-x-2">
                        <button className="text-[11px] font-bold bg-primary/5 text-primary px-3 py-1.5 rounded hover:bg-primary hover:text-white transition-all">VIEW</button>
                        <button className="text-[11px] font-bold bg-primary-container/20 text-primary-container px-3 py-1.5 rounded hover:bg-primary-container hover:text-white transition-all">ACK</button>
                      </td>
                    </tr>
                    <tr className="hover:bg-surface-container-low/20 transition-colors group">
                      <td className="px-8 py-5 text-sm font-bold text-primary">AL-2029</td>
                      <td className="px-4 py-5 text-sm font-semibold">Buffer Stock Low</td>
                      <td className="px-4 py-5 text-sm text-on-surface-variant">Pediatrics</td>
                      <td className="px-4 py-5 text-center">
                        <span className="inline-block w-2.5 h-2.5 rounded-full bg-tertiary mr-2"></span>
                        <span className="text-xs font-bold text-tertiary uppercase">Warning</span>
                      </td>
                      <td className="px-4 py-5 text-sm text-on-surface-variant">4 hrs ago</td>
                      <td className="px-8 py-5 text-right space-x-2">
                        <button className="text-[11px] font-bold bg-primary/5 text-primary px-3 py-1.5 rounded hover:bg-primary hover:text-white transition-all">VIEW</button>
                        <button className="text-[11px] font-bold bg-tertiary/10 text-tertiary px-3 py-1.5 rounded hover:bg-tertiary hover:text-white transition-all">RESOLVE</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="px-8 py-4 bg-surface-container-low/30 border-t border-outline-variant/10 text-center">
                <button className="text-xs font-bold text-on-surface-variant hover:text-primary transition-colors">Show All Transactional Alerts</button>
              </div>
            </div>
          </div>

          {/* Right Sidebar (1/3 width) */}
          <div className="space-y-6">
            {/* Critical Alerts Summary */}
            <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border-l-4 border-error">
              <h3 className="font-bold font-headline text-sm mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-error text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>campaign</span>
                Critical Response Unit
              </h3>
              <div className="space-y-4 mb-6">
                <div className="p-3 bg-error/10 rounded-lg border border-error/20">
                  <p className="text-xs font-bold text-error mb-1">ICU SHORTAGE</p>
                  <p className="text-xs text-on-surface-variant leading-tight">Patient bedding running below safety threshold in 3 minutes.</p>
                </div>
                <div className="p-3 bg-error/10 rounded-lg border border-error/20">
                  <p className="text-xs font-bold text-error mb-1">SYNC FAILURE</p>
                  <p className="text-xs text-on-surface-variant leading-tight">Emergency backup failed to initiate 2 minutes ago.</p>
                </div>
              </div>
              <button className="w-full py-2 bg-error text-on-error rounded-lg text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-all">
                Take Action
              </button>
            </div>

            {/* Alert Distribution */}
            <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm">
              <h3 className="font-bold font-headline text-sm mb-6">Alert Distribution</h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-xs font-bold mb-2">
                    <span className="text-on-surface">Critical</span>
                    <span className="text-error">21%</span>
                  </div>
                  <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
                    <div className="h-full bg-error rounded-full" style={{ width: '21%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-bold mb-2">
                    <span className="text-on-surface">Warning</span>
                    <span className="text-tertiary">50%</span>
                  </div>
                  <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
                    <div className="h-full bg-tertiary rounded-full" style={{ width: '50%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-bold mb-2">
                    <span className="text-on-surface">Informational</span>
                    <span className="text-primary-container">29%</span>
                  </div>
                  <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
                    <div className="h-full bg-primary-container rounded-full" style={{ width: '29%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recommendation Card */}
            <div className="bg-gradient-to-br from-primary to-primary-container p-6 rounded-xl shadow-sm text-on-primary relative overflow-hidden">
              <div className="relative z-10">
                <div className="w-10 h-10 rounded-lg bg-white/10 backdrop-blur flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-white" style={{ fontVariationSettings: "'FILL' 1" }}>lightbulb</span>
                </div>
                <h3 className="font-bold font-headline text-sm mb-2">Strategic Insight</h3>
                <p className="text-xs text-on-primary/80 leading-relaxed">
                  High alert frequency detected in <span className="font-bold text-white">Emergency Dept</span>. Consider increasing regional buffer stock by <span className="font-bold text-white">15%</span> to mitigate recurrent shortages.
                </p>
                <button className="mt-4 text-[10px] font-bold uppercase tracking-widest text-white hover:text-secondary transition-colors flex items-center gap-1">
                  Optimize Rules <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              </div>
              {/* Abstract Texture */}
              <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
