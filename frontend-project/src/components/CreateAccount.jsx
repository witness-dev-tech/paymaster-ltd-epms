import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, UserPlus, ShieldAlert, Loader2, Truck } from 'lucide-react';
import { toast } from 'sonner';
import api from '../Api/apiAxios';

const CreateAccount = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.post('/auth/register', formData);
      toast.success('HR Administrative account created! Redirecting to login gateway.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.errors?.[0]?.msg || err.response?.data?.message || 'Account registration failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center p-6">
      
      {/* Top Branding Header */}
      <div className="flex items-center gap-2.5 mb-6">
        <div className="h-9 w-9 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-emerald-600/20">
          <Truck className="w-5 h-5 stroke-[2.5]" />
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-sm font-black text-zinc-900 tracking-wide uppercase">PayMaster Ltd</span>
          <span className="text-[10px] text-zinc-400 font-bold tracking-wider uppercase">Rubavu Headquarters</span>
        </div>
      </div>

      {/* Main Registration Card */}
      <div className="bg-white border border-zinc-200 rounded-2xl p-8 max-w-md w-full shadow-xl shadow-zinc-200/40 space-y-6 animate-in fade-in zoom-in-95 duration-300">
        <div className="space-y-1">
          <div className="h-10 w-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 mb-2 border border-emerald-100">
            <UserPlus className="w-5 h-5" />
          </div>
          <h2 className="text-2xl font-black text-zinc-900 tracking-tight">Register HR User</h2>
          <p className="text-sm text-zinc-500">Provision authorized personnel access keys to manage manual system entries digitally.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-700 uppercase tracking-wider">Desired Username</label>
            <input
              type="text"
              required
              placeholder="Minimum 3 characters"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full px-4 py-2.5 border border-zinc-200 rounded-xl text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 placeholder:text-zinc-400"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-700 uppercase tracking-wider">Secure Access Password</label>
            <input
              type="password"
              required
              placeholder="Minimum 6 characters"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-2.5 border border-zinc-200 rounded-xl text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 placeholder:text-zinc-400"
            />
          </div>

          {/* Security Advisory Warning Panel */}
          <div className="flex gap-2.5 p-3.5 bg-zinc-50 rounded-xl text-xs text-zinc-500 border border-zinc-200/60 leading-relaxed">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              <strong>Security Notice:</strong> Administrative account registration is restricted to corporate staff based in the Western Province office.
            </span>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-zinc-900 text-white py-3 px-4 rounded-xl text-sm font-semibold hover:bg-zinc-800 active:scale-[0.99] disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-md shadow-zinc-950/10 group"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
            ) : (
              <span>Create Administrative Account</span>
            )}
          </button>
        </form>

        {/* Alternate Navigation Target */}
        <p className="text-center text-sm font-medium text-zinc-600">
          Already have clearance?{' '}
          <Link to="/login" className="font-bold text-emerald-600 hover:text-emerald-500 underline underline-offset-4">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default CreateAccount;