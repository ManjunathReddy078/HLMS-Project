import React from 'react';
import DashboardLayout from '../components/DashboardLayout';

export default function Reports({ role, onLogout }) {
  return (
    <DashboardLayout role={role} onLogout={onLogout}>
      <div className="p-8 space-y-8 max-w-[1600px] animate-fade-in mx-auto w-full">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between md:items-end gap-4">
          <div>
            <h2 className="text-3xl font-bold font-headline text-on-surface tracking-tight">Reports & Analytics</h2>
            <p className="text-sm text-on-surface-variant font-body mt-1">System performance insights and exportable reports</p>
          </div>
        </div>

        {/* Filter Bar Section */}
        <section className="bg-surface-container-low rounded-xl p-4 flex flex-wrap items-center gap-4 shadow-sm">
          <div className="flex flex-col gap-1.5 flex-1 min-w-[180px]">
            <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant ml-1">Date Range</label>
            <select className="bg-surface-container-lowest border-none rounded-lg text-sm font-medium py-2 pl-3 pr-10 focus:ring-2 focus:ring-primary/20 shadow-sm outline-variant/15 outline-1 outline">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Custom Range</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5 flex-1 min-w-[180px]">
            <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant ml-1">Ward Selection</label>
            <select className="bg-surface-container-lowest border-none rounded-lg text-sm font-medium py-2 pl-3 pr-10 focus:ring-2 focus:ring-primary/20 shadow-sm outline-variant/15 outline-1 outline">
              <option>All Wards</option>
              <option>ICU - North Wing</option>
              <option>Pediatrics</option>
              <option>Emergency Room</option>
              <option>Maternity</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5 flex-1 min-w-[180px]">
            <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant ml-1">Linen Type</label>
            <select className="bg-surface-container-lowest border-none rounded-lg text-sm font-medium py-2 pl-3 pr-10 focus:ring-2 focus:ring-primary/20 shadow-sm outline-variant/15 outline-1 outline">
              <option>All Types</option>
              <option>Bed Linens</option>
              <option>Surgical Scrubs</option>
              <option>Patient Gowns</option>
              <option>Towels</option>
            </select>
          </div>
          <div className="ml-auto flex items-end h-full pt-5">
            <button className="bg-primary text-on-primary px-5 py-2.5 rounded-lg flex items-center gap-2 text-sm font-bold shadow-md hover:opacity-90 transition-all w-full md:w-auto justify-center">
              <span className="material-symbols-outlined text-lg">ios_share</span> Export (PDF / CSV)
            </button>
          </div>
        </section>

        {/* KPI Summary Cards */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border-l-4 border-primary transition-transform hover:translate-y-[-2px]">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-primary-container text-on-primary-container rounded-lg">
                <span className="material-symbols-outlined text-lg">local_shipping</span>
              </div>
              <span className="text-xs font-bold text-secondary flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">trending_up</span> 12%
              </span>
            </div>
            <p className="text-sm font-medium text-on-surface-variant">Total Dispatches</p>
            <h3 className="text-3xl font-black font-headline mt-1">1,245</h3>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border-l-4 border-tertiary transition-transform hover:translate-y-[-2px]">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-tertiary-container text-on-tertiary-container rounded-lg">
                <span className="material-symbols-outlined text-lg">assignment_return</span>
              </div>
              <span className="text-xs font-bold text-secondary flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">trending_up</span> 8%
              </span>
            </div>
            <p className="text-sm font-medium text-on-surface-variant">Total Returns</p>
            <h3 className="text-3xl font-black font-headline mt-1">1,189</h3>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border-l-4 transition-transform hover:translate-y-[-2px] border-outline-variant/30">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-error-container text-on-error-container rounded-lg">
                <span className="material-symbols-outlined text-lg">inventory</span>
              </div>
              <span className="text-xs font-bold text-error flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">trending_down</span> 1.2%
              </span>
            </div>
            <p className="text-sm font-medium text-on-surface-variant">Loss Rate (%)</p>
            <h3 className="text-3xl font-black font-headline mt-1">4.2%</h3>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border-l-4 border-secondary transition-transform hover:translate-y-[-2px]">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-secondary-container text-on-secondary-container rounded-lg">
                <span className="material-symbols-outlined text-lg">schedule</span>
              </div>
              <span className="text-xs font-bold text-secondary flex items-center gap-1">
                <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span> 0.4h
              </span>
            </div>
            <p className="text-sm font-medium text-on-surface-variant">Avg Turnaround</p>
            <h3 className="text-3xl font-black font-headline mt-1">3.8 <span className="text-sm font-bold text-on-surface-variant">hrs</span></h3>
          </div>
        </section>

        {/* Analytics Section (Bento Grid Style) */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Line Chart: Linen Movement Trend */}
          <div className="lg:col-span-8 bg-surface-container-lowest p-6 rounded-xl shadow-sm flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h4 className="text-lg font-bold font-headline">Linen Movement Trend</h4>
              <div className="flex gap-4"></div>
            </div>
            <div className="flex-1 min-h-[300px] relative flex items-end gap-2">
              {/* Simulated Line Chart with CSS bars for structure */}
              <div className="absolute inset-0 flex flex-col justify-between py-2 pointer-events-none">
                <div className="border-b border-outline-variant/10 w-full h-0"></div>
                <div className="border-b border-outline-variant/10 w-full h-0"></div>
                <div className="border-b border-outline-variant/10 w-full h-0"></div>
                <div className="border-b border-outline-variant/10 w-full h-0"></div>
                <div className="border-b border-outline-variant/10 w-full h-0"></div>
              </div>
              
              <div className="flex-1 flex flex-col justify-end items-center group relative z-10">
                <div className="w-full bg-primary/20 rounded-t-sm h-[60%] transition-all hover:bg-primary/40"></div>
                <div className="w-full bg-tertiary/20 rounded-t-sm h-[55%] -mt-4 border-t-2 border-tertiary"></div>
                <span className="text-[10px] text-on-surface-variant mt-2 font-medium">Mon</span>
              </div>
              <div className="flex-1 flex flex-col justify-end items-center group relative z-10">
                <div className="w-full bg-primary/20 rounded-t-sm h-[75%] transition-all hover:bg-primary/40"></div>
                <div className="w-full bg-tertiary/20 rounded-t-sm h-[68%] -mt-4 border-t-2 border-tertiary"></div>
                <span className="text-[10px] text-on-surface-variant mt-2 font-medium">Tue</span>
              </div>
              <div className="flex-1 flex flex-col justify-end items-center group relative z-10">
                <div className="w-full bg-primary/20 rounded-t-sm h-[85%] transition-all hover:bg-primary/40"></div>
                <div className="w-full bg-tertiary/20 rounded-t-sm h-[82%] -mt-4 border-t-2 border-tertiary"></div>
                <span className="text-[10px] text-on-surface-variant mt-2 font-medium">Wed</span>
              </div>
              <div className="flex-1 flex flex-col justify-end items-center group relative z-10">
                <div className="w-full bg-primary/20 rounded-t-sm h-[65%] transition-all hover:bg-primary/40"></div>
                <div className="w-full bg-tertiary/20 rounded-t-sm h-[60%] -mt-4 border-t-2 border-tertiary"></div>
                <span className="text-[10px] text-on-surface-variant mt-2 font-medium">Thu</span>
              </div>
              <div className="flex-1 flex flex-col justify-end items-center group relative z-10">
                <div className="w-full bg-primary/20 rounded-t-sm h-[90%] transition-all hover:bg-primary/40"></div>
                <div className="w-full bg-tertiary/20 rounded-t-sm h-[88%] -mt-4 border-t-2 border-tertiary"></div>
                <span className="text-[10px] text-on-surface-variant mt-2 font-medium">Fri</span>
              </div>
              <div className="flex-1 flex flex-col justify-end items-center group relative z-10">
                <div className="w-full bg-primary/20 rounded-t-sm h-[40%] transition-all hover:bg-primary/40"></div>
                <div className="w-full bg-tertiary/20 rounded-t-sm h-[38%] -mt-4 border-t-2 border-tertiary"></div>
                <span className="text-[10px] text-on-surface-variant mt-2 font-medium">Sat</span>
              </div>
              <div className="flex-1 flex flex-col justify-end items-center group relative z-10">
                <div className="w-full bg-primary/20 rounded-t-sm h-[35%] transition-all hover:bg-primary/40"></div>
                <div className="w-full bg-tertiary/20 rounded-t-sm h-[32%] -mt-4 border-t-2 border-tertiary"></div>
                <span className="text-[10px] text-on-surface-variant mt-2 font-medium">Sun</span>
              </div>
            </div>
          </div>

          {/* Pie Chart: Ward-wise Distribution */}
          <div className="lg:col-span-4 bg-surface-container-lowest p-6 rounded-xl shadow-sm flex flex-col">
            <h4 className="text-lg font-bold font-headline mb-6">Ward Distribution</h4>
            <div className="flex-1 flex flex-col justify-center items-center">
              <div className="relative w-48 h-48 rounded-full border-[16px] border-surface-container flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-[16px] border-primary border-t-transparent border-l-transparent transform -rotate-45"></div>
                <div className="absolute inset-0 rounded-full border-[16px] border-tertiary-container border-b-transparent border-r-transparent border-l-transparent transform rotate-12"></div>
                <div className="text-center">
                  <span className="block text-2xl font-black font-headline">2.4k</span>
                  <span className="text-[10px] text-on-surface-variant font-bold uppercase">Total Items</span>
                </div>
              </div>
              <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-3 w-full">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary"></span>
                  <span className="text-xs font-medium">ICU (42%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-tertiary"></span>
                  <span className="text-xs font-medium">ER (28%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-secondary"></span>
                  <span className="text-xs font-medium">Peds (15%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-outline"></span>
                  <span className="text-xs font-medium">Others (15%)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bar Chart: Loss vs Recovered */}
          <div className="lg:col-span-12 bg-surface-container-lowest p-6 rounded-xl shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h4 className="text-lg font-bold font-headline">Loss vs Recovered Items (Monthly)</h4>
              <div className="bg-surface-container p-1 rounded-lg flex">
                <button className="px-3 py-1 bg-white rounded shadow-sm text-xs font-bold">Qty</button>
                <button className="px-3 py-1 text-xs font-bold text-on-surface-variant">Value ($)</button>
              </div>
            </div>
            <div className="h-48 flex items-end gap-4 md:gap-12 px-2 md:px-6">
              <div className="flex-1 flex flex-col items-center gap-3">
                <div className="w-full flex gap-1 justify-center h-full items-end">
                  <div className="w-4 md:w-8 bg-primary rounded-t-md h-[80%] hover:opacity-80 transition-opacity"></div>
                  <div className="w-4 md:w-8 bg-error-container rounded-t-md h-[15%] hover:opacity-80 transition-opacity"></div>
                </div>
                <span className="text-[10px] md:text-xs font-bold">Jan</span>
              </div>
              <div className="flex-1 flex flex-col items-center gap-3">
                <div className="w-full flex gap-1 justify-center h-full items-end">
                  <div className="w-4 md:w-8 bg-primary rounded-t-md h-[95%] hover:opacity-80 transition-opacity"></div>
                  <div className="w-4 md:w-8 bg-error-container rounded-t-md h-[5%] hover:opacity-80 transition-opacity"></div>
                </div>
                <span className="text-[10px] md:text-xs font-bold">Feb</span>
              </div>
              <div className="flex-1 flex flex-col items-center gap-3">
                <div className="w-full flex gap-1 justify-center h-full items-end">
                  <div className="w-4 md:w-8 bg-primary rounded-t-md h-[70%] hover:opacity-80 transition-opacity"></div>
                  <div className="w-4 md:w-8 bg-error-container rounded-t-md h-[25%] hover:opacity-80 transition-opacity"></div>
                </div>
                <span className="text-[10px] md:text-xs font-bold">Mar</span>
              </div>
              <div className="flex-1 flex flex-col items-center gap-3">
                <div className="w-full flex gap-1 justify-center h-full items-end">
                  <div className="w-4 md:w-8 bg-primary rounded-t-md h-[85%] hover:opacity-80 transition-opacity"></div>
                  <div className="w-4 md:w-8 bg-error-container rounded-t-md h-[10%] hover:opacity-80 transition-opacity"></div>
                </div>
                <span className="text-[10px] md:text-xs font-bold">Apr</span>
              </div>
              <div className="flex-1 flex flex-col items-center gap-3">
                <div className="w-full flex gap-1 justify-center h-full items-end">
                  <div className="w-4 md:w-8 bg-primary rounded-t-md h-[92%] hover:opacity-80 transition-opacity"></div>
                  <div className="w-4 md:w-8 bg-error-container rounded-t-md h-[8%] hover:opacity-80 transition-opacity"></div>
                </div>
                <span className="text-[10px] md:text-xs font-bold">May</span>
              </div>
            </div>
          </div>
        </section>

        {/* Report Table Section */}
        <section className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden border border-outline-variant/10">
          <div className="px-6 py-5 border-b border-outline-variant/10 flex justify-between items-center">
            <h4 className="text-lg font-bold font-headline">Linen Movement Report Log</h4>
            <button className="text-primary text-xs font-bold flex items-center gap-1 hover:underline">
              View Detailed Log <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead className="bg-surface-container-low">
                <tr>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-on-surface-variant">Date</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-on-surface-variant">Ward</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-on-surface-variant">Dispatch</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-on-surface-variant">Return</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-on-surface-variant">Missing</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-on-surface-variant">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                <tr className="hover:bg-surface-container-low/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium">Oct 24, 2026</td>
                  <td className="px-6 py-4 text-sm">ICU - North Wing</td>
                  <td className="px-6 py-4 text-sm font-semibold">145</td>
                  <td className="px-6 py-4 text-sm">142</td>
                  <td className="px-6 py-4 text-sm text-error font-bold">3</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container text-[10px] font-bold uppercase">
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span> Normal
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-surface-container-low/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium">Oct 23, 2026</td>
                  <td className="px-6 py-4 text-sm">Emergency Room</td>
                  <td className="px-6 py-4 text-sm font-semibold">210</td>
                  <td className="px-6 py-4 text-sm">188</td>
                  <td className="px-6 py-4 text-sm text-error font-bold">22</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-error-container text-on-error-container text-[10px] font-bold uppercase">
                      <span className="w-1.5 h-1.5 rounded-full bg-error"></span> Alert
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-surface-container-low/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium">Oct 23, 2026</td>
                  <td className="px-6 py-4 text-sm">Maternity Ward</td>
                  <td className="px-6 py-4 text-sm font-semibold">88</td>
                  <td className="px-6 py-4 text-sm">88</td>
                  <td className="px-6 py-4 text-sm text-on-surface-variant font-bold">0</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container text-[10px] font-bold uppercase">
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span> Normal
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-surface-container-low/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium">Oct 22, 2026</td>
                  <td className="px-6 py-4 text-sm">Pediatrics</td>
                  <td className="px-6 py-4 text-sm font-semibold">132</td>
                  <td className="px-6 py-4 text-sm">129</td>
                  <td className="px-6 py-4 text-sm text-error font-bold">3</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container text-[10px] font-bold uppercase">
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span> Normal
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-surface-container-low/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium">Oct 22, 2026</td>
                  <td className="px-6 py-4 text-sm">General Surgery</td>
                  <td className="px-6 py-4 text-sm font-semibold">195</td>
                  <td className="px-6 py-4 text-sm">194</td>
                  <td className="px-6 py-4 text-sm text-error font-bold">1</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container text-[10px] font-bold uppercase">
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span> Normal
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Export Section (Bottom) */}
        <section className="bg-surface-container rounded-xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 border-2 border-dashed border-outline-variant/30">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-surface-container-lowest rounded-full flex items-center justify-center text-primary shadow-sm">
              <span className="material-symbols-outlined text-2xl">cloud_download</span>
            </div>
            <div>
              <h5 className="font-bold font-headline">Need a hard copy?</h5>
              <p className="text-xs text-on-surface-variant mt-1">Choose your preferred format to export the filtered dataset.</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <button className="flex-1 md:flex-none px-6 py-3 bg-primary text-on-primary rounded-lg font-bold text-sm shadow-md hover:opacity-90 transition-opacity">
              Generate Report
            </button>
            <button className="flex-1 md:flex-none px-6 py-3 bg-surface-container-lowest text-on-surface border border-outline-variant/20 rounded-lg font-bold text-sm shadow-sm flex items-center justify-center gap-2 hover:bg-surface-container transition-colors">
              <span className="material-symbols-outlined text-lg text-error" style={{ fontVariationSettings: "'FILL' 1" }}>picture_as_pdf</span>
              PDF
            </button>
            <button className="flex-1 md:flex-none px-6 py-3 bg-surface-container-lowest text-on-surface border border-outline-variant/20 rounded-lg font-bold text-sm shadow-sm flex items-center justify-center gap-2 hover:bg-surface-container transition-colors">
              <span className="material-symbols-outlined text-lg text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>csv</span>
              CSV
            </button>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
