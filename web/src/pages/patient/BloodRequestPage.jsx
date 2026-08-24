import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import {
  Droplet, MapPin, AlertTriangle, ChevronRight, CheckCircle, Loader, Navigation, Zap, Clock, PackageCheck, Users
} from 'lucide-react';
import PatientLayout from './PatientLayout';
import { useData } from '../../contexts/DataContext';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const COMPONENTS = [
  { value: 'WHOLE_BLOOD', label: 'Whole Blood', emoji: '🩸', desc: 'For major surgery, trauma & general transfusion' },
  { value: 'RBC', label: 'Red Blood Cells', emoji: '🔴', desc: 'Severe anemia, acute blood loss' },
  { value: 'PLASMA', label: 'Plasma (FFP)', emoji: '🟡', desc: 'Clotting factor disorders, severe burns' },
  { value: 'PLATELETS', label: 'Platelets', emoji: '🟠', desc: 'Chemotherapy, dengue, thrombocytopenia' },
];
const URGENCY_LEVELS = [
  { value: 'NORMAL', label: 'Normal', icon: Clock, color: 'text-green-400', border: 'border-green-500/40', bg: 'bg-green-500/10', desc: 'Within 24–48 hours' },
  { value: 'URGENT', label: 'Urgent', icon: AlertTriangle, color: 'text-yellow-400', border: 'border-yellow-500/40', bg: 'bg-yellow-500/10', desc: 'Within 4–6 hours' },
  { value: 'CRITICAL', label: 'Critical', icon: Zap, color: 'text-red-400', border: 'border-red-500/40', bg: 'bg-red-500/10', desc: 'Immediate — life risk' },
];
const RADII = [
  { value: 5, label: '5 km', desc: 'Immediate vicinity' },
  { value: 10, label: '10 km', desc: 'Local zone' },
  { value: 20, label: '20 km', desc: 'City-wide' },
  { value: 50, label: '50 km', desc: 'District-wide' },
];

const STEPS = ['Blood Type', 'Component', 'Urgency & Qty', 'Location', 'Review'];

const BloodRequestPage = () => {
  const navigate = useNavigate();
  const { createRequest } = useData();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [locLoading, setLocLoading] = useState(false);
  const [createdResult, setCreatedResult] = useState(null);

  const [form, setForm] = useState({
    bloodGroup: '',
    component: 'WHOLE_BLOOD',
    quantity: 1,
    urgency: 'URGENT',
    searchRadiusKm: 10,
    location: { lat: '28.6139', lng: '77.2090', address: 'City Hospital Emergency, Delhi' },
    patientName: '',
    patientAge: '',
    hospital: '',
    notes: '',
    contactPhone: '',
  });

  const update = (key, val) => setForm(f => ({ ...f, [key]: val }));
  const updateLocation = (key, val) => setForm(f => ({ ...f, location: { ...f.location, [key]: val } }));

  const detectLocation = useCallback(() => {
    if (!navigator.geolocation) { 
      toast.error('Geolocation is not supported by your browser'); 
      return; 
    }
    setLocLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`);
          const data = await res.json();
          const address = data.display_name?.split(',').slice(0, 3).join(', ') || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
          setForm(f => ({ ...f, location: { lat: lat.toFixed(6), lng: lng.toFixed(6), address } }));
          toast.success('Location detected successfully!');
        } catch {
          setForm(f => ({ ...f, location: { lat: lat.toFixed(6), lng: lng.toFixed(6), address: `Coordinates (${lat.toFixed(4)}, ${lng.toFixed(4)})` } }));
        }
        setLocLoading(false);
      },
      (err) => { 
        toast.error('Unable to retrieve location. Please type your hospital/address below.'); 
        setLocLoading(false); 
      }
    );
  }, []);

  const canNext = () => {
    if (step === 0) return !!form.bloodGroup;
    if (step === 1) return !!form.component;
    if (step === 2) return form.quantity > 0 && !!form.urgency;
    if (step === 3) return !!form.location.address || (!!form.location.lat && !!form.location.lng);
    return true;
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Simulate quick async evaluation
      await new Promise(r => setTimeout(r, 600));

      const result = createRequest(form);
      setCreatedResult(result);

      if (result.autoReserved) {
        toast.success(`🎉 Blood Found! ${result.request.quantity} unit(s) reserved immediately from inventory!`, { duration: 5000 });
      } else {
        toast.success(`Request submitted! Searching donors within ${form.searchRadiusKm} km...`, { duration: 5000 });
      }
    } catch (err) {
      toast.error('Failed to submit request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const urgencyInfo = URGENCY_LEVELS.find(u => u.value === form.urgency);

  if (createdResult) {
    const { request, autoReserved } = createdResult;
    return (
      <PatientLayout title="Request Submitted">
        <div className="max-w-xl mx-auto py-8">
          <div className={`p-6 rounded-2xl border mb-6 text-center ${
            autoReserved 
              ? 'bg-emerald-500/10 border-emerald-500/30' 
              : 'bg-yellow-500/10 border-yellow-500/30'
          }`}>
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
              autoReserved ? 'bg-emerald-500/20 text-emerald-400' : 'bg-yellow-500/20 text-yellow-400'
            }`}>
              {autoReserved ? <PackageCheck size={44} /> : <Users size={44} />}
            </div>
            
            <h2 className="text-2xl font-bold mb-1">
              {autoReserved ? 'Blood Reserved from Inventory!' : 'Searching Compatible Donors'}
            </h2>
            <p className="text-sm text-gray-300">
              {autoReserved 
                ? 'Units were found in stock at the local blood bank and have been locked for this request.'
                : `Insufficient stock in nearby banks. Notifying eligible donors within ${request.searchRadiusKm} km.`}
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6 space-y-3 text-sm">
            <div className="flex justify-between py-1 border-b border-white/5">
              <span className="text-gray-400">Request Tracking ID</span>
              <span className="font-mono font-bold text-red-400 text-base">{request.id}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-white/5">
              <span className="text-gray-400">Patient</span>
              <span className="font-semibold text-white">{request.patientName || 'Emergency Patient'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-white/5">
              <span className="text-gray-400">Required Blood</span>
              <span className="font-bold text-red-400">{request.bloodGroup} • {request.component}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-white/5">
              <span className="text-gray-400">Quantity</span>
              <span className="font-semibold text-white">{request.quantity} Unit(s)</span>
            </div>
            <div className="flex justify-between py-1 border-b border-white/5">
              <span className="text-gray-400">Urgency</span>
              <span className={`font-semibold ${urgencyInfo?.color}`}>{request.urgency}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-gray-400">Hospital / Location</span>
              <span className="font-semibold text-white text-right max-w-[200px] truncate">{request.hospital || request.location?.address}</span>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => navigate('/patient/my-requests')}
              className="flex-1 bg-red-600 hover:bg-red-500 text-white py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-red-900/40"
            >
              Track Request Status →
            </button>
            <button
              onClick={() => {
                setCreatedResult(null);
                setStep(0);
                setForm({
                  bloodGroup: '',
                  component: 'WHOLE_BLOOD',
                  quantity: 1,
                  urgency: 'URGENT',
                  searchRadiusKm: 10,
                  location: { lat: '28.6139', lng: '77.2090', address: 'City Hospital Emergency, Delhi' },
                  patientName: '',
                  patientAge: '',
                  hospital: '',
                  notes: '',
                  contactPhone: '',
                });
              }}
              className="px-6 bg-white/10 hover:bg-white/20 text-white py-3.5 rounded-xl font-semibold transition-colors"
            >
              New Request
            </button>
          </div>
        </div>
      </PatientLayout>
    );
  }

  return (
    <PatientLayout title="Request Blood">
      <div className="max-w-2xl mx-auto">
        {/* Progress Stepper */}
        <div className="flex items-center gap-2 mb-8">
          {STEPS.map((s, i) => (
            <React.Fragment key={i}>
              <button
                type="button"
                onClick={() => i < step && setStep(i)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  i === step ? 'bg-red-500/20 text-red-400 border border-red-500/40' :
                  i < step ? 'text-gray-300 cursor-pointer hover:text-white' : 'text-gray-600 cursor-default'
                }`}
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  i < step ? 'bg-green-500 text-white' : i === step ? 'bg-red-500 text-white' : 'bg-white/10 text-gray-500'
                }`}>{i < step ? '✓' : i + 1}</span>
                <span className="hidden sm:block">{s}</span>
              </button>
              {i < STEPS.length - 1 && <div className={`flex-1 h-px ${i < step ? 'bg-green-500/40' : 'bg-white/10'}`} />}
            </React.Fragment>
          ))}
        </div>

        {/* STEP 0 – Blood Group */}
        {step === 0 && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center justify-center">
                <Droplet size={20} className="text-red-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Select Blood Group</h2>
                <p className="text-sm text-gray-400">Select the recipient patient's blood type</p>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {BLOOD_GROUPS.map(bg => (
                <button
                  key={bg}
                  type="button"
                  onClick={() => update('bloodGroup', bg)}
                  className={`h-20 rounded-xl font-black text-2xl transition-all duration-200 border-2 ${
                    form.bloodGroup === bg
                      ? 'bg-red-600 border-red-500 text-white shadow-lg shadow-red-900/40 scale-105'
                      : 'bg-white/5 border-white/10 text-white hover:border-red-500/50 hover:bg-red-500/10'
                  }`}
                >
                  {bg}
                </button>
              ))}
            </div>
            {form.bloodGroup && (
              <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-300">
                ✓ Selected: <strong>{form.bloodGroup}</strong> — We will check compatible inventory first before searching donors.
              </div>
            )}
          </div>
        )}

        {/* STEP 1 – Component */}
        {step === 1 && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-bold mb-2">Select Blood Component</h2>
            <p className="text-sm text-gray-400 mb-5">Choose the specific blood derivative prescribed by the physician</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {COMPONENTS.map(({ value, label, emoji, desc }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => update('component', value)}
                  className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                    form.component === value ? 'border-red-500 bg-red-500/10' : 'border-white/10 bg-white/5 hover:border-red-500/40'
                  }`}
                >
                  <span className="text-3xl">{emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-white">{label}</p>
                    <p className="text-xs text-gray-400 line-clamp-2">{desc}</p>
                  </div>
                  {form.component === value && <CheckCircle size={20} className="text-red-400 flex-shrink-0" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2 – Urgency & Quantity */}
        {step === 2 && (
          <div className="space-y-5">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-2">Urgency Level</h2>
              <p className="text-sm text-gray-400 mb-5">How urgently is this blood required?</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {URGENCY_LEVELS.map(({ value, label, icon: Icon, color, border, bg, desc }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => update('urgency', value)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 ${
                      form.urgency === value ? `${border} ${bg}` : 'border-white/10 bg-white/5 hover:border-white/20'
                    }`}
                  >
                    <Icon size={28} className={form.urgency === value ? color : 'text-gray-500'} />
                    <p className={`font-bold ${form.urgency === value ? color : 'text-gray-300'}`}>{label}</p>
                    <p className="text-[11px] text-gray-500 text-center">{desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-2">Quantity Required</h2>
              <p className="text-sm text-gray-400 mb-4">Number of blood units needed</p>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => update('quantity', Math.max(1, form.quantity - 1))}
                  className="w-12 h-12 rounded-xl bg-white/10 hover:bg-white/20 text-2xl font-bold transition-colors flex items-center justify-center"
                >
                  −
                </button>
                <div className="flex-1 text-center">
                  <span className="text-5xl font-black text-red-400">{form.quantity}</span>
                  <p className="text-gray-400 text-sm mt-1">unit{form.quantity > 1 ? 's' : ''} (≈ {form.quantity * 450} ml)</p>
                </div>
                <button
                  type="button"
                  onClick={() => update('quantity', Math.min(10, form.quantity + 1))}
                  className="w-12 h-12 rounded-xl bg-white/10 hover:bg-white/20 text-2xl font-bold transition-colors flex items-center justify-center"
                >
                  +
                </button>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-2">Search Radius</h2>
              <p className="text-sm text-gray-400 mb-4">Maximum search perimeter for inventory & donors</p>
              <div className="grid grid-cols-4 gap-3">
                {RADII.map(({ value, label, desc }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => update('searchRadiusKm', value)}
                    className={`flex flex-col items-center py-3 px-2 rounded-xl border-2 transition-all ${
                      form.searchRadiusKm === value ? 'border-red-500 bg-red-500/10 text-red-400' : 'border-white/10 bg-white/5 text-gray-300 hover:border-white/30'
                    }`}
                  >
                    <span className="font-bold">{label}</span>
                    <span className="text-[10px] text-gray-500 mt-0.5">{desc}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 3 – Location & Details */}
        {step === 3 && (
          <div className="space-y-5">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <MapPin size={20} className="text-red-400" />
                <h2 className="text-xl font-bold">Delivery / Patient Location</h2>
              </div>
              <p className="text-sm text-gray-400 mb-4">Used to calculate distance to nearest blood banks and donors</p>
              
              <button
                type="button"
                onClick={detectLocation}
                disabled={locLoading}
                className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600/20 border border-blue-500/30 hover:bg-blue-600/30 text-blue-300 rounded-xl transition-colors font-medium mb-4"
              >
                {locLoading ? <Loader size={18} className="animate-spin" /> : <Navigation size={18} />}
                {locLoading ? 'Detecting GPS...' : 'Use Current Device GPS'}
              </button>

              <label className="block text-xs text-gray-400 mb-1 font-medium">Hospital Name / Address</label>
              <input
                type="text"
                placeholder="e.g. City Memorial Hospital ICU, Delhi"
                value={form.location.address}
                onChange={e => updateLocation('address', e.target.value)}
                className="w-full bg-[#1a1a3a] border border-white/10 rounded-xl p-3 text-white placeholder-gray-500 outline-none focus:border-red-500 transition-colors text-sm mb-2"
              />
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
              <h2 className="text-xl font-bold">Patient Details</h2>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Patient Full Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Rahul Sharma"
                    value={form.patientName}
                    onChange={e => update('patientName', e.target.value)}
                    className="w-full bg-[#1a1a3a] border border-white/10 rounded-xl p-3 text-white placeholder-gray-500 outline-none focus:border-red-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Age</label>
                  <input
                    type="number"
                    placeholder="e.g. 35"
                    value={form.patientAge}
                    onChange={e => update('patientAge', e.target.value)}
                    className="w-full bg-[#1a1a3a] border border-white/10 rounded-xl p-3 text-white placeholder-gray-500 outline-none focus:border-red-500 text-sm"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Hospital / Clinic</label>
                  <input
                    type="text"
                    placeholder="e.g. AIIMS Delhi"
                    value={form.hospital}
                    onChange={e => update('hospital', e.target.value)}
                    className="w-full bg-[#1a1a3a] border border-white/10 rounded-xl p-3 text-white placeholder-gray-500 outline-none focus:border-red-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Contact Phone</label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={form.contactPhone}
                    onChange={e => update('contactPhone', e.target.value)}
                    className="w-full bg-[#1a1a3a] border border-white/10 rounded-xl p-3 text-white placeholder-gray-500 outline-none focus:border-red-500 text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Medical Notes (Optional)</label>
                <textarea
                  placeholder="Doctor recommendation, surgery notes, ward/bed number..."
                  value={form.notes}
                  onChange={e => update('notes', e.target.value)}
                  rows={2}
                  className="w-full bg-[#1a1a3a] border border-white/10 rounded-xl p-3 text-white placeholder-gray-500 outline-none focus:border-red-500 text-sm resize-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 4 – Review */}
        {step === 4 && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-bold mb-4">Review & Submit Request</h2>
            
            <div className={`p-4 rounded-xl border mb-5 ${urgencyInfo?.border} ${urgencyInfo?.bg}`}>
              <div className="flex items-center gap-2">
                {urgencyInfo && <urgencyInfo.icon size={20} className={urgencyInfo.color} />}
                <p className={`font-bold ${urgencyInfo?.color}`}>{form.urgency} Urgency</p>
              </div>
              <p className="text-xs text-gray-400 mt-1">{urgencyInfo?.desc}</p>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-gray-400">Target Blood Group</span>
                <span className="font-bold text-red-400 text-lg">{form.bloodGroup}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-gray-400">Component</span>
                <span className="font-semibold text-white">{COMPONENTS.find(c => c.value === form.component)?.label}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-gray-400">Units Required</span>
                <span className="font-semibold text-white">{form.quantity} Unit(s)</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-gray-400">Search Radius</span>
                <span className="font-semibold text-white">{form.searchRadiusKm} km</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-gray-400">Destination</span>
                <span className="font-semibold text-white text-right">{form.hospital || form.location.address}</span>
              </div>
              {form.patientName && (
                <div className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-gray-400">Patient</span>
                  <span className="font-semibold text-white">{form.patientName} {form.patientAge ? `(${form.patientAge} yrs)` : ''}</span>
                </div>
              )}
            </div>

            <div className="mt-5 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl text-xs text-blue-300">
              <p className="font-bold mb-1">⚡ Automatic Smart Resolution:</p>
              <p>LifeLink will query nearby blood bank stocks first. If {form.bloodGroup} is available, it will be <strong>automatically reserved in real-time</strong>. If out of stock, matching donors are summoned.</p>
            </div>
          </div>
        )}

        {/* Wizard Controls */}
        <div className="flex gap-3 mt-6">
          {step > 0 && (
            <button
              type="button"
              onClick={() => setStep(s => s - 1)}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold transition-colors"
            >
              ← Back
            </button>
          )}
          <div className="flex-1" />
          {step < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={() => setStep(s => s + 1)}
              disabled={!canNext()}
              className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-all shadow-lg shadow-red-900/30"
            >
              Next <ChevronRight size={18} />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading || !canNext()}
              className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 disabled:opacity-40 text-white rounded-xl font-bold transition-all shadow-lg shadow-red-900/40"
            >
              {loading ? <><Loader size={18} className="animate-spin" /> Submitting...</> : <>🩸 Submit Blood Request</>}
            </button>
          )}
        </div>
      </div>
    </PatientLayout>
  );
};

export default BloodRequestPage;
