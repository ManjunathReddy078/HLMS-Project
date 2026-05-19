import React from 'react';
import DashboardLayout from '../../components/DashboardLayout';

export default function Facilities({ onLogout }) {
  return (
    <DashboardLayout role="admin" onLogout={onLogout}>
      <div className="p-8 flex flex-col gap-8 max-w-[1600px] animate-fade-in">
        {/* Strategic Header & Controls */}
        <section className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row justify-between md:items-end gap-4">
            <div>
              <h2 className="font-headline text-3xl font-bold text-primary tracking-tight">Facility Management</h2>
              <p className="text-on-surface-variant mt-1">Manage hospital wards, departments, and linen distribution units</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white font-semibold rounded-lg hover:bg-primary-container transition-colors shadow-lg shadow-primary/10">
                <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 0" }}>add</span>
                <span>Add Facility</span>
              </button>
            </div>
          </div>
          {/* Control Bar */}
          <div className="flex flex-col md:flex-row items-center gap-4 p-4 bg-surface-container-lowest rounded-xl shadow-sm">
            <div className="flex-1 w-full relative">
              <span className="absolute inset-y-0 left-4 flex items-center text-outline">
                <span className="material-symbols-outlined">search</span>
              </span>
              <input className="w-full bg-surface border-none rounded-lg py-3 pl-12 pr-4 text-sm focus:ring-1 focus:ring-primary-fixed-dim" placeholder="Search facility or ward..." type="text"/>
            </div>
            <div className="relative w-full md:w-auto min-w-[200px]">
              <select className="w-full bg-surface border-none rounded-lg py-3 px-4 text-sm appearance-none focus:ring-1 focus:ring-primary-fixed-dim">
                <option>All Status</option>
                <option>Optimal</option>
                <option>Risk</option>
                <option>Critical</option>
              </select>
              <span className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-outline">
                <span className="material-symbols-outlined">expand_more</span>
              </span>
            </div>
          </div>
        </section>

        {/* Layout Grid */}
        <div className="grid grid-cols-12 gap-8 items-start">
          {/* Main Content (Table) */}
          <div className="col-span-12 lg:col-span-9 flex flex-col gap-6">
            <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/10 overflow-hidden">
              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left border-collapse min-w-[900px]">
                  <thead>
                    <tr className="bg-surface-container-low/50 border-b border-outline-variant/20">
                      <th className="px-6 py-4 text-[11px] font-bold text-on-surface-variant uppercase tracking-widest whitespace-nowrap">Facility Name</th>
                      <th className="px-6 py-4 text-[11px] font-bold text-on-surface-variant uppercase tracking-widest whitespace-nowrap">Type</th>
                      <th className="px-6 py-4 text-[11px] font-bold text-on-surface-variant uppercase tracking-widest whitespace-nowrap">Supervisor</th>
                      <th className="px-6 py-4 text-[11px] font-bold text-on-surface-variant uppercase tracking-widest whitespace-nowrap text-right">Inventory</th>
                      <th className="px-6 py-4 text-[11px] font-bold text-on-surface-variant uppercase tracking-widest whitespace-nowrap text-right">Dispatches</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/10">
                    {/* Row 1: ICU */}
                    <tr className="hover:bg-surface-container-low/30 transition-colors group">
                      <td className="px-6 py-5 align-top">
                        <div className="flex flex-col gap-1">
                          <p className="font-bold text-primary font-headline">Intensive Care Unit (ICU)</p>
                          <p className="text-xs text-on-surface-variant">Main Building, Floor 4</p>
                          <div className="mt-2 flex flex-wrap items-center gap-3">
                            <p className="text-[10px] uppercase font-bold text-outline">Returns Pending: <span className="text-on-surface">120</span></p>
                            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-secondary-container text-on-secondary-container rounded-full text-[10px] font-bold">
                              <span className="w-1 h-1 rounded-full bg-secondary"></span>Optimal
                            </div>
                          </div>
                          <div className="flex items-center gap-3 pt-2 border-t border-outline-variant/10 mt-2">
                            <button className="text-[10px] font-bold text-primary hover:underline uppercase tracking-wider">View</button>
                            <span className="text-outline-variant text-[10px]">|</span>
                            <button className="text-[10px] font-bold text-primary hover:underline uppercase tracking-wider">Edit</button>
                            <button className="text-on-surface-variant ml-auto hover:text-primary">
                              <span className="material-symbols-outlined text-sm">more_vert</span>
                            </button>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 align-top">
                        <span className="px-2 py-1 bg-surface-container text-[10px] font-bold rounded tracking-wider uppercase">Ward</span>
                      </td>
                      <td className="px-6 py-5 align-top">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center text-xs font-bold">SC</div>
                          <span className="text-sm font-medium">Dr. Sarah Chen</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-right font-mono font-bold text-primary align-top">4,520</td>
                      <td className="px-6 py-5 text-right font-mono text-on-surface-variant align-top">820</td>
                    </tr>
                    
                    {/* Row 2: Emergency Dept */}
                    <tr className="hover:bg-surface-container-low/30 transition-colors group">
                      <td className="px-6 py-5 align-top">
                        <div className="flex flex-col gap-1">
                          <p className="font-bold text-primary font-headline">Emergency Dept</p>
                          <p className="text-xs text-on-surface-variant">Ground Floor, Wing A</p>
                          <div className="mt-2 flex flex-wrap items-center gap-3">
                            <p className="text-[10px] uppercase font-bold text-outline">Returns Pending: <span className="text-on-surface">45</span></p>
                            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-tertiary-container/30 text-tertiary rounded-full text-[10px] font-bold border border-tertiary/20">
                              <span className="w-1 h-1 rounded-full bg-tertiary"></span>Risk
                            </div>
                          </div>
                          <div className="flex items-center gap-3 pt-2 border-t border-outline-variant/10 mt-2">
                            <button className="text-[10px] font-bold text-primary hover:underline uppercase tracking-wider">View</button>
                            <span className="text-outline-variant text-[10px]">|</span>
                            <button className="text-[10px] font-bold text-primary hover:underline uppercase tracking-wider">Edit</button>
                            <button className="text-on-surface-variant ml-auto hover:text-primary">
                              <span className="material-symbols-outlined text-sm">more_vert</span>
                            </button>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 align-top">
                        <span className="px-2 py-1 bg-surface-container text-[10px] font-bold rounded tracking-wider uppercase">Department</span>
                      </td>
                      <td className="px-6 py-5 align-top">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-surface-variant text-on-surface-variant flex items-center justify-center text-xs font-bold">MW</div>
                          <span className="text-sm font-medium">Mark Wilson</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-right font-mono font-bold text-primary align-top">3,100</td>
                      <td className="px-6 py-5 text-right font-mono text-on-surface-variant align-top">1,200</td>
                    </tr>

                    {/* Row 3: Surgical Theatre */}
                    <tr className="hover:bg-surface-container-low/30 transition-colors group">
                      <td className="px-6 py-5 align-top">
                        <div className="flex flex-col gap-1">
                          <p className="font-bold text-primary font-headline">Surgical Theatre</p>
                          <p className="text-xs text-on-surface-variant">North Wing, Floor 2</p>
                          <div className="mt-2 flex flex-wrap items-center gap-3">
                            <p className="text-[10px] uppercase font-bold text-outline">Returns Pending: <span className="text-on-surface">10</span></p>
                            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-error-container text-error rounded-full text-[10px] font-bold">
                              <span className="w-1 h-1 rounded-full bg-error"></span>Critical
                            </div>
                          </div>
                          <div className="flex items-center gap-3 pt-2 border-t border-outline-variant/10 mt-2">
                            <button className="text-[10px] font-bold text-primary hover:underline uppercase tracking-wider">View</button>
                            <span className="text-outline-variant text-[10px]">|</span>
                            <button className="text-[10px] font-bold text-primary hover:underline uppercase tracking-wider">Edit</button>
                            <button className="text-on-surface-variant ml-auto hover:text-primary">
                              <span className="material-symbols-outlined text-sm">more_vert</span>
                            </button>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 align-top">
                        <span className="px-2 py-1 bg-surface-container text-[10px] font-bold rounded tracking-wider uppercase">Unit</span>
                      </td>
                      <td className="px-6 py-5 align-top">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-surface-variant text-on-surface-variant flex items-center justify-center text-xs font-bold">JL</div>
                          <span className="text-sm font-medium">Dr. James Lee</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-right font-mono font-bold text-primary align-top">1,200</td>
                      <td className="px-6 py-5 text-right font-mono text-on-surface-variant align-top">600</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              {/* Pagination */}
              <div className="px-6 py-4 flex justify-between items-center bg-surface-container-low/30 border-t border-outline-variant/10">
                <span className="text-sm text-on-surface-variant font-medium">Showing 1–3 of 18 facilities</span>
                <div className="flex gap-2">
                  <button className="p-2 text-on-surface-variant hover:bg-surface-container rounded transition-colors disabled:opacity-50" disabled>
                    <span className="material-symbols-outlined">chevron_left</span>
                  </button>
                  <button className="w-9 h-9 flex items-center justify-center bg-primary text-white rounded font-bold shadow-sm text-sm">1</button>
                  <button className="w-9 h-9 flex items-center justify-center hover:bg-surface-container rounded font-bold transition-colors text-sm">2</button>
                  <button className="p-2 text-on-surface-variant hover:bg-surface-container rounded transition-colors">
                    <span className="material-symbols-outlined">chevron_right</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side Panel (Quick Insights) */}
          <aside className="col-span-12 lg:col-span-3 flex flex-col gap-6">
            <div className="bg-primary text-white p-6 rounded-xl shadow-xl overflow-hidden relative">
              <div className="relative z-10">
                <p className="text-primary-fixed-dim text-sm font-bold uppercase tracking-widest mb-1">Total Facilities</p>
                <h3 className="font-headline text-4xl font-extrabold mb-4">18</h3>
                <div className="flex items-center gap-2 text-xs font-medium bg-white/10 w-fit px-3 py-1 rounded-full backdrop-blur-sm">
                  <span className="material-symbols-outlined text-sm">trending_up</span>
                  <span>+2 from last month</span>
                </div>
              </div>
              <div className="absolute -right-4 -bottom-4 opacity-10">
                <span className="material-symbols-outlined text-[120px]" style={{ fontVariationSettings: "'FILL' 1" }}>domain</span>
              </div>
            </div>

            <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/10">
              <h4 className="font-headline text-sm font-bold text-primary uppercase tracking-widest mb-6">Inventory Health</h4>
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-secondary"></div>
                    <span className="text-sm font-medium text-on-surface-variant">Optimal Facilities</span>
                  </div>
                  <span className="font-bold text-primary">12</span>
                </div>
                <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden">
                  <div className="bg-secondary h-full" style={{ width: '66%' }}></div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-tertiary"></div>
                    <span className="text-sm font-medium text-on-surface-variant">Facilities at Risk</span>
                  </div>
                  <span className="font-bold text-primary">4</span>
                </div>
                <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden">
                  <div className="bg-tertiary h-full" style={{ width: '22%' }}></div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-error"></div>
                    <span className="text-sm font-medium text-on-surface-variant">Critical Facilities</span>
                  </div>
                  <span className="font-bold text-primary">2</span>
                </div>
                <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden">
                  <div className="bg-error h-full" style={{ width: '12%' }}></div>
                </div>
              </div>
            </div>

            {/* Quick Action Card */}
            <div className="p-6 rounded-xl bg-primary-container/20 border border-primary/10">
              <div className="flex items-center gap-3 mb-3">
                <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                <h4 className="font-bold text-primary text-sm">Operational Insight</h4>
              </div>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                Emergency Dept (ER) has seen a 24% increase in turnover this week. Consider re-allocating buffer stock from the Pediatrics Ward.
              </p>
              <button className="mt-4 text-xs font-extrabold text-primary uppercase tracking-widest flex items-center gap-1 hover:underline">
                View Optimization Plan
                <span className="material-symbols-outlined text-xs">arrow_forward</span>
              </button>
            </div>
          </aside>
        </div>
      </div>
    </DashboardLayout>
  );
}
