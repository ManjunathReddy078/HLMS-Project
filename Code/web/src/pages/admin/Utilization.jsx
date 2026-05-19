import React from 'react';
import DashboardLayout from '../../components/DashboardLayout';

export default function Utilization({ onLogout }) {
  return (
    <DashboardLayout role="admin" onLogout={onLogout}>
      <div className="p-8 space-y-8 overflow-y-auto max-w-[1600px] animate-fade-in">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between md:items-end gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-primary tracking-tight font-headline">Utilization & Efficiency</h2>
            <p className="text-on-surface-variant font-body mt-1">Monitor linen usage, efficiency, and performance across departments</p>
          </div>
          <div className="relative">
            <select className="bg-surface-container-lowest border-none rounded-lg text-sm font-medium text-primary px-4 py-2 shadow-sm focus:ring-2 focus:ring-primary/20 appearance-none pr-10 cursor-pointer">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Custom Range</option>
            </select>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-primary">expand_more</span>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm">
            <p className="font-label text-[10px] uppercase tracking-wider text-on-surface-variant mb-2">Utilization Rate</p>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-primary font-headline">94.2%</span>
              <span className="text-secondary text-xs font-bold flex items-center"><span className="material-symbols-outlined text-sm">arrow_upward</span> 2.1%</span>
            </div>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm">
            <p className="font-label text-[10px] uppercase tracking-wider text-on-surface-variant mb-2">Avg Turnaround Time</p>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-primary font-headline">3.8 hrs</span>
              <span className="text-secondary text-xs font-bold flex items-center"><span className="material-symbols-outlined text-sm">arrow_downward</span> 0.4h</span>
            </div>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm">
            <p className="font-label text-[10px] uppercase tracking-wider text-on-surface-variant mb-2">Loss Rate</p>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-primary font-headline">1.4%</span>
              <span className="text-tertiary text-xs font-bold flex items-center"><span className="material-symbols-outlined text-sm">arrow_upward</span> 0.2%</span>
            </div>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm">
            <p className="font-label text-[10px] uppercase tracking-wider text-on-surface-variant mb-2">Recovery Efficiency</p>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-primary font-headline">98%</span>
              <span className="text-secondary text-xs font-bold flex items-center"><span className="material-symbols-outlined text-sm">check_circle</span> Target Met</span>
            </div>
          </div>
        </div>

        {/* Main Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Linen Usage Trend (2/3 width) */}
          <div className="lg:col-span-2 bg-surface-container-lowest p-8 rounded-xl shadow-sm">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-xl font-bold text-primary font-headline">Linen Usage Trend</h3>
              <div className="flex space-x-2 items-center">
                <span className="w-3 h-3 rounded-full bg-primary"></span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Standard Units</span>
              </div>
            </div>
            
            <div className="flex items-end justify-between h-48 px-2">
              {/* Monday */}
              <div className="flex flex-col items-center group w-12">
                <div className="bg-primary/20 w-4 rounded-t-sm transition-all duration-300 group-hover:bg-primary" style={{ height: '60%' }}></div>
                <span className="text-[10px] font-bold text-on-surface-variant mt-3 uppercase">Mon</span>
              </div>
              {/* Tuesday */}
              <div className="flex flex-col items-center group w-12">
                <div className="bg-primary/20 w-4 rounded-t-sm transition-all duration-300 group-hover:bg-primary" style={{ height: '72%' }}></div>
                <span className="text-[10px] font-bold text-on-surface-variant mt-3 uppercase">Tue</span>
              </div>
              {/* Wednesday */}
              <div className="flex flex-col items-center group w-12">
                <div className="bg-primary/20 w-4 rounded-t-sm transition-all duration-300 group-hover:bg-primary" style={{ height: '85%' }}></div>
                <span className="text-[10px] font-bold text-on-surface-variant mt-3 uppercase">Wed</span>
              </div>
              {/* Thursday */}
              <div className="flex flex-col items-center group w-12">
                <div className="bg-primary/20 w-4 rounded-t-sm transition-all duration-300 group-hover:bg-primary" style={{ height: '78%' }}></div>
                <span className="text-[10px] font-bold text-on-surface-variant mt-3 uppercase">Thu</span>
              </div>
              {/* Friday */}
              <div className="flex flex-col items-center group w-12">
                <div className="bg-primary/20 w-4 rounded-t-sm transition-all duration-300 group-hover:bg-primary" style={{ height: '92%' }}></div>
                <span className="text-[10px] font-bold text-on-surface-variant mt-3 uppercase">Fri</span>
              </div>
              {/* Saturday */}
              <div className="flex flex-col items-center group w-12">
                <div className="bg-primary/20 w-4 rounded-t-sm transition-all duration-300 group-hover:bg-primary" style={{ height: '45%' }}></div>
                <span className="text-[10px] font-bold text-on-surface-variant mt-3 uppercase">Sat</span>
              </div>
              {/* Sunday */}
              <div className="flex flex-col items-center group w-12">
                <div className="bg-primary/20 w-4 rounded-t-sm transition-all duration-300 group-hover:bg-primary" style={{ height: '35%' }}></div>
                <span className="text-[10px] font-bold text-on-surface-variant mt-3 uppercase">Sun</span>
              </div>
            </div>
          </div>

          {/* Department Utilization (1/3 width) */}
          <div className="bg-surface-container-lowest p-8 rounded-xl shadow-sm">
            <h3 className="text-xl font-bold text-primary mb-6 font-headline">Department Utilization</h3>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-bold text-on-surface">ICU</span>
                  <span className="font-extrabold text-primary">92%</span>
                </div>
                <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
                  <div className="h-full bg-secondary rounded-full" style={{ width: '92%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-bold text-on-surface">ER</span>
                  <span className="font-extrabold text-primary">88%</span>
                </div>
                <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
                  <div className="h-full bg-warning rounded-full" style={{ width: '88%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-bold text-on-surface">Maternity</span>
                  <span className="font-extrabold text-primary">95%</span>
                </div>
                <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
                  <div className="h-full bg-secondary rounded-full" style={{ width: '95%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-bold text-on-surface">Surgery</span>
                  <span className="font-extrabold text-primary">85%</span>
                </div>
                <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
                  <div className="h-full bg-tertiary rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Second Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Loss vs Recovery */}
          <div className="bg-surface-container-lowest p-8 rounded-xl shadow-sm">
            <h3 className="text-xl font-bold text-primary mb-8 font-headline">Loss vs Recovery</h3>
            <div className="flex items-center space-x-12">
              <div className="flex-1 flex flex-col items-center">
                <div className="w-full bg-surface-container-highest rounded-full h-3 overflow-hidden mb-4">
                  <div className="h-full bg-tertiary rounded-full" style={{ width: '1.4%' }}></div>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-extrabold text-tertiary">1.4%</p>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mt-1">Loss Rate</p>
                </div>
              </div>
              <div className="flex-1 flex flex-col items-center">
                <div className="w-full bg-surface-container-highest rounded-full h-3 overflow-hidden mb-4">
                  <div className="h-full bg-secondary rounded-full" style={{ width: '98.6%' }}></div>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-extrabold text-secondary">98.6%</p>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mt-1">Recovery Rate</p>
                </div>
              </div>
            </div>
            <div className="mt-8 p-4 bg-surface-container-low rounded-lg border-l-4 border-primary">
              <p className="text-sm italic text-on-surface-variant font-medium">Recovery rates are currently 0.4% above institutional benchmark.</p>
            </div>
          </div>

          {/* Operational Insights */}
          <div className="bg-surface-container-lowest p-8 rounded-xl shadow-sm">
            <h3 className="text-xl font-bold text-primary mb-6 font-headline">Operational Insights</h3>
            <div className="space-y-4">
              <div className="flex items-start p-4 rounded-lg bg-warning/10 border-l-4 border-warning">
                <span className="material-symbols-outlined text-warning mr-3 mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
                <p className="text-sm font-bold text-on-surface">Emergency Department showing higher loss rate this week</p>
              </div>
              <div className="flex items-start p-4 rounded-lg bg-secondary/10 border-l-4 border-secondary">
                <span className="material-symbols-outlined text-secondary mr-3 mt-0.5">trending_up</span>
                <p className="text-sm font-bold text-on-surface">Laundry efficiency improved by 12% following machine maintenance</p>
              </div>
              <div className="flex items-start p-4 rounded-lg bg-primary/10 border-l-4 border-primary">
                <span className="material-symbols-outlined text-primary mr-3 mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>info</span>
                <p className="text-sm font-bold text-on-surface">Maternity ward usage peaking; consider adjusting inventory buffer</p>
              </div>
            </div>
          </div>
        </div>

        {/* Small Table */}
        <div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm">
          <div className="px-8 py-6 border-b border-surface-container-high">
            <h3 className="text-xl font-bold text-primary font-headline">Department Performance Audit</h3>
          </div>
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface-container-low">
                <th className="px-8 py-4 font-bold text-[10px] uppercase tracking-widest text-on-surface-variant">Department</th>
                <th className="px-8 py-4 font-bold text-[10px] uppercase tracking-widest text-on-surface-variant">Usage %</th>
                <th className="px-8 py-4 font-bold text-[10px] uppercase tracking-widest text-on-surface-variant">Status</th>
                <th className="px-8 py-4 font-bold text-[10px] uppercase tracking-widest text-on-surface-variant text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-high">
              <tr className="hover:bg-surface-container-low/30 transition-colors">
                <td className="px-8 py-4 font-bold text-on-surface">ICU</td>
                <td className="px-8 py-4 text-on-surface font-medium">92%</td>
                <td className="px-8 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-secondary-container text-on-secondary-container">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary mr-2"></span> Optimal
                  </span>
                </td>
                <td className="px-8 py-4 text-right">
                  <button className="text-primary hover:text-primary-container font-bold text-xs transition-colors hover:underline">View Details</button>
                </td>
              </tr>
              <tr className="hover:bg-surface-container-low/30 transition-colors">
                <td className="px-8 py-4 font-bold text-on-surface">ER</td>
                <td className="px-8 py-4 text-on-surface font-medium">88%</td>
                <td className="px-8 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-tertiary-container/30 text-tertiary border border-tertiary/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-tertiary mr-2"></span> Warning
                  </span>
                </td>
                <td className="px-8 py-4 text-right">
                  <button className="text-primary hover:text-primary-container font-bold text-xs transition-colors hover:underline">View Details</button>
                </td>
              </tr>
              <tr className="hover:bg-surface-container-low/30 transition-colors">
                <td className="px-8 py-4 font-bold text-on-surface">Maternity</td>
                <td className="px-8 py-4 text-on-surface font-medium">95%</td>
                <td className="px-8 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-secondary-container text-on-secondary-container">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary mr-2"></span> Optimal
                  </span>
                </td>
                <td className="px-8 py-4 text-right">
                  <button className="text-primary hover:text-primary-container font-bold text-xs transition-colors hover:underline">View Details</button>
                </td>
              </tr>
              <tr className="hover:bg-surface-container-low/30 transition-colors">
                <td className="px-8 py-4 font-bold text-on-surface">Surgery</td>
                <td className="px-8 py-4 text-on-surface font-medium">85%</td>
                <td className="px-8 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-error-container text-error">
                    <span className="w-1.5 h-1.5 rounded-full bg-error mr-2"></span> Attention Needed
                  </span>
                </td>
                <td className="px-8 py-4 text-right">
                  <button className="text-primary hover:text-primary-container font-bold text-xs transition-colors hover:underline">View Details</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
