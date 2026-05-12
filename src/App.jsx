import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, ArrowRight, ChevronDown, Search } from 'lucide-react';

/* ─── Field ─── */
const Field = ({ label, id, type = 'text', required = true, value, onChange, error, placeholder }) => (
  <div className="field-wrapper">
    <label htmlFor={id} className="simple-lbl">
      {label} {required ? <span className="req">*</span> : <span className="opt">(Optional)</span>}
    </label>
    <div className="input-rel">
      <input type={type} id={id} name={id} value={value} onChange={onChange} placeholder={placeholder}
        className={`simple-input${error ? ' err' : ''}`} />
    </div>
    {error && <div className="err-msg">{error}</div>}
  </div>
);

/* ─── Textarea ─── */
const TextareaField = ({ label, id, value, onChange, required=false }) => (
  <div className="field-wrapper">
    <label htmlFor={id} className="simple-lbl">
      {label} {required ? <span className="req">*</span> : <span className="opt">(Optional)</span>}
    </label>
    <textarea id={id} name={id} value={value} onChange={onChange} rows={3} placeholder="Tell us about your requirements..."
      className="simple-input" />
  </div>
);

/* ─── Select ─── */
const SelectField = ({ label, id, options, required = true, value, onChange, error, searchable = false, placeholder }) => {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const ref = useRef(null);
  const sel = options.find(o => o.value === value)?.label || '';
  const list = options.filter(o => o.label.toLowerCase().includes(q.toLowerCase()));

  useEffect(() => {
    const fn = e => { if (ref.current && !ref.current.contains(e.target)) { setOpen(false); setQ(''); } };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  return (
    <div className="field-wrapper" ref={ref}>
      <label className="simple-lbl">
        {label} {required ? <span className="req">*</span> : <span className="opt">(Optional)</span>}
      </label>
      <div className="input-rel">
        <button type="button" className={`simple-input select-btn${error ? ' err' : ''}`} onClick={() => setOpen(o => !o)}>
          <span className={value ? 'val' : 'plc'}>{sel || placeholder || 'Select...'}</span>
          <ChevronDown size={16} className={`sel-icon${open ? ' open' : ''}`} />
        </button>
        <AnimatePresence>
          {open && (
            <motion.div className="simple-dd" initial={{ opacity:0, y:-4 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-4 }} transition={{ duration:0.15 }}>
              {searchable && (
                <div className="dd-search-box">
                  <Search size={14} className="dd-search-ic" />
                  <input className="dd-search-inp" placeholder="Search..." value={q} onChange={e => setQ(e.target.value)} autoFocus />
                </div>
              )}
              <div className="dd-options">
                {list.length > 0 ? list.map(opt => (
                  <button key={opt.value} type="button" className={`dd-opt${value === opt.value ? ' active' : ''}`}
                    onMouseDown={e => { e.preventDefault(); onChange({ target: { name: id, value: opt.value } }); setOpen(false); setQ(''); }}>
                    {opt.label}
                  </button>
                )) : <div className="dd-empty">No results</div>}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {error && <div className="err-msg">{error}</div>}
    </div>
  );
};

/* ─── Phone ─── */
const PhoneField = ({ label, id, value, onChange, error, required=true }) => {
  return (
    <div className="field-wrapper">
      <label className="simple-lbl">
        {label} {required ? <span className="req">*</span> : <span className="opt">(Optional)</span>}
      </label>
      <div className={`phone-flex${error ? ' err' : ''}`}>
        <div className="phone-prefix">
          <span className="pf-code">IN +91</span>
        </div>
        <input type="tel" id={id} name={id} value={value} onChange={onChange} placeholder="0000000000"
          className="phone-inp-clean" />
      </div>
      {error && <div className="err-msg">{error}</div>}
    </div>
  );
};

/* ─── Data ─── */
const districts = ["Ariyalur","Chengalpattu","Chennai","Coimbatore","Cuddalore","Dharmapuri","Dindigul","Erode","Kallakurichi","Kanchipuram","Kanyakumari","Karur","Krishnagiri","Madurai","Mayiladuthurai","Nagapattinam","Namakkal","Nilgiris","Perambalur","Pudukkottai","Ramanathapuram","Ranipet","Salem","Sivaganga","Tenkasi","Thanjavur","Theni","Thoothukudi","Tiruchirappalli","Tirunelveli","Tirupathur","Tiruppur","Tiruvallur","Tiruvannamalai","Tiruvarur","Vellore","Viluppuram","Virudhunagar","Other State"].map(d => ({ value: d.toLowerCase().replace(/ /g,'_'), label: d }));

const enquiryOpts = [
  { value:'automation', label:'Automation & Smart Home' },
  { value:'security', label:'Security & Surveillance' },
  { value:'solar', label:'Solar & Power Solutions' },
  { value:'av', label:'Audio Visual Systems' },
  { value:'network', label:'Networking & IT Infrastructure' },
  { value:'water', label:'Water Purification (RO)' },
  { value:'multiple', label:'Multiple / Other Services' },
];

/* ─── App ─── */
export default function App() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [logoErr, setLogoErr] = useState(false);
  const [form, setForm] = useState({ firstName:'', lastName:'', company:'', district:'', email:'', phone:'', enquiryType:'', message:'' });
  const [errors, setErrors] = useState({});

  const handle = e => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: '' }));
  };

  const validate = () => {
    let valid = true;
    const newErrs = {};
    if (!form.firstName.trim()) { newErrs.firstName = 'First name is required.'; valid = false; }
    if (!form.company.trim()) { newErrs.company = 'Company name is required.'; valid = false; }
    if (!form.district) { newErrs.district = 'Please select a district.'; valid = false; }
    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { newErrs.email = 'Enter a valid email address.'; valid = false; }
    if (!form.phone.trim()) { newErrs.phone = 'Phone number is required.'; valid = false; }
    if (!form.enquiryType) { newErrs.enquiryType = 'Please select an enquiry type.'; valid = false; }
    
    setErrors(newErrs);
    return valid;
  };

  const submit = async e => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true); setSubmitError('');
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type':'application/json', Accept:'application/json' },
        body: JSON.stringify({ access_key:'59de8287-8a92-42b7-b9f2-82ae5e035328', subject:'New Enquiry — Star Elite Solution', from_name:'Star Elite Solution Website', ...form })
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
        setTimeout(() => { setSubmitted(false); setForm({ firstName:'', lastName:'', company:'', district:'', email:'', phone:'', enquiryType:'', message:'' }); }, 8000);
      } else { setSubmitError('Submission failed. Please try again.'); }
    } catch { setSubmitError('Network error. Please check your connection.'); }
    finally { setSubmitting(false); }
  };

  const Logo = () => !logoErr
    ? <img src={`${import.meta.env.BASE_URL}logo.png`} alt="Star Elite Solution" onError={() => setLogoErr(true)} className="top-logo" />
    : <div className="alt-logo"><span className="text-blue">STAR</span> <span className="text-gold">ELITE</span> <span className="text-blue">SOLUTION</span></div>;

  return (
    <div className="layout-root">
      
      {/* Top Left Logo */}
      <div className="logo-container">
        <Logo />
      </div>

      <div className="form-container">
        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.div key="form" initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-20 }}>
              
              <div className="form-header">
                <div className="badge-pill">Get Started</div>
                <h1 className="title-main">Your <span className="text-blue">Details</span></h1>
                <p className="title-sub">Tell us a bit about yourself and your requirements</p>
              </div>

              <form onSubmit={submit} noValidate className="form-body">

                <div className="form-grid">
                  <Field label="First Name" id="firstName" value={form.firstName} onChange={handle} error={errors.firstName} placeholder="John" />
                  <Field label="Last Name" id="lastName" value={form.lastName} onChange={handle} required={false} placeholder="Doe" />
                  
                  <Field label="Business / Company Name" id="company" value={form.company} onChange={handle} error={errors.company} placeholder="e.g. Star Enterprises" />
                  <PhoneField label="Phone Number" id="phone" value={form.phone} onChange={handle} error={errors.phone} />
                  
                  <Field label="Email Address" id="email" type="email" value={form.email} onChange={handle} error={errors.email} required={false} placeholder="john@example.com" />
                  <SelectField label="District" id="district" options={districts} value={form.district} onChange={handle} error={errors.district} searchable placeholder="Search or select district..." />
                </div>

                <SelectField label="Enquiry Type" id="enquiryType" options={enquiryOpts} value={form.enquiryType} onChange={handle} error={errors.enquiryType} placeholder="Select service category..." />

                <TextareaField label="Message / Details" id="message" value={form.message} onChange={handle} />

                {submitError && (
                  <div className="submit-err">{submitError}</div>
                )}

                <button type="submit" disabled={submitting} className="btn-primary">
                  {submitting ? 'Submitting...' : (
                    <>Next <ArrowRight size={18} /></>
                  )}
                </button>

              </form>
            </motion.div>
          ) : (
            <motion.div key="success" initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }} className="success-view">
              <CheckCircle size={56} className="text-blue" style={{ marginBottom: 20 }} />
              <h2 className="title-main">Enquiry <span className="text-blue">Sent!</span></h2>
              <p className="title-sub" style={{ marginTop: 10, maxWidth: 400 }}>Thank you for reaching out to Star Elite Solution. Our specialists will review your requirements and contact you within 24 hours.</p>
              <button className="btn-secondary" onClick={() => setSubmitted(false)} style={{ marginTop: 30 }}>
                Submit Another
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
