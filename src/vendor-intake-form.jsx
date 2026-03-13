import { useState, useEffect } from "react";
import {
  CAT_GROUPS, VENDOR_TYPES, REGIONS, CAPABILITY_GROUPS,
  PAYMENT_TERMS, CURRENCIES, API_URL,
} from "./form-config";

/* ─── STEPS ─── */
const STEPS = [
  { id:1, label:"Category", icon:"01" },
  { id:2, label:"Vendor Info", icon:"02" },
  { id:3, label:"Capabilities", icon:"03" },
  { id:4, label:"Financial", icon:"04" },
  { id:5, label:"Review", icon:"05" },
];

/* ─── LIGHT PALETTE ─── */
const S = {
  bg:"#F7F5F2", card:"#FFFFFF", border:"#E5E0DA", border2:"#D4CEC6",
  accent:"#C2673B", accentSoft:"#C2673B14", accentHover:"#A8552F",
  text:"#2C2825", textMid:"#5C5650", textDim:"#928B82", textGhost:"#B8B2A9",
  input:"#FAFAF8", inputBorder:"#DDD8D1", inputFocus:"#C2673B",
  success:"#3D8B5E", successBg:"#3D8B5E10",
  danger:"#C0534F", dangerBg:"#C0534F10",
  mono:"'Spline Sans Mono', monospace",
  sans:"'Source Sans 3', sans-serif",
  display:"'Fraunces', serif",
};
const FONTS_URL = "https://fonts.googleapis.com/css2?family=Fraunces:wght@700;800&family=Source+Sans+3:wght@300;400;500;600&family=Spline+Sans+Mono:wght@400;500;600&display=swap";

/* ─── SHARED COMPONENTS ─── */
function Stepper({ current }) {
  return (
    <div style={{ display:"flex", alignItems:"center", marginBottom:32 }}>
      {STEPS.map((s,i) => {
        const done = s.id < current, active = s.id === current;
        return (
          <div key={s.id} style={{ display:"flex", alignItems:"center", flex: i < STEPS.length-1 ? 1 : "none" }}>
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center", minWidth:48 }}>
              <div style={{
                width:32, height:32, borderRadius:"50%",
                display:"flex", alignItems:"center", justifyContent:"center",
                background: done ? S.accent : active ? S.accentSoft : "transparent",
                border:`2px solid ${done||active ? S.accent : S.border2}`,
                color: done ? "#fff" : active ? S.accent : S.textGhost,
                fontFamily:S.mono, fontSize:11, fontWeight:600, transition:"all 0.25s",
              }}>{done ? "✓" : s.icon}</div>
              <span style={{
                fontFamily:S.mono, fontSize:8, letterSpacing:"0.08em",
                textTransform:"uppercase", marginTop:5, fontWeight: active ? 600 : 400,
                color: done||active ? S.textMid : S.textGhost,
              }}>{s.label}</span>
            </div>
            {i < STEPS.length-1 && <div style={{ flex:1, height:1.5, borderRadius:1, background: done ? S.accent : S.border, margin:"0 6px", marginBottom:16, transition:"background 0.3s" }} />}
          </div>
        );
      })}
    </div>
  );
}

function Field({ label, required, hint, children }) {
  return (
    <div style={{ marginBottom:18 }}>
      <label style={{ display:"block", fontFamily:S.mono, fontSize:10.5, fontWeight:500, letterSpacing:"0.08em", textTransform:"uppercase", color:S.textMid, marginBottom:5 }}>
        {label}{required && <span style={{ color:S.accent, marginLeft:3 }}>*</span>}
      </label>
      {children}
      {hint && <p style={{ fontFamily:S.mono, fontSize:9, color:S.textGhost, marginTop:3 }}>{hint}</p>}
    </div>
  );
}

const inputBase = { width:"100%", padding:"10px 14px", background:S.input, border:`1.5px solid ${S.inputBorder}`, borderRadius:6, color:S.text, fontFamily:S.sans, fontSize:14, outline:"none", boxSizing:"border-box", transition:"border-color 0.2s, box-shadow 0.2s" };
const onFocus = e => { e.target.style.borderColor = S.inputFocus; e.target.style.boxShadow = `0 0 0 3px ${S.accentSoft}`; };
const onBlur = e => { e.target.style.borderColor = S.inputBorder; e.target.style.boxShadow = "none"; };

function Input({ label, required, placeholder, value, onChange, hint, prefix }) {
  return (
    <Field label={label} required={required} hint={hint}>
      <div style={{ position:"relative" }}>
        {prefix && <span style={{ position:"absolute", left:13, top:"50%", transform:"translateY(-50%)", fontFamily:S.mono, fontSize:13, color:S.textGhost, pointerEvents:"none" }}>{prefix}</span>}
        <input type="text" placeholder={placeholder} value={value} onChange={onChange} style={{ ...inputBase, ...(prefix ? { paddingLeft:28 } : {}) }} onFocus={onFocus} onBlur={onBlur} />
      </div>
    </Field>
  );
}
function TextArea({ label, placeholder, value, onChange, rows=3, hint }) {
  return <Field label={label} hint={hint}><textarea placeholder={placeholder} value={value} onChange={onChange} rows={rows} style={{ ...inputBase, resize:"vertical" }} onFocus={onFocus} onBlur={onBlur} /></Field>;
}
function Select({ label, required, value, onChange, options, hint }) {
  return (
    <Field label={label} required={required} hint={hint}>
      <select value={value} onChange={onChange} style={{ ...inputBase, color: value ? S.text : S.textGhost, cursor:"pointer" }} onFocus={onFocus} onBlur={onBlur}>
        <option value="">Select…</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </Field>
  );
}

function CategoryPicker({ selected, onSelect }) {
  return (
    <div>{CAT_GROUPS.map(g => (
      <div key={g.title} style={{ marginBottom:18 }}>
        <div style={{ fontFamily:S.mono, fontSize:9, letterSpacing:"0.1em", textTransform:"uppercase", color:S.accent, marginBottom:8, paddingBottom:5, borderBottom:`1.5px solid ${S.border}` }}>{g.title}</div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(160px, 1fr))", gap:7 }}>
          {g.items.map(cat => {
            const on = selected === cat;
            return (
              <button key={cat} onClick={() => onSelect(cat)} style={{ padding:"9px 12px", background: on ? S.accentSoft : "#fff", border:`1.5px solid ${on ? S.accent : S.border2}`, borderRadius:6, cursor:"pointer", color: on ? S.accent : S.textDim, fontFamily:S.sans, fontSize:13, fontWeight: on ? 600 : 400, textAlign:"left", transition:"all 0.15s", display:"flex", alignItems:"center", gap:8 }}>
                <span style={{ width:16, height:16, minWidth:16, borderRadius:"50%", border:`2px solid ${on ? S.accent : S.border2}`, background: on ? S.accent : "transparent", display:"flex", alignItems:"center", justifyContent:"center" }}>
                  {on && <span style={{ width:5, height:5, borderRadius:"50%", background:"#fff" }} />}
                </span>{cat}
              </button>
            );
          })}
        </div>
      </div>
    ))}</div>
  );
}

function ToggleGroup({ label, items, selected, onToggle }) {
  return (
    <Field label={label}>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(145px, 1fr))", gap:7 }}>
        {items.map(({ key, label: lbl }) => {
          const on = selected.includes(key);
          return (
            <button key={key} onClick={() => onToggle(key)} style={{ display:"flex", alignItems:"center", gap:7, padding:"8px 11px", background: on ? S.accentSoft : "#fff", border:`1.5px solid ${on ? S.accent : S.border2}`, borderRadius:6, cursor:"pointer", textAlign:"left", color: on ? S.accent : S.textDim, fontFamily:S.sans, fontSize:13, transition:"all 0.15s" }}>
              <span style={{ width:16, height:16, minWidth:16, borderRadius:4, border:`1.5px solid ${on ? S.accent : S.textGhost}`, background: on ? S.accent : "transparent", display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, color:"#fff", fontWeight:700 }}>{on && "✓"}</span>{lbl}
            </button>
          );
        })}
      </div>
    </Field>
  );
}

function ReviewSection({ title, children }) {
  const arr = Array.isArray(children) ? children : [children];
  if (!arr.some(c => c)) return null;
  return (
    <div style={{ marginBottom:16 }}>
      <h4 style={{ fontFamily:S.mono, fontSize:9.5, letterSpacing:"0.1em", textTransform:"uppercase", color:S.accent, marginBottom:8, paddingBottom:5, borderBottom:`1.5px solid ${S.border}` }}>{title}</h4>
      {children}
    </div>
  );
}
function ReviewRow({ label, value }) {
  if (!value || (Array.isArray(value) && !value.length)) return null;
  const display = Array.isArray(value) ? value.join(", ") : value;
  return (
    <div style={{ display:"flex", justifyContent:"space-between", padding:"4px 0", gap:12 }}>
      <span style={{ fontFamily:S.mono, fontSize:10.5, color:S.textGhost, textTransform:"uppercase", letterSpacing:"0.04em", minWidth:110, flexShrink:0 }}>{label}</span>
      <span style={{ fontFamily:S.sans, fontSize:13, color:S.text, textAlign:"right" }}>{display}</span>
    </div>
  );
}

function Btn({ children, onClick, variant="primary", disabled, style: sx }) {
  const styles = {
    primary: { background: disabled ? S.border2 : S.accent, color: disabled ? S.textGhost : "#fff", border:"none" },
    secondary: { background:"#fff", color:S.textDim, border:`1.5px solid ${S.border2}` },
    danger: { background:"transparent", color: disabled ? S.textGhost : S.danger, border:`1.5px solid ${disabled ? S.border2 : S.danger}44` },
  };
  return (
    <button onClick={onClick} disabled={disabled} style={{
      padding:"9px 22px", borderRadius:6, fontFamily:S.mono, fontSize:11,
      fontWeight:600, letterSpacing:"0.06em", textTransform:"uppercase",
      cursor: disabled ? "not-allowed" : "pointer", transition:"all 0.15s",
      ...styles[variant], ...sx,
    }}>{children}</button>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   ADMIN PANEL — queries the PostgreSQL database via the API
   ═══════════════════════════════════════════════════════════════════════ */
function AdminPanel({ onBack }) {
  const [vendors, setVendors] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("");

  const fetchVendors = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (catFilter) params.set("category", catFilter);
      const res = await fetch(`${API_URL}/api/vendors?${params}`);
      const data = await res.json();
      setVendors(data.vendors || []);
    } catch { setVendors([]); }
    setLoading(false);
  };

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_URL}/api/stats`);
      setStats(await res.json());
    } catch { setStats(null); }
  };

  useEffect(() => { fetchVendors(); fetchStats(); }, []);
  useEffect(() => { fetchVendors(); }, [search, catFilter]);

  const handleDelete = async (id, name) => {
   if (!window.confirm(`Delete vendor "${name}"? This cannot be undone.`)) return;
    await fetch(`${API_URL}/api/vendors/${id}`, { method: "DELETE" });
    fetchVendors();
    fetchStats();
  };

  const handleExport = () => {
    window.open(`${API_URL}/api/export`, "_blank");
  };

  const allCategories = [...new Set(vendors.map(v => v.category).filter(Boolean))].sort();

  return (
    <div style={{ minHeight:"100vh", background:S.bg, fontFamily:S.sans, color:S.text }}>
      <link href={FONTS_URL} rel="stylesheet" />

      {/* Header */}
      <div style={{ borderBottom:`1.5px solid ${S.border}`, padding:"16px 28px", background:"#fff", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:10 }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <Btn variant="secondary" onClick={onBack}>← Form</Btn>
          <div>
            <div style={{ fontFamily:S.mono, fontSize:9.5, letterSpacing:"0.1em", textTransform:"uppercase", color:S.textGhost }}>Admin Dashboard</div>
            <div style={{ fontFamily:S.display, fontSize:17, fontWeight:700 }}>Vendor Database</div>
          </div>
        </div>
        <div style={{ display:"flex", gap:8 }}>
          <Btn variant="primary" onClick={handleExport} disabled={!vendors.length}>⬇ Export Excel</Btn>
        </div>
      </div>

      <div style={{ maxWidth:1040, margin:"0 auto", padding:"28px 20px" }}>

        {/* Stats cards */}
        {stats && (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(140px, 1fr))", gap:12, marginBottom:24 }}>
            <div style={{ background:"#fff", border:`1.5px solid ${S.border}`, borderRadius:8, padding:"16px 18px" }}>
              <div style={{ fontFamily:S.mono, fontSize:9, letterSpacing:"0.1em", textTransform:"uppercase", color:S.textGhost, marginBottom:4 }}>Total Vendors</div>
              <div style={{ fontFamily:S.display, fontSize:28, fontWeight:800, color:S.accent }}>{stats.total}</div>
            </div>
            <div style={{ background:"#fff", border:`1.5px solid ${S.border}`, borderRadius:8, padding:"16px 18px" }}>
              <div style={{ fontFamily:S.mono, fontSize:9, letterSpacing:"0.1em", textTransform:"uppercase", color:S.textGhost, marginBottom:4 }}>Categories</div>
              <div style={{ fontFamily:S.display, fontSize:28, fontWeight:800, color:S.text }}>{stats.byCategory?.length || 0}</div>
            </div>
            <div style={{ background:"#fff", border:`1.5px solid ${S.border}`, borderRadius:8, padding:"16px 18px" }}>
              <div style={{ fontFamily:S.mono, fontSize:9, letterSpacing:"0.1em", textTransform:"uppercase", color:S.textGhost, marginBottom:4 }}>Regions</div>
              <div style={{ fontFamily:S.display, fontSize:28, fontWeight:800, color:S.text }}>{stats.byRegion?.length || 0}</div>
            </div>
            <div style={{ background:"#fff", border:`1.5px solid ${S.border}`, borderRadius:8, padding:"16px 18px" }}>
              <div style={{ fontFamily:S.mono, fontSize:9, letterSpacing:"0.1em", textTransform:"uppercase", color:S.textGhost, marginBottom:4 }}>Latest</div>
              <div style={{ fontFamily:S.sans, fontSize:13, fontWeight:500, color:S.text, marginTop:2 }}>{stats.recent?.[0]?.vendor || "—"}</div>
            </div>
          </div>
        )}

        {/* Search & Filter */}
        <div style={{ display:"flex", gap:10, marginBottom:18, flexWrap:"wrap" }}>
          <input placeholder="Search vendors, contacts, locations…" value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ ...inputBase, flex:1, minWidth:200, maxWidth:400 }}
            onFocus={onFocus} onBlur={onBlur} />
          <select value={catFilter} onChange={e => setCatFilter(e.target.value)}
            style={{ ...inputBase, width:"auto", minWidth:160, color: catFilter ? S.text : S.textGhost, cursor:"pointer" }}
            onFocus={onFocus} onBlur={onBlur}>
            <option value="">All Categories</option>
            {allCategories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Table */}
        {loading ? (
          <p style={{ textAlign:"center", padding:40, color:S.textDim }}>Loading…</p>
        ) : vendors.length === 0 ? (
          <div style={{ textAlign:"center", padding:"50px 20px" }}>
            <div style={{ fontSize:36, marginBottom:12, opacity:0.25 }}>◇</div>
            <p style={{ color:S.textDim, fontSize:14 }}>No vendors found.</p>
          </div>
        ) : (
          <div style={{ overflowX:"auto", borderRadius:8, border:`1.5px solid ${S.border}`, background:"#fff" }}>
            <table style={{ width:"100%", borderCollapse:"collapse", fontFamily:S.sans, fontSize:13 }}>
              <thead>
                <tr>
                  {["ID","VENDOR","CATEGORY","TYPE","REGION","CONTACT","PAYMENT","DATE",""].map(h => (
                    <th key={h} style={{ padding:"10px 10px", textAlign:"left", fontFamily:S.mono, fontSize:9, letterSpacing:"0.1em", textTransform:"uppercase", color:S.accent, fontWeight:500, borderBottom:`2px solid ${S.border}`, background:S.bg }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {vendors.map(v => (
                  <tr key={v.id} style={{ borderBottom:`1px solid ${S.border}`, transition:"background 0.1s" }}
                    onMouseEnter={e => e.currentTarget.style.background = S.accentSoft}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    <td style={{ padding:"9px 10px", fontFamily:S.mono, fontSize:10, color:S.textGhost }}>{v.id}</td>
                    <td style={{ padding:"9px 10px", fontWeight:500 }}>{v.vendor}</td>
                    <td style={{ padding:"9px 10px" }}><span style={{ padding:"2px 8px", background:S.accentSoft, borderRadius:3, fontSize:11, fontFamily:S.mono, color:S.accent }}>{v.category}</span></td>
                    <td style={{ padding:"9px 10px", color:S.textDim }}>{v.type}</td>
                    <td style={{ padding:"9px 10px", color:S.textDim }}>{v.region}</td>
                    <td style={{ padding:"9px 10px", color:S.textMid }}>{v.contact}</td>
                    <td style={{ padding:"9px 10px", color:S.textDim }}>{v.payment_terms || "—"}</td>
                    <td style={{ padding:"9px 10px", fontFamily:S.mono, fontSize:10, color:S.textGhost }}>{v.submitted_at?.slice(0,10)}</td>
                    <td style={{ padding:"9px 10px" }}>
                      <button onClick={() => handleDelete(v.id, v.vendor)} style={{ background:"transparent", border:"none", color:S.danger, cursor:"pointer", fontFamily:S.mono, fontSize:10, opacity:0.6 }}
                        onMouseEnter={e => e.target.style.opacity = 1}
                        onMouseLeave={e => e.target.style.opacity = 0.6}>✕</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   MAIN FORM
   ═══════════════════════════════════════════════════════════════════════ */
const emptyForm = {
  category:"", vendor:"", type:"", location:"", contact:"", phone:"", region:"",
  capabilities:[], comments:"",
  ein:"", duns:"", paymentTerms:"", currency:"USD", minOrder:"", leadTime:"", insurance:"", annualRevenue:"",
};

export default function VendorIntakeForm() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [currentView, setCurrentView] = useState("form");
  const [form, setForm] = useState({ ...emptyForm });

  const set = k => e => setForm({...form, [k]: e.target.value});
  const toggle = k => {
    const a = form.capabilities;
    setForm({...form, capabilities: a.includes(k) ? a.filter(i=>i!==k) : [...a, k]});
  };
  const next = () => { setError(""); setStep(s => Math.min(s+1, 5)); };
  const prev = () => { setError(""); setStep(s => Math.max(s-1, 1)); };

  const handleSubmit = async () => {
    setSubmitting(true); setError("");
    try {
      const res = await fetch(`${API_URL}/api/submit`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setSubmitted(true);
    } catch { setError("Could not save. Make sure the server is running."); }
    setSubmitting(false);
  };

  const reset = () => { setSubmitted(false); setStep(1); setForm({ ...emptyForm }); };
  const capLabels = (keys, items) => keys.filter(k => items.find(i => i.key === k)).map(k => items.find(i => i.key === k).label);

  if (currentView === "admin") return <AdminPanel onBack={() => setCurrentView("form")} />;

  if (submitted) {
    return (
      <div style={{ minHeight:"100vh", background:S.bg, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:S.sans }}>
        <link href={FONTS_URL} rel="stylesheet" />
        <div style={{ textAlign:"center", maxWidth:440, padding:40 }}>
          <div style={{ width:68, height:68, borderRadius:"50%", background:S.successBg, border:`2px solid ${S.success}`, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 22px", fontSize:26, color:S.success }}>✓</div>
          <h2 style={{ fontFamily:S.display, fontSize:26, fontWeight:800, color:S.text, marginBottom:8 }}>Thank You</h2>
          <p style={{ color:S.textMid, fontSize:14, lineHeight:1.7 }}>
            Your information has been submitted successfully and saved to our vendor database. Our procurement team will review your application and reach out within 5–7 business days.
          </p>
          <Btn variant="secondary" onClick={reset} style={{ marginTop:22 }}>Submit Another Vendor</Btn>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight:"100vh", background:S.bg, fontFamily:S.sans, color:S.text }}>
      <link href={FONTS_URL} rel="stylesheet" />

      {/* Header */}
      <div style={{ borderBottom:`1.5px solid ${S.border}`, padding:"18px 28px", display:"flex", alignItems:"center", justifyContent:"space-between", background:"#fff", flexWrap:"wrap", gap:10 }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ width:30, height:30, background:S.accent, borderRadius:6, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:S.display, fontSize:15, fontWeight:800, color:"#fff" }}>V</div>
          <div>
            <div style={{ fontFamily:S.mono, fontSize:9.5, letterSpacing:"0.1em", textTransform:"uppercase", color:S.textGhost }}>Vendor Management</div>
            <div style={{ fontFamily:S.display, fontSize:17, fontWeight:700, color:S.text, marginTop:1 }}>New Vendor Application</div>
          </div>
        </div>
        <Btn variant="secondary" onClick={() => setCurrentView("admin")}>Admin ⟶</Btn>
      </div>

      <div style={{ maxWidth:700, margin:"0 auto", padding:"32px 20px 50px" }}>
        <Stepper current={step} />

        <div style={{ background:S.card, border:`1.5px solid ${S.border}`, borderRadius:10, padding:"26px 26px 20px", boxShadow:"0 1px 4px rgba(0,0,0,0.04)" }}>

          {step === 1 && (<div>
            <h3 style={{ fontFamily:S.display, fontSize:21, fontWeight:700, marginBottom:3 }}>Vendor Category</h3>
            <p style={{ fontSize:13, color:S.textDim, marginBottom:22 }}>Select the primary category that best describes your business.</p>
            <CategoryPicker selected={form.category} onSelect={cat => setForm({...form, category:cat})} />
          </div>)}

          {step === 2 && (<div>
            <h3 style={{ fontFamily:S.display, fontSize:21, fontWeight:700, marginBottom:3 }}>Vendor Information</h3>
            <p style={{ fontSize:13, color:S.textDim, marginBottom:22 }}>Tell us about your company and who we should contact.</p>
            <Input label="Company Name" required placeholder="Acme Manufacturing LLC" value={form.vendor} onChange={set("vendor")} />
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 14px" }}>
              <Select label="Type" value={form.type} onChange={set("type")} options={VENDOR_TYPES} />
              <Select label="Region" value={form.region} onChange={set("region")} options={REGIONS} />
            </div>
            <Input label="Location" placeholder="City, State" value={form.location} onChange={set("location")} />
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 14px" }}>
              <Input label="Contact Name" required placeholder="Jane Doe" value={form.contact} onChange={set("contact")} />
              <Input label="Phone" required placeholder="+1 (555) 000-0000" value={form.phone} onChange={set("phone")} />
            </div>
          </div>)}

          {step === 3 && (<div>
            <h3 style={{ fontFamily:S.display, fontSize:21, fontWeight:700, marginBottom:3 }}>Capabilities</h3>
            <p style={{ fontSize:13, color:S.textDim, marginBottom:22 }}>Select everything that applies to your business.</p>
            {CAPABILITY_GROUPS.map(g => <ToggleGroup key={g.label} label={g.label} items={g.items} selected={form.capabilities} onToggle={toggle} />)}
            <TextArea label="Comments" placeholder="Additional notes, certifications, special capabilities…" value={form.comments} onChange={set("comments")} />
          </div>)}

          {step === 4 && (<div>
            <h3 style={{ fontFamily:S.display, fontSize:21, fontWeight:700, marginBottom:3 }}>Financial Information</h3>
            <p style={{ fontSize:13, color:S.textDim, marginBottom:22 }}>Help us understand your payment and financial details.</p>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 14px" }}>
              <Input label="EIN / Tax ID" placeholder="XX-XXXXXXX" value={form.ein} onChange={set("ein")} />
              <Input label="DUNS Number" placeholder="XX-XXX-XXXX" value={form.duns} onChange={set("duns")} hint="9-digit D&B number" />
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 14px" }}>
              <Select label="Payment Terms" value={form.paymentTerms} onChange={set("paymentTerms")} options={PAYMENT_TERMS} />
              <Select label="Currency" value={form.currency} onChange={set("currency")} options={CURRENCIES} />
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 14px" }}>
              <Input label="Minimum Order Value" prefix="$" placeholder="5,000" value={form.minOrder} onChange={set("minOrder")} />
              <Input label="Typical Lead Time" placeholder="4–6" value={form.leadTime} onChange={set("leadTime")} hint="In weeks" />
            </div>
            <Input label="Annual Revenue" prefix="$" placeholder="10,000,000" value={form.annualRevenue} onChange={set("annualRevenue")} hint="Approximate" />
            <TextArea label="Insurance Coverage" placeholder="General liability, product liability, workers' comp — include limits if possible…" value={form.insurance} onChange={set("insurance")} rows={2} />
          </div>)}

          {step === 5 && (<div>
            <h3 style={{ fontFamily:S.display, fontSize:21, fontWeight:700, marginBottom:3 }}>Review & Submit</h3>
            <p style={{ fontSize:13, color:S.textDim, marginBottom:22 }}>Please verify your information before submitting.</p>
            <ReviewSection title="Category & Company">
              <ReviewRow label="Category" value={form.category} /><ReviewRow label="Company" value={form.vendor} />
              <ReviewRow label="Type" value={form.type} /><ReviewRow label="Location" value={form.location} />
              <ReviewRow label="Contact" value={form.contact} /><ReviewRow label="Phone" value={form.phone} />
              <ReviewRow label="Region" value={form.region} />
            </ReviewSection>
            {CAPABILITY_GROUPS.map(g => <ReviewSection key={g.label} title={g.label}><ReviewRow label={g.label} value={capLabels(form.capabilities, g.items)} /></ReviewSection>)}
            {form.comments && <ReviewSection title="Comments"><p style={{ fontFamily:S.sans, fontSize:13, lineHeight:1.6 }}>{form.comments}</p></ReviewSection>}
            <ReviewSection title="Financial">
              <ReviewRow label="EIN" value={form.ein} /><ReviewRow label="DUNS" value={form.duns} />
              <ReviewRow label="Payment" value={form.paymentTerms} /><ReviewRow label="Currency" value={form.currency} />
              <ReviewRow label="Min Order" value={form.minOrder ? `$${form.minOrder}` : ""} />
              <ReviewRow label="Lead Time" value={form.leadTime ? `${form.leadTime} wks` : ""} />
              <ReviewRow label="Annual Rev" value={form.annualRevenue ? `$${form.annualRevenue}` : ""} />
              <ReviewRow label="Insurance" value={form.insurance} />
            </ReviewSection>
          </div>)}
        </div>

        {error && <div style={{ marginTop:12, padding:"10px 14px", borderRadius:6, background:S.dangerBg, border:`1.5px solid ${S.danger}33`, fontFamily:S.mono, fontSize:11, color:S.danger }}>{error}</div>}

        <div style={{ display:"flex", justifyContent:"space-between", marginTop:18, alignItems:"center" }}>
          {step > 1 ? <Btn variant="secondary" onClick={prev}>← Back</Btn> : <div />}
          {step < 5
            ? <Btn onClick={next} disabled={step===1 && !form.category}>Continue →</Btn>
            : <Btn onClick={handleSubmit} disabled={submitting}>{submitting ? "Submitting…" : "Submit Application"}</Btn>}
        </div>

        <div style={{ marginTop:36, textAlign:"center", fontFamily:S.mono, fontSize:8.5, letterSpacing:"0.08em", textTransform:"uppercase", color:S.textGhost }}>Confidential — Vendor Application</div>
      </div>
    </div>
  );
}
