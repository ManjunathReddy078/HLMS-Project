import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function DashboardLayout({ children, role, onLogout }) {
  const isAdmin = role === 'admin';
  const location = useLocation();

  const getLinkClass = (path) => {
    const isActive = location.pathname === path || (path === '/admin' && location.pathname === '/admin/') || (path === '/supervisor' && location.pathname === '/supervisor/');
    if (isActive) {
      return "flex items-center gap-4 py-3 px-6 bg-surface-container-lowest text-primary rounded-r-full shadow-sm font-label text-sm font-bold border-l-4 border-primary";
    }
    return "flex items-center gap-4 py-3 px-6 text-on-surface-variant hover:text-primary hover:bg-primary/5 transition-all font-label text-sm font-medium rounded-r-full group border-l-4 border-transparent";
  };

  return (
    <div className={`min-h-screen ${isAdmin ? 'theme-admin' : 'theme-supervisor'} bg-background text-on-surface font-body antialiased`}>
      {/* Top Navbar */}
      <header className="fixed top-0 lg:left-64 left-0 right-0 z-50 bg-surface/80 backdrop-blur-2xl shadow-[0_8px_24px_rgba(25,28,29,0.04)] border-b border-outline-variant/20">
        <div className="flex justify-between items-center w-full px-8 py-3">
          <div className="flex items-center gap-8">
            <span className="text-xl font-black text-primary tracking-tighter font-headline">
              {isAdmin ? 'HLMS Clinical Command' : 'LinenFlow HLMS'}
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center bg-surface-container rounded-full px-4 py-1.5 hidden md:flex">
              <span className="material-symbols-outlined text-on-surface-variant text-lg">search</span>
              <input className="bg-transparent border-none focus:ring-0 text-sm w-48 outline-none ml-2" placeholder="Search facilities..." type="text" />
            </div>
            <button className="material-symbols-outlined text-on-surface-variant p-2 hover:bg-surface-container-low rounded-full transition-colors relative">
              notifications
              <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full"></span>
            </button>
            <button className="material-symbols-outlined text-on-surface-variant p-2 hover:bg-surface-container-low rounded-full transition-colors">settings</button>
            <div className="flex items-center gap-2 pl-2 border-l border-outline-variant/30 ml-2 cursor-pointer" onClick={onLogout}>
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-on-primary text-xs font-bold ring-2 ring-surface-container-high ring-offset-2">
                {isAdmin ? 'AD' : 'SU'}
              </div>
              <div className="text-right hidden md:block">
                <span className="text-xs font-bold block leading-tight">{isAdmin ? 'Admin User' : 'Supervisor A.'}</span>
                <span className="text-[10px] text-on-surface-variant uppercase tracking-tighter">{isAdmin ? 'Executive' : 'Day Shift Lead'}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Side Navigation */}
      <aside className="h-screen w-64 fixed left-0 top-0 bg-surface-container-low hidden lg:flex flex-col shadow-sm border-r border-outline-variant/10">
        <div className="px-6 py-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-on-primary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              {isAdmin ? 'domain' : 'local_laundry_service'}
            </span>
          </div>
          <div>
            <p className="font-headline font-bold text-primary leading-tight">HLMS</p>
            <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold leading-tight">Hospital Laundry Management System</p>
          </div>
        </div>

        <nav className="flex flex-col gap-1 pr-4 mt-4">
          <Link to={isAdmin ? "/admin" : "/supervisor"} className={getLinkClass(isAdmin ? '/admin' : '/supervisor')}>
            <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive(isAdmin ? '/admin' : '/supervisor') ? "'FILL' 1" : "'FILL' 0" }}>dashboard</span>
            <span>Dashboard</span>
          </Link>
          
          {isAdmin ? (
            <>
              <Link to="/admin/facilities" className={getLinkClass('/admin/facilities')}>
                <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive('/admin/facilities') ? "'FILL' 1" : "'FILL' 0" }}>domain</span><span>Facilities</span>
              </Link>
              <Link to="/admin/inventory" className={getLinkClass('/admin/inventory')}>
                <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive('/admin/inventory') ? "'FILL' 1" : "'FILL' 0" }}>inventory_2</span><span>Inventory</span>
              </Link>
              <Link to="/admin/utilization" className={getLinkClass('/admin/utilization')}>
                <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive('/admin/utilization') ? "'FILL' 1" : "'FILL' 0" }}>monitoring</span><span>Utilization</span>
              </Link>
              <Link to="/admin/alerts" className={getLinkClass('/admin/alerts')}>
                <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive('/admin/alerts') ? "'FILL' 1" : "'FILL' 0" }}>warning</span><span>Alerts</span>
              </Link>
              <Link to="/admin/reports" className={getLinkClass('/admin/reports')}>
                <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive('/admin/reports') ? "'FILL' 1" : "'FILL' 0" }}>description</span><span>Reports</span>
              </Link>
            </>
          ) : (
            <>
              <Link to="/supervisor/tracking" className={getLinkClass('/supervisor/tracking')}>
                <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive('/supervisor/tracking') ? "'FILL' 1" : "'FILL' 0" }}>location_on</span><span>Tracking</span>
              </Link>
              <Link to="/supervisor/discrepancies" className={getLinkClass('/supervisor/discrepancies')}>
                <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive('/supervisor/discrepancies') ? "'FILL' 1" : "'FILL' 0" }}>warning</span><span>Discrepancies</span>
              </Link>
              <Link to="/supervisor/reports" className={getLinkClass('/supervisor/reports')}>
                <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive('/supervisor/reports') ? "'FILL' 1" : "'FILL' 0" }}>assessment</span><span>Reports</span>
              </Link>
            </>
          )}
        </nav>

        <div className="mt-auto p-6">
          <button className="w-full py-3 bg-primary text-on-primary rounded-xl font-bold text-sm shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-sm">{isAdmin ? 'add' : 'add_circle'}</span> 
            {isAdmin ? 'Add Facility' : 'Monitor Requests'}
          </button>
        </div>
      </aside>

      {/* Main Canvas */}
      <main className="lg:ml-64 pt-20 min-h-screen relative overflow-x-hidden">
        {children}
      </main>
    </div>
  );

  function isActive(path) {
    return location.pathname === path || (path === '/admin' && location.pathname === '/admin/') || (path === '/supervisor' && location.pathname === '/supervisor/');
  }
}
