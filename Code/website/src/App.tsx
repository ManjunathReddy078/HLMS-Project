import React, { useState } from 'react';
import { AlertCircle, Plus, Send, Trash2, Hospital, MapPin, PackageSearch, ShieldCheck } from 'lucide-react';

const LINEN_TYPES = [
  "Bedsheet", "Pillow Cover", "Blankets", "Patient Gown", "Mother Gown", 
  "NICU Gown", "Surgical Linen", "Staff Uniform", "Towel", "Drapes", 
  "Aprons", "Curtains"
];

const WARDS = ['ICU', 'General Ward', 'Maternity', 'Emergency', 'Surgery', 'Pediatrics', 'Oncology'];

function App() {
  const [empId, setEmpId] = useState('');
  const [empName, setEmpName] = useState('');
  const [ward, setWard] = useState('');
  const [floor, setFloor] = useState('');
  const [room, setRoom] = useState('');
  
  const [selectedItem, setSelectedItem] = useState(LINEN_TYPES[0]);
  const [qty, setQty] = useState('1');
  const [requestedItems, setRequestedItems] = useState<{item: string, qty: number}[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const addItem = () => {
    if (!qty || isNaN(Number(qty)) || Number(qty) <= 0) return;
    setRequestedItems([...requestedItems, { item: selectedItem, qty: Number(qty) }]);
    setQty('1');
  };

  const removeItem = (index: number) => {
    setRequestedItems(requestedItems.filter((_, i) => i !== index));
  };

  const submitRequest = () => {
    if (!empId || !empName || !ward || !floor || !room) {
      alert("Validation Failed: All identity and location fields are strictly mandatory.");
      return;
    }
    if (requestedItems.length === 0) {
      alert("Validation Failed: You must add at least one linen item to the request payload.");
      return;
    }
    
    // In production, this JSON payload is instantly pushed to Firebase RTDB
    console.log("Pushing to Firebase:", { empId, empName, ward, floor, room, requestedItems });
    setIsSubmitted(true);
  };

  return (
    <>
      <div className="watermark"></div>

      {/* Global Application Header */}
      <header className="app-header">
        <img src="/logo.png" alt="HLM Logo" style={{width: 75, height: 75, objectFit: 'contain'}} />
        <div>
          <h1 style={{fontSize: 26, fontWeight: 900, color: 'var(--text-main)', margin: 0, lineHeight: 1.2}}>HLM Portal</h1>
          <p style={{fontSize: 14, fontWeight: 600, color: 'var(--text-muted)', margin: 0}}>Ward Request Terminal</p>
        </div>
      </header>

      <main className="main-content" style={{paddingBottom: 250}}>
        {isSubmitted ? (
          <div className="card" style={{textAlign: 'center', padding: '60px 40px', position: 'relative', zIndex: 10}}>
            <div style={{width: 90, height: 90, borderRadius: 45, backgroundColor: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', boxShadow: '0 10px 20px rgba(16, 185, 129, 0.2)'}}>
              <Send color="var(--secondary)" size={40} style={{marginLeft: 5}} />
            </div>
            <h1 style={{color: 'var(--text-main)', marginBottom: 15, fontSize: 32, fontWeight: 900}}>SOS Dispatch Sent!</h1>
            <p style={{color: 'var(--text-muted)', fontSize: 18, marginBottom: 40, lineHeight: 1.6}}>
              A high-priority alert has been successfully pushed to the Ground Worker's Android handheld. 
              They will arrive at <strong style={{color: 'var(--text-main)'}}>{ward} (Room {room})</strong> shortly.
            </p>
            <button className="btn btn-primary" onClick={() => { setIsSubmitted(false); setRequestedItems([]); }}>
              Submit Another Request
            </button>
          </div>
        ) : (
          <div className="card" style={{position: 'relative', zIndex: 10}}>
            <div style={{textAlign: 'center', marginBottom: 40}}>
              <h1 className="gradient-text" style={{fontSize: 32, fontWeight: 900, marginBottom: 10}}>Urgent Linen Request</h1>
              <p style={{fontSize: 16, color: 'var(--text-muted)', fontWeight: 500}}>Bypass physical intercoms and dispatch items directly to the floor worker.</p>
            </div>

            <div className="grid-2">
              <div style={{backgroundColor: '#f8fafc', padding: 24, borderRadius: 12, border: '1px solid var(--border-color)'}}>
                 <h3 className="section-header">
                   <ShieldCheck size={22} color="var(--primary)" /> 1. Requester Identity
                 </h3>
                 <div className="form-group">
                   <label className="form-label">Employee ID <span style={{color: 'var(--danger)'}}>*</span></label>
                   <input className="form-input" placeholder="e.g. NUR-9921" required value={empId} onChange={e => setEmpId(e.target.value)} />
                 </div>
                 <div className="form-group" style={{marginBottom: 0}}>
                   <label className="form-label">Full Name <span style={{color: 'var(--danger)'}}>*</span></label>
                   <input className="form-input" placeholder="e.g. Sarah Jenkins" required value={empName} onChange={e => setEmpName(e.target.value)} />
                 </div>
              </div>

              <div style={{backgroundColor: '#f8fafc', padding: 24, borderRadius: 12, border: '1px solid var(--border-color)'}}>
                 <h3 className="section-header">
                   <MapPin size={22} color="var(--primary)" /> 2. Target Location
                 </h3>
                 <div className="form-group">
                   <label className="form-label">Ward Designation <span style={{color: 'var(--danger)'}}>*</span></label>
                   <select className="form-input" required value={ward} onChange={e => setWard(e.target.value)}>
                     <option value="" disabled>Select Ward...</option>
                     {WARDS.map(w => <option key={w} value={w}>{w}</option>)}
                   </select>
                 </div>
                 <div className="grid-2" style={{marginBottom: 0}}>
                   <div className="form-group" style={{marginBottom: 0}}>
                     <label className="form-label">Floor <span style={{color: 'var(--danger)'}}>*</span></label>
                     <input type="number" className="form-input" placeholder="e.g. 3" required value={floor} onChange={e => setFloor(e.target.value)} />
                   </div>
                   <div className="form-group" style={{marginBottom: 0}}>
                     <label className="form-label">Room <span style={{color: 'var(--danger)'}}>*</span></label>
                     <input className="form-input" placeholder="e.g. 304B" required value={room} onChange={e => setRoom(e.target.value)} />
                   </div>
                 </div>
              </div>
            </div>

            <div style={{height: 1, backgroundColor: 'var(--border-color)', margin: '40px 0'}} />

            <div style={{backgroundColor: '#f8fafc', padding: 24, borderRadius: 12, border: '1px solid var(--border-color)'}}>
              <h3 className="section-header" style={{marginBottom: 20}}>
                <PackageSearch size={22} color="var(--primary)" /> 3. Build Request Payload
              </h3>
              
              <div style={{display: 'flex', gap: 15, alignItems: 'flex-end', marginBottom: 25}}>
                 <div style={{flex: 2}}>
                   <label className="form-label">Select Missing Item <span style={{color: 'var(--danger)'}}>*</span></label>
                   <select className="form-input" value={selectedItem} onChange={e => setSelectedItem(e.target.value)}>
                     {LINEN_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                   </select>
                 </div>
                 <div style={{flex: 1}}>
                   <label className="form-label">Quantity <span style={{color: 'var(--danger)'}}>*</span></label>
                   <input type="number" min="1" className="form-input" value={qty} onChange={e => setQty(e.target.value)} />
                 </div>
                 <button className="btn btn-secondary" style={{padding: '14px 20px', width: 'auto'}} onClick={addItem}>
                   <Plus size={20} /> ADD
                 </button>
              </div>

              {requestedItems.length > 0 && (
                <div style={{marginBottom: 30}}>
                  <label className="form-label" style={{color: 'var(--primary)'}}>Active Items in Payload:</label>
                  <div style={{border: '2px solid var(--border-color)', borderRadius: 12, overflow: 'hidden'}}>
                    {requestedItems.map((req, idx) => (
                      <div key={idx} className="cart-item">
                        <span style={{fontWeight: 800, fontSize: 16, color: 'var(--text-main)'}}>{req.item}</span>
                        <div style={{display: 'flex', alignItems: 'center', gap: 15}}>
                          <span className="cart-qty-badge">Qty: {req.qty}</span>
                          <button onClick={() => removeItem(idx)} style={{color: 'var(--danger)', padding: 8}}><Trash2 size={20} /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button className="btn btn-danger" style={{padding: 20, fontSize: 18, marginTop: 10, letterSpacing: 1}} onClick={submitRequest}>
                <AlertCircle size={24} /> DISPATCH SOS PROTOCOL
              </button>
            </div>
          </div>
        )}
      </main>

      <footer className="app-footer" style={{position: 'relative', zIndex: 10}}>
        <p style={{fontWeight: 800, color: 'var(--text-main)', marginBottom: 5}}>PESUIMSR Hospital Laundry Management System</p>
        <p style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5}}>
          <ShieldCheck size={14} color="var(--secondary)" /> Secure Inter-Departmental Terminal v1.0
        </p>
      </footer>
    </>
  );
}

export default App;
