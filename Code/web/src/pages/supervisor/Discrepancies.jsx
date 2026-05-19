import React from 'react';
import DashboardLayout from '../../components/DashboardLayout';

export default function Discrepancies({ onLogout }) {
  return (
    <DashboardLayout role="supervisor" onLogout={onLogout}>
      <div className="p-8 space-y-8 max-w-[1600px] animate-fade-in mx-auto w-full">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between md:items-end gap-4">
          <div>
            <h2 className="text-3xl font-headline font-bold text-on-surface tracking-tight">Discrepancy Overview</h2>
            <p className="text-on-surface-variant text-sm mt-1 font-body">Overview of missing and damaged linen identified during return reconciliation</p>
          </div>
          <div className="flex gap-2">
            <span className="flex items-center gap-1 px-3 py-1 bg-surface-container-high rounded-full text-xs text-on-surface-variant font-medium">
              <span className="w-2 h-2 rounded-full bg-secondary"></span>
              System Online
            </span>
          </div>
        </div>

        {/* Summary Cards Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border-b-4 border-primary">
            <div className="flex justify-between items-start">
              <p className="text-sm font-semibold text-on-surface-variant">Total Missing Items</p>
              <span className="material-symbols-outlined text-primary">inventory_2</span>
            </div>
            <p className="text-4xl font-headline font-extrabold text-on-surface mt-2">42</p>
            <p className="text-xs text-on-surface-variant mt-2 flex items-center gap-1">
              <span className="material-symbols-outlined text-xs text-error">trending_up</span>
              8% increase from yesterday
            </p>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border-b-4 border-secondary">
            <div className="flex justify-between items-start">
              <p className="text-sm font-semibold text-on-surface-variant">Total Damaged Items</p>
              <span className="material-symbols-outlined text-secondary">heart_broken</span>
            </div>
            <p className="text-4xl font-headline font-extrabold text-on-surface mt-2">18</p>
            <p className="text-xs text-on-surface-variant mt-2 flex items-center gap-1">
              <span className="material-symbols-outlined text-xs text-secondary">trending_down</span>
              4 fewer than last shift
            </p>
          </div>
          <div className="bg-error/5 p-6 rounded-xl shadow-sm border-b-4 border-error">
            <div className="flex justify-between items-start">
              <p className="text-sm font-semibold text-error">High Priority Issues</p>
              <span className="material-symbols-outlined text-error" style={{ fontVariationSettings: "'FILL' 1" }}>priority_high</span>
            </div>
            <p className="text-4xl font-headline font-extrabold text-error mt-2">5</p>
            <p className="text-xs text-error mt-2 font-medium">Immediate attention required</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Table Section */}
          <div className="lg:col-span-3 space-y-6">
            {/* Tabbed Interface */}
            <div className="flex border-b border-surface-container-highest">
              <button className="px-6 py-3 text-sm font-bold border-b-2 border-primary text-primary transition-all">
                Missing Items
              </button>
              <button className="px-6 py-3 text-sm font-medium text-on-surface-variant hover:text-on-surface transition-all">
                Damaged Items
              </button>
            </div>
            <div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="bg-surface-container-low">
                      <th className="px-6 py-4 text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Linen ID</th>
                      <th className="px-6 py-4 text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Item Type</th>
                      <th className="px-6 py-4 text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Ward / Location</th>
                      <th className="px-6 py-4 text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Issue Type</th>
                      <th className="px-6 py-4 text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Reported</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y-0">
                    <tr className="hover:bg-surface-container-high/50 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs font-semibold text-primary">LN-5542</td>
                      <td className="px-6 py-4 text-sm font-medium">Patient Gown (L)</td>
                      <td className="px-6 py-4 text-sm text-on-surface-variant">Ward B</td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-medium text-on-surface-variant">Missing</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-error/10 text-error text-[10px] font-bold rounded-md uppercase">Missing</span>
                      </td>
                      <td className="px-6 py-4 text-xs text-on-surface-variant">2 hours ago</td>
                    </tr>
                    <tr className="bg-surface-container-low/30 hover:bg-surface-container-high/50 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs font-semibold text-primary">LN-8812</td>
                      <td className="px-6 py-4 text-sm font-medium">Bed Sheet (Surgical)</td>
                      <td className="px-6 py-4 text-sm text-on-surface-variant">Theatre 4</td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-medium text-on-surface-variant">Missing</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-error/10 text-error text-[10px] font-bold rounded-md uppercase">Missing</span>
                      </td>
                      <td className="px-6 py-4 text-xs text-on-surface-variant">3 hours ago</td>
                    </tr>
                    <tr className="hover:bg-surface-container-high/50 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs font-semibold text-primary">LN-2290</td>
                      <td className="px-6 py-4 text-sm font-medium">Pillow Case (Standard)</td>
                      <td className="px-6 py-4 text-sm text-on-surface-variant">Ward A</td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-medium text-on-surface-variant">Missing</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-surface-container-highest text-on-surface-variant text-[10px] font-bold rounded-md uppercase">Recovered</span>
                      </td>
                      <td className="px-6 py-4 text-xs text-on-surface-variant">5 hours ago</td>
                    </tr>
                    <tr className="bg-surface-container-low/30 hover:bg-surface-container-high/50 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs font-semibold text-primary">LN-3341</td>
                      <td className="px-6 py-4 text-sm font-medium">Bath Towel</td>
                      <td className="px-6 py-4 text-sm text-on-surface-variant">Maternity</td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-medium text-on-surface-variant">Missing</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-error/10 text-error text-[10px] font-bold rounded-md uppercase">Missing</span>
                      </td>
                      <td className="px-6 py-4 text-xs text-on-surface-variant">Yesterday</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Sidebar Section */}
          <aside className="space-y-6">
            <div className="bg-surface-container-highest/30 rounded-xl p-6 border border-outline-variant/10 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-error font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>campaign</span>
                <h3 className="font-headline font-bold text-on-surface">Critical Discrepancies</h3>
              </div>
              <div className="space-y-4">
                <div className="bg-surface-container-lowest p-4 rounded-lg shadow-sm border-l-4 border-error">
                  <p className="text-xs font-bold text-error uppercase mb-1">Stock Level Alert</p>
                  <p className="text-sm font-medium text-on-surface">Surgical linen mismatch in Ward D</p>
                  <p className="text-[10px] text-on-surface-variant mt-2">Reported: 15 mins ago</p>
                </div>
                <div className="bg-surface-container-lowest p-4 rounded-lg shadow-sm border-l-4 border-error">
                  <p className="text-xs font-bold text-error uppercase mb-1">Audit Failure</p>
                  <p className="text-sm font-medium text-on-surface">12 items missing from ICU checkout</p>
                  <p className="text-[10px] text-on-surface-variant mt-2">Reported: 45 mins ago</p>
                </div>
                <div className="bg-surface-container-lowest p-4 rounded-lg shadow-sm border-l-4 border-primary">
                  <p className="text-xs font-bold text-primary uppercase mb-1">Processing Delay</p>
                  <p className="text-sm font-medium text-on-surface">Sterilization unit 02 reporting delay</p>
                  <p className="text-[10px] text-on-surface-variant mt-2">Reported: 1 hour ago</p>
                </div>
              </div>
            </div>

            {/* Visual Summary Graphic */}
            <div className="relative overflow-hidden rounded-xl h-48 group shadow-sm">
              <div className="absolute inset-0 bg-primary/20 backdrop-blur-sm group-hover:bg-primary/10 transition-colors duration-700"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-primary/90 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-4 text-on-primary">
                <p className="text-xs font-bold uppercase opacity-80">Audit Progress</p>
                <p className="text-lg font-headline font-bold">84% of Today's Linen Accounted For</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </DashboardLayout>
  );
}
