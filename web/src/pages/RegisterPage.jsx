import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { UserPlus, Droplet, User, Building } from 'lucide-react';

const RegisterPage = () => {
  const [step, setStep] = useState(1);
  return (
    <div className="min-h-screen bg-[#0f0f23] flex text-white font-sans items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white/5 p-8 rounded-2xl backdrop-blur-xl border border-white/10 shadow-2xl relative overflow-hidden">
         <div className="absolute top-0 left-0 w-full h-1 bg-white/10"><div className="h-full bg-red-500" style={{width: step === 1 ? '50%' : '100%'}}></div></div>
         <div className="flex flex-col items-center mb-8">
           <Droplet className="text-red-500 mb-2" size={40} />
           <h2 className="text-3xl font-bold">Join LifeLink</h2>
           <p className="text-gray-400">Create your account to manage blood donations</p>
         </div>
         {step === 1 ? (
           <div className="space-y-6">
             <div className="grid grid-cols-2 gap-4">
               <div className="bg-[#1a1a3a] p-4 rounded-xl border border-white/10 hover:border-red-500 cursor-pointer text-center flex flex-col items-center transition-colors">
                  <Building size={32} className="mb-2 text-blue-400" />
                  <span className="font-semibold">Hospital / Clinic</span>
               </div>
               <div className="bg-[#1a1a3a] p-4 rounded-xl border border-white/10 hover:border-red-500 cursor-pointer text-center flex flex-col items-center transition-colors">
                  <Droplet size={32} className="mb-2 text-red-400" />
                  <span className="font-semibold">Blood Bank</span>
               </div>
             </div>
             <input type="text" placeholder="Organization Name" className="w-full bg-[#1a1a3a] border border-white/10 rounded-lg p-3 text-white outline-none focus:border-red-500" />
             <input type="email" placeholder="Email Address" className="w-full bg-[#1a1a3a] border border-white/10 rounded-lg p-3 text-white outline-none focus:border-red-500" />
             <button onClick={() => setStep(2)} className="w-full bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white p-3 rounded-lg font-semibold">Next Step</button>
           </div>
         ) : (
           <div className="space-y-6">
             <input type="password" placeholder="Password" className="w-full bg-[#1a1a3a] border border-white/10 rounded-lg p-3 text-white outline-none focus:border-red-500" />
             <input type="password" placeholder="Confirm Password" className="w-full bg-[#1a1a3a] border border-white/10 rounded-lg p-3 text-white outline-none focus:border-red-500" />
             <label className="flex items-center text-sm text-gray-400"><input type="checkbox" className="mr-2"/> I agree to Terms & Conditions</label>
             <div className="flex space-x-4">
               <button onClick={() => setStep(1)} className="flex-1 bg-white/10 hover:bg-white/20 text-white p-3 rounded-lg font-semibold transition-colors">Back</button>
               <button className="flex-1 bg-gradient-to-r from-red-600 to-red-800 text-white p-3 rounded-lg font-semibold">Register</button>
             </div>
           </div>
         )}
         <p className="mt-6 text-center text-gray-400 text-sm">Already have an account? <Link to="/login" className="text-red-400 hover:text-red-300">Login</Link></p>
      </div>
    </div>
  );
};
export default RegisterPage;
