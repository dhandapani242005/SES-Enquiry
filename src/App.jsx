import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, ArrowRight, ShieldCheck, ChevronDown, AlertCircle, Search } from 'lucide-react';

const FloatingInput = ({ label, id, type = "text", required = true, className = "", value, onChange, error }) => {
  const [focused, setFocused] = useState(false);
  const hasValue = value && value.length > 0;

  return (
    <div className={`w-full ${className}`}>
      <div className="relative w-full">
        <input
          type={type}
          id={id}
          name={id}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={`block w-full px-4 pt-6 pb-2 text-slate-900 bg-slate-50/50 border rounded-xl appearance-none focus:outline-none focus:ring-2 focus:bg-white transition-all peer font-medium ${error ? 'border-red-300 focus:ring-red-400 focus:border-transparent' : 'border-slate-200 focus:ring-[#1e5eff] focus:border-transparent'}`}
        />
        <label
          htmlFor={id}
          className={`absolute left-4 transition-all duration-200 pointer-events-none ${
            focused || hasValue 
              ? `text-[11px] top-2 font-bold uppercase tracking-wider ${error ? 'text-red-500' : 'text-[#1e5eff]'}` 
              : 'text-sm top-4 text-slate-500 font-semibold'
          }`}
        >
          {label} {required ? <span className="text-red-500">*</span> : <span className="text-slate-400 font-normal normal-case tracking-normal ml-1">(Optional)</span>}
        </label>
        {error && <AlertCircle className="absolute right-4 top-4 w-5 h-5 text-red-500 pointer-events-none" />}
      </div>
      <AnimatePresence>
        {error && (
          <motion.p initial={{opacity:0, height:0}} animate={{opacity:1, height:'auto'}} exit={{opacity:0, height:0}} className="text-red-500 text-xs font-bold mt-1.5 ml-2">
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

const FloatingSelect = ({ label, id, options, required = true, value, onChange, error, searchable = false }) => {
  const [focused, setFocused] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const hasValue = value && value !== "";

  const selectedLabel = options.find(opt => opt.value === value)?.label || "";
  const filteredOptions = options.filter(opt => opt.label.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="w-full">
      <div className="relative w-full">
        <button
          type="button"
          id={id}
          onFocus={() => setFocused(true)}
          onBlur={() => {
            setFocused(false);
            // Delay closing to allow clicking options or the search bar
            setTimeout(() => {
              // We only close if focus wasn't moved to the search input
              if (document.activeElement.id !== `${id}-search`) {
                setIsOpen(false);
                setSearchTerm("");
              }
            }, 200);
          }}
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full text-left px-4 pt-6 pb-2 text-slate-900 bg-slate-50/50 border rounded-xl focus:outline-none focus:ring-2 transition-all font-medium ${error ? 'border-red-300 focus:ring-red-400' : 'border-slate-200 focus:ring-[#1e5eff]'} ${focused || isOpen ? 'bg-white border-transparent' : ''}`}
        >
          <span className="block truncate h-6">{selectedLabel}</span>
        </button>
        
        <label
          htmlFor={id}
          className={`absolute left-4 transition-all duration-200 pointer-events-none ${
            focused || hasValue || isOpen
              ? `text-[11px] top-2 font-bold uppercase tracking-wider ${error ? 'text-red-500' : 'text-[#1e5eff]'}` 
              : 'text-sm top-4 text-slate-500 font-semibold'
          }`}
        >
          {label} {required ? <span className="text-red-500">*</span> : <span className="text-slate-400 font-normal normal-case tracking-normal ml-1">(Optional)</span>}
        </label>
        <div className="absolute right-4 top-4 pointer-events-none text-slate-400">
          <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${(focused || isOpen) && !error ? 'rotate-180 text-[#1e5eff]' : ''} ${error ? 'hidden' : ''}`} />
          {error && <AlertCircle className="w-5 h-5 text-red-500" />}
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full left-0 mt-2 w-full bg-white border border-slate-100 rounded-xl shadow-2xl z-50 overflow-hidden flex flex-col"
            >
              {searchable && (
                <div className="p-2 border-b border-slate-100 bg-slate-50/80 sticky top-0 backdrop-blur-sm z-10" onClick={(e) => e.stopPropagation()}>
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    <input 
                      id={`${id}-search`}
                      type="text" 
                      placeholder="Search..." 
                      className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1e5eff] font-medium placeholder-slate-400 transition-shadow"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyDown={(e) => e.stopPropagation()}
                      onBlur={() => {
                        // Allow closing when blurring from the search input
                        setTimeout(() => {
                           setIsOpen(false);
                           setSearchTerm("");
                        }, 200);
                      }}
                      autoFocus
                    />
                  </div>
                </div>
              )}
              <div className="max-h-60 overflow-y-auto">
                {filteredOptions.length > 0 ? filteredOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      onChange({ target: { name: id, value: opt.value } });
                      setIsOpen(false);
                      setSearchTerm("");
                    }}
                    className={`w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors font-medium text-sm ${value === opt.value ? 'bg-blue-50 text-[#1e5eff]' : 'text-slate-700'}`}
                  >
                    {opt.label}
                  </button>
                )) : (
                  <div className="px-4 py-4 text-sm text-slate-500 text-center font-medium flex flex-col items-center justify-center">
                    <Search className="w-5 h-5 text-slate-300 mb-2" />
                    No results found
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <AnimatePresence>
        {error && (
          <motion.p initial={{opacity:0, height:0}} animate={{opacity:1, height:'auto'}} exit={{opacity:0, height:0}} className="text-red-500 text-xs font-bold mt-1.5 ml-2">
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

const FloatingPhoneInput = ({ id, required = true, value, onChange, error }) => {
  const [focused, setFocused] = useState(false);
  const hasValue = value && value.length > 0;
  const [phoneCode, setPhoneCode] = useState('+91');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const countries = [
    { code: '+91', flag: 'https://flagcdn.com/w20/in.png' },
    { code: '+1', flag: 'https://flagcdn.com/w20/us.png' },
    { code: '+44', flag: 'https://flagcdn.com/w20/gb.png' },
    { code: '+61', flag: 'https://flagcdn.com/w20/au.png' }
  ];

  const selectedCountry = countries.find(c => c.code === phoneCode);

  return (
    <div className="w-full">
      <div className={`relative w-full flex text-slate-900 bg-slate-50/50 border rounded-xl transition-all ${error ? 'border-red-300 ring-2 ring-red-400 bg-white' : focused || isDropdownOpen ? 'border-[#1e5eff] ring-2 ring-[#1e5eff] bg-white' : 'border-slate-200 hover:border-slate-300'}`}>
        
        <div className="relative flex items-center border-r border-slate-200/60 w-[110px] shrink-0">
          <button 
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            onFocus={() => setFocused(true)}
            onBlur={() => {
              setFocused(false);
              setTimeout(() => setIsDropdownOpen(false), 200);
            }}
            className="w-full h-full flex items-center justify-between px-4 focus:outline-none"
          >
            <div className="flex items-center space-x-2">
              <img src={selectedCountry.flag} alt="flag" className="w-[20px] shadow-sm rounded-[2px] object-contain" />
              <span className="font-bold text-slate-800">{phoneCode}</span>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>

          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
                className="absolute top-full left-0 mt-2 w-32 bg-white border border-slate-100 rounded-xl shadow-2xl z-50 overflow-hidden"
              >
                {countries.map((c) => (
                  <button
                    key={c.code}
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      setPhoneCode(c.code);
                      setIsDropdownOpen(false);
                    }}
                    className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-slate-50 transition-colors"
                  >
                    <img src={c.flag} alt="flag" className="w-[18px] shadow-sm rounded-[2px]" />
                    <span className="font-bold text-slate-700">{c.code}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="relative w-full flex-1">
          <input
            type="tel"
            id={id}
            name={id}
            value={value}
            onChange={onChange}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className="block w-full px-4 pt-6 pb-2 bg-transparent appearance-none focus:outline-none font-medium peer"
          />
          <label
            htmlFor={id}
            className={`absolute left-4 transition-all duration-200 pointer-events-none ${
              focused || hasValue 
                ? `text-[11px] top-2 font-bold uppercase tracking-wider ${error ? 'text-red-500' : 'text-[#1e5eff]'}` 
                : 'text-sm top-4 text-slate-500 font-semibold'
            }`}
          >
            Phone Number {required ? <span className="text-red-500">*</span> : <span className="text-slate-400 font-normal normal-case tracking-normal ml-1">(Optional)</span>}
          </label>
          {error && <AlertCircle className="absolute right-4 top-4 w-5 h-5 text-red-500 pointer-events-none" />}
        </div>
      </div>
      <AnimatePresence>
        {error && (
          <motion.p initial={{opacity:0, height:0}} animate={{opacity:1, height:'auto'}} exit={{opacity:0, height:0}} className="text-red-500 text-xs font-bold mt-1.5 ml-2">
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

function App() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', company: '', district: '', email: '', phone: '', enquiryType: '', message: ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Custom Validation Logic - Bail early to show only the first error
    if (!formData.firstName.trim()) {
      setErrors({ firstName: "First name is required." });
      return;
    }
    
    if (!formData.company.trim()) {
      setErrors({ company: "Company name is required." });
      return;
    }
    
    if (!formData.district) {
      setErrors({ district: "Please select a district." });
      return;
    }
    
    if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setErrors({ email: "Please enter a valid email address." });
      return;
    }
    
    if (!formData.phone.trim()) {
      setErrors({ phone: "Phone number is required." });
      return;
    }
    
    if (!formData.enquiryType) {
      setErrors({ enquiryType: "Please select an enquiry type." });
      return;
    }

    setErrors({});
    setIsSubmitting(true);
    setSubmitError("");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: "59de8287-8a92-42b7-b9f2-82ae5e035328",
          subject: "New Enquiry from Star Elite Solution",
          from_name: "Star Elite Solution Website",
          ...formData
        }),
      });

      const result = await response.json();
      if (result.success) {
        setIsSubmitted(true);
        setTimeout(() => {
          setIsSubmitted(false);
          setFormData({
            firstName: '', lastName: '', company: '', district: '', email: '', phone: '', enquiryType: '', message: ''
          });
        }, 5000);
      } else {
        setSubmitError("Failed to send enquiry. Please try again.");
      }
    } catch (error) {
      setSubmitError("Something went wrong. Please check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 15 } }
  };

  const tamilNaduDistricts = [
    "Ariyalur", "Chengalpattu", "Chennai", "Coimbatore", "Cuddalore", "Dharmapuri", 
    "Dindigul", "Erode", "Kallakurichi", "Kanchipuram", "Kanyakumari", "Karur", 
    "Krishnagiri", "Madurai", "Mayiladuthurai", "Nagapattinam", "Namakkal", "Nilgiris", 
    "Perambalur", "Pudukkottai", "Ramanathapuram", "Ranipet", "Salem", "Sivaganga", 
    "Tenkasi", "Thanjavur", "Theni", "Thoothukudi", "Tiruchirappalli", "Tirunelveli", 
    "Tirupathur", "Tiruppur", "Tiruvallur", "Tiruvannamalai", "Tiruvarur", "Vellore", 
    "Viluppuram", "Virudhunagar"
  ].map(d => ({ value: d.toLowerCase().replace(/ /g, '_'), label: d }));

  tamilNaduDistricts.push({ value: "other_state", label: "Other State" });

  return (
    <div className="flex min-h-screen w-full bg-white font-sans text-slate-900 selection:bg-[#1e5eff] selection:text-white">
      
      {/* Left Panel - Brand / Hero (Hidden on Mobile) */}
      <div className="hidden lg:flex w-[45%] bg-[#080d1e] relative overflow-hidden flex-col justify-center p-16 text-white border-r border-slate-800">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            className="absolute -top-[20%] -left-[20%] w-[800px] h-[800px] bg-[#1e5eff] rounded-full mix-blend-screen filter blur-[150px] opacity-20"
          />
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-[#ffa500] rounded-full mix-blend-screen filter blur-[150px] opacity-10"
          />
        </div>
        
        <div className="relative z-10 -mt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl xl:text-6xl font-black tracking-tight leading-[1.1] mb-6">
              Elevate Your Space with <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffa500] to-[#ffc14d]">Smart Living.</span>
            </h1>
            <p className="text-slate-400 text-lg xl:text-xl max-w-md leading-relaxed font-medium">
              From advanced solar solutions to intelligent gate automation and security systems. We build the future of living, today.
            </p>
          </motion.div>
        </div>
        
        <div className="absolute bottom-16 left-16 z-10 flex items-center space-x-4 text-sm font-semibold text-slate-500 tracking-wide uppercase">
          <span>© 2026 Star Elite Solution</span>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-[55%] flex flex-col px-5 sm:px-12 md:px-20 lg:px-24 py-8 lg:py-12 relative h-screen overflow-y-auto">
        
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full flex justify-center mb-6 lg:mb-0 lg:justify-end lg:absolute lg:top-12 lg:right-12 z-20"
        >
          <img 
            src="/logo.png" 
            alt="Star Elite Solution" 
            className="h-16 sm:h-20 lg:h-24 object-contain mix-blend-multiply"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'block';
            }}
          />
        </motion.div>

        {/* Added pb-32 so the user can scroll past the floating WhatsApp button on mobile */}
        <div className="w-full max-w-[540px] mx-auto my-auto pb-32 pt-2 lg:py-10">

          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <motion.div
                key="form-content"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5 }}
              >
                <div className="mb-8 sm:mb-10 text-center lg:text-left">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="inline-flex items-center space-x-2 py-1.5 px-3 rounded-full bg-orange-50 text-[#ffa500] text-xs font-bold uppercase tracking-widest mb-4 border border-orange-100"
                  >
                    <span className="w-2 h-2 rounded-full bg-[#ffa500] animate-pulse"></span>
                    <span>Get in Touch</span>
                  </motion.div>
                  <h2 className="text-[28px] leading-tight sm:text-4xl font-black tracking-tight mb-3 text-slate-900">Let's start your project</h2>
                  <p className="text-slate-500 text-base font-medium">Fill out the details below and our experts will contact you directly.</p>
                </div>

                <motion.form 
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  onSubmit={handleSubmit}
                  noValidate 
                  className="space-y-5"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <motion.div variants={itemVariants}>
                      <FloatingInput label="First Name" id="firstName" value={formData.firstName} onChange={handleChange} error={errors.firstName} />
                    </motion.div>
                    <motion.div variants={itemVariants}>
                      <FloatingInput label="Last Name" id="lastName" value={formData.lastName} onChange={handleChange} error={errors.lastName} required={false} />
                    </motion.div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <motion.div variants={itemVariants}>
                      <FloatingInput label="Business / Company Name" id="company" value={formData.company} onChange={handleChange} error={errors.company} />
                    </motion.div>
                    <motion.div variants={itemVariants}>
                      <FloatingSelect 
                        label="District" 
                        id="district"
                        value={formData.district}
                        onChange={handleChange}
                        error={errors.district}
                        searchable={true}
                        options={tamilNaduDistricts} 
                      />
                    </motion.div>
                  </div>

                  <motion.div variants={itemVariants}>
                    <FloatingInput label="Email Address" id="email" type="email" value={formData.email} onChange={handleChange} error={errors.email} required={false} />
                  </motion.div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <motion.div variants={itemVariants}>
                      <FloatingPhoneInput id="phone" value={formData.phone} onChange={handleChange} error={errors.phone} />
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <FloatingSelect 
                        label="Enquiry Type" 
                        id="enquiryType"
                        value={formData.enquiryType}
                        onChange={handleChange}
                        error={errors.enquiryType}
                        options={[
                          { value: "automation", label: "Automation & Smart Home" },
                          { value: "security", label: "Security & Surveillance" },
                          { value: "solar_power", label: "Solar & Power Solutions" },
                          { value: "audiovisual", label: "Audio Visual Systems" },
                          { value: "networking_it", label: "Networking & IT" },
                          { value: "water", label: "Water Solutions (RO)" },
                          { value: "multiple", label: "Multiple / Other Services" },
                        ]} 
                      />
                    </motion.div>
                  </div>

                  <motion.div variants={itemVariants} className="w-full">
                    <div className="relative w-full">
                      <textarea
                        id="message"
                        name="message"
                        rows="3"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder=" "
                        className="block w-full px-4 pt-6 pb-2 text-slate-900 bg-slate-50/50 border rounded-xl appearance-none focus:outline-none focus:ring-2 focus:bg-white transition-all peer font-medium resize-y border-slate-200 focus:ring-[#1e5eff] focus:border-transparent"
                      ></textarea>
                      <label
                        htmlFor="message"
                        className="absolute left-4 top-4 font-semibold transition-all duration-200 pointer-events-none peer-focus:text-[11px] peer-focus:top-2 peer-focus:font-bold peer-focus:uppercase peer-focus:tracking-wider peer-not-placeholder-shown:text-[11px] peer-not-placeholder-shown:top-2 peer-not-placeholder-shown:font-bold peer-not-placeholder-shown:uppercase peer-not-placeholder-shown:tracking-wider text-slate-500 peer-focus:text-[#1e5eff] peer-not-placeholder-shown:text-[#1e5eff]"
                      >
                        Message / Details <span className="text-slate-400 font-normal normal-case tracking-normal ml-1">(Optional)</span>
                      </label>
                    </div>
                  </motion.div>

                  <motion.div variants={itemVariants} className="pt-4">
                    {submitError && <div className="text-red-500 text-sm font-bold text-center mb-3">{submitError}</div>}
                    <motion.button
                      whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                      whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                      type="submit"
                      disabled={isSubmitting}
                      className="group w-full flex items-center justify-center space-x-3 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-700 text-white font-bold text-lg py-4 px-8 rounded-xl transition-all duration-300 outline-none focus:ring-4 focus:ring-slate-300 shadow-xl shadow-slate-900/10"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span>Sending Enquiry...</span>
                        </>
                      ) : (
                        <>
                          <span>Submit Enquiry</span>
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                        </>
                      )}
                    </motion.button>
                  </motion.div>
                </motion.form>
              </motion.div>
            ) : (
              <motion.div
                key="success-content"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="py-20 text-center flex flex-col items-center justify-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring', damping: 12 }}
                  className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6"
                >
                  <CheckCircle className="w-10 h-10 text-green-500" />
                </motion.div>
                <h2 className="text-3xl font-black text-slate-900 mb-3">Enquiry Sent Successfully</h2>
                <p className="text-slate-500 text-lg mb-8">
                  Thank you! Our Star Elite Solution team will review your requirements and reach out to you shortly.
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="text-slate-900 font-bold px-6 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
                >
                  Send another message
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-12 flex items-center justify-center space-x-2 text-sm text-slate-400 font-medium">
            <ShieldCheck className="w-4 h-4 text-green-500" />
            <span>Secure 256-bit encrypted connection.</span>
          </div>
        </div>
      </div>

      {/* WhatsApp Floating Button */}
      <motion.a
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 100 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        href="https://wa.me/919095955644?text=Hi%20Star%20Elite%20Solution,%20I'm%20interested%20in%20your%20smart%20living%20and%20automation%20services.%20Could%20we%20discuss%20a%20potential%20project?"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 z-50 flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-[#25D366] text-white rounded-full shadow-2xl hover:shadow-[#25D366]/50"
        aria-label="Chat on WhatsApp"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 sm:w-7 sm:h-7" fill="currentColor" viewBox="0 0 16 16">
          <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
        </svg>
      </motion.a>
    </div>
  );
}

export default App;
