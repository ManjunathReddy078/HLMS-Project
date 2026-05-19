import React from 'react';
import DashboardLayout from '../../components/DashboardLayout';

export default function Tracking({ onLogout }) {
  return (
    <DashboardLayout role="supervisor" onLogout={onLogout}>
      <div className="p-8 space-y-8 max-w-[1600px] animate-fade-in mx-auto w-full">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between md:items-end gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-on-surface tracking-tight font-headline">Live Linen Tracking</h2>
            <p className="text-on-surface-variant mt-1 font-body">Real-time tracking of linen movement across wards, laundry, and vendors</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-surface-container-high text-on-surface rounded-xl text-sm font-semibold hover:bg-surface-variant transition-colors">
              <span className="material-symbols-outlined text-sm">filter_list</span> Filters
            </button>
          </div>
        </div>

        {/* KPI Cards: Tonal Architecture */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-surface-container-lowest p-6 rounded-[1.5rem] shadow-sm border border-outline-variant/5">
            <p className="text-on-surface-variant text-xs font-bold uppercase tracking-wider mb-2">Total Items in System</p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-on-surface tracking-tighter font-headline">12,450</span>
              <span className="text-xs font-semibold text-secondary flex items-center"><span className="material-symbols-outlined text-xs">trending_up</span> 2%</span>
            </div>
          </div>
          <div className="bg-surface-container-low p-6 rounded-[1.5rem] shadow-sm">
            <p className="text-on-surface-variant text-xs font-bold uppercase tracking-wider mb-2">In Wards</p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-primary tracking-tighter font-headline">8,420</span>
              <span className="text-on-surface-variant text-xs">67% of total</span>
            </div>
          </div>
          <div className="bg-surface-container-low p-6 rounded-[1.5rem] shadow-sm">
            <p className="text-on-surface-variant text-xs font-bold uppercase tracking-wider mb-2">In Laundry</p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-tertiary tracking-tighter font-headline">1,240</span>
              <span className="text-on-surface-variant text-xs">Active wash</span>
            </div>
          </div>
          <div className="bg-surface-container-low p-6 rounded-[1.5rem] shadow-sm">
            <p className="text-on-surface-variant text-xs font-bold uppercase tracking-wider mb-2">With Vendor</p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-error tracking-tighter font-headline">2,790</span>
              <span className="text-on-surface-variant text-xs">External processing</span>
            </div>
          </div>
        </div>

        {/* Main Workspace Grid */}
        <div className="grid grid-cols-12 gap-8 items-start">
          {/* Table Section: Card-based table */}
          <div className="col-span-12 lg:col-span-8 bg-surface-container-lowest rounded-[1.5rem] shadow-sm overflow-hidden flex flex-col">
            {/* Internal Filters */}
            <div className="p-6 bg-surface-container-low/50 flex flex-wrap items-center gap-4 border-b border-outline-variant/10">
              <div className="flex items-center gap-2">
                <label className="text-xs font-bold text-on-surface-variant">Location:</label>
                <select className="bg-surface-container-lowest border-outline-variant/20 rounded-lg text-xs font-semibold px-3 py-1.5 focus:ring-primary/20">
                  <option>All Locations</option>
                  <option>Ward A</option>
                  <option>Vendor X</option>
                  <option>Central Laundry</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-xs font-bold text-on-surface-variant">Status:</label>
                <select className="bg-surface-container-lowest border-outline-variant/20 rounded-lg text-xs font-semibold px-3 py-1.5 focus:ring-primary/20">
                  <option>All Statuses</option>
                  <option>Clean</option>
                  <option>Soiled</option>
                  <option>Processing</option>
                </select>
              </div>
              <div className="ml-auto flex gap-2">
                <button className="p-2 hover:bg-surface-container-high rounded-lg text-on-surface-variant transition-colors"><span className="material-symbols-outlined text-sm">download</span></button>
                <button className="p-2 hover:bg-surface-container-high rounded-lg text-on-surface-variant transition-colors"><span className="material-symbols-outlined text-sm">print</span></button>
              </div>
            </div>

            {/* Clean Table (Divider-Free approach via Tonal Layers) */}
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead className="bg-surface-container-low/30">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Linen ID</th>
                    <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Item Type</th>
                    <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Location</th>
                    <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Last Updated</th>
                  </tr>
                </thead>
                <tbody className="divide-y-0">
                  {/* Row 1 */}
                  <tr className="hover:bg-surface-container-low transition-colors group">
                    <td className="px-6 py-4 font-semibold text-primary">LN-1023</td>
                    <td className="px-6 py-4 text-sm font-medium">Bedsheet (King)</td>
                    <td className="px-6 py-4 text-sm text-on-surface-variant">Central Laundry</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-secondary-container text-on-secondary-container">
                        CLEAN
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-on-surface-variant italic">5 mins ago</td>
                  </tr>
                  {/* Row 2 */}
                  <tr className="bg-surface-container-low/20 hover:bg-surface-container-low transition-colors group">
                    <td className="px-6 py-4 font-semibold text-primary">LN-8892</td>
                    <td className="px-6 py-4 text-sm font-medium">Patient Gown (L)</td>
                    <td className="px-6 py-4 text-sm text-on-surface-variant">Ward B - Oncology</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-error-container text-on-error-container uppercase">
                        Soiled
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-on-surface-variant italic">14:20</td>
                  </tr>
                  {/* Row 3 */}
                  <tr className="hover:bg-surface-container-low transition-colors group">
                    <td className="px-6 py-4 font-semibold text-primary">LN-4451</td>
                    <td className="px-6 py-4 text-sm font-medium">Pillowcase</td>
                    <td className="px-6 py-4 text-sm text-on-surface-variant">Vendor X (PrimeWash)</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-tertiary-container text-on-tertiary-container uppercase">
                        Processing
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-on-surface-variant italic">12 mins ago</td>
                  </tr>
                  {/* Row 4 */}
                  <tr className="bg-surface-container-low/20 hover:bg-surface-container-low transition-colors group">
                    <td className="px-6 py-4 font-semibold text-primary">LN-0922</td>
                    <td className="px-6 py-4 text-sm font-medium">Surgical Drapes</td>
                    <td className="px-6 py-4 text-sm text-on-surface-variant">Transit (In Route)</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-primary-container text-on-primary-container uppercase">
                        Dispatched
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-on-surface-variant italic">25 mins ago</td>
                  </tr>
                  {/* Row 5 */}
                  <tr className="hover:bg-surface-container-low transition-colors group">
                    <td className="px-6 py-4 font-semibold text-primary">LN-7731</td>
                    <td className="px-6 py-4 text-sm font-medium">Bedsheet (Standard)</td>
                    <td className="px-6 py-4 text-sm text-on-surface-variant">Ward A - ICU</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-secondary-container text-on-secondary-container">RETURNED</span>
                    </td>
                    <td className="px-6 py-4 text-xs text-on-surface-variant italic">Just now</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Pagination-like Footer */}
            <div className="p-4 flex justify-between items-center bg-surface-container-low/20 mt-auto border-t border-outline-variant/10">
              <span className="text-xs text-on-surface-variant font-medium">Showing 1-10 of 12,450 items</span>
              <div className="flex gap-1">
                <button className="p-2 hover:bg-surface-container-high rounded-lg transition-colors"><span className="material-symbols-outlined text-sm">chevron_left</span></button>
                <button className="p-2 hover:bg-surface-container-high rounded-lg transition-colors"><span className="material-symbols-outlined text-sm">chevron_right</span></button>
              </div>
            </div>
          </div>

          {/* Right Panel: Live Movement Feed */}
          <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
            {/* Live Movement Feed Card */}
            <div className="bg-surface-container-low rounded-[1.5rem] p-6 shadow-sm flex flex-col h-full max-h-[600px]">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-on-surface flex items-center gap-2 font-headline">
                  <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>sensors</span>
                  Live Movement Feed
                </h3>
                <span className="px-2 py-0.5 bg-secondary text-on-secondary text-[10px] font-bold rounded-full animate-pulse tracking-widest">LIVE</span>
              </div>
              <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar">
                {/* Event 1 */}
                <div className="flex gap-4 p-4 bg-surface-container-lowest rounded-xl relative overflow-hidden group shadow-sm">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-container flex items-center justify-center">
                    <span className="material-symbols-outlined text-sm text-on-primary-container">local_shipping</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Item #LN-1023 moved to Vendor</p>
                    <p className="text-[10px] text-on-surface-variant font-medium mt-1 uppercase tracking-tight">PrimeWash Logistics • 2m ago</p>
                  </div>
                </div>
                {/* Event 2 */}
                <div className="flex gap-4 p-4 bg-surface-container-lowest rounded-xl relative overflow-hidden shadow-sm">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-tertiary"></div>
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-tertiary-container flex items-center justify-center">
                    <span className="material-symbols-outlined text-sm text-on-tertiary-container">replay</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Item #LN-8892 returned to Laundry</p>
                    <p className="text-[10px] text-on-surface-variant font-medium mt-1 uppercase tracking-tight">Sanitation Dept • 8m ago</p>
                  </div>
                </div>
                {/* Event 3 */}
                <div className="flex gap-4 p-4 bg-surface-container-lowest rounded-xl relative overflow-hidden shadow-sm">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-secondary"></div>
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center">
                    <span className="material-symbols-outlined text-sm text-on-secondary-container">check_circle</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Ward B received 50 Clean Bedsheets</p>
                    <p className="text-[10px] text-on-surface-variant font-medium mt-1 uppercase tracking-tight">Dispatch #442 • 15m ago</p>
                  </div>
                </div>
                {/* Event 4 */}
                <div className="flex gap-4 p-4 bg-surface-container-lowest rounded-xl relative overflow-hidden opacity-80 shadow-sm">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-container flex items-center justify-center">
                    <span className="material-symbols-outlined text-sm text-on-primary-container">local_shipping</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Batch #902 Dispatched to Maternity</p>
                    <p className="text-[10px] text-on-surface-variant font-medium mt-1 uppercase tracking-tight">Loader Alpha • 32m ago</p>
                  </div>
                </div>
              </div>
              <button className="w-full mt-6 py-2 text-xs font-bold text-primary hover:bg-primary-container/20 rounded-lg transition-colors border border-primary/20">
                View Historical Logs
              </button>
            </div>

            {/* Sidebar Stats / Secondary Card */}
            <div className="bg-primary p-6 rounded-[1.5rem] text-on-primary relative overflow-hidden shadow-sm">
              <div className="relative z-10">
                <h4 className="text-sm font-bold opacity-80 uppercase tracking-widest mb-1">Stock Health</h4>
                <p className="text-2xl font-black font-headline">94.2% Optimal</p>
                <p className="text-xs mt-4 opacity-70 leading-relaxed font-medium">Inventory turnover is 12% faster than last month. Current cycle time: 4.2 hours.</p>
              </div>
              <div className="absolute -right-6 -bottom-6 opacity-10">
                <span className="material-symbols-outlined text-[120px]" style={{ fontVariationSettings: "'FILL' 1" }}>ecg_heart</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
