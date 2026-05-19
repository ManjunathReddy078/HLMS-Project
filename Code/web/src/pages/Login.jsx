import React from 'react';

export default function Login({ onLogin }) {
  return (
    <div className="theme-admin min-h-screen bg-background text-on-surface font-body antialiased flex items-center justify-center relative overflow-hidden">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-tertiary/20 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="w-full max-w-lg bg-surface-container-lowest p-10 rounded-[2rem] shadow-[0_24px_60px_rgba(25,28,29,0.08)] border border-outline-variant/20 relative z-10">
        
        <div className="w-20 h-20 mx-auto bg-primary-container rounded-3xl flex items-center justify-center mb-8 rotate-3 shadow-lg">
          <span className="material-symbols-outlined text-primary text-[40px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            local_laundry_service
          </span>
        </div>
        
        <div className="text-center mb-10">
          <h1 className="text-3xl font-headline font-extrabold tracking-tight mb-2">HLIMS Portal</h1>
          <p className="text-on-surface-variant text-sm font-medium">Hospital Linen & Inventory Management</p>
        </div>

        <div className="space-y-4">
          <button 
            onClick={() => onLogin('admin')} 
            className="w-full relative group overflow-hidden bg-primary text-on-primary py-4 px-6 rounded-2xl font-bold flex items-center justify-between shadow-md hover:shadow-xl transition-all hover:-translate-y-0.5"
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-on-primary/80" style={{ fontVariationSettings: "'FILL' 1" }}>admin_panel_settings</span>
              <span className="text-sm tracking-wide">Nursing Superintendent</span>
            </div>
            <span className="material-symbols-outlined transform group-hover:translate-x-1 transition-transform">arrow_forward</span>
            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          </button>
          
          <button 
            onClick={() => onLogin('supervisor')} 
            className="w-full relative group overflow-hidden bg-surface-container-high text-on-surface py-4 px-6 rounded-2xl font-bold flex items-center justify-between border border-outline-variant/20 hover:border-outline transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-on-surface-variant">engineering</span>
              <span className="text-sm tracking-wide">Operations Supervisor</span>
            </div>
            <span className="material-symbols-outlined text-on-surface-variant transform group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </button>
        </div>

        <div className="mt-12 pt-6 border-t border-outline-variant/20 flex items-center justify-center gap-2 text-on-surface-variant">
          <span className="material-symbols-outlined text-[16px]">smartphone</span>
          <span className="text-xs font-bold uppercase tracking-widest">Ground Workers: Use Handhelds</span>
        </div>
      </div>
    </div>
  );
}
