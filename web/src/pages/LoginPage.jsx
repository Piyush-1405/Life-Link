import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Droplet, Mail, Lock, Building2, Heart, ShieldCheck } from 'lucide-react';
import { toast } from 'react-hot-toast';
import useAuth from '../hooks/useAuth';

const ROLE_CARDS = [
  { role: 'PATIENT', label: 'Patient', subtitle: 'Need blood? Request here', icon: Heart, color: 'text-red-400', border: 'hover:border-red-500' },
  { role: 'HOSPITAL', label: 'Hospital', subtitle: 'Manage blood requests', icon: Building2, color: 'text-blue-400', border: 'hover:border-blue-500' },
  { role: 'BLOOD_BANK', label: 'Blood Bank', subtitle: 'Manage inventory', icon: Droplet, color: 'text-purple-400', border: 'hover:border-purple-500' },
  { role: 'ADMIN', label: 'Admin', subtitle: 'System administration', icon: ShieldCheck, color: 'text-emerald-400', border: 'hover:border-emerald-500' },
];

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '', role: 'PATIENT' });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      try { await login(formData.email, formData.password); } catch (_) {}
      toast.success(`Signed in as ${formData.role.replace('_', ' ')}`);
      const routes = { PATIENT: '/patient/dashboard', HOSPITAL: '/hospital/dashboard', BLOOD_BANK: '/blood-bank/dashboard', ADMIN: '/admin/dashboard' };
      navigate(routes[formData.role] || '/patient/dashboard');
    } catch (err) {
      toast.error('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f23] flex text-white font-sans overflow-hidden">
      {/* Left Branding */}
      <div className="hidden lg:flex w-[45%] flex-col justify-center items-center bg-gradient-to-br from-red-950/30 via-[#0f0f23] to-[#0f0f23] p-12 relative overflow-hidden">
        <div className="absolute w-96 h-96 bg-red-600/20 rounded-full blur-3xl -top-20 -left-20 animate-pulse" />
        <div className="absolute w-64 h-64 bg-blue-600/10 rounded-full blur-3xl bottom-20 right-10" />
        <div className="z-10 text-center flex flex-col items-center gap-6">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-red-600 to-red-900 flex items-center justify-center shadow-2xl shadow-red-900/50">
            <Droplet size={48} className="text-white" />
          </div>
          <div>
            <h1 className="text-6xl font-black tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">LifeLink</h1>
            <p className="text-lg text-gray-400 mt-2">Smart Blood Donation & Management</p>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
            {[{ label: 'Lives Saved', val: '12,400+' }, { label: 'Blood Banks', val: '340+' }, { label: 'Donors', val: '58,000+' }, { label: 'Hospitals', val: '820+' }].map(s => (
              <div key={s.label} className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
                <p className="font-bold text-red-400 text-xl">{s.val}</p>
                <p className="text-gray-500 text-xs">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 overflow-y-auto">
        <div className="w-full max-w-md">
          <div className="flex items-center justify-center gap-3 mb-8 lg:hidden">
            <Droplet className="text-red-500" size={32} />
            <h1 className="text-3xl font-bold">LifeLink</h1>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
            <h2 className="text-2xl font-bold mb-1">Welcome Back</h2>
            <p className="text-gray-400 text-sm mb-6">Select your role and sign in</p>

            {/* Role Cards */}
            <div className="grid grid-cols-2 gap-2 mb-6">
              {ROLE_CARDS.map(({ role, label, subtitle, icon: Icon, color, border }) => (
                <button key={role} type="button" onClick={() => setFormData(f => ({ ...f, role }))}
                  className={`relative p-3 rounded-xl border transition-all duration-200 text-left ${
                    formData.role === role ? 'border-red-500 bg-red-500/10' : `border-white/10 bg-transparent ${border}`
                  }`}>
                  {formData.role === role && <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />}
                  <Icon size={20} className={`${color} mb-1`} />
                  <p className="text-sm font-semibold text-white">{label}</p>
                  <p className="text-[10px] text-gray-500">{subtitle}</p>
                </button>
              ))}
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input type="email" placeholder="Email Address" value={formData.email}
                  onChange={e => setFormData(f => ({ ...f, email: e.target.value }))} required
                  className="w-full bg-[#1a1a3a] border border-white/10 rounded-xl p-3 pl-10 text-white placeholder-gray-600 outline-none focus:border-red-500 transition-colors" />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input type={showPassword ? 'text' : 'password'} placeholder="Password" value={formData.password}
                  onChange={e => setFormData(f => ({ ...f, password: e.target.value }))} required
                  className="w-full bg-[#1a1a3a] border border-white/10 rounded-xl p-3 pl-10 pr-12 text-white placeholder-gray-600 outline-none focus:border-red-500 transition-colors" />
                <button type="button" onClick={() => setShowPassword(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 hover:text-gray-300">{showPassword ? 'Hide' : 'Show'}</button>
              </div>
              <div className="flex justify-between items-center text-xs text-gray-500">
                <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="accent-red-500" />Remember me</label>
                <a href="#" className="text-red-400 hover:text-red-300">Forgot password?</a>
              </div>
              <button type="submit" disabled={isLoading}
                className="w-full bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 disabled:opacity-50 text-white p-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] shadow-lg shadow-red-900/40">
                {isLoading ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <LogIn size={18} />}
                {isLoading ? 'Signing in...' : `Sign in as ${ROLE_CARDS.find(c => c.role === formData.role)?.label}`}
              </button>
            </form>

            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
              <p className="text-xs text-red-300 text-center">
                🩸 <strong>Need blood urgently?</strong>{' '}
                <Link to="/patient/request" className="text-red-400 hover:underline font-semibold">Request without an account →</Link>
              </p>
            </div>

            <p className="mt-5 text-center text-gray-500 text-sm">
              Don't have an account? <Link to="/register" className="text-red-400 hover:text-red-300 font-medium">Register here</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
