import React from 'react';
import DashboardLayout from '../../components/DashboardLayout';

export default function Inventory({ onLogout }) {
  return (
    <DashboardLayout role="admin" onLogout={onLogout}>
      <div className="p-8 flex flex-col gap-8 max-w-[1600px] animate-fade-in">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between md:items-end gap-4">
          <div>
            <h1 className="text-3xl font-extrabold font-headline text-on-surface tracking-tight mb-1">Inventory Management</h1>
            <p className="text-on-surface-variant font-body">Monitor and manage hospital linen inventory across all locations</p>
          </div>
          <button className="bg-primary text-on-primary px-6 py-2.5 rounded-lg flex items-center justify-center gap-2 font-medium shadow-md hover:bg-primary-container transition-all">
            <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 0" }}>add</span>
            <span>Add Inventory Item</span>
          </button>
        </div>

        {/* KPI Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-surface-container-lowest p-6 rounded-xl border-none shadow-sm flex flex-col">
            <span className="uppercase tracking-wider text-on-surface-variant font-bold text-[10px] mb-2">Total Items</span>
            <span className="text-3xl font-headline font-extrabold text-primary">12,450</span>
            <div className="mt-4 h-1.5 w-full bg-surface-container-highest rounded-full overflow-hidden">
              <div className="bg-primary h-full w-full"></div>
            </div>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-xl border-none shadow-sm flex flex-col">
            <span className="uppercase tracking-wider text-on-surface-variant font-bold text-[10px] mb-2">In Circulation</span>
            <span className="text-3xl font-headline font-extrabold text-secondary">8,420</span>
            <div className="mt-4 h-1.5 w-full bg-surface-container-highest rounded-full overflow-hidden">
              <div className="bg-secondary h-full" style={{ width: '68%' }}></div>
            </div>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-xl border-none shadow-sm flex flex-col border-b-4 border-error/20">
            <span className="uppercase tracking-wider text-error font-bold text-[10px] mb-2">Low Stock</span>
            <span className="text-3xl font-headline font-extrabold text-error">320</span>
            <div className="mt-4 flex items-center text-error text-[12px] font-medium gap-1">
              <span className="material-symbols-outlined text-sm">trending_up</span>
              <span>12% from last week</span>
            </div>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-xl border-none shadow-sm flex flex-col">
            <span className="uppercase tracking-wider text-tertiary font-bold text-[10px] mb-2">Damaged Items</span>
            <span className="text-3xl font-headline font-extrabold text-tertiary">85</span>
            <div className="mt-4 h-1.5 w-full bg-surface-container-highest rounded-full overflow-hidden">
              <div className="bg-tertiary h-full" style={{ width: '5%' }}></div>
            </div>
          </div>
        </div>

        {/* Content Area: Main Layout */}
        <div className="grid grid-cols-12 gap-8 items-start">
          {/* Left Column: Table and Filters */}
          <div className="col-span-12 lg:col-span-9 space-y-6">
            {/* Filters */}
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="w-full md:flex-[2] bg-surface-container-low px-4 py-2 rounded-lg flex items-center gap-3">
                <span className="material-symbols-outlined text-outline">search</span>
                <input className="bg-transparent border-none focus:ring-0 text-sm w-full font-body" placeholder="Search item ID or name..." type="text"/>
              </div>
              <div className="w-full md:flex-1 bg-surface-container-low px-4 py-2 rounded-lg flex items-center gap-3">
                <span className="material-symbols-outlined text-outline">filter_list</span>
                <select className="bg-transparent border-none focus:ring-0 text-sm font-medium text-on-surface-variant w-full">
                  <option>Location</option>
                  <option>Ward A</option>
                  <option>Ward B</option>
                  <option>Laundry</option>
                </select>
              </div>
              <div className="w-full md:flex-1 bg-surface-container-low px-4 py-2 rounded-lg flex items-center gap-3">
                <span className="material-symbols-outlined text-outline">tune</span>
                <select className="bg-transparent border-none focus:ring-0 text-sm font-medium text-on-surface-variant w-full">
                  <option>Status</option>
                  <option>Clean</option>
                  <option>Soiled</option>
                  <option>Processing</option>
                </select>
              </div>
              <button className="w-full md:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-outline-variant hover:bg-surface-container transition-colors text-sm font-medium text-on-surface-variant">
                <span className="material-symbols-outlined text-[20px]">download</span>
                <span>Export</span>
              </button>
            </div>

            {/* Table Container */}
            <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden border border-outline-variant/10">
              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                    <tr className="bg-surface-container-low/50">
                      <th className="px-6 py-4 font-bold text-on-surface-variant text-[11px] uppercase tracking-wider whitespace-nowrap">Item ID</th>
                      <th className="px-6 py-4 font-bold text-on-surface-variant text-[11px] uppercase tracking-wider whitespace-nowrap">Item Name</th>
                      <th className="px-6 py-4 font-bold text-on-surface-variant text-[11px] uppercase tracking-wider whitespace-nowrap">Category</th>
                      <th className="px-6 py-4 font-bold text-on-surface-variant text-[11px] uppercase tracking-wider whitespace-nowrap">Location</th>
                      <th className="px-6 py-4 font-bold text-on-surface-variant text-[11px] uppercase tracking-wider whitespace-nowrap">Status</th>
                      <th className="px-6 py-4 font-bold text-on-surface-variant text-[11px] uppercase tracking-wider text-right whitespace-nowrap">Quantity</th>
                      <th className="px-6 py-4 font-bold text-on-surface-variant text-[11px] uppercase tracking-wider text-center w-16 whitespace-nowrap">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-container">
                    {/* Row 1 */}
                    <tr className="hover:bg-surface-container-low/30 transition-colors">
                      <td className="px-6 py-4 text-sm font-semibold text-primary">LN-1023</td>
                      <td className="px-6 py-4 text-sm font-medium">Bedsheet (King)</td>
                      <td className="px-6 py-4 text-sm text-on-surface-variant">Linen</td>
                      <td className="px-6 py-4 text-sm text-on-surface-variant">Ward A</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-secondary-container text-on-secondary-container">
                          Clean
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-right">120</td>
                      <td className="px-6 py-4 text-center">
                        <button className="p-1 hover:bg-surface-container rounded-full transition-colors text-on-surface-variant">
                          <span className="material-symbols-outlined text-[18px]">more_vert</span>
                        </button>
                      </td>
                    </tr>
                    {/* Row 2 */}
                    <tr className="hover:bg-surface-container-low/30 transition-colors">
                      <td className="px-6 py-4 text-sm font-semibold text-primary">LN-8892</td>
                      <td className="px-6 py-4 text-sm font-medium">Patient Gown (L)</td>
                      <td className="px-6 py-4 text-sm text-on-surface-variant">Apparel</td>
                      <td className="px-6 py-4 text-sm text-on-surface-variant">Ward B</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-tertiary-fixed text-on-tertiary-fixed-variant">
                          Soiled
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-right">45</td>
                      <td className="px-6 py-4 text-center">
                        <button className="p-1 hover:bg-surface-container rounded-full transition-colors text-on-surface-variant">
                          <span className="material-symbols-outlined text-[18px]">more_vert</span>
                        </button>
                      </td>
                    </tr>
                    {/* Row 3 */}
                    <tr className="hover:bg-surface-container-low/30 transition-colors">
                      <td className="px-6 py-4 text-sm font-semibold text-primary">LN-4451</td>
                      <td className="px-6 py-4 text-sm font-medium">Pillowcase</td>
                      <td className="px-6 py-4 text-sm text-on-surface-variant">Linen</td>
                      <td className="px-6 py-4 text-sm text-on-surface-variant">Vendor X</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary-fixed text-on-primary-fixed-variant">
                          Processing
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-right">200</td>
                      <td className="px-6 py-4 text-center">
                        <button className="p-1 hover:bg-surface-container rounded-full transition-colors text-on-surface-variant">
                          <span className="material-symbols-outlined text-[18px]">more_vert</span>
                        </button>
                      </td>
                    </tr>
                    {/* Row 4 */}
                    <tr className="hover:bg-surface-container-low/30 transition-colors">
                      <td className="px-6 py-4 text-sm font-semibold text-primary">LN-0922</td>
                      <td className="px-6 py-4 text-sm font-medium">Surgical Drapes</td>
                      <td className="px-6 py-4 text-sm text-on-surface-variant">Surgical</td>
                      <td className="px-6 py-4 text-sm text-on-surface-variant">Laundry</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-secondary-container text-on-secondary-container">
                          Clean
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-right">80</td>
                      <td className="px-6 py-4 text-center">
                        <button className="p-1 hover:bg-surface-container rounded-full transition-colors text-on-surface-variant">
                          <span className="material-symbols-outlined text-[18px]">more_vert</span>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="bg-surface-container-low/30 px-6 py-4 flex items-center justify-between">
                <span className="text-sm text-on-surface-variant">Showing 1–10 of 12,450 items</span>
                <div className="flex items-center gap-1">
                  <button className="p-2 hover:bg-surface-container rounded-lg transition-colors disabled:opacity-30" disabled>
                    <span className="material-symbols-outlined">chevron_left</span>
                  </button>
                  <button className="w-8 h-8 flex items-center justify-center bg-primary text-on-primary rounded-lg text-sm font-bold">1</button>
                  <button className="w-8 h-8 flex items-center justify-center hover:bg-surface-container rounded-lg text-sm font-medium">2</button>
                  <button className="w-8 h-8 flex items-center justify-center hover:bg-surface-container rounded-lg text-sm font-medium">3</button>
                  <span className="px-1 text-on-surface-variant">...</span>
                  <button className="w-8 h-8 flex items-center justify-center hover:bg-surface-container rounded-lg text-sm font-medium">1,245</button>
                  <button className="p-2 hover:bg-surface-container rounded-lg transition-colors">
                    <span className="material-symbols-outlined">chevron_right</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Panel */}
          <aside className="col-span-12 lg:col-span-3 space-y-6">
            {/* Stock Health Card */}
            <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/10">
              <h3 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant mb-4">Stock Health</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-medium mb-1.5">
                    <span className="text-secondary">Optimal</span>
                    <span>75%</span>
                  </div>
                  <div className="h-2 w-full bg-surface-container-highest rounded-full">
                    <div className="h-full bg-secondary rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-medium mb-1.5">
                    <span className="text-error">Low Stock</span>
                    <span>20%</span>
                  </div>
                  <div className="h-2 w-full bg-surface-container-highest rounded-full">
                    <div className="h-full bg-error rounded-full" style={{ width: '20%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-medium mb-1.5">
                    <span className="text-tertiary">Critical</span>
                    <span>5%</span>
                  </div>
                  <div className="h-2 w-full bg-surface-container-highest rounded-full">
                    <div className="h-full bg-tertiary rounded-full" style={{ width: '5%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Low Stock Alerts */}
            <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/10">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant">Low Stock Alerts</h3>
                <span className="bg-error/10 text-error px-2 py-0.5 rounded text-[10px] font-bold">URGENT</span>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-surface-container-low rounded-lg mb-2">
                  <span className="material-symbols-outlined text-error mt-0.5">warning</span>
                  <div>
                    <p className="text-sm font-bold">LN-1023 King Sheets</p>
                    <p className="text-xs text-on-surface-variant">Ward A • Current: 12 units</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-surface-container-low rounded-lg mb-2">
                  <span className="material-symbols-outlined text-error mt-0.5">warning</span>
                  <div>
                    <p className="text-sm font-bold">LN-4552 Scrub Sets (M)</p>
                    <p className="text-xs text-on-surface-variant">Ward C • Current: 8 units</p>
                  </div>
                </div>
                <button className="w-full py-2 text-primary text-xs font-bold hover:underline">View All Alerts</button>
              </div>
            </div>

            {/* Insight Card */}
            <div className="relative overflow-hidden bg-primary-container rounded-xl shadow-sm text-on-primary p-5">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
              <div className="flex items-center gap-3 mb-2">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>analytics</span>
                <span className="text-xs font-bold uppercase tracking-wider opacity-80">Strategic Insight</span>
              </div>
              <p className="font-headline font-bold leading-tight text-base">Laundry turnaround improved by 12% this week</p>
              <div className="mt-4 flex items-center gap-1 text-xs">
                <span className="material-symbols-outlined text-[14px]">arrow_upward</span>
                <span>Efficiency Trend: Positive</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </DashboardLayout>
  );
}
